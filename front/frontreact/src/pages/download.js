import Dropzone from "react-dropzone-uploader";
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import useWindowSize from "../hooks/useWindowSize";
import CONST, {
  get_token,
  endpoint,
  getCookie,
  requestoptions,
} from "../constants/index";
import Topnav from "../component/topnav/topnav";
import { useDispatch, useSelector } from "react-redux";
import { setreload, setfolders } from "../actions";
import {
  Center,
  TextInput,
  ActionIcon,
  Loader,
  Space,
  Select,
  Button,
} from "@mantine/core";
import {
  Clipboard,
  Folder,
  FolderOff,
  FolderPlus,
  Refresh,
} from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { Icon } from "@material-ui/core";
import { get_all_folders } from "../api/get_all_folders";
import { AddFolder } from "../addfolder";
const MyUploader = () => {
  const [url, seturl] = useState("");
  const [downloadstart, setdownloadstart] = useState(false);
  const [folderloading, setfolderloading] = useState(false);
  const [currentparent, setcurrentparent] = useState("All Songs");
  const username = useSelector((state) => state.user);
  const folderdata = useSelector((state) => state.folders);
  const dispatch = useDispatch();
  const size = useWindowSize();
  const getUploadParams = ({ meta }) => {
    const csrftoken = getCookie("csrftoken");
    return {
      url: endpoint + "/api/upload/",
      headers: { "X-CSRFToken": csrftoken, Authorization: get_token() },
    };
  };
  const handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };
  const handleSubmit = (files, allFiles) => {
    console.log(files.map((f) => f.meta));
    allFiles.forEach((f) => f.remove());
  };
  function handletextfieldchange(e) {
    if (e.target.id === "url") {
      seturl(e.target.value);
    }
  }

  function handlesubmit() {
    setdownloadstart(true);
    requestoptions.method = "POST";
    requestoptions.body = JSON.stringify({
      url: url.toString(),
      parent: currentparent,
    });
    var fetchurl = "/api/downloadurl/";
    if (url.startsWith("https://open.spotify.com/playlist/")) {
      var loc = window.location;
      var start = "ws://";
      if (loc.protocol == "https:") {
        start = "wss://";
      }
      var endpoint2 = start + loc.host + "/spotifyupload/";
      var socket = new WebSocket(endpoint2);
      socket.onmessage = (e) => {
        showNotification({ title: e.data });
        setdownloadstart(false);
        dispatch(setreload(true));
      };
      socket.onopen = (e) => {
        socket.send(
          JSON.stringify({
            username: username,
            link: url.toString(),
          })
        );
      };
      socket.onclose = (e) => {
        showNotification({ title: "socket connection closed" });
        setdownloadstart(false);
      };
    } else {
      if (url.startsWith("https://www.youtube.com/")) {
        fetchurl = "/api/youtubeurl/";
      }

      if (url.startsWith("https://open.spotify.com/track/")) {
        fetchurl = "/api/spotify/";
      }
      console.log(endpoint, fetchurl);
      fetch(endpoint + fetchurl, requestoptions).then((response) => {
        if (response.ok) {
          showNotification({ title: "downloaded successfully" });
          dispatch(setreload(true));
        } else {
          showNotification({ title: "error occured" });
        }
        setdownloadstart(false);
      });
    }
  }

  function updatefolders() {
    setfolderloading(true);
    get_all_folders().then((data) => {
      dispatch(setfolders(data));
      setfolderloading(false);
    });
  }

  return (
    <div
      className={
        size.width > CONST.MOBILE_SIZE ? "uploadpage" : "uploadpagemobile"
      }
    >
      <Topnav></Topnav>
      <Center>
        <Grid container xs={12} spacing={3} direction="column" align="center">
          <Grid item align="center" xs={12} sm={12}>
            <Grid item align="center" xs={10} sm={7}>
              <h4>Local files</h4>
              <Dropzone
                getUploadParams={getUploadParams}
                onChangeStatus={handleChangeStatus}
                onSubmit={handleSubmit}
                accept="audio/*"
              />
            </Grid>
          </Grid>
          <h4>From link</h4>
          <Center>
          
            <span>
              <Grid container xs={12}>
              <AddFolder trigger={() => <FolderPlus size={28} className="pointer"/>} />
              <Space w="sm" />
                <Select
                  placeholder="Pick a folder"
                  data={folderdata.map((data) => {
                    return data["name"];
                  })}
                  icon={<Folder />}
                  defaultValue={"All Songs"}
                  onChange={(e) => {
                    setcurrentparent(e);
                  }}
                />
              </Grid>
              <Space h="xl" />
                    {folderloading ? (
                      <Loader />
                    ) : (
                      <Icon>
                        <Refresh
                        size={28}
                        className="pointer"
                          onClick={() => {
                            updatefolders();
                          }}
                        ></Refresh>
                      </Icon>
                    )}
            </span>
          </Center>

          <TextInput
            
            className="urlcss"
            placeholder="paste youtube, spotify or direct download link"
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={handletextfieldchange}
            size="lg"
            rightSection={
              <ActionIcon
                onClick={() => {
                  navigator.clipboard.readText().then((text) => {
                    seturl(text);
                  });
                }}
              >
                <Clipboard size={26} strokeWidth={1} color={"#45bf40"} />
              </ActionIcon>
            }
          />
          <Space></Space>
          {!downloadstart ? (
            <Grid item xs={12} align="center">
              <Button className="button alternative" onClick={handlesubmit}>
                Download
              </Button>
            </Grid>
          ) : (
            <Center>
              <Loader></Loader>
            </Center>
          )}
        </Grid>
      </Center>
    </div>
  );
};

export default MyUploader;

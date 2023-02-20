import { connect } from "react-redux";
import { setmoremenu, setreload, setfolders, setplaylistload } from "./actions";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { endpoint, requestoptions } from "./constants";
import { showNotification } from "@mantine/notifications";
import { useModals } from "@mantine/modals";
import { get_all_folders } from "./api/get_all_folders";
import {
  Button,
  TextInput,
  Text,
  Space,
  Stack,
  Title,
  Center,
  LoadingOverlay,
  Modal,
  Loader,
} from "@mantine/core";
import { Refresh } from "tabler-icons-react";

function MoreMenu(props) {
  const dispatch = useDispatch();
  const [isloading, setisloading] = useState(false);
  const [moveloading, setmoveloading] = useState(false);
  const [showfolder, setshowfolder] = useState(false);
  const [folderloading, setfolderloading] = useState(false);
  const [isrenamemodal, setisrenamemodal] = useState(false);
  const [rename, setrename] = useState();
  const [renameloading, setrenameloading] = useState(false);
  const playlistdata = useSelector((state) => state.playlistdata);
  const link = useSelector((state) => state.playlistid);
  const folderdata = useSelector((state) => state.folders);
  const modals = useModals();
  // to get the song name to change(given songid)
  function getsongname(id) {
    var playlist_id = 0;
    for (let i = 0; i < playlistdata.length; i++) {
      if (playlistdata[i]["link"] == link) {
        playlist_id = playlistdata[i]["index"].toString();
        break;
      }
    }
    if (playlist_id == undefined || playlistdata[playlist_id] == undefined)
      return "song name";
    var data = playlistdata[playlist_id]["playlistData"];
    for (let i = 0; i < data.length; i++) {
      if (data[i]["id"] == id) {
        return data[i]["songName"];
      }
    }
    return "song name";
  }
  const openConfirmModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="md">
          Are you sure you want to delete this song?This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handledelete(),
    });

  function sendmoverequest(id, modalid) {
    setmoveloading(true);
    requestoptions.method = "POST";
    requestoptions.body = JSON.stringify({
      fileid: props.songid,
      destination: id,
    });
    fetch(endpoint + "/api/move/", requestoptions).then((response) => {
      setmoveloading(false);
      if (response.status == 200) {
        showNotification({
          message: "Song moved successfully",
          type: "success",
        });
        setshowfolder(false);
        props.setplaylistload(link, false);
        props.setplaylistload(id, false);
        props.setreloadplaylist(!props.reloadplaylist);
      } else {
        showNotification({
          message: "Something went wrong",
          type: "error",
        });
      }
    });
  }

  // rename handler for songs
  function handlerename() {
    setrenameloading(true);
    requestoptions.method = "POST";
    requestoptions.body = JSON.stringify({
      id: props.songid.toString(),
      name: rename,
    });
    fetch(endpoint + "/api/rename/", requestoptions).then((response) => {
      setisloading(false);

      if (response.ok) {
        setisrenamemodal(false);
        showNotification({
          title: "Song Renamed ",
          message: "Changes will reflect shortly",
        });
        props.setplaylistload(link, false);
        props.setreloadplaylist(!props.reloadplaylist);
      } else {
        showNotification({
          title: "Error",
          message: "something went wrong",
        });
      }
      setrenameloading(false);
    });
  }
  // delete songs handler
  function handledelete() {
    setisloading(true);
    requestoptions.method = "POST";
    requestoptions["body"] = JSON.stringify({
      id: props.songid.toString(),
    });
    fetch(endpoint + "/api/delete/", requestoptions).then((response) => {
      setisloading(false);
      if (response.ok) {
        showNotification({
          title: "Song deleted successfully",
          message: "Changes will reflect shortly",
        });
        props.setplaylistload(link, false);
        props.setreloadplaylist(!props.reloadplaylist);
      } else {
        showNotification({
          title: "Error",
          message: "Sorry something went wrong",
        });
      }
    });
  }
  function updatefolders() {
    setfolderloading(true);
    get_all_folders().then((data) => {
      dispatch(setfolders(data));
      setfolderloading(false);
    });
  }

  return (
    <>
      {/* modal  for moving folder */}
      <Modal
        opened={showfolder}
        onClose={() => {
          setshowfolder(false);
        }}
      >
        <LoadingOverlay visible={moveloading}></LoadingOverlay>
        <Stack>
          <Center>
            <Title>Move to</Title>
          </Center>
          <Center>
            {folderloading ? (
              <Loader />
            ) : (
              <Refresh onClick={() => updatefolders()} />
            )}{" "}
          </Center>
          {folderdata &&
            folderdata.map((item, index) => {
              return (
                <>
                  {item["id"] != link && (
                    <>
                      <p onClick={() => sendmoverequest(item["id"])}>
                        {item["name"]}
                      </p>
                      <Space h="sm"></Space>
                    </>
                  )}
                </>
              );
            })}
        </Stack>
      </Modal>
      {/* modal for renaming song */}
      <Modal
        opened={isrenamemodal}
        onClose={() => {
          setisrenamemodal(false);
        }}
      >
        <Center>
          <Title size="sm">Rename</Title>
        </Center>
        <Space h="xl"></Space>
        <LoadingOverlay visible={renameloading} />
        <TextInput
          defaultValue={getsongname(props.songid)}
          onChange={(e) => {
            setrename(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlerename();
            }
          }}
        />
        <Space h="xl"></Space>
        <Button
          fullWidth
          onClick={() => {
            handlerename();
          }}
        >
          Submit
        </Button>
      </Modal>

      {/* menu for renaming and delete*/}
      {props.menu && (
        <div>
          <div
            className="layer"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                props.setmoremenu(false);
              }
            }}
          ></div>
          <div
            className="context-menu"
            style={{
              left: `${props.clientx - 155}px`,
              top: `${props.clienty}px`,
            }}
          >
            <div
              className="item12"
              onClick={() => {
                setisrenamemodal(true);
                props.setmoremenu(false);
              }}
            >
              Rename
            </div>
            <div
              className="item12"
              onClick={() => {
                openConfirmModal();
                props.setmoremenu(false);
              }}
            >
              Delete
            </div>
            <div
              className="item12"
              onClick={() => {
                setshowfolder(true);
                props.setmoremenu(false);
              }}
            >
              Moveto
            </div>
          </div>
        </div>
      )}

      {/* loading animation */}
      {isloading && (
        <div className="item">
          <div className="loader">
            <div className="loader10"></div>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    menu: state.menu,
    clientx: state.clientx,
    songid: state.songid,
    clienty: state.clienty,
    setreloadplaylist: ownProps.setreloadplaylist,
    reloadplaylist: ownProps.reloadplaylist,
  };
};

export default connect(mapStateToProps, {
  setmoremenu,
  setreload,
  setplaylistload,
})(MoreMenu);

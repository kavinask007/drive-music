import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Heart from "react-heart";
import {
  changePlay,
  setclientY,
  setclientX,
  setsongid,
  setmoremenu,
  setlikeunlike,
} from "../../actions";
import TextBoldL from "../text/text-bold-l";
import TextRegularM from "../text/text-regular-m";
import Playgif from "../../image/now-play.gif";
import * as Icons from "../icons";
import styles from "./playlist-track.module.css";
import { Video } from "tabler-icons-react";
import VideoPlayer from "../../videoPlayer";
import { ActionIcon, Loader, Modal } from "@mantine/core";
import useWindowSize from "../../hooks/useWindowSize";
import CONST from "../../constants/";
import { endpoint, requestoptions } from "../../constants";
function PlaylistTrack(props) {
  const [thisSong, setthisSong] = useState(false);
  const [isopened, setisopened] = useState(false);
  const size = useWindowSize();
  /*setInterval(function () {
    setthisSong(props.data.song.link == localStorage.getItem("playedSong"));
  }, 50);*/
  const [loading, setloading] = useState(false);
  function like(data, playlistIndex, is_like) {
    let liked = 0;
    let url = endpoint + "/api/unlike/";
    if (is_like == 0) {
      liked = 1;
      url = endpoint + "/api/like/";
    }
    requestoptions.method = "POST";
    requestoptions["body"] = JSON.stringify({
      track: data["link"],
      name: data["songName"],
      track_id: data["id"],
      trackimg: data["songimg"],
      videoId: data["videoId"],
      trackTime: data["trackTime"],
      trackArtist: data["songArtist"],
    });
    fetch(url, requestoptions)
      .then((response) => {
        return response.json();
      })
      .then((out_data) => {
        if (out_data["data"] == "Ok") {
          props.setlikeunlike(playlistIndex, data["index"], liked);
        }
        setloading(false);
      });
    
  }

  useEffect(() => {
    if (
      props.data.song.link === props.trackData.track &&
      props.isPlaying === true
    ) {
      setthisSong(true);
    } else {
      setthisSong(false);
    }
  });
  return (
    <>
      <Modal
        opened={isopened}
        onClose={() => setisopened(false)}
        centered={true}
        size={size.width / 2 + 50}
      >
        <div
          style={{
            width: `${size.width / 2}` + "px",
          }}
        >
          <VideoPlayer videoId={props.trackData.videoID} />
        </div>
      </Modal>

      <div
        className={`${styles.trackDiv} ${thisSong ? "activeTrack" : ""}`}
        style={
          props.data.listType === "albüm"
            ? { gridTemplateColumns: "1fr 1fr 1fr" }
            : {}
        }
      >
        {thisSong ? (
          <img className={styles.gif} src={Playgif} />
        ) : (
          <p className={styles.SongIndex}>{props.data.song.index}</p>
        )}

        <img src={props.data.song.songimg} />

        <span>
          <TextBoldL>{props.data.song.songName}</TextBoldL>
          <TextRegularM>{props.data.song.songArtist}</TextRegularM>
        </span>

        <span>
          {props.data.song.videoId != undefined &&
          size.width > CONST.MOBILE_SIZE ? (
            <ActionIcon size={"small"}>
              <Video
                onClick={() => {
                  setisopened(true);
                  props.changePlay(true);
                }}
              ></Video>
            </ActionIcon>
          ) : null}
          <span className="timemore">
            <span>{props.data.song.trackTime}</span>
            <span>
              <div
                style={{ width: "1.1rem", paddingLeft: "5px" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {loading ? (
                  <Loader size="sm" />
                ) : (
                  <Heart
                    isActive={props.data.song.is_liked}
                    inactiveColor="white"
                    onClick={(event) => {
                      setloading(true);
                      like(
                        props.data.song,
                        props.data.playlistIndex,
                        props.data.song.is_liked
                      );
                    }}
                  />
                )}
              </div>
            </span>
            {props.moreMenu ? (
              <span className="paddingleft">
                <button
                  className="moreiconbutton"
                  id={props.data.song.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setclientX(e.clientX);
                    props.setclientY(e.clientY);
                    props.setsongid(e.target.id);
                    props.setmoremenu(true);
                  }}
                >
                  <div className="noevents">
                    <Icons.More />
                  </div>
                </button>
              </span>
            ) : null}
          </span>
        </span>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    trackData: state.trackData,
  };
};

export default connect(mapStateToProps, {
  changePlay,
  setclientY,
  setclientX,
  setsongid,
  setmoremenu,
  setlikeunlike,
})(PlaylistTrack);

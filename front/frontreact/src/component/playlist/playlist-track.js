import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlay,
  setclientY,
  setclientX,
  setsongid,
  setmoremenu,
} from "../../actions";
import TextBoldL from "../text/text-bold-l";
import TextRegularM from "../text/text-regular-m";
import Playgif from "../../image/now-play.gif";
import * as Icons from "../icons";
import styles from "./playlist-track.module.css";
import { Video } from "tabler-icons-react";
import VideoPlayer from "../../videoPlayer";
import { ActionIcon, Modal } from "@mantine/core";
import useWindowSize from "../../hooks/useWindowSize";
import CONST from "../../constants/";
function PlaylistTrack(props) {
  const [thisSong, setthisSong] = useState(false);
  const [isopened, setisopened] = useState(false);
  const size = useWindowSize();
  /*setInterval(function () {
    setthisSong(props.data.song.link == localStorage.getItem("playedSong"));
  }, 50);*/

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
        size={(size.width / 2)+50}
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
})(PlaylistTrack);

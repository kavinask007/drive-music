import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { changePlay ,setclientY,setclientX,setsongid,setmoremenu} from "../../actions";
import TextBoldL from "../text/text-bold-l";
import TextRegularM from "../text/text-regular-m";
import Playgif from "../../image/now-play.gif";
import * as Icons from "../icons";
import styles from "./playlist-track.module.css";
import {Menu, MenuItem} from '@mantine/core';
function PlaylistTrack(props) {
  const [thisSong, setthisSong] = useState(false);
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
    <div
      className={`${styles.trackDiv} ${thisSong ? "activeTrack" : ""}`}
      style={
        props.data.listType === "albüm"
          ? { gridTemplateColumns: "1fr 1fr 1fr" }
          : {}
      }
    >
      <button
        className={styles.playBtn}
        onClick={() => props.changePlay(!props.isPlaying)}
      >
        {thisSong ? <Icons.Pause /> : <Icons.Play />}
      </button>

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

      <span className="timemore">
        <span>{props.data.song.trackTime}</span>

       {props.moreMenu? <span className="paddingleft" ><button className="moreiconbutton" id={props.data.song.id} onClick={(e)=>{
          e.stopPropagation()
          props.setclientX(e.clientX) 
          props.setclientY(e.clientY);
           props.setsongid(e.target.id);
        props.setmoremenu(true) }}><div className="noevents"><Icons.More/></div></button></span>:null}
      </span>
    </div>
 
  );
}

const mapStateToProps = (state) => {
  return {
    isPlaying: state.isPlaying,
    trackData: state.trackData,
  };
};

export default connect(mapStateToProps, { changePlay,setclientY,setclientX,setsongid,setmoremenu})(PlaylistTrack);

import React, { useRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeTrack, changePlay, setshufflekey, settime } from "../../actions";
import useWindowSize from "../../hooks/useWindowSize";
import FooterLeft from "./footer-left";
import MusicControlBox from "./player/music-control-box";
import MusicProgressBar from "./player/music-progress-bar";
import FooterRight from "./footer-right";
import Audio from "./audio";
import CONST from "../../constants/index";
import styles from "./footer.module.css";

function Footer(props) {
  const size = useWindowSize();
  let local_volume=localStorage.getItem("volume")
  if (local_volume==undefined){
    local_volume=0.75
  }
  const [audioLoading, setaudioLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(local_volume);
  const audioRef = useRef(null);

  props.settime(currentTime);
  const handleTrackClick = (position) => {
    audioRef.current.currentTime = position;
  };
  const setVolumefn=(volume)=>{
    setVolume(volume)
    localStorage.setItem("volume",volume);
  }
  useEffect(() => {
    if (audioRef.current) {
      if (props.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioRef, props.isPlaying]);



  useEffect(() => {
    if (audioRef.current) {
      
      audioRef.current.volume = volume;
    }
  }, [audioRef, volume,props.trackData.track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => {
        if (!props.shuffle) {
          if (
            props.trackData.trackKey[1] ===
            props.playlistdata[props.trackData.trackKey[0]].playlistData
              .length -
              1
          ) {
            props.changeTrack([props.trackData.trackKey[0], 0]);
          } else {
            props.changeTrack([
              props.trackData.trackKey[0],
              parseInt(props.trackData.trackKey[1]) + 1,
            ]);
          }
          props.changePlay(true);
        } else {
          if (
            props.trackData.trackKey[1] ===
            props.playlistdata[props.trackData.trackKey[0]].playlistData
              .length -
              1
          ) {
            props.changeTrack([
              props.trackData.trackKey[0],
              props.shufflelist[0],
            ]);
            props.setshufflekey(0);
          } else {
            props.changeTrack([
              props.trackData.trackKey[0],
              props.shufflelist[props.shufflekey + 1],
            ]);
            props.setshufflekey(props.shufflekey + 1);
          }
          props.changePlay(true);
        }
      });
    }
  }, [props.shuffle, props.shufflekey, props.trackData]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("play", () => {
        props.changePlay(true);
      });
      audioRef.current.addEventListener("pause", () => {
        props.changePlay(false);
      });
    }
  }, [audioRef]);

  return (
    <>
      {props.trackData.track != "" && (
        <footer className={styles.footer}>
          <div className={styles.nowplayingbar}>
            <FooterLeft
              duration={duration}
              handleTrackClick={handleTrackClick}
              currentTime={currentTime}
              volume={volume}
              setVolume={setVolumefn}
              width={size.width}
              loading={audioLoading}
            />

            <div className={styles.footerMid}>
              <MusicControlBox large={false} loading={audioLoading} />
              <MusicProgressBar
                currentTime={currentTime}
                duration={duration}
                handleTrackClick={handleTrackClick}
              />
              <Audio
                ref={audioRef}
                handleDuration={setDuration}
                handleCurrentTime={setCurrentTime}
                trackData={props.trackData}
                isPlaying={props.isPlaying}
                setloading={setaudioLoading}
              />
            </div>
            {size.width > CONST.MOBILE_SIZE && (
              <FooterRight volume={volume} setVolume={setVolumefn} />
            )}
          </div>
        </footer>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    trackData: state.trackData,
    isPlaying: state.isPlaying,
    playlistdata: state.playlistdata,
    shuffle: state.shuffle,
    shufflelist: state.shufflelist,
    shufflekey: state.shufflekey,
  };
};

export default connect(mapStateToProps, {
  changeTrack,
  changePlay,
  setshufflekey,
  settime,
})(Footer);

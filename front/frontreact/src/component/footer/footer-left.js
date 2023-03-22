import { connect } from "react-redux";
import TextRegularM from "../text/text-regular-m";
import TitleS from "../text/title-s";
import styles from "./footer-left.module.css";
import { useState, useEffect } from "react";
import * as Icons from "../icons";
import MusicControlBox from "./player/music-control-box";
import FooterRight from "./footer-right";
import MusicProgressBar from "./player/music-progress-bar";
import CONST from "../../constants/index";
import { colors } from "../../constants/index";
import VideoPlayer from "../../videoPlayer";
import { ActionIcon } from "@mantine/core";
import { Video, VideoOff, Download } from "tabler-icons-react";
function FooterLeft(props) {
  const [open, setopen] = useState(false);
  const [video, setvideo] = useState(false);
  const [color, setcolor] = useState("#A92E9F");
  useEffect(() => {
    setcolor(colors[Math.round(Math.random() * colors.length)]);
  }, [props.trackData]);

  return (
    <div>
      {!open && (
        <div
          className={styles.footerLeft}
          onClick={(e) => {
            setopen(true);
          }}
        >
          <ImgBox trackData={props.trackData} />
          <SongDetails trackData={props.trackData} />
          <Download
            onClick={(e) => {
              window.location.href = props.trackData.track;
              e.stopPropagation();
            }}
          />
        </div>
      )}
      {open && (
        <div
          className={styles.full}
          id="swipable"
          style={{
            background: `linear-gradient(to bottom,${color}, #000000)`,
          }}
        >
          <div
            className={styles.close}
            onClick={() => {
              setopen(false);
            }}
          >
            <button className="downBtn">
              <Icons.Nextpage />
            </button>
          </div>

          {props.width < CONST.MOBILE_SIZE ? (
            <>
              {!video ? (
                <>
                  <ImgBox2 trackData={props.trackData} />
                  <SongDetails2 trackData={props.trackData} />
                  <ActionIcon size={"small"}>
                    <Video onClick={() => setvideo(true)}></Video>
                  </ActionIcon>
                </>
              ) : (
                <>
                  <VideoPlayer videoId={props.trackData.videoID} />
                  <SongDetails2 trackData={props.trackData} />
                  <ActionIcon size={"small"}>
                    <VideoOff onClick={() => setvideo(false)}></VideoOff>
                  </ActionIcon>
                </>
              )}

              <MusicProgressBar
                duration={props.duration}
                currentTime={props.currentTime}
                handleTrackClick={props.handleTrackClick}
              />
            </>
          ) : !video ? (
            <>
              <ImgBox2 trackData={props.trackData} />
              <SongDetails2 trackData={props.trackData} />
              <ActionIcon size={"small"}>
                <Video onClick={() => setvideo(true)}></Video>
              </ActionIcon>
            </>
          ) : (
            <>
              <VideoPlayer videoId={props.trackData.videoID} />
              <SongDetails2 trackData={props.trackData} />
              <ActionIcon size={"small"}>
                <VideoOff onClick={() => setvideo(false)}></VideoOff>
              </ActionIcon>
            </>
          )}
          {props.width < CONST.MOBILE_SIZE && (
            <MusicControlBox large={true} loading={props.loading} />
          )}
          {props.width < CONST.MOBILE_SIZE && (
            <FooterRight volume={props.volume} setVolume={props.setVolume} />
          )}
          <Download
            onClick={(e) => {
              window.location.href = props.trackData.track;
              e.stopPropagation();
            }}
          />
        </div>
      )}
    </div>
  );
}

function ImgBox({ trackData }) {
  return (
    <div className={styles.imgBox}>
      <img src={trackData.trackImg} alt="Gavurlar" />
    </div>
  );
}

function SongDetails({ trackData }) {
  return (
    <div className={styles.songDetails}>
      <TextRegularM>{trackData.trackName}</TextRegularM>
      <TextRegularM>{trackData.trackArtist}</TextRegularM>
    </div>
  );
}

function ImgBox2({ trackData }) {
  return (
    <div className={styles.imgBox2}>
      <img src={trackData.trackImg} alt="Gavurlar" />
    </div>
  );
}

function SongDetails2({ trackData }) {
  return (
    <div className={styles.songDetails}>
      <TitleS>{trackData.trackName}</TitleS>
      <TextRegularM>
        <small>{trackData.trackArtist}</small>
      </TextRegularM>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    trackData: state.trackData,
  };
};

export default connect(mapStateToProps)(FooterLeft);

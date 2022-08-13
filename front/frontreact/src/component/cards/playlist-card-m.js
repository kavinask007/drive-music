import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { changeTrack, setplaylistdata } from "../../actions";
import { Link } from "react-router-dom";
import TextBoldL from "../text/text-bold-l";
import TextRegularM from "../text/text-regular-m";
import PlayButton from "../buttons/play-button"; 
import PlayButton2 from "../buttons/Play-button2"; 
import { get_folder_songs } from "../../services/getsongs";
import styles from "./playlist-card-m.module.css";
import { Loader } from "@mantine/core";
function PlaylistCardM(props) {
  const [isthisplay, setIsthisPlay] = useState(false);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setIsthisPlay(parseInt(props.data.index) === props.trackData.trackKey[0]);
  });

  const checkPlayability = (index) => {
    if (props.playlistdata[index]["isLoaded"]) {
      return true;
    }
    return false;
  };
  const loadPlaylist = (index) => {
    setloading(true);
    var path = props.playlistdata[index]["link"];
    get_folder_songs(path).then((data) => {
      var playlist = props.playlistdata[index];
      var playlistData = Object.values(data);
      if (playlistData.length == 0) {
        playlist["isLoaded"] = true;
        props.setplaylistdata(index, playlist);
        setloading(false);
        return 
      }
      playlist["playlistData"] = playlistData;
      playlist["isLoaded"] = true;
      playlist["imgUrl"] = playlistData[0]["songimg"];
      props.setplaylistdata(index, playlist);
      setloading(false);
      props.changeTrack([parseInt(props.data.index), 0]);
    });
  };
  return (
    <div className={styles.PlaylistCardSBox}>
      <Link to={`/${props.type}/${props.data.link}`}>
        <div className={styles.PlaylistCardS}>
          <div className={styles.ImgBox}>
            <img src={props.data.imgUrl} alt={props.data.title} />
          </div>
          <div className={styles.Title}>
            <TextBoldL>{props.data.title}</TextBoldL>
            <TextRegularM>{props.data.artist}</TextRegularM>
          </div>
        </div>
      </Link>
      <div
        onClick={() => {
          if (checkPlayability(parseInt(props.data.index))) {
            props.changeTrack([parseInt(props.data.index), 0]);
          } else {
            loadPlaylist(parseInt(props.data.index));
          }
        }}
        className={`${styles.IconBox} ${
          isthisplay && props.isPlaying ? styles.ActiveIconBox : ""
        }`}
      >
        {loading ? <Loader /> :isthisplay? <PlayButton isthisplay={isthisplay}/> :<PlayButton2/> }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    trackData: state.trackData,
    isPlaying: state.isPlaying,
    playlistdata: state.playlistdata,
  };
};

export default connect(mapStateToProps, { changeTrack, setplaylistdata })(
  PlaylistCardM
);

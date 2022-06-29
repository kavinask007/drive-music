import React from "react";
import { connect } from "react-redux";
import { changePlay } from "../../actions";
import * as Icons from "../icons";
import IconButton from "../buttons/icon-button";

import styles from "./play-button.module.css";

function PlayButton(props) {
  return (
    <div
      className={props.large?styles.playBtnlarge:styles.playBtn}
      tabIndex="0"
      role="button"
      onClick={() => props.changePlay(!props.isPlaying)}
    >
      {props.isPlaying && props.isthisplay ? (
        <IconButton icon={props.large?<Icons.Pauselarge/>:<Icons.Pause />} activeicon={props.large?<Icons.Pauselarge/>:<Icons.Pause />} />
      ) : (
        <IconButton icon={props.large?<Icons.Playlarge />:<Icons.Play />} activeicon={props.large?<Icons.Playlarge />:<Icons.Play />} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isPlaying: state.isPlaying,
  };
};

export default connect(mapStateToProps, { changePlay })(PlayButton);

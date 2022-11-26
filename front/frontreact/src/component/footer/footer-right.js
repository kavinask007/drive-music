import * as Icons from "../icons";
import RangeSlider from "./range-slider";
import IconButton from "../buttons/icon-button";
import styles from "./footer-right.module.css";
import { useState } from "react";
import React from "react";
import { connect } from "react-redux";
import styles2 from "../buttons/icon-button.module.css";
import { setshuffle } from "../../actions/index";
function FooterRight({ volume, setVolume }) {
  return (
    <div className={styles.footerRight}>
      <SoundLevel volume={volume} setVolume={setVolume} />
    </div>
  );
}

function SoundLevel({ volume, setVolume }) {
  const [isActive, setIsActive] = useState(false);
  const [lastVolume, setLastVolume] = useState(1);
  const soundBtn = () => {
    if (volume == 0) {
      setVolume(lastVolume);
    } else {
      setLastVolume(volume);
      setVolume(0);
    }
  };
  const setVolumeTmp = (volume) => {
    if (volume == 0) {
      setIsActive(true);
      setLastVolume(0.5);
      setVolume(0);
    } else {
      setVolume(volume);
      setIsActive(false)
    }
  };

  return (
    <div className={styles.soundBar}>
      <div tabIndex="0" role="button" onClick={soundBtn}>
        <VolumeButton
          icon={<Icons.Sound />}
          activeicon={<Icons.SoundClose />}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      </div>
      <RangeSlider
        minvalue={0}
        maxvalue={1}
        value={volume}
        handleChange={setVolumeTmp}
      />
    </div>
  );
}

class VolumeButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button
        className={`${styles2.iconButton} ${
          this.props.isActive ? "activeIcon" : ""
        }`}
        onClick={() => {
          this.props.setIsActive(!this.props.isActive);
        }}
      >
        {this.props.isActive ? this.props.activeicon : this.props.icon}
      </button>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    shuffle: state.shuffle,
  };
};
connect(mapStateToProps, { setshuffle })(IconButton);
export default FooterRight;

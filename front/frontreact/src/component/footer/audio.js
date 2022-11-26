import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const Audio = forwardRef(
  (
    { trackData, handleDuration, handleCurrentTime, isPlaying, setloading },
    ref
  ) => {
    return (
      <audio
        ref={ref}
        onLoadedMetadata={(e) => handleDuration(e.target.duration)}
        onTimeUpdate={(e) => handleCurrentTime(e.target.currentTime)}
        src={trackData.track}
        autoPlay={isPlaying}
        onLoadStart={(e) => setloading(true)}
        onLoadedData={(e) => setloading(false)}
      />
    );
  }
);

Audio.propTypes = {
  handleDuration: PropTypes.func.isRequired,
  handleCurrentTime: PropTypes.func.isRequired,
};

export default Audio;

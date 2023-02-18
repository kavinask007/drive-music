import { useState } from "react";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
export default function VideoPlayer(props) {
  const isPlaying = useSelector((state) => state.isPlaying);
  const time = useSelector((state) => state.time);
  const starttime=time
  const [player, setplayer] = useState(null);
  if (player && props.videoId != undefined && player["i"] != null) {
    player.mute();
    if (
      Math.abs(Math.round(player.getCurrentTime()) -Math.round(time) )>0.75
    ) {
      player.seekTo(time);
    }
    if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }
  const opts = {
    height: "400px",
    width: "100%",
    playerVars: {
      start: 0,
      autoplay: 1,
      controls: 1,
      enablejsapi: 1,
      modestbranding: 1,
      hideVideoInfo: 1,
      iv_load_policy: 3,
    },
  };
  const onPlayerReady = (event) => {
    setplayer(event.target);
    event.target.seekTo(time);
  };
  return (
    <>
      {props.videoId != undefined ? (
        <YouTube
          onReady={onPlayerReady}
          videoId={props.videoId}
          start={starttime}
          containerClassName={props.videoId}
          opts={opts}
        />
      ) : (
        <h1>Video Not available</h1>
      )}
    </>
  );
}

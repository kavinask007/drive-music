import { useParams } from "react-router";
import { connect } from "react-redux";
import { changeTrack,setplaylistid,setshufflelist} from "../actions";
import Topnav from "../component/topnav/topnav";
import TextRegularM from "../component/text/text-regular-m";
import PlayButton from "../component/buttons/play-button";
import PlaylistDetails from "../component/playlist/playlist-details";
import PlaylistTrack from "../component/playlist/playlist-track";
import * as Icons from "../component/icons";
import styles from "./playlist.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MoreMenu from '../moremenu'
import {CreateShuffleList} from '../functions/random'
function PlaylistPage(props) {
  const [playlistIndex, setPlaylistIndex] = useState(undefined);
  const [isthisplay, setIsthisPlay] = useState(false);
  const playlistdata = useSelector((state) => state.playlistdata)
  const { path } = useParams();
  function changeBg(color) {
    document.documentElement.style.setProperty("--hover-home-bg", color);
  }
  useEffect(() => {
    if (playlistdata.length == 0) {
      window.location.href = "/";
    }
    for(let i=0;i<playlistdata.length;i++){
      if(playlistdata[i]['link']==path){
        props.setshufflelist(CreateShuffleList(playlistdata[i]['playlistData'].length))
        break;
      }
    }
    props.setplaylistid(path)
    
  }, [playlistdata]);
  useEffect(() => {
    setIsthisPlay(playlistIndex === props.trackData.trackKey[0]);
  })
  return (
   <div className={styles.PlaylistPage}>
      <div className={styles.gradientBg}></div>
      <div className={styles.gradientBgSoft}></div>
      <div className={styles.Bg}></div>
      <Topnav />
      {playlistdata.map((item) => {
        if (item.link == path) {
          return (
            <div
              key={item.title+item.artist}
              onLoad={() => {
                changeBg(item.playlistBg);
                setPlaylistIndex(playlistdata.indexOf(item));
              }}
            >
              <PlaylistDetails data={item} />

              <div className={styles.PlaylistIcons}>
                <button
                  onClick={() =>{
                    props.changeTrack([playlistdata.indexOf(item), 0])
                    setIsthisPlay(true)}
                  }
                >
                  <PlayButton isthisplay={isthisplay} />
                </button>
              </div>

              <div className={styles.ListHead}>
                <TextRegularM>#</TextRegularM>
                <TextRegularM>Music</TextRegularM>
                <Icons.Time />
              </div>

              <div className={styles.PlaylistSongs}>
                {item.playlistData.map((song) => {
                  return (
                    <button
                      key={song.index}
                      onClick={() => {
                        console.log(item.playlistData.indexOf(song));
                        props.changeTrack([
                          playlistdata.indexOf(item),
                          item.playlistData.indexOf(song),
                        ]);
                      }}
                      className={styles.SongBtn}
                    >
                      <PlaylistTrack
                        data={{
                          listType: item.type,
                          song: song,
                        }}
                        moreMenu={item.type=="album"}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
      })} 
      <MoreMenu/>
     
    </div>

  );
}

const mapStateToProps = (state) => {
  return {
    trackData: state.trackData,
  };
};



export default connect(mapStateToProps, { changeTrack,setplaylistid,setshufflelist})(PlaylistPage);

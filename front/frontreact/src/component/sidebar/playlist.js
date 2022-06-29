import { Link } from "react-router-dom";
import styles from "./playlist.module.css";
import TitleS from "../text/title-s";
import TextRegularM from "../text/text-regular-m";
import PlaylistButton from "./playlist-button";
import { PLAYLISTBTN } from "../../constants";
import { useSelector } from "react-redux";

function Playlist() {
  const playlistdata = useSelector((state) => state.playlistdata);
  return (
    <div className={styles.Playlist}>
      <TitleS>Çalma Listeleri</TitleS>

      <div>
        {PLAYLISTBTN.map((playlist) => {
          return (
            <PlaylistButton
              href={playlist.path}
              ImgName={playlist.ImgName}
              key={playlist.title}
            >
              {playlist.title}
            </PlaylistButton>
          );
        })}
      </div>

      <hr className={styles.hr} />

      <div>
        {playlistdata
          .filter((item) => item.type === "playlist")
          .map((list) => {
            return (
              <Link to={`/playlist/${list.link}`} key={list.title}>
                <TextRegularM>{list.title}</TextRegularM>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default Playlist;

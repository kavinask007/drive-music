import Topnav from "../component/topnav/topnav";
import TitleL from "../component/text/title-l";
import PlaylistCardM from "../component/cards/playlist-card-m";
import PlaylistCardS from "../component/cards/playlist-card-s";
import styles from "./home.module.css";
import { useSelector } from "react-redux";
import { Addplaylist } from "../addPlaylist";
import cardsytles from "../component/cards/playlist-card-m.module.css";
import { Button, Card, Center, Stack } from "@mantine/core";
import TitleS from "../component/text/title-s";
import { AddFolder } from "../addfolder";
import { FolderPlus } from "tabler-icons-react";
function Home(props) {
  return (
    <div>
      <div className={styles.Home}>
        <div className={styles.HoverBg}></div>
        <div className={styles.Bg}></div>
        <Topnav />

        <div className={styles.Content}>
          <section>
            {props.nodata ? (
              <>
                {" "}
                <div className={styles.SectionTitle}>
                  <Addplaylist />
                </div>
                <Center>
                  <TitleS>
                    Upload files to your drive or add your friend's playlist
                  </TitleS>
                </Center>
              </>
            ) : (
              <div style={{ overflowY: "scroll", height: "100vh" }}>
                <div className={styles.cardsholder}>
                  {props.playlistdata != undefined &&
                    props.playlistdata.map((item) => {
                      return (
                        <PlaylistCardM
                          key={item.title + item.artist}
                          data={item}
                          type="playlist"
                        />
                      );
                    })}
                  <Card>
                    <Stack>
                      <Addplaylist />
                      <AddFolder
                        trigger={() => (
                          <Button
                            variant="outline"
                            styles={{
                              outline: { color: "green" },
                            }}
                          >
                            <FolderPlus></FolderPlus> Add folder{" "}
                          </Button>
                        )}
                      />
                    </Stack>
                  </Card>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;

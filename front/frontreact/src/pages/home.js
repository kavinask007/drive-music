import Topnav from "../component/topnav/topnav";
import PlaylistCardM from "../component/cards/playlist-card-m";
import styles from "./home.module.css";
import { Addplaylist } from "../addPlaylist";
import { Button, Card, Center, Stack } from "@mantine/core";
import TitleS from "../component/text/title-s";
import { AddFolder } from "../addfolder";
import { FolderPlus } from "tabler-icons-react";
import { useSelector } from "react-redux";
function Home(props) {
  const trackData = useSelector((state) => state.trackData);
  return (
    <div>
      <div
        className={
        trackData.data == "" ? styles.Home : styles.HomeBottomPadding
        }
      >
        <div className={styles.HoverBg}></div>
        <div className={styles.Bg}></div>
        <Topnav />

        <div className={styles.Content}>
          <section>
            {props.nodata ? (
              <>
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

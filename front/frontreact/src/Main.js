import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import useWindowSize from "./hooks/useWindowSize";
import Sidebar from "./component/sidebar/sidebar";
import MobileNavigation from "./component/sidebar/mobile-navigation";
import Footer from "./component/footer/footer";
import Home from "./pages/home";
import PlaylistPage from "./pages/playlist";
import CONST, { get_token, endpoint } from "./constants/index";
import styles from "./style/App.module.css";
import MyUploader from "./pages/download";
import { setuser, setplaylist, setreload, setfolders } from "./actions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NavMenu from "./component/topnav/navmenu";
import { get_all_folders } from "./api/get_all_folders";
var template = {};
export default function Main(props) {
  const dispatch = useDispatch();
  const size = useWindowSize();
  const playlistdata = useSelector((state) => state.playlistdata);
  const reload = useSelector((state) => state.reload);
  const [dataloaded, setdataloaded] = useState(false);
  const [nodata, setnodata] = useState(false);
  const [loading, setloading] = useState(true);
  var loggedin = false;

  useEffect(() => {
    get_all_folders().then((data) => {
      dispatch(setfolders(data));
    });

    fetch(endpoint + "/api/loggedin/", {
      method: "GET",
      headers: {
        Authorization: get_token(),
      },
    })
      .then((response) => {
        if (response.ok) {
          loggedin = true;
          return response.json();
        } else {
          window.location.href = "/login/";
          return;
        }
      })
      .then((data) => {
        if (loggedin == true) {
          dispatch(setuser(data.username));
        }
      });
    setloading(true);
    if (playlistdata.length != 0) {
      setdataloaded(true);
      setloading(false);
    }
    dispatch(setreload(false));
    fetch(endpoint + "/api/getsongs/", {
      method: "GET",
      headers: {
        Authorization: get_token(),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data == null) {
          setnodata(true);
          setloading(false);
          setdataloaded(true);
          return;
        }
        let list = Object.values(data);
        if (list.length == 0) {
          setnodata(true);
          setloading(false);
          setdataloaded(true);
          return;
        }
        var final = [];
        for (let i = 0; i < list.length; i++) {
          let track = Object.values(list[i]["playlistData"]);
          template["index"] = list[i].index;
          template["type"] = list[i].type;
          template["title"] = list[i].title;
          template["link"] = list[i].link;
          template["imgUrl"] = list[i].imgUrl;
          template["hoverColor"] = list[i].hoverColor;
          template["artist"] = list[i].artist;
          template["playlistBg"] = list[i].playlistBg;
          template["isLoaded"]=false;
          template["playlistData"] = track;

          final.push(template);
          template = {};
        }
        console.log(final)
        dispatch(setplaylist(final));
        setdataloaded(true);
        setloading(false);
      });
  }, [reload]);
  return (
    <div>
      {loading && (
        <div className="item">
          <div className="loader10"></div>
        </div>
      )}
      {dataloaded && (
        <Router>
          <div className={styles.layout}>
            <>
              {size.width > CONST.MOBILE_SIZE ? (
                <Sidebar />
              ) : (
                <MobileNavigation />
              )}
              <Switch>
                <Route exact path="/">
                  <Home nodata={nodata} playlistdata={playlistdata} />
                </Route>
                <Route exact path="/playlist/:path">
                  <PlaylistPage />
                </Route>
                <Route path="/upload/" component={MyUploader}></Route>
              </Switch>
            </>
            <Footer />
          </div>
        </Router>
      )}
      <NavMenu />
    </div>
  );
}

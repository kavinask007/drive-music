import { MenuItem } from "@material-ui/core";
import {
  PLAYPAUSE,
  CHANGETRACK,
  SETPLAYLIST,
  SETUSER,
  SETMENU,
  SETCLIENTX,
  SETCLIENTY,
} from "../actions/index";
import {
  SETSONGID,
  SETRELOAD,
  SETNAVY,
  SETNAVX,
  SETNAVMENU,
  SETTIME,
} from "../actions/index";
import {
  SETPLAYLISTID,
  SETSHUFFLE,
  SETSHUFFLELIST,
  SETSHUFFLEKEY,
  SETFOLDERS,
  SETPLAYLISTDATA,
  SETPLAYLISTLOAD,
  SETLIKEUNLIKE,
} from "../actions/index";
const INITIAL_STATE = {
  isPlaying: false,
  user: ". . . . . . ",
  playlistdata: [],
  trackData: {
    trackKey: [0, 0],
    trackName: " ",
    trackImg: "/static/music-placeholder.png",
    track: "",
    videoID: "",
  },
  menu: false,
  clientx: 0,
  clienty: 0,
  songid: 0,
  reload: false,
  navmenu: false,
  navX: 0,
  navY: 0,
  playlistid: "",
  shuffle: false,
  shufflelist: [],
  shufflekey: 0,
  folders: [],
  time: 0,
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAYPAUSE:
      return {
        ...state,
        isPlaying: action.payload,
      };
    case SETMENU:
      return {
        ...state,
        menu: action.payload,
      };
    case SETRELOAD:
      return {
        ...state,
        reload: action.payload,
      };
    case SETCLIENTX:
      return {
        ...state,
        clientx: action.payload,
      };
    case SETCLIENTY:
      return {
        ...state,
        clienty: action.payload,
      };
    case SETSONGID:
      return {
        ...state,
        songid: action.payload,
      };

    case SETNAVMENU:
      return {
        ...state,
        navmenu: action.payload,
      };
    case SETNAVX:
      return {
        ...state,
        navX: action.payload,
      };
    case SETNAVY:
      return {
        ...state,
        navY: action.payload,
      };
    case SETPLAYLISTID:
      return {
        ...state,
        playlistid: action.payload,
      };
    case SETSHUFFLE:
      return {
        ...state,
        shuffle: action.payload,
      };
    case SETSHUFFLELIST:
      return {
        ...state,
        shufflelist: action.payload,
      };
    case SETSHUFFLEKEY:
      return {
        ...state,
        shufflekey: action.payload,
      };
    case CHANGETRACK:
      if (
        state.playlistdata[action.payload[0]].playlistData.length >
        action.payload[1]
      ) {
        return {
          ...state,
          trackData: {
            ...state.trackData,
            trackKey: action.payload,
            track: `${
              state.playlistdata[action.payload[0]].playlistData[
                action.payload[1]
              ].link
            }`,
            trackName: `${
              state.playlistdata[action.payload[0]].playlistData[
                action.payload[1]
              ].songName
            }`,
            trackImg: `${
              state.playlistdata[action.payload[0]].playlistData[
                action.payload[1]
              ].songimg
            }`,
            trackArtist: `${
              state.playlistdata[action.payload[0]].playlistData[
                action.payload[1]
              ].songArtist
            }`,
            videoID: `${
              state.playlistdata[action.payload[0]].playlistData[
                action.payload[1]
              ].videoId
            }`,
          },
        };
      } else {
        return { ...state };
      }
    case SETPLAYLIST:
      return {
        ...state,
        playlistdata: action.payload,
      };
    case SETLIKEUNLIKE:
      return {
        ...state,
        playlistdata: state.playlistdata.map((item_, index_) => {
          if (index_ == action.playlistIndex) {
            return {
              ...state.playlistdata[action.playlistIndex],
              playlistData: state.playlistdata[action.playlistIndex][
                "playlistData"
              ].map((item, index) => {
                if (item.index == action.index) {
                  item.is_liked = action.payload;
                }
                return item;
              }),
              
            };
           
          }
          return item_
        }),
      };

    case SETPLAYLISTDATA:
      return {
        ...state,
        playlistdata: state.playlistdata.map((item, index) => {
          if (index == action.index) {
            return action.payload;
          }
          return item;
        }),
      };
    case SETPLAYLISTLOAD:
      return {
        ...state,
        playlistdata: state.playlistdata.map((item, index) => {
          if (item.link == action.index) {
            item.isLoaded = action.payload;
            return item;
          }
          return item;
        }),
      };
    case SETUSER:
      return {
        ...state,
        user: action.payload,
      };
    case SETFOLDERS:
      return {
        ...state,
        folders: action.payload,
      };

    case SETTIME:
      return {
        ...state,
        time: action.payload,
      };

    default:
      return state;
  }
};

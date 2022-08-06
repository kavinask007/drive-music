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
} from "../actions/index";
const INITIAL_STATE = {
  isPlaying: false,
  user: ". . . . . . ",
  playlistdata: [],
  trackData: {
    trackKey: [0, 0],
    trackName: " ",
    trackImg:
      "https://i.pinimg.com/564x/0e/16/26/0e162634bfb41117c5ed8350ba3bf829.jpg",
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
  time:0,
  
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
          videoID:`${
            state.playlistdata[action.payload[0]].playlistData[
              action.payload[1]
            ].videoId
          }`
        },
      };
    case SETPLAYLIST:
      return {
        ...state,
        playlistdata: action.payload,
        trackData: {
          trackKey: [0, 0],
          track: `${action.payload[0].playlistData[0].link}`,
          trackName: `${action.payload[0].playlistData[0].songName}`,
          trackImg: `${action.payload[0].playlistData[0].songimg}`,
          trackArtist: `${action.payload[0].playlistData[0].songArtist}`,
          videoID: `${action.payload[0].playlistData[0].videoId}`,
        },
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

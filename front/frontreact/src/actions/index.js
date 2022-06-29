export const PLAYPAUSE = "PLAYPAUSE";
export const CHANGETRACK = "CHANGETRACK";
export const SETPLAYLIST = "SETPLAYLIST";
export const SETUSER = "SETUSER";
export const SETMENU = "SETMENU";
export const SETNAVMENU = "SETNAVMENU";
export const SETSONGID= "SETSONGID";
export const SETCLIENTX= "SETCLIENTX";
export const SETNAVX= "SETNAVX";
export const SETCLIENTY= "SETCLIENTY";
export const SETNAVY= "SETNAVY";
export const SETRELOAD="SETRELOAD"
export const SETPLAYLISTID='SETPLAYLISTID'
export const SETSHUFFLE='SETSHUFFLE'
export const SETSHUFFLELIST="SETSHUFFLELIST"
export const SETSHUFFLEKEY='SETSHUFFLEKEY'
export const SETSHARED='SETSHARED'
export const SETFOLDERS="SETFOLDERS"
export const changePlay = (isPlaying) => {
  return { type: PLAYPAUSE, payload: isPlaying };
};

export const changeTrack = (trackKey) => {
  return { type: CHANGETRACK, payload: trackKey };
};

export const setplaylist = (playlistdata) => {
  return { type: SETPLAYLIST, payload: playlistdata };
};
export const setuser = (user) => {
  return { type: SETUSER, payload: user };
};
export const setmoremenu = (data) => {
  return { type: SETMENU, payload: data };
};
export const setsongid = (data) => {
  return { type: SETSONGID, payload: data };
};export const setclientX = (data) => {
  return { type: SETCLIENTX, payload: data };
};
export const setclientY = (data) => {
  return { type: SETCLIENTY, payload: data };
};
export const setreload = (data) => {
  return { type: SETRELOAD, payload: data };
};
export const setnavmenu=(data) => {
  return{type:SETNAVMENU,payload:data}
}
export const setnavX=(data) => {
  return {type:SETNAVX,payload:data}
}
export const setnavY=(data) => {
  return {type:SETNAVY,payload:data}
}
export const setplaylistid=(data)=>{
return{type:SETPLAYLISTID,payload:data}
}
export const setshuffle=(data) => {
  return{type:SETSHUFFLE,payload:data}
}
export const setshufflelist=(data)=>{
  return{type:SETSHUFFLELIST,payload:data}
}
export const setshufflekey=(data) => {
 return{type:SETSHUFFLEKEY,payload:data} 
}
export const setshared=(data)=>{
  return {type:SETSHARED,payload:data}
}
export const setfolders=(data)=>{
  return {type:SETFOLDERS,payload:data}
}
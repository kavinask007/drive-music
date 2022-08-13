import { endpoint,get_token } from "../constants";
export function get_folder_songs(folderid) {
  return fetch(endpoint + "/api/getfoldersongs/", {
    method: "POST",
    headers: {
      Authorization: get_token(),
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
    user:"kavinraj",
    id:folderid
    })
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    }).catch((err) => {
      return err;
    }
    );
}
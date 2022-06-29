import {requestoptions,endpoint} from '../constants/index'
export async function get_all_folders() {
    requestoptions.method = "GET";
    requestoptions.body = null;
    const ans=fetch(endpoint + "/api/all-folders/", requestoptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return {
          "folders": [],
        };
      })
      .then((data) => {
       return data["folders"]
      });
    return ans
  }
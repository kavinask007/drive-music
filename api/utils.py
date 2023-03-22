import requests
import json
import urllib3
import audio_metadata
import math
from stopify_drive.settings import client_id, client_secret


def get_access_token(code):
    return requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": "https://drivify.kavinraj.com/code/",
        },
    ).json()


def get_stopify_folder_id(access_token):
    all_folders = requests.get(
        "https://www.googleapis.com/drive/v3/files",
        headers=get_headers(access_token),
        params={
            "corpora": "user",
            "supportsAllDrives": "true",
            "q": "mimeType = 'application/vnd.google-apps.folder'and trashed = false",
        },
    ).json()
    if "files" not in all_folders:
        return ""
    all_folders = all_folders["files"]
    for folder in all_folders:
        if folder["name"] == "Drivify":
            return folder["id"]
    return ""


def create_stopify_folder(access_token):
    response = requests.post(
        "https://www.googleapis.com/drive/v3/files",
        headers=get_headers(access_token),
        data=json.dumps(
            {
                "mimeType": "application/vnd.google-apps.folder",
                "name": "Drivify",
            }
        ),
    ).json()
    if "id" in response:
        make_folder_public(response["id"], access_token)
    return response


def create_playlist_folder(access_token, folder_name):
    return requests.post(
        "https://www.googleapis.com/drive/v3/files",
        headers=get_headers(access_token),
        data=json.dumps(
            {
                "mimeType": "application/vnd.google-apps.folder",
                "name": folder_name,
                "parents": [get_stopify_folder_id(access_token)],
            }
        ),
    ).json()


def get_items_from_folderid(access_token, folder_id, only_folders):
    if only_folders:
        q = (
            "'"
            + folder_id
            + "'"
            + " in parents and mimeType ="
            + "'"
            + "application/vnd.google-apps.folder"
            + "'"
            + "and trashed = false",
        )
    else:
        q = (
            "'"
            + folder_id
            + "'"
            + " in parents and mimeType !="
            + "'"
            + "application/vnd.google-apps.folder"
            + "'"
            + " and trashed=false"
        )
    tmp = requests.get(
        "https://www.googleapis.com/drive/v3/files",
        headers=get_headers(access_token),
        params={
            "corpora": "user",
            "supportsAllDrives": "true",
            "q": q,
            "pageSize": 200,
            "fields": "files(name,id,webContentLink,appProperties)",
            "orderBy": "createdTime desc",
        },
    ).json()
    if "files" in tmp:
        return tmp["files"]
    return []


def update_parents(fileid, destination, access_token):
    return requests.post(
        "https://www.googleapis.com/drive/v2/files/" + fileid + "/parents",
        headers=get_headers(access_token),
        data=json.dumps({
            "id":destination
        })
    ).json()
def remove_parent(fileid,current,access_token):
    return requests.delete("https://www.googleapis.com/drive/v2/files/"+fileid+"/parents/"+current,headers=get_headers(access_token)).json()


def upload_file_to_drive(
    access_token,
    content,
    audioname,
    folder_id,
    getmetadata,
    artist,
    trackTime,
    imgurl,
    videoId=None,
    parent_name="All Songs"
):
    if getmetadata:
        try:
            audmeta = audio_metadata.loads(content)
            trackTime = convert_seconds_to_minutes(audmeta["streaminfo"]["duration"])
            artist = audmeta["tags"]["artist"][0]
            audioname = audmeta["tags"]["title"][0]
        except Exception as e:
            # print(e)
            pass
    folders = get_items_from_folderid(access_token, folder_id, True)
    if not folders: return False
    for folder in folders:
        if folder["name"]==parent_name:
            parent=folder["id"]
    if not parent:
        new = create_playlist_folder(access_token,"All Songs")
        if "id" not in new:
            return None
        parent= new["id"]
    appProperties = {"trackTime": trackTime, "trackimg": imgurl, "songArtist": artist}
    if videoId:
        appProperties["videoId"] = videoId
    response = requests.post(
        "https://www.googleapis.com/drive/v3/files",
        headers=get_headers(access_token),
        data=json.dumps(
            {
                "mimeType": "*/*",
                "name": audioname,
                "description": "audio file uploaded by DRIVIFY",
                "parents": [parent],
                "appProperties": appProperties,
            }
        ),
    ).json()
    print(response)
    http = urllib3.PoolManager()
    resp = http.request(
        "PATCH",
        "https://www.googleapis.com/upload/drive/v3/files/"
        + response["id"]
        + "?uploadType=media",
        body=content,
        headers={
            "Authorization": "Bearer " + access_token,
            "Content-Type": "*/ *",
        },
    )
    # print(json.loads(resp.data.decode("utf-8")))


def make_folder_public(id, access_token):
    response = requests.post(
        "https://www.googleapis.com/drive/v3/files/" + id + "/permissions",
        data=json.dumps({"role": "reader", "type": "anyone"}),
        headers=get_headers(access_token),
    ).json()
    # print(response)


def convert_seconds_to_minutes(duration):
    minutes = math.floor(duration / 60)
    seconds = pad(math.floor(duration - minutes * 60))
    return f"{minutes}:{seconds}"


def pad(num):
    if num < 10:
        return f"0{num}"
    return num


def get_headers(access_token):
    return {
        "Authorization": "Bearer " + access_token,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
    }


def jsonify_songs(files,liked_songs=None):
    final = {}
    albumcover = None
    if liked_songs==None:
        liked_songs=[]
    else:
        liked_songs=[v for song in liked_songs for k,v in song.items() if k=="fileId"]
    for i in range(0, len(files)):
        videoId = None
        if "appProperties" in files[i]:
            songArtist = files[i]["appProperties"]["songArtist"]
            trackTime = files[i]["appProperties"]["trackTime"]
            trackimg = files[i]["appProperties"]["trackimg"]
            if "videoId" in files[i]["appProperties"]:
                videoId = files[i]["appProperties"]["videoId"]
            if albumcover is None:
                albumcover = trackimg
        else:
            songArtist = "unknown Aritst"
            trackTime = "none"
            trackimg = "https://i.ibb.co/txDCNx5/music-placeholder.png"
        final[str(i)] = {
            "index": str(i + 1),
            "songName": files[i]["name"],
            "songimg": trackimg,
            "songArtist": songArtist,
            "link": files[i]["webContentLink"],
            "trackTime": trackTime,
            "id": files[i]["id"],
            "is_liked":1 if files[i]["id"] in liked_songs else 0
        }
        if videoId != None:
            final[str(i)]["videoId"] = videoId
    return (final, albumcover)

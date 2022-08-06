from channels.consumer import AsyncConsumer,SyncConsumer
import json
from channels.db import database_sync_to_async
import os
from spotdl.search.song_gatherer import from_spotify_url
from spotdl.search.song_gatherer import from_playlist
from spotdl.search.spotify_client import SpotifyClient
from pytube import YouTube
import os
import django
django.setup()
from api.models import *
from asgiref.sync import sync_to_async
from api.utils import *
import typing
import threading
class Consumer(AsyncConsumer):
    async def websocket_connect(self, event):
        await self.send({
           'type':'websocket.accept'
        })
        print(event)

    async def websocket_receive(self, event):
        data = event.get("text", None)
        if data is not None:
            parsed = json.loads(data)
            '''self.channel_layer.send(
                'spotify-download',
                {
                    'type':"spotify_download",
                    'username':parsed['username'],
                    'url':parsed['link']
                   
                }
            )'''
            user_token = await get_access_token_object(parsed["username"])
            folder_id = get_stopify_folder_id(user_token.access_token)
            #result = await spotifydownload(parsed["link"], user_token,folder_id)
            #await self.send({"type": "websocket.send", "text": result})
            threading.Thread(target=spotifydownload,args=(parsed["link"], user_token,folder_id,)).start()
            await self.send(
            {
                "type": "websocket.close",
            }
            )

    async def websocket_disconnect(self, event):
        print(event)
 

@database_sync_to_async
def get_access_token_object(username):
    return User_tokens.objects.get(username=username).update_token_if_needed()


def spotifydownload(url,user_token,folder_id):
    var=url.split("/")
    song=[]
    a=SpotifyClient()
    if (var[3]=="playlist"):
         song =from_playlist(url)
    elif(var[3]=="track"):
        song.append(from_spotify_url(url))
    if song==[]:
        return 
    for i in song:
        url = i.youtube_link
        audioname=i.song_name
        artists=i.contributing_artists
        finalartist=""
        for artist in range(0,len(artists)):
            if artist<len(artists)-1:
                finalartist=finalartist+artists[artist]+","
            else:
                finalartist=finalartist+artists[artist]
            trackTime=convert_seconds_to_minutes(i.duration)
            imgurl=i.album_cover_url
        yt = YouTube(url)
        yts = yt.streams.get_audio_only()
        videoid=yt.video_id
        aud=yts.stream_to_buffer(buffer=typing.BinaryIO)
        final=b''
        for i in aud:
            final+=bytearray(i)
        upload_file_to_drive(
        access_token=user_token.access_token,
        content=final,
        audioname=audioname,
        folder_id=folder_id,
        getmetadata=False,
        artist=finalartist,
        videoId=videoid,
        trackTime=trackTime,
        imgurl=imgurl,
    )
    return 


'''            
class DownloadConsumer(SyncConsumer):
    def spotify_download(self,message):
        print('adfadfasdf')
        url=message['url']
        username=message['username']
        var=url.split("/")
        song=[]
        a=SpotifyClient()
        if (var[3]=="playlist"):
            song =from_playlist(url)
        elif(var[3]=="track"):
            song.append(from_spotify_url(url))
        if song==[]:
            return 
        for i in song:
            url = i.youtube_link
            audioname=i.song_name
            artists=i.contributing_artists
            finalartist=""
            for artist in range(0,len(artists)):
                if artist<len(artists)-2:
                    finalartist=finalartist+artists[artist]+","
                else:
                    finalartist=finalartist+artists[artist]
                trackTime=convert_seconds_to_minutes(i.duration)
                imgurl=i.album_cover_url
            yt = YouTube(url)
            yts = yt.streams.get_audio_only()
            yts = yt.streams.get_audio_only()
            aud=yts.stream_to_buffer(buffer=typing.BinaryIO)
            final=b''
            for i in aud:
                final+=bytearray(i)
            user_token = User_tokens.objects.get(username=username).update_token_if_needed()
            folder_id = get_stopify_folder_id(user_token.access_token)
            upload_file_to_drive(
        access_token=user_token.access_token,
        content=final,
        audioname=audioname,
        folder_id=folder_id,
        getmetadata=False,
        artist=finalartist,
        trackTime=trackTime,
        imgurl=imgurl,
    )
'''
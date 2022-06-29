from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from .utils import *
from pytube import YouTube
import typing
from django.http import HttpResponse
from spotdl.search.song_gatherer import from_spotify_url
from spotdl.search.spotify_client import SpotifyClient
import ytmusicapi as yT
@api_view(("POST",))
def downloadfromurl(request):
    url = request.data.get("url")
    folder=request.data.get("folder")
    parent_folder=request.data.get("parent")
    audioname = "unnamed"
    username = request.user
    val = URLValidator()
    try:
        val(url)
    except ValidationError:
        return Response({"msg": "Invalid url !"}, status=status.HTTP_400_BAD_REQUEST)
    req = requests.get(url)
    if req.status_code != requests.codes.ok:
        return Response({"msg": "File not found !"}, status=status.HTTP_400_BAD_REQUEST)
    # print(req.content)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    folder_id = get_stopify_folder_id(user_token.access_token)
    if folder_id is None:
         return Response({"msg": "Google drive not configured correctly!"}, status=status.HTTP_400_BAD_REQUEST)
    s = upload_file_to_drive(
        access_token=user_token.access_token,
        content=req.content,
        audioname=audioname,
        folder_id=folder_id,
        getmetadata=True,
        artist="unknown Artist" ,
        trackTime="None",
        imgurl="https://i.ibb.co/hc4sC8X/Pngtree-musical-note-decorative-watercolor-splatter-5348137.png",
        parent_name=parent_folder
    )
    # print(s.request)
    # print(req.headers)
    return Response({"msg": "Song uploaded !"}, status=status.HTTP_200_OK)

@api_view(("POST",))
def downloadfromyoutube(request):
    url = request.data.get("url")
    parent_folder=request.data.get("parent")
    username = request.user
    if not (str(url).startswith("https://")):
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    folder_id = get_stopify_folder_id(user_token.access_token)
    try:
        yt = YouTube(url)
        videoid=yt.video_id
        imgurl = yt.thumbnail_url
        audioname = yt.title
        artist = yt.author
        trackTime = convert_seconds_to_minutes(yt.length)
        yts = yt.streams.get_audio_only()
        aud = yts.stream_to_buffer(buffer=typing.BinaryIO)
        final = b''
        for i in aud:
            final += bytearray(i)
    except Exception as e:
        print(e)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    upload_file_to_drive(
        access_token=user_token.access_token,
        content=final,
        audioname=audioname,
        folder_id=folder_id,
        getmetadata=False,
        artist=artist,
        trackTime=trackTime,
        imgurl=imgurl,
        videoId=videoid,
        parent_name=parent_folder
    )
    return Response({}, status=status.HTTP_200_OK)

def upload_view(request):
    if request.method == 'POST':
        my_file = request.FILES.get('file')
        audioname = request.FILES.get("file").name
        username = request.user
        user_token = User_tokens.objects.get(
            username=username).update_token_if_needed()
        folder_id = get_stopify_folder_id(user_token.access_token)
        if folder_id is None:
            create_stopify_folder(user_token.access_token)
            return Response({}, status=status.HTTP_200_OK)
        s = upload_file_to_drive(
            access_token=user_token.access_token,
            content=my_file.read(),
            audioname=audioname,
            folder_id=folder_id,
            getmetadata=True,
            artist="unknown Artist",
            trackTime="None",
            imgurl="https://i.ibb.co/hc4sC8X/Pngtree-musical-note-decorative-watercolor-splatter-5348137.png",
        )
    return HttpResponse('upload')

@api_view(('POST',))
def spotifydownload(request):
    parent_folder=request.data.get("parent")
    username = request.user
    url = request.data.get('url')
    var = url.split("/")
    SpotifyClient()
    if (var[3] == "playlist"):
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    elif(var[3] == "track"):
        song = from_spotify_url(url)
    url = song.youtube_link
    audioname = song.song_name
    artists = song.contributing_artists
    finalartist = ""
    for artist in range(0, len(artists)):
        if artist < len(artists)-1:
            finalartist = finalartist+artists[artist]+","
        else:
            finalartist = finalartist+artists[artist]
        trackTime = convert_seconds_to_minutes(song.duration)
        imgurl = song.album_cover_url
    yt = YouTube(url)
    yts = yt.streams.get_audio_only()
    aud = yts.stream_to_buffer(buffer=typing.BinaryIO)
    final = b''
    for i in aud:
        final += bytearray(i)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
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
        videoId=yt.video_id,
        parent_name=parent_folder
    )
    return Response({}, status=status.HTTP_200_OK)

@api_view(("POST",))
def download_from_yt_video_id(request):
    song_id = request.data.get("id")
    username=request.user
    x=yT.YTMusic()
    y=x.get_song(videoId=song_id)
    if y['playabilityStatus']['status']=="ERROR":
        return Response({},status=status.HTTP_400_BAD_REQUEST)
    url=y['microformat']['microformatDataRenderer']['urlCanonical']
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    folder_id = get_stopify_folder_id(user_token.access_token)
    try:
        yt = YouTube(url)
        imgurl = yt.thumbnail_url
        audioname = yt.title
        artist = yt.author
        trackTime = convert_seconds_to_minutes(yt.length)
        yts = yt.streams.get_audio_only()
        aud = yts.stream_to_buffer(buffer=typing.BinaryIO)
        final = b''
        for i in aud:
            final += bytearray(i)
    except Exception as e:
        print(e)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    upload_file_to_drive(
        access_token=user_token.access_token,
        content=final,
        audioname=audioname,
        folder_id=folder_id,
        getmetadata=False,
        artist=artist,
        trackTime=trackTime,
        imgurl=imgurl,
        videoId=yt.video_id
    )
    return Response({}, status=status.HTTP_200_OK)

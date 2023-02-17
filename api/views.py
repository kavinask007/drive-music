from django.shortcuts import redirect
from .models import *
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from .forms import *
from rest_framework.response import Response
from rest_framework import status
import requests
import random
from django.utils import timezone
from datetime import timedelta
from .colors import colors
from .utils import *
import time
from rest_framework.authtoken.models import Token
# check and return if user is logged in 
@api_view(("GET",))
def isloggedin(request):
    if request.user.is_authenticated:
        return Response({"username": str(request.user)}, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(("GET",))
def logout_view(request):
    logout(request)
    return redirect("/signup/")

# for login 
@api_view(("POST",))
def loginpage(request):
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created =Token.objects.get_or_create(user=user)
            return Response({'token':str(token.key)}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

# handle signup 
@api_view(("POST",))
def signuppage(request):
    if request.method == "POST":
        form = CreateUserForm(request.data)
        if form.is_valid():
            form.save()
            return Response({}, status=status.HTTP_200_OK)
    return Response({"error": form.errors}, status=status.HTTP_400_BAD_REQUEST)

# to get the access token ,refresh token of google drive
@api_view(("POST",))
def receivecode(request):
    code = request.data.get("code")
    response = get_access_token(code)
    if 'error' in response:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    access_token = response.get("access_token")
    refresh_token = response.get("refresh_token")
    expires_in = timezone.now() + timedelta(seconds=response.get("expires_in"))
    user = User_tokens.objects.filter(username=request.user)
    if len(user) == 0:
        User_tokens.objects.create(
            username=request.user,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=expires_in,
        )
    else:
        user[0].access_token = access_token
        user[0].refresh_token = refresh_token
        user[0].expires_in = expires_in
        user[0].save(update_fields=["access_token",
                     "refresh_token", "expires_in"])
    return Response({}, status=status.HTTP_200_OK)

# to display all files in drivify folder
@api_view(("GET",))
def getsongs(request):
    username = request.user
    if not username.is_authenticated:
        return  Response({}, status=status.HTTP_400_BAD_REQUEST) 
    # get the user's gdrive token
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    # check if drivify folder exists if not create one
    folder_id = get_stopify_folder_id(user_token.access_token)
    if len(folder_id) == 0:
        stopify_id=create_stopify_folder(user_token.access_token)
        if 'id' in stopify_id:
            create_playlist_folder(user_token.access_token,'All Songs')
        return Response({}, status=status.HTTP_200_OK)
    final_template={}
    # get all the folders in drivify folder
    root= get_items_from_folderid(user_token.access_token, folder_id,True)
    # loop through all the folders and jsonify the song data
    for num,folder in enumerate(root):
        randomcolor=colors[random.randint(0,len(colors)-1)]
        response=get_items_from_folderid(user_token.access_token,folder['id'],False)
        if len(response)==0:
            continue
        files = response
        final_template[str(num)]={
        "index": str(num),
        "type": "album",    
        "title": folder['name'],
        "link": folder['id'],
        "imgUrl":'https://images.pexels.com/photos/7709554/pexels-photo-7709554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        "hoverColor": randomcolor,
        "artist": str(username),
        "playlistBg": randomcolor,
    }
        songs=jsonify_songs(files)
        albumcover=songs[1]
        if albumcover is None:
            albumcover="https://images.pexels.com/photos/7709554/pexels-photo-7709554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        final_template[str(num)]['imgUrl']=albumcover
        final_template[str(num)]["playlistData"] = songs[0]
    if num>0 or "0" in final_template:
        num+=1
    # user's shared playlists
    playlists=Playlist.objects.filter(user=user_token)
    if len(playlists)==0:
        return Response(final_template, status=status.HTTP_200_OK)
    for folder in playlists:
        randomcolor=colors[random.randint(0,len(colors)-1)]
        tmp = User_tokens.objects.filter(username=folder.owner)
        if len(tmp) == 0:
            continue
        owner=User_tokens.objects.get(username=folder.owner).update_token_if_needed()
        response=get_items_from_folderid(owner.access_token,folder.playlist,False)
        if len(response)==0:
            continue
        files = response
        final_template[str(num)]={
        "index": str(num),
        "type": "shared",    
        "title": folder.name,
        "link": folder.playlist,
        "imgUrl":'https://images.pexels.com/photos/7709554/pexels-photo-7709554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        "hoverColor": randomcolor,
        "artist": folder.owner,
        "playlistBg": randomcolor,
    }
        songs=jsonify_songs(files)
        albumcover=songs[1]
        if albumcover is None:
            albumcover="https://images.pexels.com/photos/7709554/pexels-photo-7709554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        final_template[str(num)]['imgUrl']=albumcover  
        final_template[str(num)]["playlistData"] = songs[0]
        num+=1
    # print(final_template)
    return Response(final_template, status=status.HTTP_200_OK)


# to get songs from a particular drive folder
@api_view(('POST',))
def get_songs_from_folder(request):     
    username=request.user
    id_=request.data.get('id')
    if len(User_tokens.objects.filter(username=username))==0:
        return  Response({"user":username}, status=status.HTTP_400_BAD_REQUEST)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    files=get_items_from_folderid(user_token.access_token,id_,False)
    songs=jsonify_songs(files)
    return Response(songs[0],status=status.HTTP_200_OK)
    
# to delete file in google drive
@api_view(('POST',))
def delete_view(request):
    username = request.user
    id_ = request.data.get('id')
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    response = requests.delete('https://www.googleapis.com/drive/v3/files/'+id_,
                               headers={
                                   "Authorization": "Bearer " + user_token.access_token, })
    if 'error' in response:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)                               
    return Response({}, status=status.HTTP_200_OK)

# to rename file in google drive
@api_view(('POST',))
def rename_view(request):
    username = request.user
    id_ = request.data.get('id')
    name = request.data.get('name')
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    response = requests.patch('https://www.googleapis.com/drive/v3/files/'+id_,
                               headers={
                                   "Authorization": "Bearer " + user_token.access_token,
                                   "Content-Type": "application/json"},
                                    data=json.dumps({
                                   'name': name
                               })).json()
    if 'error' in response:
        return Response({}, status=status.HTTP_400_BAD_REQUEST)
    return Response({}, status=status.HTTP_200_OK)

# TO display the name of  current drive account linked
@api_view(('GET',)) 
def get_drive_name(request):
    username=request.user
    if not username.is_authenticated:
        return  Response({}, status=status.HTTP_400_BAD_REQUEST)     
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    response=requests.get('https://www.googleapis.com/drive/v3/about',
    headers={
        "Authorization": "Bearer " + user_token.access_token,
    },
    params={
        'fields':"user"
    }).json()
    if 'error' in response:
        return Response({"error",response['error']}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'drive':response['user']['displayName'],'img':response['user']['photoLink']}, status=status.HTTP_200_OK)


# give access token with expiry for flutter front end
@api_view(('GET',))
def obtain_access_token(request):
    username=request.user
    if not username.is_authenticated:
        return  Response({}, status=status.HTTP_400_BAD_REQUEST) 
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    return Response({"token":user_token.access_token,'expires':user_token.expires_in},status=status.HTTP_200_OK) 

@api_view(('GET',))
def get_access_code(request):
    username=request.user
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    return Response({
        "code":user_token.access_token
    },status=status.HTTP_200_OK)


@api_view(('POST',))
def add_shared_playlist(request):
    username=request.user
    owner=request.data.get("owner")
    playlistId=request.data.get("playlistId")
    name=request.data.get("name")
    if len(name)==0:
        name="shared with you"
    if not username.is_authenticated:
        return  Response({}, status=status.HTTP_400_BAD_REQUEST)
    if len(User_tokens.objects.filter(username=owner))==0:
        return  Response({"msg":"User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    owner_token = User_tokens.objects.get(
        username=owner).update_token_if_needed()
    user_token= User_tokens.objects.get(
        username=username).update_token_if_needed()
    user_playlist=Playlist.objects.filter(user=user_token)
    for i in user_playlist:
        if i.playlist==playlistId:
            return Response({"msg":"Playlist already exists"}, status=status.HTTP_400_BAD_REQUEST)
    response=get_items_from_folderid(owner_token.access_token,playlistId,False)
    if len(response)==0:
        return  Response({"msg":" Invalid Playlist "}, status=status.HTTP_400_BAD_REQUEST) 
    Playlist.objects.create(
user=user_token,
name=name,
playlist=playlistId,
owner=owner
    )
    return Response({"msg":"Playlist Sucessfully added"}, status=status.HTTP_200_OK)
@api_view(("GET",))
def get_all_folders(request):
    username=request.user
    if not username.is_authenticated:
        return  Response({"msg":"User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    folder_id = get_stopify_folder_id(user_token.access_token)
    if len(folder_id)==0:
        return  Response({"msg":"No folders found"}, status=status.HTTP_400_BAD_REQUEST)
    # get all the folders in drivify folder
    all_folders= get_items_from_folderid(user_token.access_token, folder_id,True)
    if all_folders:
        return Response({"folders":all_folders},status=status.HTTP_200_OK)
    return Response({"msg":"No folders found"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(('POST',))
def create_new_folder(request):
    username=request.user
    folderName=request.data.get("foldername")
    if not username.is_authenticated:
        return  Response({"msg":"User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    if folderName:
        result=create_playlist_folder(user_token.access_token,folderName)
        if "id" in result:
            return Response({"msg":"folder created"},status=status.HTTP_200_OK)
    return Response({"msg":"Coudn't create folder"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(('POST',))
def move_file(request):
    username=request.user
    if not username.is_authenticated:
        return  Response({"msg":"User not authenticated"}, status=status.HTTP_400_BAD_REQUEST)
    destination=request.data.get('destination')
    fileid=request.data.get('fileid') 
    user_token = User_tokens.objects.get(
        username=username).update_token_if_needed()
    result=update_parents(fileid=fileid,destination=destination,access_token=user_token.access_token)
    if 'error' in result:
        return Response({},status=status.HTTP_400_BAD_REQUEST)
    return Response({},status=status.HTTP_200_OK)


# to display all files in drivify folder
@api_view(("GET",))
def getplaylist(request):
    username = request.user
    if not username.is_authenticated:
        return  Response({}, status=status.HTTP_400_BAD_REQUEST) 
    # get the user's gdrive token
    user_token = User_tokens.objects.get(
username=username).update_token_if_needed()
    # check if drivify folder exists if not create one
    folder_id = get_stopify_folder_id(user_token.access_token)
    if len(folder_id) == 0:
        stopify_id=create_stopify_folder(user_token.access_token)
        if 'id' in stopify_id:
            create_playlist_folder(user_token.access_token,'All Songs')
        return Response({}, status=status.HTTP_200_OK)
    final_template={}
    # get all the folders in drivify folder
    root= get_items_from_folderid(user_token.access_token, folder_id,True)
    # loop through all the folders and jsonify the song data
    for num,folder in enumerate(root):
        randomcolor=colors[random.randint(0,len(colors)-1)]
        final_template[str(num)]={
        "index": str(num),
        "type": "album",    
        "title": folder['name'],
        "link": folder['id'],
        "hoverColor": randomcolor,
        "artist": str(username),
        "playlistBg": randomcolor,
        "imgUrl":"/static/music-placeholder.png",
        "playlistData":[]
    }
    if num>0 or "0" in final_template:
        num+=1
    # user's shared playlists
    playlists=Playlist.objects.filter(user=user_token)
    if len(playlists)==0:
        return Response(final_template, status=status.HTTP_200_OK)
    for folder in playlists:
        randomcolor=colors[random.randint(0,len(colors)-1)]
        final_template[str(num)]={
        "index": str(num),
        "type": "shared",    
        "title": folder.name,
        "link": folder.playlist,
        "hoverColor": randomcolor,
        "artist": folder.owner,
        "playlistBg": randomcolor,
        "imgUrl":"/static/music-placeholder.png",
        "playlistData":[] 
    }
        num+=1
    # print(final_template)
    return Response(final_template, status=status.HTTP_200_OK)

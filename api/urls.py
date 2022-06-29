from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import *
from .search import *
from .dowload import *
urlpatterns = [
path("loginapi/",loginpage),
path("logout/",logout_view),
path("signup/",signuppage),
path("loggedin/",isloggedin),
path('authcode/',receivecode),
path('getsongs2/',getsongs),
path("downloadurl/",downloadfromurl),
path("youtubeurl/",downloadfromyoutube),
path("upload/",upload_view),
path('delete/',delete_view),
path('rename/',rename_view),
path('drivename/',get_drive_name),
path('accesscode',get_access_code),
path('getfoldersongs',get_songs_from_folder),
path('get-auth-token/',obtain_auth_token),
path('get-access-token/',obtain_access_token),
path('search/',search_view),
path('artist/',artist_view),
path('album/',album_view),
path("ytmusic/",download_from_yt_video_id),
path("add-shared-playlist/",add_shared_playlist),
path("all-folders/",get_all_folders),
path("create-folder/",create_new_folder),
path("move/",move_file),
path("spotify/",spotifydownload),
]

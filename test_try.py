import ytmusicapi as yt
import json
x=yt.YTMusic()
'''accept: */*
accept-encoding: gzip, deflate, br
accept-language: en-US,en;q=0.9
authorization: SAPISIDHASH 1640969531_41b1b4f2950b40d14b22a7366773738148e765d7
content-length: 1917
content-type: application/json
cookie: VISITOR_INFO1_LIVE=LFPAJ0j52yk; LOGIN_INFO=AFmmF2swRQIgdsqet0wZ8gUydj3L80yTZsqJUjOKphp3hRsWhYsSNegCIQDz1x3HLZ1Gl-l-dQclvzfk099MAdUA4NXFHrtGDTCvnw:QUQ3MjNmekhQMFZWbFo1RUQzNHRKRnNkQXloVHlfa2k2eDFGWkwtZmo1MHpYTFcyMVI3a3lGSldHandnSEd2bGxDUzlZUVBqRUtlenVSdjFmLU9BQjVMUmZMS0NFQ291MjFnM0Z1VGVud1NibVEtNVFFa1FGMTQteFJsR0tCOFNCS2ZKS2ZQRHVNVk5yRHhqUTZSYm9TQjYwaXFLZ05uckx3; HSID=AyNUOHZpRLgTg3JyB; SSID=AWlmNyYkdNBdMXvNH; APISID=1NA4L1yaZ6YEU6u_/AQ7FLKM5tNerCPSQx; SAPISID=BYpBtlGw3pPuaH_F/A9GuG7Y69JP-BgQSl; __Secure-1PAPISID=BYpBtlGw3pPuaH_F/A9GuG7Y69JP-BgQSl; __Secure-3PAPISID=BYpBtlGw3pPuaH_F/A9GuG7Y69JP-BgQSl; NID=511=D0Dcfqf4w1rwRG5aE5cBVnaxoxnmg_DJUV8G6RTswnBd15SmOFprMKDMQXRV6W0A_jkFSGwa5oZCT0BqmX87wdkbhc8iY4JmGSJjirz7uczpG99X-yHJXhykyICXUmErLCyrwvXQhDLtVYXdjV_P2nqdQ-QDNBYvod9NaDmjiQc; SID=EgjhkklcPNYnczhEB2ObTVqTaKt2X8HoP8CxGXHfUTkhZi6LScdlnpGBZitBDubQ9Gt2dg.; __Secure-1PSID=EgjhkklcPNYnczhEB2ObTVqTaKt2X8HoP8CxGXHfUTkhZi6Lcz1At-89pqOnPdg403Llrw.; __Secure-3PSID=EgjhkklcPNYnczhEB2ObTVqTaKt2X8HoP8CxGXHfUTkhZi6LjU4T9Z2Bmp0mvhF0iNmayg.; _gcl_au=1.1.750441112.1639927422; YSC=GnlwJK3OqRk; PREF=tz=Asia.Calcutta&f6=40000400&f5=30000&f4=4000000&hl=en-IN&repeat=NONE&library_tab_browse_id=FEmusic_liked_playlists; SIDCC=AJi4QfFcHGcyMPnNMHnqFhzVa1nEwBhn-zVo5GkZnj1XP7lhEwhZu_M4XJspTTHf1gKIlThAbJ4Q; __Secure-3PSIDCC=AJi4QfF66Z0pqLfDx9C3XfxKvSUjvsUGdbxoVuu6K7Tv7J4-ybR36_5aMIoLktz5EMqFBmm-76KB
origin: https://music.youtube.com
referer: https://music.youtube.com/library/playlists
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"
sec-ch-ua-mobile: ?1
sec-ch-ua-platform: "Android"
sec-fetch-dest: empty
sec-fetch-mode: same-origin
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36
x-client-data: CKy1yQEIlLbJAQiktskBCMS2yQEIqZ3KAQiRk8sBCOvyywEInvnLAQjW/MsBCOaEzAEItYXMAQjLicwBCIeNzAEIrI7MAQiZj8wBCNKPzAEI2ZDMAQjWk8wBGIyeywE=
Decoded:
message ClientVariations {
  // Active client experiment variation IDs.
  repeated int32 variation_id = [3300012, 3300116, 3300132, 3300164, 3313321, 3328401, 3340651, 3341470, 3341910, 3342950, 3343029, 3343563, 3344007, 3344172, 3344281, 3344338, 3344473, 3344854];
  // Active client experiment variation IDs that trigger server-side behavior.
  repeated int32 trigger_variation_id = [3329804];
}
x-goog-authuser: 0
x-goog-visitor-id: CgtMRlBBSjBqNTJ5ayje6byOBg%3D%3D
x-origin: https://music.youtube.com
x-youtube-client-name: 67
x-youtube-client-version: 1.20211213.00.00'''

# # y=x.search(query='adfasdfasf',filter='songs',ignore_spelling=True)
# # print(y)
z=x.get_song(videoId='gU2HqP4NxUs')
print(z['videoDetails']['videoId'])
# print(z['microformat']['microformatDataRenderer']['urlCanonical'])
# z=x.get_album('MPREb_a8adfasdfadPYoKfrQ4')
# print(z)

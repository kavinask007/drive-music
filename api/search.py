import ytmusicapi as yT
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
@api_view(("POST",))
def search_view(request):
    search_term=request.data.get('data')
    x=yT.YTMusic()
    y=x.search(query=search_term,ignore_spelling=True,filter='songs')
    final={}
    if len(y)==0:
        return Response({},status=status.HTTP_400_BAD_REQUEST)
    for i in range(len(y)):
        final[str(i)]={"title":y[i]['title'],'id':y[i]['videoId'],'thumbnail':y[i]['thumbnails'][0]['url']}
    return Response(final,status=status.HTTP_200_OK)
@api_view(("POST",))
def artist_view(request):
    q=request.data.get("data")
    x=yT.YTMusic()
    try:
        y=x.get_artist(q)
    except:
        return Response({},status=status.HTTP_400_BAD_REQUEST)
    return Response(y,status=status.HTTP_200_OK)

@api_view(("POST",))
def album_view(request):
    q=request.data.get("data")
    x=yT.YTMusic()
    try:
        y=x.get_album(q)
    except:
        return Response({},status=status.HTTP_400_BAD_REQUEST)
    return Response(y,status=status.HTTP_200_OK)

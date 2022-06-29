from operator import mod
from django.db import models
import datetime
import requests
from django.utils import timezone
from stopify_drive.settings import client_secret,client_id
# Create your models here.
class User_tokens(models.Model):
    username=models.CharField(max_length=150)
    access_token=models.CharField(max_length=500)
    refresh_token=models.CharField(max_length=500)
    created_at=models.DateTimeField(auto_now_add=True)
    expires_in=models.DateTimeField(null=True)
    def update_token_if_needed(self):
        if timezone.now()>=self.expires_in:
            response=requests.post('https://oauth2.googleapis.com/token',data={
            'grant_type':'refresh_token',
            'refresh_token':self.refresh_token,
            'client_id':client_id,
            "client_secret":client_secret,
        }).json()
            self.access_token=response.get('access_token')
            self.expires_in=timezone.now()+datetime.timedelta(seconds=response.get('expires_in'))
            self.save(update_fields=['access_token','expires_in'])
        return self
class Playlist(models.Model):
    user = models.ForeignKey(
        'User_tokens',
        on_delete=models.CASCADE,
    )
    name=models.CharField(max_length=150)
    playlist=models.CharField(max_length=500)
    owner=models.CharField(max_length=500)

"""
ASGI config for stopify_drive project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stopify_drive.settings')
import channels
from channels.routing import ProtocolTypeRouter,URLRouter,ChannelNameRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.conf.urls import url
from .consumer import Consumer
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "https": get_asgi_application(),
    'websocket':AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                    url('spotifyupload/',Consumer.as_asgi()),
                ]
            )
        )
    )
})

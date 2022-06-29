from django.contrib import admin
from django.urls import path,include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path("",TemplateView.as_view(template_name='index.html')),
    path("api/",include("api.urls")),
    path("signup/",TemplateView.as_view(template_name='index.html')),
    path("upload/",TemplateView.as_view(template_name='index.html')),
    path("login/",TemplateView.as_view(template_name='index.html')),
    path("code/",TemplateView.as_view(template_name='index.html')),
    path("playlist/<str>",TemplateView.as_view(template_name='index.html')), 
]
 
if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
    urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
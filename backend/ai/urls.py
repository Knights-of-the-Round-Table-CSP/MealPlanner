from django.urls import path
from .views import *

urlpatterns = [
    path('send/', GeminiView.as_view(), name='send a request and get a response'),
    path('debug/', AIDebugView.as_view(), name='debug'),
]

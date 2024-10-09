from django.urls import path
from .views import *

urlpatterns = [
    path('', RecipesView.as_view(), name='recipes'),
    path('generate/', GenerateRecipeView.as_view(), name='generate recipe')
]

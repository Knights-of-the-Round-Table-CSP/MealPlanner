from django.urls import path
from .views import *

urlpatterns = [
    path('recipes/', RecipesView.as_view(), name='recipes'),
    path('recipes/generate/', GenerateRecipeView.as_view(), name='generate recipe'),

    path('questions/', QuestionsView.as_view(), name='questions'),
    path('questions/<int:pk>', QuestionView.as_view(), name='question'),

    path('answers/', AnswersView.as_view(), name='answers'),
    path('answers/<int:pk>', AnswerView.as_view(), name='answer'),
]

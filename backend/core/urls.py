from django.urls import path

from .qa.views import *
from .recipe.views import *

urlpatterns = [
    path('new-recipe/<str:type>', NewRecipeView.as_view(), name='new_recipe'),
    path('new-recipe-pic/<str:type>', NewRecipeFromFileView.as_view(), name='new_recipe_pic'),
    path('change-detalization/<int:pk>', ChangeRecipeDetalizationView.as_view(), name='change_detalization'),
    path('recipes/', RecipesView.as_view(), name='recipes'),
    path('recipes/<int:pk>', RecipeView.as_view(), name='recipe'),

    path('ingredients/', IngredientsView.as_view(), name='ingredients'),
    path('ingredients/<int:pk>', IngredientView.as_view(), name='ingredient'),

    path('steps/', CookingStepsView.as_view(), name='cooking_steps'),
    path('steps/<int:pk>', CookingStepView.as_view(), name='cooking_step'),

    path('questions/', QuestionsView.as_view(), name='questions'),
    path('questions/<int:pk>', QuestionView.as_view(), name='question'),

    path('answers/', AnswersView.as_view(), name='answers'),
    path('answers/<int:pk>', AnswerView.as_view(), name='answer'),
]

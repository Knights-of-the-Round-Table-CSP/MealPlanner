from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from ai.gemini import *
from . models import *
from . serializer import *

# Create your views here.

class RecipesView(APIView):

    serializer_class = RecipeSerializer

    def get(self, request):
        recipe = [ {"owner": recipe.owner.username, "name": recipe.name, "description": recipe.description}
        for recipe in Recipe.objects.all()]
        
        return Response(recipe)

    def post(self, request):
        serializer = RecipeSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class GenerateRecipeView(APIView):

    def get(self, request):
        ai = GeminiAPI()
        prompt = "Give me a popular dinner recipe for Finland, with detailed steps. Explain in a kind and friendly manner, like you are a mother."
        result = ai.send_prompt(prompt)

        return Response({"request": prompt, "response": result.split('\n')})

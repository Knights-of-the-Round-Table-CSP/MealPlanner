from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
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

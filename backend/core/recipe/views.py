import json
import tempfile

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ai.gemini import *
from .. qa.serializer import *
from .. models import *
from . serializer import *

# Create your views here.

class RecipesView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer

    def get(self, request):
        recipes = Recipe.objects.filter(owner=request.user)
        serializer = RecipeReturnModelSerializer(recipes, many=True, context={'request': request})

        return Response(serializer.data)

    def post(self, request):
        serializer = RecipeSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class RecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = RecipeReturnModelSerializer(recipe, context={'request': request})

        return Response(serializer.data)
    
    def delete(self, request, pk):
        instance = get_object_or_404(Recipe, pk=pk)
        instance.delete()
        
        return Response({"message": "Item deleted successfully"})
    
class NewRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, type):
        if type not in ["breakfast", "lunch", "dinner"]:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        ai = GeminiAPI()
        flag = 0

        if type == "breakfast":
            flag = flag + RecipeFlags.IS_BREAKFAST
        elif type == "lunch":
            flag = flag + RecipeFlags.IS_LUNCH
        elif type == "dinner":
            flag = flag + RecipeFlags.IS_DINNER

        existing_recipes = [ recipe.name
            for recipe in Recipe.objects
                .filter(owner=request.user)
                .extra(
                    where=["flags & %s != 0"],
                    params=[flag]
                )
        ]
        prompt = f"Give me a {type} recipe. But"
        for name in existing_recipes:
            prompt += " not " + name + ","

        prompt += "\nAnd here are some user answers on related questions for context:\n"
        questions = Question.objects.all()
        serializer = QuestionAnswersToTextSerializer(questions, many=True, context={'request': request})
        prompt += str(serializer.data)

        print("PROMPT: ", prompt)

        # I'm sorry for this
        # But sometimes it fails
        tries = 0
        while tries < 5:
            result = ai.send_recipe_prompt(prompt)
            serializer = RecipeInputQuerySerializer(data=json.loads(result), context={'request': request, 'type': type})
            if serializer.is_valid():
                recipe = serializer.save()
                output = RecipeReturnModelSerializer(recipe, context={'request': request})

                return Response(output.data)
            tries += 1
        
        return Response(["JSON parsing failed with error: ", serializer.errors, result.split("\n")], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, type):
        if type not in ["breakfast", "lunch", "dinner"]:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = RecipeInputQuerySerializer(data=request.data, context={'request': request, 'type': type})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NewRecipeFromFileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, type):
        def getPath(file):
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                
                temp_file_path = temp_file.name
                return temp_file_path
        
        if type not in ["breakfast", "lunch", "dinner"]:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = GenerateNewRecipeFromPictureRequestSerializer(data=request.data)

        if serializer.is_valid():
            path = ""
            if 'file' in serializer.validated_data:
                file = serializer.validated_data['file']
                print(file)
                path = getPath(file)

            user_input = serializer.validated_data['prompt']
            ai = GeminiAPI()
            flag = 0

            if type == "breakfast":
                flag = flag + RecipeFlags.IS_BREAKFAST
            elif type == "lunch":
                flag = flag + RecipeFlags.IS_LUNCH
            elif type == "dinner":
                flag = flag + RecipeFlags.IS_DINNER

            existing_recipes = [ recipe.name
                for recipe in Recipe.objects
                    .filter(owner=request.user)
                    .extra(
                        where=["flags & %s != 0"],
                        params=[flag]
                    )
            ]
            prompt = f"Give me a {type} recipe. "
            prompt += f"Special instructions are: " + user_input + ". "

            prompt += "But"
            for name in existing_recipes:
                prompt += " not " + name + ","

            prompt += "\nAnd here are some user answers on related questions for context:\n"
            questions = Question.objects.all()
            serializer = QuestionAnswersToTextSerializer(questions, many=True, context={'request': request})
            prompt += str(serializer.data)

            print("PROMPT: ", prompt)

            # I'm sorry for this
            # But sometimes it fails
            tries = 0
            while tries < 5:
                if len(path) > 0:
                    result = ai.send_recipe_picture_prompt(prompt, path)
                else:
                    result = ai.send_recipe_prompt(prompt)
                print(result)
                serializer = RecipeInputQuerySerializer(data=json.loads(result), context={'request': request, 'type': type})

                if serializer.is_valid():
                    recipe = serializer.save()
                    output = RecipeReturnModelSerializer(recipe, context={'request': request})

                    return Response(output.data)
                
                tries += 1
            
            return Response(["JSON parsing failed with error: ", serializer.errors, result.split("\n")], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeRecipeDetalizationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        instance = get_object_or_404(Recipe, pk=pk)

        if instance.flags & RecipeFlags.IS_BREAKFAST != 0:
            type = "breakfast"
        elif instance.flags & RecipeFlags.IS_LUNCH != 0:
            type = "lunch"
        elif instance.flags & RecipeFlags.IS_DINNER != 0:
            type = "dinner"

        isLong = instance.flags & RecipeFlags.IS_LONG != 0

        serializer = RecipeInputQuerySerializer(instance, context={'request': request, 'type': type})
        ai = GeminiAPI()

        if isLong:
            prompt = f"Make this recipe steps shorter. Avoid unnessesary details.\n"
        else:
            prompt = f"Make this recipe steps more detalised, add tips and details. I'm not good at cooking.\n"
        prompt += json.dumps(serializer.data)

        print("PROMPT: ", prompt)

        # I'm sorry for this
        # But sometimes it fails
        tries = 0
        while tries < 5:
            result = ai.send_recipe_prompt(prompt)
            print(result)
            serializer = RecipeInputQuerySerializer(instance, data=json.loads(result))
            if serializer.is_valid():
                recipe = serializer.save()
                output = RecipeReturnModelSerializer(recipe, context={'request': request})

                return Response(output.data)
            tries += 1
        
        return Response(["JSON parsing failed with error: ", serializer.errors, result.split("\n")], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class IngredientsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer

    def get(self, request):
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        serializer = IngredientSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class IngredientView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer

    def get(self, request, pk):
        instance = get_object_or_404(Ingredient, pk=pk)
        serializer = IngredientSerializer(instance)

        return Response(serializer.data)
        
    def put(self, request, pk):
        instance = get_object_or_404(Ingredient, pk=pk)
        serializer = IngredientSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = get_object_or_404(Ingredient, pk=pk)
        instance.delete()
        
        return Response({"message": "Item deleted successfully"})
    
class CookingStepsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CookingStepSerializer

    def get(self, request):
        steps = CookingStep.objects.all()
        serializer = CookingStepSerializer(steps, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        serializer = CookingStepSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CookingStepView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CookingStepSerializer

    def get(self, request, pk):
        instance = get_object_or_404(CookingStep, pk=pk)
        serializer = CookingStepSerializer(instance)

        return Response(serializer.data)
        
    def put(self, request, pk):
        instance = get_object_or_404(CookingStep, pk=pk)
        serializer = CookingStepSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = get_object_or_404(CookingStep, pk=pk)
        instance.delete()
        
        return Response({"message": "Item deleted successfully"})
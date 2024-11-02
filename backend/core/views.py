from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ai.gemini import *
from . models import *
from . serializer import *

# Create your views here.

class RecipesView(APIView):

    serializer_class = RecipeSerializer

    def get(self, request):
        recipes = Recipe.objects.filter(owner=request.user)
        serializer = RecipeSerializer(recipes, many=True)

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
    
class NewRecipeView(APIView):

    def post(self, request):
        serializer = RecipeInputQuerySerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GenerateRecipeView(APIView):

    def get(self, request):
        ai = GeminiAPI()
        # TODO: build one from user data and ansswers
        prompt = "Give me a popular dinner recipe for Finland, with detailed steps. Explain in a kind and friendly manner, like you are a mother."
        result = ai.send_prompt(prompt)

        return Response({"request": prompt, "response": result.split('\n')})
    
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

class QuestionsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get(self, request):
        questions = [ {"id": question.id, "question": question.question} 
        for question in Question.objects.all()]
        
        return Response(questions)
    
    def post(self, request):
        serializer = QuestionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class QuestionView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get(self, request, pk):
        question = get_object_or_404(Question, pk=pk)
        return Response(question.question)
        
    def put(self, request, pk):
        instance = get_object_or_404(Question, pk=pk)
        serializer = QuestionSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = get_object_or_404(Question, pk=pk)
        instance.delete()
        
        return Response({"message": "Item deleted successfully"})
    
class AnswersView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AnswerSerializer

    def get_serializer_context(self):
        # Pass the request object to the serializer context
        return {'request': self.request}
    
    def get(self, request):
        user = request.user
        answers = [ {"answerId": answer.id, "questionId": answer.questionId.id, "userId": answer.userId.id, "answer": answer.answer} 
        for answer in Answer.objects.filter(userId=user.id) ]
        
        return Response(answers)

    def post(self, request):
        serializer = AnswerSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AnswerView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in
    serializer_class = AnswerSerializer

    def get_serializer_context(self):
        # Pass the request object to the serializer context
        return {'request': self.request}
    
    def get(self, request, pk):
        answer = get_object_or_404(Answer, pk=pk)
        return Response(answer.answer)
        
    def put(self, request, pk):
        instance = get_object_or_404(Answer, pk=pk)
        serializer = AnswerSerializer(instance, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        instance = get_object_or_404(Answer, pk=pk)
        instance.delete()
        
        return Response({"message": "Item deleted successfully"})
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .. models import *
from . serializer import *

class QuestionsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get(self, request):
        questions = Question.objects.all()
        serializer = QuestionsReturnModelSerializer(questions, many=True, context={'request': request})

        return Response(serializer.data)
    
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
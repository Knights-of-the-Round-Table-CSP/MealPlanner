from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from . serializer import *
from ..recipe.serializer import *
from .. models import *
from ai.gemini import *

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatSerializer(data=request.data)

        if serializer.is_valid():
            ai = GeminiAPI()
            message = serializer.validated_data['message']
            message_history = serializer.validated_data['history']
            recipe_id = serializer.validated_data['recipeId']
            recipe = get_object_or_404(Recipe, pk=recipe_id)
            recipe_text = RecipeReturnModelSerializer(recipe, context={'request': request}).data

            result = ai.send_chat_message(message, message_history, str(recipe_text))

            return Response({"response": result})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
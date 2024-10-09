from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .gemini import *
from .serializer import *

# Create your views here.
class GeminiView(APIView):

    serializer_class = AIRequestSerializer

    def post(self, request):

        serializer = AIRequestSerializer(data=self.request.data,
            context={ 'request': self.request })

        if serializer.is_valid(raise_exception=True):
            ai = GeminiAPI()
            result = ai.send_prompt(serializer.validated_data['message'])

            return Response({"request": serializer.validated_data['message'], "response": result.split('\n')})
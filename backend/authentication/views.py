from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from authentication.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import redirect
from . serializer import *
import json
    
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, including unauthenticated users
    serializer_class = UserSerializer

    def post(self, request):
        # Extract the fields from the request
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        # Check if a user with the same email already exists
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the new user using CustomUserManager's create_user method
        user = CustomUser.objects.create_user(
            email=email, password=password, first_name=first_name, last_name=last_name
        )

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow access to anyone, including unauthenticated users
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': json.dumps(user.to_dict())
        })

class LogoutView(APIView):
    def post(self, request):
        return Response({'message': 'You cannot logout JWT, delete it from localStore instead'}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'is_superuser': user.is_superuser,
        })

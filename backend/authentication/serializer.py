from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import CustomUser

# CustomUser{
#     email,
#     password,
#     first_name,
#     last_name,
#     is_superuser,
#     is_staff
# }

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,  # Password should only be writeable, not readable
        style={'input_type': 'password'}  # This hides the password in forms (like DRF's browsable API)
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']

class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * email
      * password.
    It will try to authenticate the user when validated.
    """
    email = serializers.EmailField(
        label="Email",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take email and password from the request
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Try to authenticate the user using Django's authentication framework.
            user = authenticate(request=self.context.get('request'),
                                username=email, password=password)
            if not user:
                # If authentication fails, raise a ValidationError
                msg = 'Access denied: wrong email or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "email" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')

        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs

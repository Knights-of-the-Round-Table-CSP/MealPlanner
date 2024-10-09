from rest_framework import serializers
from . models import *

class AIRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        label="Message",
        write_only=True
    )

    def validate(self, attrs):
        message = attrs.get('message')

        if message:
            attrs['message'] = message
            return attrs
        else:
            msg = '\'message\' is required.'
            raise serializers.ValidationError(msg)
        

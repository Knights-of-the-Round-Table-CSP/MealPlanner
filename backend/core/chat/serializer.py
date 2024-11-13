from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    role = serializers.CharField()
    message = serializers.CharField()

class ChatSerializer(serializers.Serializer):
    recipeId = serializers.IntegerField()
    message = serializers.CharField()
    history = ChatMessageSerializer(many=True)

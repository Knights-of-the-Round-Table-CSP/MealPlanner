from rest_framework import serializers
from . models import *

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ['owner', 'name', 'description']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['questionId', 'answer']

    def create(self, validated_data):
        # Assign the owner (request.user) to the post before saving
        user = self.context['request'].user
        post = Answer.objects.create(userId=user, **validated_data)
        return post
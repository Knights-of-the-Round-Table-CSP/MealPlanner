from rest_framework import serializers
from .. models import *

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'questionId', 'answer']

    def create(self, validated_data):
        # Assign the owner (request.user) to the post before saving
        user = self.context['request'].user
        post = Answer.objects.create(userId=user, **validated_data)
        return post
    
class AnswerReturnModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'userId', 'answer']
    
class QuestionsReturnModelSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question', 'answers']

    def get_answers(self, obj):
        user = self.context['request'].user
        return [
            AnswerReturnModelSerializer(answer, context={'request': self.context['request']}).data
            for answer in obj.answers.filter(userId=user)
        ]
from django.db import models
from django.conf import settings

class Recipe(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField()
    flags = models.IntegerField(default=0)

class Question(models.Model):
    id = models.AutoField(primary_key=True)  # Explicitly defining the primary key
    question = models.CharField(max_length=200)

class Answer(models.Model):
    userId = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    questionId = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=500)
from django.db import models
from django.conf import settings

class Recipe(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    preparation_time = models.IntegerField(default=0)
    description = models.TextField()
    flags = models.IntegerField(default=0)

class Ingredient(models.Model):
    id = models.AutoField(primary_key=True)
    recipeId = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)

class CookingStep(models.Model):
    id = models.AutoField(primary_key=True)
    recipeId = models.ForeignKey(Recipe, related_name='steps', on_delete=models.CASCADE)
    number = models.IntegerField()
    instruction = models.TextField()

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=200)

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    userId = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    questionId = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=500)
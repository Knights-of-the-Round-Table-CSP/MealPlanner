from django.db import models
from django.conf import settings

# {
#   "recipe": {
#     "name": "Recipe Name",
#     "preparation_time": "30", // always in minutes
#     "description": "A short description of the recipe, including flavors, origin, or ideal occasions.",
#     "ingredients": [
#       {
#         "name": "Ingredient 1",
#         "quantity": "1",
#         "unit": "cup"
#       },
#       {
#         "name": "Ingredient 2",
#         "quantity": "2",
#         "unit": "tablespoon"
#       }
#     ],
#     "steps": [
#       {
#         "step_number": 1,
#         "instruction": "Preheat the oven to 180°C (350°F)."
#       },
#       {
#         "step_number": 2,
#         "instruction": "Mix the flour and sugar in a large bowl."
#       }
#     ]
#   }
# }

# {
#     "name": "Pasta1",
#     "preparation_time": "15",
#     "description": "Make pasta.",
#     "ingredients": [
#        {
#          "name": "Ingredient 1",
#          "quantity": "1",
#          "unit": "cup"
#        },
#        {
#          "name": "Ingredient 2",
#          "quantity": "2",
#          "unit": "tablespoon"
#        }
#     ],
#     "cooking_steps": [
#        {
#          "number": "1",
#          "instruction": "Preheat the oven to 180°C (350°F)."
#        },
#        {
#          "number": "2",
#          "instruction": "Mix the flour and sugar in a large bowl."
#        }
#     ]
# }

# {
#     "id": 2,
#     "isBreakfast": false,
#     "isLunch": true,
#     "isDinner": false,
#     "recipeName": "Caesar Salad",
#     "ingredients": [
#         "Romaine lettuce",
#         "Croutons",
#         "Parmesan cheese",
#         "Caesar dressing",
#         "Black pepper"
#     ],
#     "preparationTime": "10 minutes",
#     "steps": [
#         "Chop the Romaine lettuce into bite-sized pieces.",
#         "In a bowl, combine lettuce, croutons, and Parmesan cheese.",
#         "Drizzle Caesar dressing over the salad and toss to combine.",
#         "Season with black pepper to taste."
#     ],
    
#     "isLong": true,
#     "isShort": false
# }

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
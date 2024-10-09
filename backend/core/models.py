from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField()
    flags = models.IntegerField(default=0)

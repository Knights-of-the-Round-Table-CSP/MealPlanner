from django.db import models
from django.conf import settings

class Recipe(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField()
    flags = models.IntegerField(default=0)

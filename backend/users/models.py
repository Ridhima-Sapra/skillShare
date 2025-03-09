from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField('skills.Skill', related_name="users_with_skill", blank=True)
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username

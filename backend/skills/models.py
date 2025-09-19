

from django.db import models
from django.conf import settings

class Skill(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_skills")

    def __str__(self):
        return self.name

class UserSkill(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency = models.CharField(max_length=50, blank=True, null=True) 
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'skill')  # Prevent duplicate user-skill entries

    def __str__(self):
        return f"{self.user.username} - {self.skill.name}"

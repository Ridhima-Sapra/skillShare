from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

#will extend abstarct and add other features
class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    skills = models.ManyToManyField("skills.Skill", related_name="users_with_skill", blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
class UserConnection(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='connections_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='connections_received', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending','Pending'), ('accepted','Accepted'), ('rejected','Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    class Meta:
        unique_together = ("from_user", "to_user")

    def __str__(self):
        return f"{self.from_user.username} -> {self.to_user.username} ({self.status})"

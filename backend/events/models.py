from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

# end_time = models.DateTimeField(default=timezone.now)

User = get_user_model()


class GoogleCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="google_credentials")                  # Links each user to their Google OAuth tokens.
    access_token = models.TextField()
    refresh_token = models.TextField(blank=True, null=True)
    token_uri = models.TextField(default="https://oauth2.googleapis.com/token")
    client_id = models.TextField()
    client_secret = models.TextField()
    scopes = models.TextField()
    expiry = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Google Credentials"
    
    def is_expired(self):
        return self.expiry and timezone.now() >= self.expiry

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    date = models.DateTimeField()
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_events")
    attendees = models.ManyToManyField(User, related_name="events_attending", blank=True)
    meet_link = models.URLField(default='', blank=True)

    def __str__(self):
        return self.title




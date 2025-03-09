from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_events")
    attendees = models.ManyToManyField(User, related_name="events_attending", blank=True)

    def __str__(self):
        return self.title




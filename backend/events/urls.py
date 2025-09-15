
from django.urls import path
from .views import (
    EventListCreateView, EventDetailView, JoinEventView, LeaveEventView,
    create_event_with_google_meet, google_oauth_start, google_oauth_callback
)

from . import views

urlpatterns = [
     path('', EventListCreateView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/join/', JoinEventView.as_view(), name='join-event'),
    path('<int:pk>/leave/', LeaveEventView.as_view(), name='leave-event'),
    path("create-with-meet/", views.create_event_with_google_meet, name="create_event_with_google_meet"),
    path("google-oauth-start/", views.google_oauth_start, name="google-oauth-start"),
    path("google-oauth-callback/", views.google_oauth_callback, name="google-oauth-callback"),
]



from django.urls import path
from .views import EventListCreateView, EventDetailView, JoinEventView

urlpatterns = [
    path('', EventListCreateView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/join/', JoinEventView.as_view(), name='join-event'),
]

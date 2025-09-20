# users/urls.py
from django.urls import path
from .views import (
    CurrentUserView,
    SendConnectionRequestView,
    RespondConnectionRequestView,
    ListIncomingRequestsView,
    AcceptConnectionRequestView,  # if still needed
    ListUserConnectionsView,
    RegisterView, UserProfileView, DashboardView, SkillMatchView
)

urlpatterns = [
    path('<int:id>/', UserProfileView.as_view(), name='user-profile'),
    path('register/', RegisterView.as_view(), name='register'),
    path('skill-match/', SkillMatchView.as_view(), name='skill-match'),

    # connections
    path('connect/', SendConnectionRequestView.as_view(), name='send-connection'),
    path('connect/respond/<int:connection_id>/', RespondConnectionRequestView.as_view(), name='respond-connection'),
    path('connect/accept/<int:connection_id>/', AcceptConnectionRequestView.as_view(), name='accept-connection'),  # optional
    path('requests/', ListIncomingRequestsView.as_view(), name='incoming-requests'),
    path('connections/', ListUserConnectionsView.as_view(), name='list-connections'),

    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]

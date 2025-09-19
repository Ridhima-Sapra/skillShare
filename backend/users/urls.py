# Django needs URL routing to connect frontend requests to backend views.

from django.urls import path
from .views import RegisterView, UserProfileView, DashboardView, SkillMatchView
urlpatterns = [
    # GET or PATCH <id>/
    path('<int:id>/', UserProfileView.as_view(), name='user-profile'),

    # POST /api/register/
    path('register/', RegisterView.as_view(), name='register'),

    # GET /api/users/skill-match/?skill=...
    path('users/skill-match/', SkillMatchView.as_view(), name='skill-match'),

    # GET /api/dashboard/
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
]

from django.urls import path
from .views import RegisterView, UserProfileView, DashboardView, SkillMatchView
# from events.views import save_google_tokens
urlpatterns = [
    # GET or PATCH /api/users/<id>/
    path('<int:id>/', UserProfileView.as_view(), name='user-profile'),

    # POST /api/register/
    path('register/', RegisterView.as_view(), name='register'),

    # GET /api/users/skill-match/?skill=...
    path('users/skill-match/', SkillMatchView.as_view(), name='skill-match'),

    # GET /api/dashboard/
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    #  path("save-google-tokens/", save_google_tokens, name="save-google-tokens"),
]

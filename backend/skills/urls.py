from django.urls import path
from .views import AssignSkillView, SkillListCreateView, SkillDetailView, UserAssignedSkillsView
from users.views import UpdateUserSkillProficiencyView

urlpatterns = [
    path('', SkillListCreateView.as_view(), name='skill-list'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),
    path('assign-skill/', AssignSkillView.as_view(), name='assign-skill'),  
    path('user/<int:user_id>/skills-assigned/', UserAssignedSkillsView.as_view(), name='user-skills-assigned'),
    path('assigned-skill/<int:pk>/', UpdateUserSkillProficiencyView.as_view(), name='update-user-skill'),
]

from django.urls import path
from .views import  SkillListCreateView
from users.views import UpdateUserSkillProficiencyView
from .views import (
    AssignSkillView, SkillDetailView, 
    UserAssignedSkillsView, CreateSkillView,SkillResourceListCreateView

)
urlpatterns = [
    path('', SkillListCreateView.as_view(), name='skill-list'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),
    path('assign/', AssignSkillView.as_view(), name='assign-skill'),
    path("create/", CreateSkillView.as_view(), name="create-skill"),
    path("<int:skill_id>/resources/", SkillResourceListCreateView.as_view(), name="skill-resources"),

    path('assigned/<int:pk>/', UpdateUserSkillProficiencyView.as_view(), name='update-user-skill'),
    path('user/<int:user_id>/assigned/', UserAssignedSkillsView.as_view(), name='user-skills-assigned'),

]

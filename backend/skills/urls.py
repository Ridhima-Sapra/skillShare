from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet
from .views import SkillListCreateView, SkillDetailView

router = DefaultRouter()
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
urlpatterns = [
    path('', SkillListCreateView.as_view(), name='skill-list'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),
]
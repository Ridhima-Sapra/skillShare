from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from skills.views import SkillViewSet

# Router for ViewSets
router = DefaultRouter()
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/skills/', include('skills.urls')),
    path('api/events/', include('events.urls')),
]

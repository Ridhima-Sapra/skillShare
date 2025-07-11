from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from skills.views import SkillViewSet,AssignSkillView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from users.views import RegisterView

# Router for ViewSets
router = DefaultRouter()
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/custom-skills/', include('skills.urls')),
    path('api/events/', include('events.urls')),
    path('api/', include('users.urls')),
    # jwt
    path('api/register/', RegisterView.as_view(), name='register'),  # Ensure this line exists

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

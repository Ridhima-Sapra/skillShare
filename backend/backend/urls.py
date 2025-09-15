# from django.contrib import admin
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from skills.views import SkillViewSet,AssignSkillView
# from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
# from users.views import RegisterView
# from django.conf import settings
# from django.conf.urls.static import static
# from events.views import google_oauth_start as google_login
# from events.views import google_oauth_callback as google_callback

# # Router for ViewSets
# router = DefaultRouter()
# router.register(r'skills', SkillViewSet)

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include(router.urls)),
#     path('api/custom-skills/', include('skills.urls')),
#     path('api/events/', include('events.urls')),
#     path('api/', include('users.urls')),
#     # jwt
#     path('api/register/', RegisterView.as_view(), name='register'),  # Ensure this line exists

#     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
#     path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

#      path('api/google/login/', google_login, name='google_login'),
#     path('api/google/callback/', google_callback, name='google_callback'),
#     path('notifications/', include('notifications.urls')),
# ]


# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from skills.views import SkillViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# Router for ViewSets
router = DefaultRouter()
router.register(r'skills', SkillViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # App urls
    path('api/', include(router.urls)),
    path('api/custom-skills/', include('skills.urls')),
    path('api/events/', include('events.urls')),
    path('api/users/', include('users.urls')),

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Notifications
    path('notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

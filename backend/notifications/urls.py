from django.urls import path
from .views import test_send_notification

urlpatterns = [
    path('test/', test_send_notification),
]

from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def test_send_notification(request):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'notifications',
        {
            'type': 'send_notification',
            'message': 'Hello from backend test view!'
        }
    )
    return JsonResponse({'status': 'sent'})

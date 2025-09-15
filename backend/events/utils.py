import requests
from django.conf import settings

def refresh_google_access_token(user):
    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": user.google_refresh_token,
        "grant_type": "refresh_token"
    }
    resp = requests.post('https://oauth2.googleapis.com/token', data=data)
    tokens = resp.json()
    access_token = tokens.get('access_token')
    if access_token:
        # save new token
        user.google_access_token = access_token
        user.save()
        return access_token
    else:
        print("Failed to refresh:", tokens)
        return None

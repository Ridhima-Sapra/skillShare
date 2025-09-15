import requests
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from events.models import GoogleCredentials

def refresh_google_token(creds: GoogleCredentials):
    resp = requests.post(
        creds.token_uri,
        data={
            "client_id": creds.client_id,
            "client_secret": creds.client_secret,
            "refresh_token": creds.refresh_token,
            "grant_type": "refresh_token",
        },
    )
    data = resp.json()
    if resp.status_code == 200:
        creds.access_token = data["access_token"]
        expires_in = int(data.get("expires_in", 3600))
        creds.expiry = timezone.now() + timedelta(seconds=expires_in)
        creds.save()
        return True, "Token refreshed"
    return False, data.get("error_description", "Unknown error")

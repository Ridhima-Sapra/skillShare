# events/google_oauth.py
from django.conf import settings
import requests

CLIENT_ID = settings.GOOGLE_CLIENT_ID
CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
REDIRECT_URI = settings.GOOGLE_REDIRECT_URI  # matching to google console

def get_google_auth_url(state):
    return (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&scope=https://www.googleapis.com/auth/calendar"
        "&access_type=offline"
        "&prompt=consent"
        f"&state={state}"
    )

def exchange_code_for_tokens(code):
    data = {
        'code': code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    # print("Sending to Google:", data)

    resp = requests.post('https://oauth2.googleapis.com/token', data=data)
    # print("Google token response:", resp.status_code, resp.text)  

    resp.raise_for_status()
    return resp.json()  # contains access_token, refresh_token, expires_in



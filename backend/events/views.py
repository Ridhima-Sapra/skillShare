from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Event
from skills.models import UserSkill
from .serializers import EventSerializer
from users.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from notifications.utils import send_user_notification
from users.models import CustomUser
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
import requests, uuid, traceback
from datetime import datetime
from datetime import timedelta
from users.utils import refresh_google_token
from django.core.signing import Signer, BadSignature
from .google_oauth import exchange_code_for_tokens
from django.utils import timezone
from django.shortcuts import redirect
signer = Signer()
from .models import GoogleCredentials
from urllib.parse import quote
# Google OAuth Start
# The frontend opens this URL go to Google login screen then user grants permissions


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def google_oauth_start(request):
    client_id = settings.GOOGLE_CLIENT_ID
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    scope = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar"

    state = signer.sign(str(request.user.id))

    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
         f"?client_id={quote(str(client_id))}"
        f"&response_type=code"
        f"&redirect_uri={quote(str(redirect_uri))}"
        f"&scope={quote(str(scope))}"
        f"&access_type=offline"
        f"&prompt=consent"
        f"&state={quote(str(state))}"
    )
    return Response({'auth_url': auth_url})


# Google OAuth Callback

@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    if not code or not state:
        return Response({'error': 'Missing code or state'}, status=400)

    try:
        user_id = signer.unsign(state)
        user = CustomUser.objects.get(id=user_id)

        tokens = exchange_code_for_tokens(code)
        expires_in = int(tokens.get('expires_in', 3600))
        expiry_time = timezone.now() + timedelta(seconds=expires_in)
        
        GoogleCredentials.objects.update_or_create(
            user=user,
            defaults={
                "access_token": tokens["access_token"],
                "refresh_token": tokens.get("refresh_token"),
                "expiry": expiry_time,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "scopes": "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar",
            }
        )
        FRONTEND_SUCCESS_URL = settings.FRONTEND_URL + "/events?google_linked=1"
        return redirect(FRONTEND_SUCCESS_URL)
    except BadSignature:
        return Response({'error': 'Invalid state'}, status=400)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        print(traceback.format_exc())
        return Response({'error': str(e)}, status=500)

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def save_google_tokens(request):
#     data = request.data
#     GoogleCredentials.objects.update_or_create(
#         user=request.user,
#         defaults={
#             "access_token": data["access_token"],
#             "refresh_token": data.get("refresh_token"),
#             "client_id": data.get("client_id", settings.GOOGLE_CLIENT_ID),
#             "client_secret": data.get("client_secret", settings.GOOGLE_CLIENT_SECRET),
#             "scopes": " ".join(data.get("scopes", [])) if isinstance(data.get("scopes"), list) else data.get("scopes", ""),
#         }
#     )
#     return Response({"detail": "Google tokens saved successfully"})

# Create Event with Google Meet

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event_with_google_meet(request):
    try:
        user = request.user
        creds = user.google_credentials

        if not creds or not creds.access_token:
            return Response({'error': 'Google account not linked'}, status=400)

        # Refresh proactively if expired
        if creds.expiry and timezone.now() >= creds.expiry:
            refreshed, msg = refresh_google_token(creds)
            if not refreshed:
                return Response({'error': f'Could not refresh token: {msg}'}, status=400)

        access_token = creds.access_token

        title = request.data.get('title')
        description = request.data.get('description', '')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        if not all([title, start_time, end_time]):
            return Response({'error': 'Missing required fields'}, status=400)

        google_event = {
            "summary": title,
            "description": description,
            "start": {"dateTime": start_time},
            "end": {"dateTime": end_time},
            "conferenceData": {"createRequest": {"requestId": str(uuid.uuid4())}}
        }

        resp = requests.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            },
            json=google_event
        )

        if resp.status_code == 401:
            refreshed, msg = refresh_google_token(creds)
            if refreshed:
                access_token = creds.access_token 
                resp = requests.post(
                    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json"
                    },
                    json=google_event
                )

        data = resp.json()

        if resp.status_code not in (200, 201):
            return Response({'error': 'Failed to create Google event', 'details': data}, status=resp.status_code)

        meet_link = data.get('hangoutLink')
        start_time_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_time_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))

        event = Event.objects.create(
            title=title,
            description=description,
            date=start_time_dt.date(),
            start_time=start_time_dt,
            end_time=end_time_dt,
            host=user,
            meet_link=meet_link
        )

        for other_user in CustomUser.objects.exclude(id=user.id):
            send_user_notification(other_user.id, f'New event created: {event.title}')

        return Response({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'start_time': event.start_time,
            'end_time': event.end_time,
            'meet_link': event.meet_link
        })

    except Exception as e:
        print(traceback.format_exc())
        return Response({'error': str(e)}, status=500)


# -------------------------
# Event CRUD
# -------------------------
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['date', 'host']
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = Event.objects.all()
        skill_name = self.request.query_params.get('skill')
        if skill_name:
            users_with_skill = UserSkill.objects.filter(skill__name__icontains=skill_name).values_list('user', flat=True)
            queryset = queryset.filter(attendees__in=users_with_skill).distinct()
        return queryset

    def perform_create(self, serializer):
        event = serializer.save(host=self.request.user)
        send_user_notification(user_id=self.request.user.id, message=f'New event created: {event.title}')
        for user in CustomUser.objects.all():
            send_user_notification(user.id, f'New event created: {event.title}')


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class JoinEventView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        event = self.get_object()
        event.attendees.add(request.user)
        event.save()
        return Response({"message": "Joined Event!"})


class LeaveEventView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user not in event.attendees.all():
            raise ValidationError("You are not attending this event.")
        event.attendees.remove(request.user)
        return Response({"message": "You have left the event."})



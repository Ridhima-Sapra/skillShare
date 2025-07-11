from rest_framework import generics, permissions ,filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response  # Missing import added
from rest_framework.exceptions import ValidationError
from .models import Event
from skills.models import UserSkill
from .serializers import EventSerializer
from users.pagination import StandardResultsSetPagination
from rest_framework.permissions import IsAuthenticated

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['date','host']               # ✅ /api/events/?date=2025-07-06
    search_fields = ['title', 'description']  # ✅ /api/events/?search=ML
    def get_queryset(self):
        queryset = Event.objects.all()
        skill_name = self.request.query_params.get('skill')

        if skill_name:
            # Get all users who have this skill
            users_with_skill = UserSkill.objects.filter(skill__name__icontains=skill_name).values_list('user', flat=True)
            # Filter events attended by these users
            queryset = queryset.filter(attendees__in=users_with_skill).distinct()

        return queryset
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

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
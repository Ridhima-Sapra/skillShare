from rest_framework import generics, permissions, status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from users.models import CustomUser
from skills.models import UserSkill
from skills.serializers import UserSkillSerializer
from events.models import Event
from django.db import models
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import RegisterSerializer, UserProfileSerializer
from django.http import JsonResponse
from events.models import GoogleCredentials
from rest_framework.views import APIView
from skills.models import Skill, UserSkill
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from .serializers import UserProfileSerializer
from django.db.models import Q

User = get_user_model()

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserConnection
from .serializers import UserConnectionSerializer
from rest_framework.response import Response
from rest_framework import status

# Send connection request
class SendConnectionRequestView(generics.CreateAPIView):
    serializer_class = UserConnectionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        to_user_id = request.data.get('to_user')
        if not to_user_id:
            return Response({"detail": "to_user is required"}, status=status.HTTP_400_BAD_REQUEST)

        # block self
        if int(to_user_id) == request.user.id:
            return Response({"detail": "Cannot connect to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        # check if any connection already exists between the two users (either direction)
        existing = UserConnection.objects.filter(
            Q(from_user=request.user, to_user_id=to_user_id) |
            Q(from_user_id=to_user_id, to_user=request.user)
        ).first()

        if existing:
            # return existing status and id
            return Response({
                "detail": "Connection already exists",
                "id": existing.id,
                "status": existing.status
            }, status=status.HTTP_200_OK)

        serializer = self.get_serializer(data={'to_user': to_user_id})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, from_user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def perform_create(self, serializer, from_user):
        serializer.save(from_user=from_user)



# Accept connection request
class AcceptConnectionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, connection_id):
        try:
            conn = UserConnection.objects.get(id=connection_id, to_user=request.user)
            conn.status = "accepted"
            conn.save()
            return Response({"success": True, "message": "Connection accepted"})
        except UserConnection.DoesNotExist:
            return Response({"success": False, "message": "Connection not found"}, status=status.HTTP_404_NOT_FOUND)

class RespondConnectionRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, connection_id):
        action = request.data.get('action')
        if action not in ('accept', 'reject'):
            return Response({"detail": "Invalid action; use 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            conn = UserConnection.objects.get(id=connection_id, to_user=request.user)
        except UserConnection.DoesNotExist:
            return Response({"detail": "Connection request not found or you are not the recipient."}, status=status.HTTP_404_NOT_FOUND)

        if action == 'accept':
            conn.status = 'accepted'
            conn.save()
            return Response({"success": True, "message": "Connection accepted", "id": conn.id})
        else:
            conn.status = 'rejected'
            conn.save()
            return Response({"success": True, "message": "Connection rejected", "id": conn.id})

# List accepted connections
class ListUserConnectionsView(generics.ListAPIView):
    serializer_class = UserConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserConnection.objects.filter(
            Q(from_user=self.request.user) | Q(to_user=self.request.user),
            status="accepted"
        )

#incomih req
class ListIncomingRequestsView(generics.ListAPIView):
    serializer_class = UserConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserConnection.objects.filter(to_user=self.request.user, status='pending').order_by('-created_at')


# User Registration

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# User Profile

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        user_obj = self.get_object()
        if request.user != user_obj:
            raise PermissionDenied("You can only update your own profile.")
        return super().update(request, *args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
# users/views.py
# class UserSkillCreateView(generics.CreateAPIView):
#     serializer_class = UserSkillSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

# Update User Skill

class UpdateUserSkillProficiencyView(generics.UpdateAPIView):
    queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSkill.objects.filter(user=self.request.user)

#for viewable profile only
class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk' 

# Dashboard

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_events = Event.objects.count()

        top_skills_qs = (
            UserSkill.objects.values('skill__name')
            .annotate(count=models.Count('skill'))
            .order_by('-count')[:5]
        )
        top_skills = [{'name': s['skill__name'], 'count': s['count']} for s in top_skills_qs]

        users = User.objects.all()
        most_active = []
        for u in users:
            skill_count = UserSkill.objects.filter(user=u).count()
            event_count = u.events_attending.count()
            if skill_count or event_count:
                most_active.append({
                    'username': u.username,
                    'skills': skill_count,
                    'events': event_count,
                })

        most_active.sort(key=lambda x: (x['skills'] + x['events']), reverse=True)
        most_active = most_active[:5]

        return Response({
            'total_users': total_users,
            'total_events': total_events,
            'top_skills': top_skills,
            'most_active_users': most_active,
        })


# Skill Match

class SkillMatchView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        skill_names = self.request.query_params.get("skill")
        proficiency_filter = self.request.query_params.get("proficiency")
        if not skill_names:
            return User.objects.none()
        
        skill_list = [s.strip() for s in skill_names.split(",")]

        queryset = User.objects.filter(
            userskill__skill__name__in=skill_list
        ).distinct()

        if proficiency_filter:
            queryset = queryset.filter(
                userskill__proficiency__iexact=proficiency_filter
            ).distinct()

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={"request": request})
        data = serializer.data
        current_user = request.user

        # attach connection info
        for u in data:
            # check accepted either direction
            accepted_conn = UserConnection.objects.filter(
                (Q(from_user=current_user, to_user_id=u['id']) | Q(from_user_id=u['id'], to_user=current_user)),
                status='accepted'
            ).first()
            if accepted_conn:
                u['connection_status'] = 'connected'
                u['connection_id'] = accepted_conn.id
                continue

            # check pending request sent by current user
            sent_conn = UserConnection.objects.filter(from_user=current_user, to_user_id=u['id'], status='pending').first()
            if sent_conn:
                u['connection_status'] = 'pending_sent'
                u['connection_id'] = sent_conn.id
                continue

            # check pending request received by current user (other user sent it)
            rec_conn = UserConnection.objects.filter(from_user_id=u['id'], to_user=current_user, status='pending').first()
            if rec_conn:
                u['connection_status'] = 'pending_received'
                u['connection_id'] = rec_conn.id
                continue

            u['connection_status'] = 'none'
            u['connection_id'] = None

        return Response(data)

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

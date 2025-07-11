from rest_framework import generics,permissions
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from users.models import CustomUser
from skills.models import UserSkill,Skill
from skills.serializers import UserSkillSerializer
from events.models import Event
from django.db.models import Count
from django.db import models
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .serializers import RegisterSerializer  # Create this if not already there
from .serializers import UserProfileSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['password'] = make_password(data['password'])  # Hash the password
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
class UpdateUserSkillProficiencyView(generics.UpdateAPIView):
    queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Restrict update to only the skills owned by the logged-in user
        return UserSkill.objects.filter(user=self.request.user)
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()
        total_events = Event.objects.count()

        # Top 5 most assigned skills
        top_skills_qs = (
            UserSkill.objects.values('skill__name')
            .annotate(count=models.Count('skill'))
            .order_by('-count')[:5]
        )
        top_skills = [{'name': s['skill__name'], 'count': s['count']} for s in top_skills_qs]

        # Most active users (by skill + event count)
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

        # Sort descending by activity (total)
        most_active.sort(key=lambda x: (x['skills'] + x['events']), reverse=True)
        most_active = most_active[:5]

        return Response({
            'total_users': total_users,
            'total_events': total_events,
            'top_skills': top_skills,
            'most_active_users': most_active,
        })
class SkillMatchView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        skill_name = self.request.query_params.get('skill')
        if not skill_name:
            return User.objects.none()
        
        return User.objects.filter(
            userskill__skill__name__iexact=skill_name
        ).distinct()    
class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'    
    
    
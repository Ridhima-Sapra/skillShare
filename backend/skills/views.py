
from rest_framework import generics, permissions,filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Skill
from .models import UserSkill
from .serializers import UserSkillSerializer
from .serializers import SkillSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from users.pagination import StandardResultsSetPagination  
from django.db import transaction
from .models import SkillResource
from .serializers import SkillResourceSerializer



User = get_user_model()
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics, permissions
from .models import Skill
from .serializers import SkillSerializer


class CreateSkillView(generics.CreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]  # optional

    @transaction.atomic 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        skill = serializer.save()
        return Response({
            "id": skill.id,
            "name": skill.name,
            "description": skill.description,
        }, status=status.HTTP_201_CREATED)
# Lists all skills or creates a new one. Allows searching
class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'description']             # /api/skills/?search=Python


    def perform_create(self, serializer):
         serializer.save() 


# CRUD for a single skill 
class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]



class AssignSkillView(generics.CreateAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserAssignedSkillsView(generics.ListAPIView):
    serializer_class = UserSkillSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination 


    def get_queryset(self):
        user_id = self.kwargs['user_id']
        queryset= UserSkill.objects.filter(user__id=user_id)        
        proficiency = self.request.query_params.get('proficiency')
        if proficiency:
            queryset = queryset.filter(proficiency__iexact=proficiency)

        return queryset

class UpdateUserSkillProficiencyView(generics.UpdateAPIView):
    # queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow the logged-in user to update their own skills
        return UserSkill.objects.filter(user=self.request.user)    
    

class SkillResourceListCreateView(generics.ListCreateAPIView):
    serializer_class = SkillResourceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        skill_id = self.kwargs["skill_id"]
        return SkillResource.objects.filter(skill_id=skill_id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, skill_id=self.kwargs["skill_id"])

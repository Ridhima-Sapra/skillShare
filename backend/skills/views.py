
from rest_framework import generics, permissions,filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Skill
from .models import UserSkill
from .serializers import UserSkillSerializer
from .serializers import SkillSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from users.pagination import StandardResultsSetPagination  # ✅ import this



User = get_user_model()

class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['name']
    search_fields = ['name', 'description']  # ✅ /api/skills/?search=Python


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # FIXED: use correct field name

class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]
class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
    queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow the logged-in user to update their own skills
        return UserSkill.objects.filter(user=self.request.user)    
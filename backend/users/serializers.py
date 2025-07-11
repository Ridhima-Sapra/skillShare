from rest_framework import serializers
from .models import CustomUser  # Use your actual custom user model
from skills.models import UserSkill, Skill
from events.models import Event

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user

class SkillBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class UserSkillBriefSerializer(serializers.ModelSerializer):
    skill = SkillBriefSerializer()

    class Meta:
        model = UserSkill
        fields = ['id', 'skill', 'proficiency']
class EventBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'date']

class UserProfileSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    events_attending = EventBriefSerializer(many=True)
    events_hosted = EventBriefSerializer(many=True, source='hosted_events')

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'skills', 'events_attending', 'events_hosted']

    def get_skills(self, user):
        user_skills = UserSkill.objects.filter(user=user)
        return UserSkillBriefSerializer(user_skills, many=True).data
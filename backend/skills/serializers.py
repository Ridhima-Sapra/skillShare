from rest_framework import serializers
from .models import Skill,UserSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'description', 'user']
        read_only_fields = ['user']

class UserSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkill
        fields = ['id', 'user', 'skill', 'proficiency', 'date_added']
        read_only_fields = ['user', 'date_added']
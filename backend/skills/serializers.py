from rest_framework import serializers
from .models import Skill,UserSkill

# skills/serializers.py
from rest_framework import serializers
from .models import Skill, UserSkill, SkillResource


class SkillResourceSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True) 
    skill = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SkillResource
        fields = ["id", "skill", "user", "title", "url", "description", "created_at"]
        read_only_fields = ["user", "created_at", "skill"]


class SkillSerializer(serializers.ModelSerializer):
    resources = SkillResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Skill
        fields = ["id", "name", "description", "resources"]


class UserSkillSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())
    skill_detail = SkillSerializer(source="skill", read_only=True)

    class Meta:
        model = UserSkill
        fields = ["id", "user", "skill", "proficiency", "date_added", "skill_detail"]
        read_only_fields = ["user", "date_added"]



class UserSkillSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())
    skill_detail = SkillSerializer(source='skill', read_only=True)
    class Meta:
        model = UserSkill
        fields = ['id', 'user', 'skill', 'proficiency', 'date_added','skill_detail']
        read_only_fields = ['user', 'date_added']
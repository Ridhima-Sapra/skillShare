from rest_framework import serializers
from .models import Skill,UserSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'description']
        # read_only_fields = ['user']

class UserSkillSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    skill = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all())
    skill_detail = SkillSerializer(source='skill', read_only=True)
    class Meta:
        model = UserSkill
        fields = ['id', 'user', 'skill', 'proficiency', 'date_added','skill_detail']
        read_only_fields = ['user', 'date_added']
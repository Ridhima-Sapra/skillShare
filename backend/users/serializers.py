# DRF serializers handle validation along with conversion between Python & JSON.



from urllib import request
from rest_framework import serializers
from .models import CustomUser  
from skills.models import UserSkill, Skill
from events.models import Event


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(                                   #   Validates username,Hashes the password using Djangos password hasher (make_password).
            email=validated_data.get('email'),                                        #  Saves the user with is_active=True by default.
            username=validated_data['username'],                                   
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
    # photo = serializers.SerializerMethodField()                         # Custom method to get full URL for photo   
    photo = serializers.ImageField(use_url=True)

    skills = serializers.SerializerMethodField()
    events_attending = EventBriefSerializer(many=True)
    events_hosted = EventBriefSerializer(many=True, source='hosted_events')

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'bio', 'photo','skills', 'events_attending', 'events_hosted']

    # def get_photo(self, obj):
    #     request = self.context.get('request')
    #     if obj.photo and hasattr(obj.photo, 'url'):
    #         try:
    #             if request:
    #                 url= request.build_absolute_uri(obj.photo.url)
    #             else:
    #                 return obj.photo.url
    #         except Exception as e:
    #             return None
    #     return None
    def get_photo(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
             url = request.build_absolute_uri(obj.photo.url) if request else obj.photo.url
             return f"{url}?t={int(obj.updated_at.timestamp())}"  # use user updated_at field
        return None


    def get_skills(self, user):
        user_skills = UserSkill.objects.filter(user=user)
        return UserSkillBriefSerializer(user_skills, many=True).data






   
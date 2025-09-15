from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from skills.models import Skill, UserSkill
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed dummy users and assign random skills'

    def handle(self, *args, **options):
        # Step 1: Create skills
        skill_names = ['Python', 'JavaScript', 'React', 'Django', 'Machine Learning', 'Data Science', 'C++', 'Java', 'HTML', 'CSS']
        skills = []
        for name in skill_names:
            skill, created = Skill.objects.get_or_create(name=name)
            skills.append(skill)
        self.stdout.write(self.style.SUCCESS(f'Created/checked {len(skills)} skills.'))

        # Step 2: Create dummy users
        dummy_usernames = ['alice', 'bob', 'charlie', 'dave', 'eve', 'frank', 'grace']
        users = []
        for username in dummy_usernames:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'email': f'{username}@example.com'}
            )
            if created:
                user.set_password('testpass123')  # Simple password for all dummy users
                user.save()
            users.append(user)
        self.stdout.write(self.style.SUCCESS(f'Created/checked {len(users)} dummy users.'))

        # Step 3: Assign random skills with random proficiency
        proficiencies = ['Beginner', 'Intermediate', 'Advanced']
        for user in users:
            num_skills = random.randint(2, 5)  # Each user gets 2–5 skills
            random_skills = random.sample(skills, num_skills)
            for skill in random_skills:
                UserSkill.objects.get_or_create(
                    user=user,
                    skill=skill,
                    defaults={'proficiency': random.choice(proficiencies)}
                )
        self.stdout.write(self.style.SUCCESS('Assigned random skills to users! ✅'))

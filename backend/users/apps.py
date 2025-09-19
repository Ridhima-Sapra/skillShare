# Defines metadata/config for the users app.


from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'            #pk
    name = 'users'

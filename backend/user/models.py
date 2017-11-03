from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    google_accounts = models.EmailField(max_length=255, unique=True)

    USERNAME_FIELD = 'email'

# Create your models here.

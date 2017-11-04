from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _


class MyUserManager(BaseUserManager):
    """
    This custom is intended to deal with emails as unique identifiers for auth instead of username.
    """
    pass

class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    google_account = models.EmailField(_('google account'), blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

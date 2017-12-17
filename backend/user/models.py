from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _


class MyUserManager(BaseUserManager):
    """
    This custom is intended to deal with emails as unique identifiers for auth instead of username.
    """
    def _create_user(self, email, password, **extra_fields):

        if not email:
            raise ValueError('The email must be set.')

        if not password:
            raise ValueError('The password must be set.')

        if not extra_fields['username']:
            raise ValueError('The username must be set.')

        if not extra_fields['name']:
            raise ValueError('The name must be set.')

        user = self.model(
            email = MyUserManager.normalize_email(email),
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = models.CharField(_('Username'), max_length=64, unique=True)
    email = models.EmailField(_('Email'), unique=True)
    name = models.CharField(_('Name'), max_length=30)
    is_fake = models.BooleanField(_('Is_fake'), default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

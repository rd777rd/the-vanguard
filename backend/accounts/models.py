import re
import secrets

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

AVATAR_PALETTE = ["#e8b008", "#3b82c2", "#c23b3b", "#2f9e6b", "#f2c744"]


def slugify_handle(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "", name.lower())[:16] or "member"
    return f"@{slug}"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Members need an email address.")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("name", email.split("@")[0])
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    A Vanguard member. Auth is real: signup/login require a password
    (validated by Django's configured password validators), and sessions
    are DRF auth tokens issued on signup/login and cleared on logout.
    """

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=120)
    handle = models.CharField(max_length=40, blank=True)
    city = models.CharField(max_length=120, blank=True, default="Remote / Online")
    role = models.CharField(max_length=120, blank=True, default="Vanguard Member")
    bio = models.TextField(blank=True, default="New member of The Vanguard community.")
    avatar_color = models.CharField(max_length=7, default="#e8b008")
    tags = models.JSONField(default=list, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        ordering = ["-joined_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"

    def save(self, *args, **kwargs):
        if not self.handle:
            self.handle = slugify_handle(self.name)
        if not self.avatar_color:
            self.avatar_color = secrets.choice(AVATAR_PALETTE)
        super().save(*args, **kwargs)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ["-joined_at"]
    list_display = ["name", "email", "handle", "city", "role", "is_staff"]
    search_fields = ["name", "email", "handle", "city"]
    list_filter = ["is_staff", "is_active"]
    filter_horizontal = ()
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("name", "handle", "city", "role", "bio", "avatar_color", "tags")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("joined_at", "last_login")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "name", "password1", "password2")}),
    )
    readonly_fields = ["joined_at", "last_login"]

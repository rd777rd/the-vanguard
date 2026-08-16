from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User


class MemberSerializer(serializers.ModelSerializer):
    """Public-facing member info — what shows up in the directory and as the
    author/seller/host on any piece of content. Deliberately omits email."""

    class Meta:
        model = User
        fields = ["id", "name", "handle", "city", "role", "bio", "avatar_color", "tags"]


class MeSerializer(serializers.ModelSerializer):
    saved_events = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "handle",
            "city",
            "role",
            "bio",
            "avatar_color",
            "tags",
            "joined_at",
            "saved_events",
        ]
        read_only_fields = ["id", "email", "handle", "avatar_color", "joined_at"]

    def get_saved_events(self, obj):
        return list(obj.saved_events.values_list("id", flat=True))


class SignupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    city = serializers.CharField(max_length=120, required=False, allow_blank=True)
    tags = serializers.ListField(child=serializers.CharField(max_length=40), required=False)

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with that email already exists. Try logging in instead."
            )
        return value

    def validate_password(self, value):
        # Runs Django's configured password validators (min length, not too
        # common, not entirely numeric, etc.) — no user instance yet at
        # signup time, so similarity-to-profile checks are skipped.
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(exc.messages[0])
        return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

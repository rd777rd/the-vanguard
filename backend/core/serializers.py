from rest_framework import serializers

from accounts.serializers import MemberSerializer

from .models import BackingCall, Business, Discussion, Event, Listing, Resource


class DiscussionSerializer(serializers.ModelSerializer):
    author = MemberSerializer(read_only=True)
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = ["id", "author", "tag", "title", "body", "likes", "replies", "created_at", "liked_by_me"]
        read_only_fields = ["id", "author", "likes", "replies", "created_at", "liked_by_me"]

    def get_liked_by_me(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.like_records.filter(user=request.user).exists()

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Give it a title.")
        return value.strip()

    def validate_body(self, value):
        if not value.strip():
            raise serializers.ValidationError("Say something.")
        return value.strip()


class BackingCallSerializer(serializers.ModelSerializer):
    author = MemberSerializer(read_only=True)

    class Meta:
        model = BackingCall
        fields = ["id", "author", "type", "title", "detail", "city", "created_at"]
        read_only_fields = ["id", "author", "created_at"]

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Give it a title.")
        return value.strip()

    def validate_detail(self, value):
        if not value.strip():
            raise serializers.ValidationError("Add some detail.")
        return value.strip()


class ListingSerializer(serializers.ModelSerializer):
    seller = MemberSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = ["id", "seller", "type", "title", "price", "city", "category", "created_at"]
        read_only_fields = ["id", "seller", "created_at"]

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("What are you offering?")
        return value.strip()

    def validate_price(self, value):
        if not value.strip():
            raise serializers.ValidationError("Add a price, rate, or 'free / trade'.")
        return value.strip()


class BusinessSerializer(serializers.ModelSerializer):
    owner = MemberSerializer(read_only=True)

    class Meta:
        model = Business
        fields = ["id", "name", "owner", "owner_name", "category", "city", "tags", "created_at"]
        read_only_fields = ["id", "owner", "created_at"]


class EventSerializer(serializers.ModelSerializer):
    host = MemberSerializer(read_only=True)
    going_count = serializers.SerializerMethodField()
    going = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "date",
            "time",
            "city",
            "host",
            "host_name",
            "description",
            "going_count",
            "going",
        ]

    def get_going_count(self, obj):
        return obj.rsvps.count()

    def get_going(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.rsvps.filter(id=request.user.id).exists()


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ["id", "category", "title", "summary", "body", "minutes"]

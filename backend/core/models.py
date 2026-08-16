from django.conf import settings
from django.db import models

AUTH_USER_MODEL = settings.AUTH_USER_MODEL


class Discussion(models.Model):
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="discussions")
    tag = models.CharField(max_length=40)
    title = models.CharField(max_length=200)
    body = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    replies = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class DiscussionLike(models.Model):
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE, related_name="like_records")
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="discussion_likes")

    class Meta:
        unique_together = ("discussion", "user")


class BackingCall(models.Model):
    TYPE_CHOICES = [("request", "Calling for backup"), ("offer", "Backing offered")]

    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="backing_calls")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    detail = models.TextField()
    city = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Listing(models.Model):
    TYPE_CHOICES = [("good", "Good"), ("service", "Service"), ("job", "Job")]

    seller = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    price = models.CharField(max_length=80)
    city = models.CharField(max_length=120)
    category = models.CharField(max_length=80, default="General")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Business(models.Model):
    name = models.CharField(max_length=160)
    owner = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="businesses"
    )
    owner_name = models.CharField(max_length=160, blank=True)
    category = models.CharField(max_length=80)
    city = models.CharField(max_length=120)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "businesses"

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=160)
    date = models.DateField()
    time = models.CharField(max_length=40)
    city = models.CharField(max_length=120)
    host = models.ForeignKey(
        AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="hosted_events"
    )
    host_name = models.CharField(max_length=160, blank=True)
    description = models.TextField()
    rsvps = models.ManyToManyField(AUTH_USER_MODEL, blank=True, related_name="saved_events")

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return self.title


class Resource(models.Model):
    category = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    body = models.TextField()
    minutes = models.PositiveIntegerField(default=5)

    class Meta:
        ordering = ["category", "title"]

    def __str__(self):
        return self.title

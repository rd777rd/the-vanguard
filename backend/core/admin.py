from django.contrib import admin

from .models import BackingCall, Business, Discussion, DiscussionLike, Event, Listing, Resource


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "tag", "likes", "replies", "created_at"]
    list_filter = ["tag"]
    search_fields = ["title", "body"]


admin.site.register(DiscussionLike)


@admin.register(BackingCall)
class BackingCallAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "type", "city", "created_at"]
    list_filter = ["type"]
    search_fields = ["title", "detail"]


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ["title", "seller", "type", "price", "city", "category"]
    list_filter = ["type", "category"]
    search_fields = ["title"]


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "category", "city"]
    search_fields = ["name", "category"]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "date", "time", "city", "host"]
    filter_horizontal = ["rsvps"]
    search_fields = ["title"]


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "minutes"]
    list_filter = ["category"]
    search_fields = ["title", "summary", "body"]

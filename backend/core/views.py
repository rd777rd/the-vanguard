from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import BackingCall, Business, Discussion, DiscussionLike, Event, Listing, Resource
from .serializers import (
    BackingCallSerializer,
    BusinessSerializer,
    DiscussionSerializer,
    EventSerializer,
    ListingSerializer,
    ResourceSerializer,
)


class DiscussionViewSet(viewsets.ModelViewSet):
    queryset = Discussion.objects.select_related("author").all()
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        discussion = self.get_object()
        like, created = DiscussionLike.objects.get_or_create(discussion=discussion, user=request.user)
        if created:
            discussion.likes += 1
            liked = True
        else:
            like.delete()
            discussion.likes = max(0, discussion.likes - 1)
            liked = False
        discussion.save(update_fields=["likes"])
        return Response({"likes": discussion.likes, "liked": liked})


class BackingCallViewSet(viewsets.ModelViewSet):
    queryset = BackingCall.objects.select_related("author").all()
    serializer_class = BackingCallSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related("seller").all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class BusinessViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Business.objects.select_related("owner").all()
    serializer_class = BusinessSerializer
    permission_classes = [permissions.AllowAny]


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.select_related("host").prefetch_related("rsvps").all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        user = request.user
        if event.rsvps.filter(id=user.id).exists():
            event.rsvps.remove(user)
            going = False
        else:
            event.rsvps.add(user)
            going = True
        return Response({"going": going, "going_count": event.rsvps.count()}, status=status.HTTP_200_OK)


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [permissions.AllowAny]

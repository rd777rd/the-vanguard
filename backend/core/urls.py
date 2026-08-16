from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("discussions", views.DiscussionViewSet, basename="discussion")
router.register("backing", views.BackingCallViewSet, basename="backing")
router.register("listings", views.ListingViewSet, basename="listing")
router.register("businesses", views.BusinessViewSet, basename="business")
router.register("events", views.EventViewSet, basename="event")
router.register("resources", views.ResourceViewSet, basename="resource")

urlpatterns = router.urls

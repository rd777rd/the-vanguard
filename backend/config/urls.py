from django.contrib import admin
from django.urls import include, path, re_path

from .views_spa import spa_index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("core.urls")),
    # Catch-all: anything not matched above (i.e. every client-side React
    # Router route) falls through to the SPA shell. Must stay last.
    re_path(r"^.*$", spa_index),
]

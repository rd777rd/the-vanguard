"""Serves the built React app's index.html for any path the API/admin/
whitenoise-served assets don't claim, so client-side routes (e.g. /connect,
/support) work on a hard reload or a direct link — not just when React
Router handles the navigation client-side after loading from '/'."""

from django.conf import settings
from django.http import HttpResponse

_INDEX_HTML = settings.FRONTEND_DIST / "index.html"


def spa_index(request):
    try:
        content = _INDEX_HTML.read_text(encoding="utf-8")
    except FileNotFoundError:
        return HttpResponse(
            "Frontend build not found at dist/index.html — did the build "
            "step run `npm run build` before this?",
            status=500,
        )
    return HttpResponse(content, content_type="text/html")

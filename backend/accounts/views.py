from django.contrib.auth import authenticate
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import LoginSerializer, MemberSerializer, MeSerializer, SignupSerializer


class MemberListView(generics.ListAPIView):
    """The Connect directory — every member of The Vanguard, seeded or real.
    Staff/admin accounts are excluded; they manage the platform, they aren't
    a member persona to browse."""

    queryset = User.objects.filter(is_staff=False)
    serializer_class = MemberSerializer
    permission_classes = [permissions.AllowAny]


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = User.objects.create_user(
            email=data["email"],
            name=data["name"],
            password=data["password"],
            city=data.get("city") or "Remote / Online",
            tags=data.get("tags") or [],
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"user": MeSerializer(user).data, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        if not User.objects.filter(email__iexact=email).exists():
            return Response(
                {"detail": "No account found with that email. Request Membership first."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "Incorrect password. Try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": MeSerializer(user).data, "token": token.key})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        serializer = MeSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(MeSerializer(user).data)

from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from accounts.serializers import RegisterSerializer
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets, permissions
from webapp.models import Profile, Ads
from accounts.serializers import ProfileSerializer
from webapp.serializers import AdsSerializer


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class LogoutView(APIView):
    permission_classes = []

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            user.auth_token.delete()
        return Response({'status': 'ok'})


class RegisterViewSet(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = []
    serializer_class = RegisterSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        profile = self.get_object()

        if profile.user == self.request.user:
            ads = Ads.objects.filter(author=profile, is_delete=False)
        else:
            ads = Ads.objects.filter(author=profile, status='published', is_delete=False)

        ads_serializer = AdsSerializer(ads, many=True)
        profile_serializer = self.get_serializer(profile)

        return Response({
            'profile': profile_serializer.data,
            'ads': ads_serializer.data
        })

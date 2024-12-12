from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from webapp.models import Category, Ads
from webapp.serializers import CategorySerializer, AdsSerializer


class IsModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author.user == request.user


class AdsViewSet(viewsets.ModelViewSet):
    queryset = Ads.objects.filter(is_delete=False).order_by('-published_at')
    serializer_class = AdsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwner()]
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(author=profile, status='draft', is_delete=False)

    def perform_update(self, serializer):
        ad = self.get_object()
        if ad.status == 'rejected':
            raise PermissionDenied("Отклонённые объявления не могут быть отредактированы.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.status == 'rejected':
            instance.delete()
        else:
            if instance.author.user != self.request.user:
                raise PermissionDenied("Вы не можете удалить это объявление.")
            instance.is_delete = True
            instance.save(update_fields=['is_delete'])


class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = Ads.objects.filter(is_delete=False, status='draft').order_by('-created_at')
    serializer_class = AdsSerializer
    permission_classes = [permissions.IsAuthenticated, IsModerator]

    def perform_update(self, serializer):
        ad = self.get_object()
        status = self.request.data.get('status')
        if status not in ['published', 'rejected']:
            return Response({'error': 'Invalid status'}, status=400)

        ad.status = status
        if status == 'published':
            ad.published_at = timezone.now()
        ad.save(update_fields=['status', 'published_at'])

        return Response({'status': 'success', 'ad_status': ad.status})


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


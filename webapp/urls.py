from django.urls import path, include
from rest_framework import routers
from webapp.views import AdsViewSet, ModeratorViewSet, CategoryViewSet
from django.conf import settings
from django.conf.urls.static import static


app_name = 'webapp'


router = routers.DefaultRouter()
router.register(r'ads', AdsViewSet, basename='ads')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'moderator', ModeratorViewSet, basename='moderator')

urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

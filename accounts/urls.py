from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from accounts.views import LogoutView, RegisterViewSet, ProfileViewSet
from django.conf import settings
from django.conf.urls.static import static


app_name = 'accounts'

router = routers.DefaultRouter()
router.register(r'profile', ProfileViewSet)


urlpatterns = [
    path('', include(router.urls)),

    path('register/', RegisterViewSet.as_view(), name='register'),
    path('login/', obtain_auth_token, name='token_auth'),
    path('logout/', LogoutView.as_view(), name='token_delete'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

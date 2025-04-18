from asyncio import tasks

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('user/', include('user.urls')),
    path('project/', include('project.urls')),
    path('task/', include('task.urls')),
    path('comment/', include('comment.urls')),
]

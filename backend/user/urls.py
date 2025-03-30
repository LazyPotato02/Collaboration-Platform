from django.urls import path

from user.views import RegisterView, LogoutView ,get_current_user

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('me', get_current_user),
]

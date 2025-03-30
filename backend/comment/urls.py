from django.urls import path

from comment.views import CommendApiView

urlpatterns = [
    path('',CommendApiView.as_view(), name='comment-api'),
]
from django.urls import path
from comment.views import CommendApiView

urlpatterns = [
    path('<int:task_id>/', CommendApiView.as_view(), name='comment-by-task'),
]
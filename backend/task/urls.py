from django.urls import path
from task.views import TaskListView

urlpatterns = [
    path('', TaskListView.as_view()),

    path('project/<int:project_id>/', TaskListView.as_view()),
]

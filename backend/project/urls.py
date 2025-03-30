from django.urls import path

from project.views import ProjectApiView, ProjectTaskListView

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
    path('<int:id>', ProjectTaskListView.as_view(), name='project-task-list'),
]

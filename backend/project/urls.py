from django.urls import path

from project.views import ProjectApiView, ProjectTaskListView

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
    path ('<id:int>', ProjectTaskListView, name='project-task-list'),
]

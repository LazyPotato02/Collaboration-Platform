from django.urls import path

from project.views import ProjectApiView, ProjectMembershipView

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
    path('users/<int:project_id>', ProjectMembershipView.as_view()),

]

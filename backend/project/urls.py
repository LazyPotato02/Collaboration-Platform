from django.urls import path

from project.views import ProjectApiView, ProjectMembershipView, CheckIsUserAdmin

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
    path('users/<int:project_id>', ProjectMembershipView.as_view()),
    path('isAdmin/<int:project_id>', CheckIsUserAdmin.as_view()),
    path('add/<int:project_id>/members/', ProjectMembershipView.as_view(), name='project-members'),
]

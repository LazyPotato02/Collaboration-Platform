from django.urls import path

from project.views import ProjectApiView

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
]

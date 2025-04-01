from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from project.models import ProjectMembership, Project
from project.serializers import ProjectSerializer
from task.models import Task
from task.serializers import TaskSerializer


class ProjectApiView(APIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(members=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(owner=request.user)
            ProjectMembership.objects.create(user=request.user, project=project, role='admin')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        project_id = request.data.get('id')
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=404)

        membership = ProjectMembership.objects.filter(user=request.user, project=project, role='admin').first()
        if not membership:
            return Response({"error": "Only admins can update this project."}, status=403)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        project_id = request.data.get('id')
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=404)

        is_admin = ProjectMembership.objects.filter(user=request.user, project=project, role='admin').first()

        if not is_admin:
            return Response({"error": "Only admins can delete this project."}, status=403)
        project.delete()
        return Response({"detail": "Project deleted."}, status=204)


from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from project.models import ProjectMembership, Project
from project.serializers import ProjectSerializer
from task.models import Task
from task.serializers import TaskSerializer
from user.serializers import CustomUserSerializer


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


class CheckIsUserAdmin(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):
        is_admin = ProjectMembership.objects.filter(user=request.user, project_id=project_id, role='admin').first()
        if is_admin:
            return Response({"is_admin": True}, status=status.HTTP_200_OK)
        return Response({"is_admin": False}, status=status.HTTP_403_FORBIDDEN)


class ProjectMembershipView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        project = get_object_or_404(Project, id=project_id)

        if not project.members.filter(id=request.user.id).exists():
            return Response(
                {"detail": "Access denied to this project."},
                status=status.HTTP_403_FORBIDDEN
            )

        users = project.members.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, project_id=None):
        user_id = request.data.get('user_id')
        project = get_object_or_404(Project, id=project_id)
        role = request.data.get('role', 'member')
        is_admin = ProjectMembership.objects.filter(
            user=request.user,
            project=project,
            role='admin'
        ).exists()

        if not is_admin:
            return Response({"error": "Only admins can add users."}, status=status.HTTP_403_FORBIDDEN)

        if not user_id:
            return Response({"error": "Missing user_id."}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth import get_user_model
        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        project.members.add(user)

        membership, created = ProjectMembership.objects.get_or_create(
            user=user,
            project=project,
            defaults={"role": role}
        )

        if not created and membership.role != role:
            membership.role = role
            membership.save()

        return Response({"success": f"User {user.email} added to project."}, status=status.HTTP_200_OK)

    def delete(self, request, project_id=None):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({"error": "Missing user_id."}, status=status.HTTP_400_BAD_REQUEST)

        project = get_object_or_404(Project, id=project_id)

        is_admin = ProjectMembership.objects.filter(
            user=request.user,
            project=project,
            role='admin'
        ).exists()

        if not is_admin:
            return Response({"error": "Only admins can remove members."}, status=status.HTTP_403_FORBIDDEN)
        
        if int(user_id) == request.user.id:
            admin_count = ProjectMembership.objects.filter(project=project, role='admin').count()

            if admin_count <= 1:
                return Response({"error": "You are the last admin. You can't remove yourself."}, status=403)

        try:
            membership = ProjectMembership.objects.get(user_id=user_id, project=project)
            membership.delete()
            project.members.remove(user_id)  # 🔁 Махаме и от ManyToMany полето
            return Response({"success": "User removed from project."}, status=status.HTTP_200_OK)
        except ProjectMembership.DoesNotExist:
            return Response({"error": "Membership not found."}, status=status.HTTP_404_NOT_FOUND)
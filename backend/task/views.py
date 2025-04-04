from django.db.migrations import serializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from project.models import ProjectMembership
from task.models import Task
from task.serializers import TaskSerializer


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        if project_id:
            tasks = Task.objects.filter(project_id=project_id, is_deleted=False)
        else:
            tasks = Task.objects.filter(assigned_to=request.user, is_deleted=False)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        task_id = request.data.get("id")
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        is_assigned_to = task.assigned_to and task.assigned_to.id == request.user.id
        if not is_assigned_to:
            return Response({"error": "You don't have permission to update this task."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            new_status = serializer.validated_data.get("status")
            if new_status == "finished":
                serializer.save(is_deleted=True)
            else:
                serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


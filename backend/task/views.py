from django.db.migrations import serializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from project.models import ProjectMembership
from task.models import Task
from task.serializers import TaskSerializer
from utils.notifications import notify_ws


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id=None):
        if project_id:
            tasks = Task.objects.filter(project_id=project_id, is_deleted=False)
        else:
            tasks = Task.objects.filter(assigned_to=request.user, is_deleted=False)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request, project_id=None):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, project_id=None):
        try:
            task = Task.objects.get(id=project_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # is_assigned_to = task.assigned_to and task.assigned_to.id == request.user.id
        # if not is_assigned_to:
        #     return Response({"error": "You don't have permission to update this task."},
        #                     status=status.HTTP_403_FORBIDDEN)

        serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            new_status = serializer.validated_data.get("status")
            if new_status == "finished":
                serializer.save(is_deleted=True)
            else:
                serializer.save()
            notify_ws(project_id=task.project.id, payload={
                "type": "task_updated",
                "task": serializer.data
            })

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, project_id=None):
        if not project_id:
            return Response({"error": "Missing task ID."}, status=400)

        try:
            task = Task.objects.get(id=project_id, is_deleted=False)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=404)

        # if task.assigned_to != request.user:
        #     return Response({"error": "You don't have permission to delete this task."}, status=403)

        task.is_deleted = True
        task.save()

        notify_ws(project_id=task.project.id, payload={
            "type": "task_updated",
            "task": TaskSerializer(task).data
        })

        return Response({"detail": "Task soft-deleted."}, status=204)

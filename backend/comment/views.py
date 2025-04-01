from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from comment.models import Comment
from comment.serializers import CommentSerializer
from project.models import ProjectMembership


# Create your views here.


class CommendApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        comments = Comment.objects.filter(task_id=task_id, is_deleted=False)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        commend_id = request.data.get('id')
        try:
            comment = Comment.objects.get(id=commend_id)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        is_commend_owner = comment.user == request.user
        if not is_commend_owner:
            return Response({"error": "You don't have permission to update this comment."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        comment_id = request.data.get("id")

        if not comment_id:
            return Response({"error": "Missing comment ID."}, status=400)

        try:
            comment = Comment.objects.select_related('task__project').get(id=comment_id, is_deleted=False)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found."}, status=404)

        user = request.user
        is_owner = comment.user == user
        is_admin = ProjectMembership.objects.filter(
            user=user,
            project=comment.task.project,
            role='admin'
        ).exists()

        if not (is_owner or is_admin):
            return Response({"error": "You don't have permission to delete this comment."}, status=403)

        comment.is_deleted = True
        comment.save()

        return Response({"detail": "Comment deleted (soft)."}, status=204)

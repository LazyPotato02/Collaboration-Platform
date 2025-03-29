from django.db import models
from user.models import CustomUser as User

from task.models import Task


# Create your models here.


class Comment(models.Model):
    comment = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email}: {self.content[:30]}"

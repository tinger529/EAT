from django.db import models

class Session(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    password = models.CharField(max_length=255)
    email = models.EmailField()
    session_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
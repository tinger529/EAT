from django.db import models
import datetime
from django.utils import timezone

# use makemigrations to change models !
# use migrations to apply changes to database !

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    # object representation
    def __str__(self):
        return self.question_text
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    # object representation
    def __str__(self):
        return self.choice_text
    
class User(models.Model):
    name = models.CharField(max_length=100, default='')
    password = models.CharField(max_length=100, default='')
    email = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.name
    
class LoginSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100, default='')
    expire_time = models.DateTimeField("expire time")

    def __str__(self):
        return self.session_id

class Group(models.Model):
    # todo
    # modify the columns
    name = models.CharField(max_length=100, default='')
    users = models.ManyToManyField(User, related_name='groups')
    def __str__(self):
        return self.name

# todo
# add record model
class Record(models.Model):
    name = models.CharField(max_length=100, default='')
    createdAt = models.DateTimeField("created at")
    updatedAt = models.DateTimeField("updated at")
    creator = models.ForeignKey(User, on_delete=models.CASCADE)


    def __str__(self):
        return self.name
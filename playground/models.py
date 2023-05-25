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
    name = models.CharField(max_length=100)
    groups = models.ManyToManyField('Group', related_name='members')
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Group(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class LoginSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100)
    expire_time = models.DateTimeField("expire time")
    
    def __str__(self):
        return self.session_id

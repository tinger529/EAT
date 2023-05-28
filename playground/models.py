from django.db import models

# use makemigrations to change models !
# use migrations to apply changes to database !
    
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
    
class RecordUserValue(models.Model):
    recordid = models.ForeignKey('Record', on_delete=models.CASCADE)
    userid = models.ForeignKey('User', on_delete=models.CASCADE)
    value = models.CharField(max_length=100, default='')
    def __str__(self):
        return self.name

class SumOfGroupPerUser(models.Model):
    groupid = models.ForeignKey('Group', on_delete=models.CASCADE)
    userid = models.ForeignKey('User', on_delete=models.CASCADE)
    value = models.CharField(max_length=100, default='')
    def __str__(self):
        return self.name

class Record(models.Model):
    name = models.CharField(max_length=100, default='')
    createdAt = models.DateTimeField("created at")
    updatedAt = models.DateTimeField("updated at")
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    
class Group(models.Model):
    name = models.CharField(max_length=100, default='')
    users = models.ManyToManyField(User, related_name='groups')
    records = models.ManyToManyField(Record, related_name='groups')
    def __str__(self):
        return self.name

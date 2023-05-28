from django.contrib import admin

from .models import User, Group, LoginSession, Record, RecordUserValue, SumOfGroupPerUser

admin.site.register(User)
admin.site.register(Group)
admin.site.register(LoginSession)
admin.site.register(Record)
admin.site.register(RecordUserValue)
admin.site.register(SumOfGroupPerUser)
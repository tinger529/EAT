from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Group, LoginSession
import json
from django.http import JsonResponse
import uuid
import datetime
from django.utils import timezone

# Create your views here.
# request handler

def hello(request):
    return render(request, './hello.html', {'name': 'Tinger'})

def create_user(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    user = User.objects.create(name=name, password=password, email=email)
    response_data = {
        'message': 'User created successfully',
        'user': user,
    }
    return JsonResponse(response_data, status=201)

def create_session(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    user = User.objects.get(email=email, password=password)
    if not user:
        return HttpResponse('User not found', status=404)
    session_id = str(uuid.uuid4())
    expire_time = timezone.now() + datetime.timedelta(hours=1)
    session = LoginSession.objects.create(user=user, session_id=session_id, expire_time=expire_time)
    return HttpResponse(session.session_id, status=201)

def delete_session(request, session_id):
    session = LoginSession.objects.get(session_id=session_id)
    session.delete()
    return HttpResponse('delete session success', status=204)
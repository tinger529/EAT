from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Group, LoginSession
import json
from django.http import JsonResponse
import uuid
import datetime
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
# request handler
@csrf_exempt
def hello(request):
    return render(request, './hello.html', {'name': 'Tinger'})

@csrf_exempt
def create_get_user(request):
    if request.method == 'GET':
        # get session id from request header
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find user object if session is not expired
        if session.expire_time > timezone.now():
            user = session.user
            userJson = {
                'id': str(user.id),
                'name': user.name,
                'password': user.password,
                'email': user.email,
            }
            response_data = {
                "user":userJson
            }
            return JsonResponse(response_data, status=200)
        else:
            return HttpResponse('session expired', status=401)
        
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        # check user objects columns
        user = User.objects.create(name=name, password=password, email=email)
        userJson = {
            'id': str(user.id),
            'name': user.name,
            'password': user.password,
            'email': user.email,
        }
        response_data = {
            "user":userJson
        }
        return JsonResponse(response_data, status=201)

@csrf_exempt
def create_session(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    try:
        user = User.objects.get(email=email, password=password)
    except User.DoesNotExist:
        return HttpResponse('User not found', status=404)
    session_id = str(uuid.uuid4())
    expire_time = timezone.now() + datetime.timedelta(hours=1)
    session = LoginSession.objects.create(user=user, session_id=session_id, expire_time=expire_time)
    return HttpResponse(session.session_id, status=201)

@csrf_exempt
def get_user(request, userId):
    try:
        user = User.objects.get(id=userId)
    except User.DoesNotExist:
        return HttpResponse('User not found', status=404)
    userJson = {
        'id': str(user.id),
        'name': user.name,
        'password': user.password,
        'email': user.email,
    }
    response_data = {
        "user":userJson
    }
    return JsonResponse(response_data, status=200)


@csrf_exempt
def delete_session(request, sessionId):
    try:
        session = LoginSession.objects.get(session_id=sessionId)
        session.delete()
    except LoginSession.DoesNotExist:
        return HttpResponse('session not found', status=404)
    return HttpResponse('delete session success', status=204)
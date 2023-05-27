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
    return render(request, './hello.html', {'name': 'Hensuu'})

# user APIs
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
                '$id': str(user.id),
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
            '$id': str(user.id),
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
    # set cookie in response header
    iso_8601_time = session.expire_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    sessionidJson = {
        '$id': str(session.id),
        'userId': str(session.user.id),
        'expireAt': str(iso_8601_time),
    }
    response = JsonResponse(sessionidJson, status=201)
    response.set_cookie('session_id', session.session_id,httponly=True,secure=True)
    return response

@csrf_exempt
def get_user(request, userId):
    try:
        user = User.objects.get(id=userId)
    except User.DoesNotExist:
        return HttpResponse('User not found', status=404)
    userJson = {
        '$id': str(user.id),
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

# group APIs
@csrf_exempt
def create_group(request):
    # Todo
    pass

@csrf_exempt
def get_groupinfo(request, groupId):
    # Todo
    pass

@csrf_exempt
def user_group_relation(request, userId):
    if request.method == 'GET':
        # Todo
        pass
    elif request.method == 'POST':
        # Todo
        pass

# record APIs
def get_create_record(request, groupId):
    if request.method == 'GET':
        # Todo
        pass
    elif request.method == 'POST':
        # Todo
        pass

def update_delete_record(request, groupId, recordId):
    if request.method == 'PATCH':
        # Todo
        pass
    elif request.method == 'DELETE':
        # Todo
        pass
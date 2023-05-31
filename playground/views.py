from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Group, LoginSession, Record, RecordUserValue, SumOfGroupPerUser
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
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
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
            response = JsonResponse(response_data, status=201)
            # response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
            return response
        else:
            return HttpResponse('session expired', status=401)
        
    elif request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        # check user objects columns
        if email is None or password is None or name is None:
            return HttpResponse('email, password, name are required', status=400)
        # check if email is unique
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = None
        if user is not None:
            return HttpResponse('email already exists', status=400)
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
        # add header with Access Control Allow Origin
        response = JsonResponse(response_data, status=201)
        # response['Access-Control-Allow-Origin'] = '*'
        return response
        # return JsonResponse(response_data, status=201)
    # elif request.method == 'OPTIONS':
    #     response = HttpResponse('Other Methods', status=200)
    #     # response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     return response

@csrf_exempt
def create_session(request):
    # print(request.body)
    # if request.method == 'OPTIONS':
    #     response = HttpResponse('OK', status=200)
    #     response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     # response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     response['Access-Control-Allow-Credentials'] = 'true'
    #     response['Access-Control-Allow-Headers'] = 'access-control-request-headers'
    #     return response
    # parse request body (plain text) to json
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
    response.set_cookie('session_id', session.session_id,httponly=True,expires=iso_8601_time)
    # response['Access-Control-Allow-Origin'] = '*'
    return response

@csrf_exempt
def get_user(request, userId):
    # if request.method == 'OPTIONS':
    #     response = HttpResponse('OK', status=200)
    #     response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     return response
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
    # if request.method == 'OPTIONS':
    #     response = HttpResponse('OK', status=200)
    #     response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     return response
    try:
        session = LoginSession.objects.get(session_id=sessionId)
        session.delete()
    except LoginSession.DoesNotExist:
        return HttpResponse('session not found', status=404)
    return HttpResponse('delete session success', status=204)

# group APIs
@csrf_exempt
def create_group(request):
    # if request.method == 'OPTIONS':
    #     response = HttpResponse('OK', status=200)
    #     response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     return response
    # check if session is valid
    session_str = request.headers.get('cookie')
    if session_str is None:
        return HttpResponse('session not found', status=401)
    session_id = request.headers.get('cookie').split('=')[1]
    try:
        session = LoginSession.objects.get(session_id=session_id)
    except LoginSession.DoesNotExist:
        return HttpResponse('session not found', status=401)
    sessionUserId = session.user.id
    # find group object if session is not expired
    if session.expire_time > timezone.now():
        data = json.loads(request.body)
        name = data.get('name')
        group = Group.objects.create(name=name)
        groupid = group.id
        group.users.add(session.user)
        memberList = []
        for member in group.users.all():
            memberJson = {
                '$id': str(member.id),
                'name': member.name,
                'password': member.password,
                'email': member.email,
            }
            memberList.append(memberJson)
        groupJson = {
            '$id': str(group.id),
            'name': group.name,
            'members': memberList,
        }
        response_data = {
            "group":groupJson
        }
        SumOfGroupPerUser.objects.create(name=str(name)+"_"+str(session.user.name),userid=session.user, groupid=groupid, value=0)
        return JsonResponse(response_data, status=201)
    else:
        return HttpResponse('session expired', status=401)

@csrf_exempt
def get_groupinfo(request, groupId):
    # if request.method == 'OPTIONS':
    #     response = HttpResponse('OK', status=200)
    #     response['Access-Control-Allow-Origin'] = ' http://127.0.0.1:5173'
    #     response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    #     response['Access-Control-Allow-Headers'] = 'X-Requested-With, Content-Type, Accept, Origin, Authorization'
    #     return response
    # check if session is valid
    session_str = request.headers.get('cookie')
    if session_str is None:
        return HttpResponse('session not found', status=401)
    session_id = request.headers.get('cookie').split('=')[1]
    try:
        session = LoginSession.objects.get(session_id=session_id)
    except LoginSession.DoesNotExist:
        return HttpResponse('session not found', status=401)
    # find group object if session is not expired
    if session.expire_time > timezone.now():
        try:
            group = Group.objects.get(id=groupId)
        except Group.DoesNotExist:
            return HttpResponse('group not found', status=404)
        memberList = []
        for member in group.users.all():
            memberJson = {
                '$id': str(member.id),
                'name': member.name,
                'password': member.password,
                'email': member.email,
            }
            memberList.append(memberJson)
        groupJson = {
            '$id': str(group.id),
            'name': group.name,
            'members': memberList,
        }
        response_data = {
            "group":groupJson
        }
        return JsonResponse(response_data, status=201)
    else:
        return HttpResponse('session expired', status=401)


@csrf_exempt
def user_group_relation(request, userId):
    if request.method == 'GET':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            try:
                user = User.objects.get(id=userId)
            except User.DoesNotExist:
                return HttpResponse('user not found', status=404)
            # filter the groups that the user belongs to (users contain the user)
            groups = Group.objects.filter(users__id=userId)
            groupList = []
            for group in groups:
                memberList = []
                for member in group.users.all():
                    memberJson = {
                        '$id': str(member.id),
                        'name': member.name,
                        'password': member.password,
                        'email': member.email,
                    }
                    memberList.append(memberJson)
                groupJson = {
                    '$id': str(group.id),
                    'name': group.name,
                    'members': memberList,
                }
                groupList.append(groupJson)
            response_data = {
                "groups":groupList
            }
            return JsonResponse(response_data, status=201)
        else:
            return HttpResponse('session expired', status=401)
        
    elif request.method == 'POST':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            try:
                user = User.objects.get(id=userId)
            except User.DoesNotExist:
                return HttpResponse('user not found', status=404)
            data = json.loads(request.body)
            groupId = data.get('groupId')
            adduserId = data.get('userId')
            if (adduserId == userId):
                return HttpResponse('Add user permission denied (User cannot add himself)', status=404)
            # check if the user is in the group
            try:
                group = Group.objects.get(id=groupId)
            except Group.DoesNotExist:
                return HttpResponse('group not found', status=404)
            if user not in group.users.all():
                return HttpResponse('Add user permission denied (User not in the group)', status=404)
            try:
                adduser = User.objects.get(id=adduserId)
            except User.DoesNotExist:
                return HttpResponse('adduser not found', status=404)
            group.users.add(adduser)
            memberList = []
            for member in group.users.all():
                memberJson = {
                    '$id': str(member.id),
                    'name': member.name,
                    'password': member.password,
                    'email': member.email,
                }
                memberList.append(memberJson)
            groupJson = {
                '$id': str(group.id),
                'name': group.name,
                'members': memberList,
            }
            response_data = {
                "group":groupJson
            }
            # add the newuser to sum of group per user
            SumOfGroupPerUser.objects.create(name=str(group.name)+"_"+str(adduser.name),userid=adduser, groupid=groupId, value=0)
            return JsonResponse(response_data, status=201)
        else:
            return HttpResponse('session expired', status=401)
    else:
        return HttpResponse('Other Methods', status=200)
# record APIs
@csrf_exempt
def get_create_record(request, groupId):
    if request.method == 'GET':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            try:
                group = Group.objects.get(id=groupId)
            except Group.DoesNotExist:
                return HttpResponse('group not found', status=404)
            # data = json.loads(request.body)
            # queryNum = data.get('queryNum')
            # if (queryNum == None or queryNum > 20):
            #     queryNum = 20
            queryNum = 20
            records = Record.objects.filter(groupid=groupId).order_by('-createdAt')[:queryNum]
            
            # filter the groups that the user belongs to (users contain the user)
            recordList = []
            sumList = []
            SumOfGroupPerUsers = SumOfGroupPerUser.objects.filter(groupid=groupId)
            for sum in SumOfGroupPerUsers:
                newVal = int(sum.value)
                sumJson = {
                    'value': newVal,
                    'userId': sum.userid.id
                }
                sumList.append(sumJson)
            # print(sumList)
            for record in records:
                # get the member data
                recorduserval = RecordUserValue.objects.filter(recordid=record)
                memberData = []
                for recorduser in recorduserval:
                    newVal = int(recorduser.value)
                    memberJson = {
                        'userId': str(recorduser.userid.id),
                        'value': newVal
                    }
                    memberData.append(memberJson)
                recordName = record.name.split('_')[0]
                recordJson = {
                    '$id': str(record.id),
                    'name': recordName,
                    '$createdAt': record.createdAt,
                    '$updatedAt': record.updatedAt,
                    'creator': str(record.creator.id),
                    'data': memberData
                }
                recordList.append(recordJson)
            
            response_data = {
                'records':recordList,
                'sum':sumList
            }
            # print(response_data)
            # input()
            return JsonResponse(response_data, status=200)
        else:
            return HttpResponse('session expired', status=401)
        
    elif request.method == 'POST':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            try:
                group = Group.objects.get(id=groupId)
            except Group.DoesNotExist:
                return HttpResponse('group not found', status=404)
            data = json.loads(request.body)
            name = data.get('name')
            memberData = data.get('data')
            preSum = 0
            for member in memberData:
                try: 
                    user = User.objects.get(id=member['userId'])
                except User.DoesNotExist:
                    return HttpResponse('user not found', status=404)
                preSum += member['value']
            if (preSum != 0):
                return HttpResponse('sum of value is not 0', status=404)
            creator = User.objects.get(id=session.user_id)
            createdTime = timezone.now()
            record = Record.objects.create(name=str(name)+"_"+str(createdTime),createdAt=createdTime,updatedAt=createdTime,creator=creator,groupid=groupId)
            Sum = 0
            thisSumOfGroupPerUser = []
            for member in memberData:
                try: 
                    user = User.objects.get(id=member['userId'])
                except User.DoesNotExist:
                    return HttpResponse('user not found', status=404)
                value = member['value']
                recordUserVal = RecordUserValue.objects.create(name=str(name)+"_"+str(group.name)+"_"+str(user.name)+"_"+str(createdTime),recordid=record,userid=user,value=value)
                # update the sum of group per user
                sumOfGroupPerUser_ = SumOfGroupPerUser.objects.get(userid=user, groupid=groupId)
                curVal = int(sumOfGroupPerUser_.value)
                curVal += value
                sumOfGroupPerUser_.value = str(curVal)
                sumOfGroupPerUser_.save()
                newValue = int(sumOfGroupPerUser_.value)
                GroupObj = {
                    'userId': user.id,
                    'value': newValue
                }
                thisSumOfGroupPerUser.append(GroupObj)
                Sum += value
            if (Sum != 0):
                return HttpResponse('Sum of member value is not 0', status=404)
            recordName = record.name.split('_')[0]
            thisRecord = {
                '$id': str(record.id),
                'name': recordName,
                '$createdAt': record.createdAt,
                '$updatedAt': record.updatedAt,
                'creator': str(record.creator.id),
                'data': memberData
            }
            response_data = {
                "record":thisRecord,
                "sum":thisSumOfGroupPerUser
            }
            return JsonResponse(response_data, status=201)
        else:
            return HttpResponse('session expired', status=401)
    else:
        return HttpResponse('Other Methods', status=200)
@csrf_exempt
def update_delete_record(request, groupId, recordId):
    if request.method == 'PATCH':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            # update record by data and name given from request
            try:
                record = Record.objects.get(id=recordId)
            except Record.DoesNotExist:
                return HttpResponse('record not found', status=404)
            try:
                group = Group.objects.get(id=groupId)
            except Group.DoesNotExist:
                return HttpResponse('group not found', status=404)
            data = json.loads(request.body)
            name = data.get('name')
            memberData = data.get('data')
            preSum = 0
            for member in memberData:
                try:
                    user = User.objects.get(id=member['userId'])
                except User.DoesNotExist:
                    return HttpResponse('user not found', status=404)
                preSum += member['value']
            if (preSum != 0):
                return HttpResponse('sum of value is not 0', status=404)

            # if name is not None, update the name
            if name != None:
                record.name = name
            # now did not update RecordUserValue
            record.updatedAt = timezone.now()
            record.save()
            Sum = 0 
            thisSumOfGroupPerUser = []
            
            # update the recordUserValue
            for member in memberData:
                user = User.objects.get(id=member['userId'])
                value = member['value']
                try:
                    recordUserValue = RecordUserValue.objects.get(recordid=record, userid=user)
                except RecordUserValue.DoesNotExist:
                    return HttpResponse('recordUserValue not found', status=404)
                oldVal = int(recordUserValue.value)
                recordUserValue.value = str(value)
                recordUserValue.save()
                # update the sum of group per user
                sumOfGroupPerUser = SumOfGroupPerUser.objects.get(userid=user, groupid=groupId)
                newVal = int(sumOfGroupPerUser.value)
                newVal = newVal - oldVal + value
                sumOfGroupPerUser.value = str(newVal)
                sumOfGroupPerUser.save()
                Sum += value
                sumJson = {
                    'userId': user.id,
                    'value': newVal
                }
                thisSumOfGroupPerUser.append(sumJson)
            if (Sum != 0):
                return HttpResponse('Sum of member value is not 0', status=404)
            # split record _
            recordName = record.name.split('_')[0]
            thisRecord = {
                '$id': str(record.id),
                'name': recordName,
                '$createdAt': record.createdAt,
                '$updatedAt': record.updatedAt,
                'creator': str(record.creator.id),
                'data': memberData
            }
            response_data = {
                "record":thisRecord,
                "sum":thisSumOfGroupPerUser
            }
            return JsonResponse(response_data, status=200)
        else:
            return HttpResponse('session expired', status=401)
    elif request.method == 'DELETE':
        # check if session is valid
        session_str = request.headers.get('cookie')
        if session_str is None:
            return HttpResponse('session not found', status=401)
        session_id = request.headers.get('cookie').split('=')[1]
        try:
            session = LoginSession.objects.get(session_id=session_id)
        except LoginSession.DoesNotExist:
            return HttpResponse('session not found', status=401)
        # find group object if session is not expired
        if session.expire_time > timezone.now():
            # delete the record
            try:
                record = Record.objects.get(id=recordId)
            except Record.DoesNotExist:
                return HttpResponse('record not found', status=404)
            # delete the recordUserValue
            recordUserValues = RecordUserValue.objects.filter(recordid=record)
            Sum = 0
            for recordUserValue in recordUserValues:
                # update the sum of group per user
                sumOfGroupPerUser = SumOfGroupPerUser.objects.get(userid=recordUserValue.userid, groupid=record.groupid)
                newVal = int(sumOfGroupPerUser.value)
                newVal -= int(recordUserValue.value)
                sumOfGroupPerUser.value = str(newVal)
                sumOfGroupPerUser.save()
                Sum += int(recordUserValue.value)
                recordUserValue.delete()
            if (Sum != 0):
                return HttpResponse('Sum of member value is not 0', status=404)
            record.delete()
            return HttpResponse('record deleted', status=204)
        else:
            return HttpResponse('session expired', status=401)
    else:
        return HttpResponse('Other Methods', status=200)

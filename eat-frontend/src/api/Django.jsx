//TODO: use rest api to communicate with django backend

import axios from "axios";


let api = {

        url: "http://127.0.0.1:9001",

        example: (data1) => {
            return axios.get(api.url + "/api/v1/example", {
                data1: data1,
                data2: "data2",
            })
        },


        createAccount: (email, password, name) => {

            return axios.post(api.url + "/api/v1/account/", {
                email: email,
                password: password,
                name: name,
                withCredentials: true,
                origin: '*',
            })
        },
        createSession: (email, password) => {
            
            return axios.post(api.url + '/api/v1/account/sessions/email/', {
                email: email,
                password: password,
                withCredentials: true,
                origin: '*',
            })
        },


        getAccount: () => {

            return axios.get(api.url + '/api/v1/account/', {
                withCredentials: true,
                origin: '*'
            })
            
        },

        getUserInfo: async (userid) => {
            // get login user's account information
            // end point: /api/v1/account{userid}
            // method: GET
            // return: user
            // response: 200
            // error: 401
            const endpoint = '/api/v1/account/' + userid + '/';

            return axios.get(endpoint, {
                withCredentials: true,
                userId: userid,
                origin: '*'
            })

        },


        deleteCurrentSession: async () => {
            // end point: /api/v1/account/sessions/{sessionId}
            // method: DELETE
            // return: none
            // response: 204
            // error: 401
            //delete the current session

            const endpoint = '/api/v1/account/sessions/';

            return axios.delete(endpoint, {
                withCredentials: true,
                origin: '*'
            })
        },

        // return sum + records
        listRecords: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.get(endpoint, {
                withCredentials: true,
                groupId: groupId,
                origin: '*'
            })
        },

        createRecord: (groupId, name, data) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.post(endpoint, {
                name: name,
                data: data,
                withCredentials: true,
                groupId: groupId,
                origin: '*'
            })
        },

        deleteRecord: (groupId, recordId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.delete(endpoint, {
                withCredentials: true,
                groupId: groupId,
                recordId: recordId,
                origin: '*'
            })
        },

        updateRecord: (groupId, recordId, data, name) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.patch(endpoint, {
                data: data,
                name: name,
                withCredentials: true,
                groupId: groupId,
                recordId: recordId,
                origin: '*'
            })
        },

        listGroups: (userId) => {
            const endpoint = '/api/v1/databases/users/' + userId + '/groups/';

            return axios.get(endpoint, {
                withCredentials: true,
                userId: userId,
                origin: '*'
            })
        },

        inviteGroupMember: (groupId, userId) => {
            const endpoint = '/api/v1/databases/users/' + userId + '/groups/';

            return axios.post(endpoint, {
                groupId: groupId,
                withCredentials: true,
                userId: userId,
                origin: '*'
            })
        },

        createGroup: (groupName) => {
            const endpoint = '/api/v1/databases/groups/';

            return axios.post(endpoint, {
                name: groupName,
                withCredentials: true,
                origin: '*'
            })
        },


        getGroup: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(endpoint, {
                withCredentials: true,
                groupId: groupId,
                origin: '*'
            })
        },

        //return group object
        getGroupInfo: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(endpoint, {
                withCredentials: true,
                groupId: groupId,
                origin: '*'
            })

        },

    }
;


export default api;

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
                withCredentials: false,
            })
        },
        createSession: (email, password) => {
            
            return axios.post(api.url + '/api/v1/account/sessions/email/', {
                email: email,
                password: password,
                withCredentials: false,
            })
        },


        getAccount: () => {

            return axios.get(api.url + '/api/v1/account/', {
                withCredentials: false,
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
                withCredentials: false,
                userId: userid,
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
                withCredentials: false,
            })
        },

        // return sum + records
        listRecords: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.get(endpoint, {
                withCredentials: false,
                groupId: groupId,
            })
        },

        createRecord: (groupId, name, data) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.post(endpoint, {
                name: name,
                data: data,
                withCredentials: false,
                groupId: groupId,
            })
        },

        deleteRecord: (groupId, recordId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.delete(endpoint, {
                withCredentials: false,
                groupId: groupId,
                recordId: recordId,
            })
        },

        updateRecord: (groupId, recordId, data, name) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.patch(endpoint, {
                data: data,
                name: name,
                withCredentials: false,
                groupId: groupId,
                recordId: recordId,
            })
        },

        listGroups: (userId) => {
            const endpoint = '/api/v1/databases/users/' + userId + '/groups/';

            return axios.get(endpoint, {
                withCredentials: false,
                userId: userId,
            })
        },

        inviteGroupMember: (groupId, userId) => {
            const endpoint = '/api/v1/databases/users/' + userId + '/groups/';

            return axios.post(endpoint, {
                groupId: groupId,
                withCredentials: false,
                userId: userId,
            })
        },

        createGroup: (groupName) => {
            const endpoint = '/api/v1/databases/groups/';

            return axios.post(endpoint, {
                name: groupName,
                withCredentials: false,
            })
        },


        getGroup: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(endpoint, {
                withCredentials: false,
                groupId: groupId,
            })
        },

        //return group object
        getGroupInfo: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(endpoint, {
                withCredentials: false,
                groupId: groupId,
            })

        },

    }
;


export default api;

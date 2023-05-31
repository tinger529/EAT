//TODO: use rest api to communicate with django backend

import axios from "axios";


let api = {
        // sessionId: null,

        url: "http://13.114.67.2:3000",

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
            }).then((response) => {
                return response.data.user;
            })
        },
        createSession: (email, password) => {
                        
            return axios.post(api.url + '/api/v1/account/sessions/email/', {
                email: email,
                password: password,
            })
        },


        getAccount: () => {
            return axios.get(api.url + '/api/v1/account/', {
                // withCredentials: true,
                // origin: '*'
            
            },{
                headers: {
                    withCredentials: true
                }
            }).then((response) => {
                return response.data.user;
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

            return axios.get(api.url + endpoint, {
                // withCredentials: true,
                userId: userid,
            },{
                headers: {
                    withCredentials: true
                }
            }).then((response) => {
                return response.data.user;
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

            return axios.delete(api.url + endpoint, {

            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        // return sum + records
        listRecords: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.get(api.url + endpoint, {
                // withCredentials: true,
                groupId: groupId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            }).then((response) => {
                
                return response.data;
            })
        },

        createRecord: (groupId, name, data) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/';

            return axios.post(api.url + endpoint, {
                name: name,
                data: data,
                // withCredentials: true,
                groupId: groupId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        deleteRecord: (groupId, recordId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.delete(api.url + endpoint, {
                // withCredentials: true,
                groupId: groupId,
                recordId: recordId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        updateRecord: (groupId, recordId, data, name) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/records/' + recordId + '/';

            return axios.patch(api.url + endpoint, {
                data: data,
                name: name,
                // withCredentials: true,
                groupId: groupId,
                recordId: recordId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        listGroups: (userId) => {
            const endpoint = '/api/v1/databases/users/' + userId + '/groups/';

            return axios.get(api.url + endpoint, {
                // withCredentials: true,
                
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            }).then((response) => {
                return response.data.groups;
            })
        },

        inviteGroupMember: (groupId,myUserId, userId) => {
            const endpoint = '/api/v1/databases/users/' + myUserId + '/groups/';

            return axios.post(api.url + endpoint, {
                groupId: groupId,
                // withCredentials: true,
                userId: userId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        createGroup: (groupName) => {
            const endpoint = '/api/v1/databases/groups/';

            return axios.post(api.url + endpoint, {
                name: groupName,
                // withCredentials: true,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },


        getGroup: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(api.url + endpoint, {
                // withCredentials: true,
                groupId: groupId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            })
        },

        //return group object
        getGroupInfo: (groupId) => {
            const endpoint = '/api/v1/databases/groups/' + groupId + '/';

            return axios.get(api.url + endpoint, {
                // withCredentials: true,
                groupId: groupId,
                // origin: '*'
            },{
                headers: {
                    withCredentials: true
                }
            }).then((response) => {
                return response.data.group;
            })

        },

    }
;


export default api;

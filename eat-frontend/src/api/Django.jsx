//TODO: use rest api to communicate with django backend
import axios from 'axios';

let api = {


    provider: () => {

    },
    
    baseURL: 'http://localhost:8000/api', // Replace with your Django API URL

    createAccount: async (email, password, name) => {
        const data = {
            email,
            password,
            name,
        };

        try {
            const response = await axios.post(`${api.baseURL}/accounts/create`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    getAccount: async () => {
        // get login user's account information
        // end point: /api/v1/account
        // method: GET
        // return: user
        // response: 200
        // error: 401
        try {
            const response = await axios.get(`${api.baseURL}/accounts`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    getuserinformation: async (userid) => {
        // get login user's account information
        // end point: /api/v1/account{userid}
        // method: GET
        // return: user
        // response: 200
        // error: 401
        const endpoint = '/api/v1/account' + userid;
        const method = 'GET';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                // Return the session if the account is created successfully
                const data = await response.json();
                return data.user;

            } else if (response.status === 401) {
                // Handle error if the request is bad
                throw new Error('Unauthorized');
            } else {
                // Handle any other errors
                throw new Error(`Unexpected error: ${response.status}`);
            }
        } catch (error) {

            console.error('Error in getAccount:', error);
            throw error;
        }

    },


    createSession: async (email, password) => {
        // end point: /api/v1/account/sessions/email
        // method: POST
        // return: session
        // response: 201
        // error: 400
        //create a session for the user
        const data = {
            email,
            password,
        };

        try {
            const response = await axios.post(`${api.baseURL}/sessions/create`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    deleteCurrentSession: async () => {
        // end point: /api/v1/account/sessions/{sessionId}
        // method: DELETE
        // return: none
        // response: 204
        // error: 401
        //delete the current session
        try {
            const response = await axios.delete(`${api.baseURL}/sessions/current`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    //to be done :create groupid
    createGroup: async (groupName) => {
        const data = {
            name: groupName,
        };

        try {
            const response = await axios.post(`${api.baseURL}/groups/create`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    listGroups: async () => {
        try {
            const response = await axios.get(`${api.baseURL}/groups`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    getGroup: async (groupId) => {
        try {
            const response = await axios.get(`${api.baseURL}/groups/${groupId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    listGroupMemberships: async (groupId) => {
        try {
            const response = await axios.get(`${api.baseURL}/groups/${groupId}/memberships`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    getGroupInfo: async (groupId) => {
        try {
            const membershipResponse = await api.listGroupMemberships(groupId);
            const groupResponse = await api.getGroup(groupId);
            return { $id: groupId, members: membershipResponse.memberships, name: groupResponse.name };
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },


};


export default api;

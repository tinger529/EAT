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
            const response = await axios.post(`${api.baseURL}/account`, data);
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
            const response = await axios.get(`${api.baseURL}/account`);
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
        try {
            const response = await axios.get(`${api.baseURL}/account/${userid}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
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
            const response = await axios.post(`${api.baseURL}/sessions/email`, data);
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
            const response = await axios.delete(`${api.baseURL}/sessions`);
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
            const response = await axios.post(`${api.baseURL}/databases/groups`, data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.error); // Adjust the error handling as needed
        }
    },

    listGroups: async (userid) => {
        try {
            const response = await axios.get(`${api.baseURL}/databases/${userid}/groups`);
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

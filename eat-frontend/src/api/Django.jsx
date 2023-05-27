//TODO: use rest api to communicate with django backend

let api = {


    provider: () => {

    },

    createAccount: async (email, password, name) => {
        // use http rest api to communicate with django backend
        //end point: /api/v1/account
        //method: POST
        //return: user
        //response: 201
        //error: 400
        //TODO: implement this function

        const endpoint = '/api/v1/account';
        const method = 'POST';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                }),
            });

            if (response.status === 201) {
                // Return the session if the account is created successfully
                const data = await response.json();
                return data.user;
            } else if (response.status === 400) {
                // Handle error if the request is bad
                throw new Error('Bad Request');
            } else {
                // Handle any other errors
                throw new Error(`Unexpected error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error in createAccount:', error);
            throw error;
        }

    },


    getAccount: async () => {
        // get login user's account information
        // end point: /api/v1/account
        // method: GET
        // return: user
        // response: 200
        // error: 401
        const endpoint = '/api/v1/account';
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
        const endpoint = '/api/v1/account/sessions/email';
        const method = 'POST';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.status === 201) {
                // Return the session if the account is created successfully
                const data = await response.json();
                return data.session;
            } else if (response.status === 400) {
                // Handle error if the request is bad
                throw new Error('Bad Request');
            } else {
                // Handle any other errors
                throw new Error(`Unexpected error: ${response.status}`);
            }
        } catch (error) {
            console.error('Error in createSession:', error);
            throw error;
        }


    },

    deleteCurrentSession: async () => {
        // end point: /api/v1/account/sessions/{sessionId}
        // method: DELETE
        // return: none
        // response: 204
        // error: 401
        //delete the current session

        const endpoint = '/api/v1/account/sessions/{sessionId}';
        const method = 'DELETE';

        return fetch(endpoint, {
            method: method,
        })
            .then(res => {
                if (res.status === 204) {
                    return
                } else {
                    throw Error('Unauthorized')
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    createGroup: (groupName) => {

    },

    listGroups: () => {

    },


    //return group object
    getGroupInfo: (groupId) => {

    },


};

export default api;
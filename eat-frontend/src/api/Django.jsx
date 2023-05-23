//TODO: use rest api to communicate with django backend

let api = {


    provider: () => {

    },

    createAccount: (email, password, name) => {
        // use http rest api to communicate with django backend

    },

    getAccount: () => {

    },

    createSession: (email, password) => {

    },

    deleteCurrentSession: () => {

    },

    createDocument: (databaseId, collectionId, data, permissions) => {

    },

    listDocuments: (databaseId, collectionId) => {

    },

    updateDocument: (databaseId, collectionId, documentId, data) => {

    },

    deleteDocument: (databaseId, collectionId, documentId) => {

    },
};

export default api;
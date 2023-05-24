import {Client as Appwrite, Databases, Account, Teams} from "appwrite";
import {Server} from "../utils/config";

let api = {
        sdk: null,

        provider: () => {
            if (api.sdk) {
                return api.sdk;
            }
            let appwrite = new Appwrite();
            appwrite.setEndpoint(Server.endpoint).setProject(Server.project);
            const account = new Account(appwrite);
            const database = new Databases(appwrite);
            const group = new Teams(appwrite);

            api.sdk = {database, account, group};
            return api.sdk;
        },

        createAccount: (email, password, name) => {
            return api.provider().account.create("unique()", email, password, name);
        },

        getAccount: () => {
            let account = api.provider().account;
            return account.get();
        },

        createSession: (email, password) => {
            return api.provider().account.createEmailSession(email, password);
        },

        deleteCurrentSession: (_) => {
            return api.provider().account.deleteSession("current");
        },

        createDocument: (databaseId, collectionId, data, permissions) => {
            return api
                .provider()
                .database.createDocument(databaseId, collectionId, 'unique()', data, permissions);
        },

        listDocuments: (databaseId, collectionId) => {
            return api.provider().database.listDocuments(databaseId, collectionId);
        },

        updateDocument: (databaseId, collectionId, documentId, data) => {
            return api
                .provider()
                .database.updateDocument(databaseId, collectionId, documentId, data);
        },

        deleteDocument: (databaseId, collectionId, documentId) => {
            return api.provider().database.deleteDocument(databaseId, collectionId, documentId);
        },

        createGroup: (groupName) => {
            return api.provider().group.create("unique()", groupName);
        },

        listGroups: () => {
            return api.provider().group.list();
        },

        getGroup: (groupId) => {
            return api.provider().group.get(groupId);
        },

        listGroupMemberships: (groupId) => {
            return api.provider().group.listMemberships(groupId);
        },

        createGroupMembership: (groupId, userId) => {
            return api.provider().group.createMembership({
                teamId: groupId,
                userId: userId,
                roles: "owner",
                url: "https://google.com", //TODO: Change this to the actual URL
            });
        },

        // Appwrite only
        updateGroupMembershipStatus: (groupId, memberId, userId, secret) => {
            return api.provider().group.updateMembershipStatus(groupId, memberId, userId, secret);
        },


    }
;

export default api;

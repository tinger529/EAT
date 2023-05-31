import {Client as Appwrite, Databases, Account, Teams, Query} from "appwrite";
import {Server} from "../utils/config";
import group from "../pages/Dashboard/Group.jsx";

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

    createSession: (email, password) => {
        return api.provider().account.createEmailSession(email, password);
    },

    getAccount: () => {
        let account = api.provider().account;
        return account.get();
    },

    getUserInfo: (userId) => {

    },

    deleteCurrentSession: (_) => {
        return api.provider().account.deleteSession("current");
    },

    createDocument: (databaseId, collectionId, data, permissions) => {
        return api
            .provider()
            .database.createDocument(databaseId, collectionId, 'unique()', data, permissions);
    },

    listDocuments: (databaseId, collectionId, query) => {
        return api.provider().database.listDocuments(databaseId, collectionId, query);
    },

    updateDocument: (databaseId, collectionId, documentId, data) => {
        return api
            .provider()
            .database.updateDocument(databaseId, collectionId, documentId, data);
    },

    deleteDocument: (databaseId, collectionId, documentId) => {
        return api.provider().database.deleteDocument(databaseId, collectionId, documentId);
        },

        // return sum + records
        listRecords: (groupId) => {
            return api.listDocuments(Server.databaseID, Server.collectionID, [
                Query.equal('groupId', [groupId]),
            ]).then((response) => {
                
                return {sum: [], records: response.documents.reverse()}
            })
        },

        createRecord: (groupId, name, data) => {
            return api.getAccount().then((response) => {
                return api.createDocument(Server.databaseID, Server.collectionID, {
                    groupId: groupId,
                    name: name,
                    creator: response.$id,
                    data: JSON.stringify(data),
                }).then((response) => {
                    return {sum: [], record: response}
                })
            })
        },

    deleteRecord: (groupId, recordId) => {
        return api.deleteDocument(Server.databaseID, Server.collectionID, recordId);
    },

    updateRecord: (groupId, recordId, data, name) => {
        return api.updateDocument(Server.databaseID, Server.collectionID, recordId, {
            data: data,
            name: name,
        })
    },

    listGroups: () => {
        return api.provider().group.list().then((response) => {
            return response.teams;
        });
    },

    inviteGroupMember: (groupId, userId) => {
        return api.provider().group.createMembership({
            teamId: groupId,
            userId: userId,
            roles: ["owner"],
            url: "https://google.com", //TODO: Change this to the actual URL
        });
    },

    createGroup: (groupName) => {
        return api.provider().group.create("unique()", groupName);
    },


    getGroup: (groupId) => {
        return api.provider().group.get(groupId);
    },

    // Appwrite only
    listGroupMemberships: (groupId) => {
        return api.provider().group.listMemberships(groupId);
    },

    //return group object
    getGroupInfo: (groupId) => {
        return api.listGroupMemberships(groupId).then((response) => {
            return api.getGroup(groupId).then((group) => {
                    return {$id: groupId, members: response.memberships, name: group.name}
                })
            })
        },


        // Appwrite only
        updateGroupMembershipStatus: (groupId, memberId, userId, secret) => {
            return api.provider().group.updateMembershipStatus(groupId, memberId, userId, secret);
        },


    }
;

export default api;

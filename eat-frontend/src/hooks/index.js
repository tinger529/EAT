import api from "../api/api";
import {Server} from "../utils/config";
import {useEffect, useReducer} from "react";
import {Query} from "appwrite";

export const FetchState = {
    FETCH_INIT: 0,
    FETCH_SUCCESS: 1,
    FETCH_FAILURE: 2,
    FETCH_LOGOUT: 3,
};

export const useGetGroups = (stale,userId) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return {...state, isLoading: true, isError: false};
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    groups: action.groups,
                };
            case FetchState.FETCH_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: false,
        groups: [],
    });

    useEffect(() => {
        let didCancel = false;
        const getRecords = async () => {
            dispatch({type: FetchState.FETCH_INIT});
            try {
                const data = await api.listGroups(userId);
                
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_SUCCESS, groups: data});
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_FAILURE});
                }
            }
        };
        getRecords();
        return () => (didCancel = true);
    }, [stale]);

    return [state];
};


export const useGetGroupInfo = (stale, groupID) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return {...state, isLoading: true, isError: false};
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    sum: action.sum,
                    records: action.records,
                    members: action.members
                };
            case FetchState.FETCH_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: false,
        records: [],
        members: [],
        sum: []
    });

    useEffect(() => {
        let didCancel = false;
        const getGroupInfo = async () => {
            if (!groupID) return;
            dispatch({type: FetchState.FETCH_INIT});
            try {
                //List records
                const records = await api.listRecords(groupID);
                const group = await api.getGroupInfo(groupID);
                if (!didCancel) {
                    dispatch({
                        type: FetchState.FETCH_SUCCESS,
                        sum: records.sum,
                        records: records.records,
                        members: group.members,
                        name: group.name
                    });
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_FAILURE});
                }
            }
        };
        getGroupInfo();
        return () => (didCancel = true);
    }, [groupID, stale]);

    return [state];
};

export const useGetUser = () => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return {...state, isLoading: true, isError: false};
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    user: action.user,
                    session: action.session
                };
            case FetchState.FETCH_FAILURE:
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                };
            case FetchState.FETCH_LOGOUT:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    user: null,
                    session: null
                }
            default:
                throw new Error();
        }
    };

    const [state, dispatch] = useReducer(reducer, {
        isLoading: false,
        isError: true,
        user: null,
        session: null
    });

    useEffect(() => {

        let didCancel = false;
        const getUser = async () => {
            dispatch({type: FetchState.FETCH_INIT});
            try {
                const account = await api.getAccount();
                
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_SUCCESS, user: account});
                }
            } catch (e) {
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_FAILURE});
                }
            }
        };
        getUser();
        return () => (didCancel = true);
    }, []);

    return [state, dispatch];
};

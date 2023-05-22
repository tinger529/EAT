import api from "../api/api";
import {Server} from "../utils/config";
import {useEffect, useReducer} from "react";

export const FetchState = {
    FETCH_INIT: 0,
    FETCH_SUCCESS: 1,
    FETCH_FAILURE: 2,
    FETCH_LOGOUT: 3,
};

export const useGetRecords = (stale) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case FetchState.FETCH_INIT:
                return {...state, isLoading: true, isError: false};
            case FetchState.FETCH_SUCCESS:
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    todos: action.payload,
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
        todos: [],
    });

    useEffect(() => {
        let didCancel = false;
        const getRecords = async () => {
            dispatch({type: FetchState.FETCH_INIT});
            try {
                const data = await api.listDocuments(Server.databaseID, Server.collectionID);
                if (!didCancel) {
                    dispatch({type: FetchState.FETCH_SUCCESS, payload: data.documents});
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

import React from "react";
import {Button, Table, Tabs, Flex, Box, Center, Text, useToast} from "@chakra-ui/react";
import {FetchState} from "../../hooks/index.js";
import api from "../../api/api.jsx";

const Dashboard = ({user, session, userDispatch}) => {

    const toast = useToast();
    const handleLogout = (e) => {
        e.preventDefault()
        userDispatch({type: FetchState.FETCH_INIT});
        try {
            api.deleteCurrentSession();
            userDispatch({type: FetchState.FETCH_LOGOUT});
            toast({
                description: 'You have logged out',
                status: 'info',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            console.log(error)
            userDispatch({type: FetchState.FETCH_FAILURE, error: error});
        }

    }

    return (
        <>

            <Button>dashboard</Button>
            <Button onClick={handleLogout}>Logout</Button>
            <Text> {JSON.stringify(user)}</Text>
        </>
    )
};

export default Dashboard;
import React, {useEffect, useState} from "react";
import {Button, Table, Tabs, Flex, Box, Center, Text, useToast, Heading, Stack, HStack} from "@chakra-ui/react";
import {FetchState, useGetGroups, useGetUser} from "../../hooks/index.js";
import api from "../../api/api.jsx";
import {Server} from "../../utils/config.jsx";
import Group from "./Group.jsx";
import {json} from "react-router-dom";

/*
    Process:
    1. Get the groups of current user
    2. Get the records of the group that recently accessed
    3. Mapping records to username
    4. Display the records
 */
const Dashboard = ({user, session, userDispatch}) => {
    const [{groups, isLoading, isError}, groupDispatch] = useGetGroups();

    const [group, setGroup] = useState({});
    // re
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
    useEffect(() => {
        if (!isLoading && !isError && groups.length > 0) {

            setGroup(groups[0]) // set the first group as default. Should be set as last accessed group

        }
    }, [groups, isError, isLoading])

    return (
        <Stack flex={"content"} direction={"column"} margin={8} maxW={1200} spacing={"1rem"}>

            <Heading>Dashboard</Heading>
            <Button onClick={handleLogout}>Logout</Button>
            <HStack flex={"max-content"} alignItems={"top"}>
                <Box maxW={150}>
                    <Text>Debug:</Text>
                    <Text>Name: {user.name}</Text>
                    <Text>Groups: {isLoading ? "Loading" : JSON.stringify(groups)}</Text>
                </Box>
                <Group group={group} user={user}/>
            </HStack>


        </Stack>
    )
};

export default Dashboard;
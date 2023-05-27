import React, {useEffect, useState} from "react";
import {
    Button,
    Table,
    Tabs,
    Flex,
    Box,
    Center,
    Text,
    useToast,
    Heading,
    Stack,
    HStack,
    Spacer,
    Spinner, Divider
} from "@chakra-ui/react";
import {FetchState, useGetGroups, useGetUser} from "../../hooks/index.js";
import api from "../../api/api.jsx";
import {Server} from "../../utils/config.jsx";
import Group from "./Group.jsx";
import {json} from "react-router-dom";
import {AddIcon} from "@chakra-ui/icons";

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
    const handleCreateGroup = (e) => {
        toast({
            description: 'Not implemented yet.🥵🥵🥺🥺',
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });

    }
    useEffect(() => {
        if (!isLoading && !isError && groups.length > 0) {

            setGroup(groups[0]) // set the first group as default. Should be set as last accessed group

        }
    }, [groups, isError, isLoading])

    return (
        <>


            <Stack flex={"content"} direction={"column"} margin={8} spacing={"1rem"}>

                <HStack alignItems={"top"} w={"100%"}>
                    <Stack spacing={4} w={"80"}
                           h={"100%"} display={{base: "none", lg: "block"}} m={4}>
                        <Heading size={"md"}>Your Groups:</Heading>
                        {isLoading ?
                            <Center w={"100%"} h={"100%"}>
                                <Spinner p={4}/>
                                <Text p={4}>Loading...</Text>
                            </Center>

                            :
                            groups.length === 0 ?
                                <Text p={4}>You do not have any group yet. Create one!</Text>
                                :
                                groups.map((group, index) => {
                                    return (
                                        <Button key={group.$id} onClick={() => setGroup(group)} w={"100%"}
                                                m={1}
                                                variant={"solid"}
                                        >

                                            {group.name}
                                        </Button>
                                    )
                                })

                        }
                        <Divider/>
                        <Button onClick={() => handleCreateGroup()}
                                w={"100%"}
                                m={1}
                                variant={"outline"}
                                leftIcon={<AddIcon/>}
                        >
                            Create Group
                        </Button>
                    </Stack>
                    <Group group={group} user={user} isGroupsLoading={isLoading}/>
                </HStack>


            </Stack>
        </>
    )
};

export default Dashboard;
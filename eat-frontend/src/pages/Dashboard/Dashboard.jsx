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
    Spinner,
    Divider,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    AlertDialogFooter,
    ButtonGroup, useDisclosure
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
    const [stale, setStale] = useState(false);
    const [{groups, isLoading, isError}, groupDispatch] = useGetGroups(stale);
    const [group, setGroup] = useState({});
    const toast = useToast();
    const {isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose} = useDisclosure();

    const handleCreateGroup = (e) => {
        toast({
            description: 'Not implemented yet.🥵🥵🥺🥺',
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });

    }

    const CreateGroupModal = ({isOpen, onClose}) => {

        const [groupName, setGroupName] = useState("")
        const [isLoading, setIsLoading] = useState(false)
        const [isError, setIsError] = useState(false)
        const [errorMessage, setErrorMessage] = useState("")

        const handleCreate = async () => {
            setIsLoading(true)
            setIsError(false)
            try {
                const res = await api.createGroup(groupName)
                toast({
                    description: 'Group created',
                    status: 'success',
                })
                onClose()
            } catch (e) {
                console.log(e)
                setIsError(true)
                setErrorMessage(JSON.stringify(e))
            }
            setIsLoading(false)
            setStale(true)
        }

        return <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Create group
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <FormControl>
                            <FormLabel>Group name</FormLabel>
                            <Input placeholder={"Group name"} onChange={(e) => setGroupName(e.target.value)}></Input>
                        </FormControl>
                        {isError && <Alert status="error">
                            <AlertIcon/>
                            <AlertTitle mr={2}>Failed to create group</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setIsError(false)}/>
                        </Alert>}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <ButtonGroup>
                            <Button onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={handleCreate} ml={3} isLoading={isLoading}>
                                Create
                            </Button>
                        </ButtonGroup>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
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
                        <Button onClick={onCreateOpen}
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
            <CreateGroupModal isOpen={isCreateOpen} onClose={onCreateClose}/>
        </>
    )
};

export default Dashboard;
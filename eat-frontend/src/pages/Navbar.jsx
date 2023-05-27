import {Outlet} from "react-router-dom";
import {Box, Button, Flex, Heading, HStack, Spacer, Stack, Text, useToast} from "@chakra-ui/react";
import {FetchState} from "../hooks/index.js";
import api from "../api/api.jsx";


const Navbar = ({user, userDispatch}) => {
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
            <Flex align="center" justify={"space-between"} padding={4}>
                <Box>
                    <Heading>Eat!</Heading>
                </Box>
                <Spacer/>
                {(user ?
                    <HStack spacing={4}>

                        <Text>Hi, {user.name}!</Text>
                        <Button onClick={handleLogout}>
                            Logout
                        </Button>
                    </HStack>
                    :
                    <Button>
                        Login
                    </Button>)}
            </Flex>

            <Outlet/>
        </>

    )
};

export default Navbar
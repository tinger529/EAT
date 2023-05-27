import React, {useState} from "react";
import api from "../../api/api";
import SignUp from "./SignUp";
import {FetchState} from "../../hooks";
import {Server} from "../../utils/config";
import {
    Alert,
    AlertDescription, AlertIcon, AlertTitle,
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text, useToast
} from "@chakra-ui/react";
import {AddIcon, ArrowBackIcon} from "@chakra-ui/icons";
import {Form} from "react-router-dom";

const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


// eslint-disable-next-line react/prop-types
const Login = ({userDispatch}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const toast = useToast()
    const handleLogin = async (e) => {
        e.preventDefault();
        let errorFlag = false;
        if (!email.match(emailFormat)) {
            setEmailError(true);
            errorFlag = true;
        }
        if (password.length < 8) {
            setPasswordError(true);
            errorFlag = true;
        }
        if (errorFlag) {
            return;
        }
        userDispatch({type: FetchState.FETCH_INIT});
        try {
            const session = await api.createSession(email, password);

            const data = await api.getAccount();
            userDispatch({type: FetchState.FETCH_SUCCESS, user: data, session: session});
            toast({
                title: 'Login Successful',
                description: "Welcome to EAT!",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            console.log(JSON.stringify(error))
            toast({
                title: 'Login Failed',
                description: error.response.message,
                status: 'error',
                duration: 7000,
                isClosable: true,
            })
            // setErrorMessage(error.response.message);
            userDispatch({type: FetchState.FETCH_FAILURE});
        }
    };

    return (
        <Stack flex={"content"} direction={"column"} margin={8} maxW={500} spacing={"1rem"}>

            {register ? (
                <>
                    <SignUp setRegister={setRegister} userDispatch={userDispatch}/>
                </>
            ) : (
                <>
                    <Heading size={"3xl"} py={5}>Login</Heading>
                    <FormControl isInvalid={emailError}>
                        <FormLabel>Email</FormLabel>
                        <Input placeholder={"Email"} size='lg' onChange={e => {
                            setEmail(e.target.value);
                            setEmailError(false);
                        }}/>
                        <FormErrorMessage>Wrong Email format</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={passwordError}>
                        <FormLabel>Password</FormLabel>
                        <Input placeholder={"Password"} type={"password"} size='lg' onChange={e => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                        }}/>
                        <FormErrorMessage> Password.length should {">="} 8 </FormErrorMessage>
                    </FormControl>

                    <Button alignSelf={"left"} w={"fit-content"} size='lg' colorScheme={"teal"} onClick={handleLogin}>Log
                        in</Button>
                    <HStack spacing={3} pt={5}>
                        <Text fontSize='lg'>No account?</Text>
                        <Button
                            variant='outline'
                            width={"fit-content"}
                            size='md'
                            onClick={() => setRegister(true)}>
                            Sign up
                        </Button>
                    </HStack>
                </>
            )}
        </Stack>
    );
};

export default Login;

import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Stack,
    TagLeftIcon,
    Text, useToast
} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useState} from "react";
import {FetchState} from "../../hooks/index.js";
import api from "../../api/api";

const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const SignUp = ({setRegister, userDispatch}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const toast = useToast();
    const handleSignup = async (e) => {
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
        if (name === "") {
            setNameError(true);
            errorFlag = true;
        }
        if (errorFlag) {
            return;
        }
        userDispatch({type: FetchState.FETCH_INIT});
        try {
            const data = await api.createAccount(email, password, name);
            const session = await api.createSession(email, password);
            userDispatch({type: FetchState.FETCH_SUCCESS, user: data, session: session});
            toast({
                title: 'Signup Successful',
                description: "Welcome to EAT!",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Signup Failed',
                description: JSON.stringify(error),
                status: 'error',
                duration: 7000,
                isClosable: true,
            })
            userDispatch({type: FetchState.FETCH_FAILURE});
        }
    }

    return (
        <>
            <Button
                leftIcon={<ArrowBackIcon/>}
                variant='outline'
                width={"fit-content"}
                size='sm'
                onClick={() => setRegister(false)}>
                Log in
            </Button>
            <Heading size={"3xl"} py={5}>Sign Up</Heading>
            <FormControl isInvalid={nameError}>
                <FormLabel>Name</FormLabel>
                <Input placeholder={"Name"} size='lg' onChange={e => {
                    setName(e.target.value);
                    setNameError(false);
                }}/>
                <FormErrorMessage>Wrong Email format</FormErrorMessage>
            </FormControl>
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
                    if (passwordError && e.target.value.length >= 8)
                        setPasswordError(false);
                }}/>
                <FormErrorMessage> Password.length should {">="} 8 </FormErrorMessage>
            </FormControl>
            <Button alignSelf={"left"} w={"fit-content"} size='lg' colorScheme={"teal"} onClick={handleSignup}>Sign
                up</Button>
        </>
    )
}

export default SignUp;
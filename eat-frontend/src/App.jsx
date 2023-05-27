import {useState} from 'react'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./pages/Navbar.jsx";
import {Button, Table, Tabs, Flex, Box, Center} from "@chakra-ui/react";
import {useGetUser} from "./hooks";
import {Server} from "./utils/config.jsx";

function App() {
    const [{user, session, isLoading, isError}, userDispatch] = useGetUser();


    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar user={user} userDispatch={userDispatch}/>}>
                    <Route path="/" element={
                        user ? <Dashboard user={user} userDispatch={userDispatch} session={session}/>
                            : <Navigate to="/login"/>}

                    />
                    <Route path="/login" element={
                        user ? <Navigate to="/"/>
                            : <Login userDispatch={userDispatch}/>}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}


export default App

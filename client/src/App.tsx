import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile/Profile";
import { useAuth } from './context/AuthContext';
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from './pages/Auth/Login';
import RecoverPassword from "./pages/Auth/RecoverPassword";
import Signup from "./pages/Auth/Signup";
import Notes from './pages/Notes/Notes';

function App() {
    const { isUserLoggedIn, currentUser } = useAuth();

    return (
        <div className="app">
            <Navbar />
            <Routes>
                {isUserLoggedIn && currentUser !== null ?
                    <>
                        <Route path="/" element={<Notes />} />
                        <Route path="/profile" element={<Profile />} />
                    </>
                    :
                    <>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgotPassword" element={<ForgotPassword />} />
                    </>}
                    <Route path="/recoverPassword/:token" element={<RecoverPassword />} />
            </Routes>
        </div>
    );
}

export default App;

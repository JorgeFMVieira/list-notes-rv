import React, { useState, useEffect } from "react";
import { AuthDTO } from "../models/Auth/AuthDTO";
import { APIService } from "../services/APIService";

interface AuthContextProps {
    currentUser: AuthDTO | null,
    children?: React.ReactNode,
    setCurrentUser: (user: AuthDTO | null) => void,
    isUserLoggedIn: boolean,
}

const AuthContext = React.createContext<AuthContextProps>({
    currentUser: null,
    setCurrentUser: () => { },
    isUserLoggedIn: false,
});

interface AuthProviderProps {
    user: AuthDTO | null,
    children?: any
}

export const AuthProvider = (props: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<AuthDTO | null>(props.user);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(props.user != null ? true : false);

    APIService.SetToken(currentUser?.token ?? null);

    const loginUser = (user: AuthDTO | null) => {

        if (isUserValid(user) === false) {
            setCurrentUser(null);
            setIsUserLoggedIn(false)
            return;
        }

        if(user !== null){
            setCurrentUser(localStorage.setItem("user", JSON.stringify(user))!);
            console.log("User:" + user);
        }
        setIsUserLoggedIn(true);
    }

    const isUserValid = (user: any): boolean => {
        if (typeof user == 'undefined') return false;
        if (user == null) return false;
        if (user.token == null) return false;

        return true;

    }

    useEffect(() => {
        APIService.SetToken(currentUser?.token ?? null);
    }, [currentUser])

    return (
        <AuthContext.Provider value={{
            currentUser, setCurrentUser: loginUser, isUserLoggedIn: isUserLoggedIn
        }}>
            {props.children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => React.useContext(AuthContext);
import httpStatus from "http-status";
import { createContext,  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../Client";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    let [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const router = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`
        
        try {
            const decoded = jwtDecode(storedToken);
            setUserData(decoded);

        } catch (error) {
            console.error("invalid token during decoding:", error);
            handleLogout();
        }}
    },[])

    const handleLogin = async (email,password) => {
        try {
            const res = await client.post("/login" , {email,password});
            if (res.status === httpStatus.OK) {
                const token = res.data.token;
                localStorage.setItem("token", token);
                setToken(token);
                const decoded = jwtDecode(token); 
                setUserData(decoded); 
                router("/");
            }

        } catch (e) {
            console.error("Invalid token during decoding:", e);
            throw e;
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setUserData(null);
        router("/")
    };

    const handleRegister = async (name,email,password) => {
        try {
            const res = await client.post("/register" , {name,email,password})
        } catch (e) {
            console.error("Registration error", e);
            throw e;
        }
    };

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        handleLogout,
        token
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
}



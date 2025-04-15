import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     fetchUser(localStorage.getItem("token") || sessionStorage.getItem("token"));
    // }, []);

    const fetchUser = async (token) => {
        try {
            if (!token) {
                console.error("No authentication token found");
                return;
            }
    
            console.log("Sending request with token:", token); // Log token before request
    
            const response = await fetch("http://localhost:5000/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("User data:", data);
            } else {
                console.error("Failed to fetch user data:", data.message);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const login = (userData) => {
        setUser(userData); // Save user details directly
    };    

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
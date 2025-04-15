import React, { useState, useContext } from "react";
import AuthContext from "../funcs/AuthContext";
import { ModalOverlay, ModalContainer, Section, Title, Input, Button, CloseButton, Divider, RadioGroup, CheckboxGroup, CheckboxInput, ErrorText } from "./LoginStyles";

const Login = ({ onClose }) => {
    const { login, fetchUser } = useContext(AuthContext);
    const [loginData, setLoginData] = useState({ email: "", password: "", rememberMe: false });
    const [registerData, setRegisterData] = useState({ fullName: "", email: "", password: "", confirmPassword: "", phoneNumber: "", userType: "buyer", termsAccepted: false});
    
    const [loginError, setLoginError] = useState("");  
    const [registerError, setRegisterError] = useState("");  

    const handleChange = (e, form) => {
        const { name, value, type, checked } = e.target;
        if (form === "login") {
            setLoginData({ ...loginData, [name]: type === "checkbox" ? checked : value });
        } else {
            setRegisterData({ ...registerData, [name]: type === "checkbox" ? checked : value });
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
    
            const data = await response.json();
            if (response.ok) {
                login(data.user); // Save user data directly
                onClose();
            } else {
                console.error("Login failed:", data.message);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };               
    
    const handleRegister = async () => {
        setRegisterError("");
    
        if (!validateEmail(registerData.email)) {
            setRegisterError("Please enter a valid email address.");
            return;
        }
    
        if (registerData.password !== registerData.confirmPassword) {
            setRegisterError("Passwords do not match!");
            return;
        }
    
        if (!registerData.termsAccepted) {
            setRegisterError("You must accept the Terms & Conditions.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            alert("Registration successful!");
            onClose();
        } catch (err) {
            setRegisterError(err.message);
        }
    };    

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>&times;</CloseButton>

                {/* Login Section */}
                <Section>
                    <Title>Login</Title>
                    <Input type="email" name="email" placeholder="Email" value={loginData.email} onChange={(e) => handleChange(e, "login")} />
                    <Input type="password" name="password" placeholder="Password" value={loginData.password} onChange={(e) => handleChange(e, "login")} />

                    <CheckboxGroup>
                        <label>
                            <CheckboxInput 
                                type="checkbox" 
                                name="rememberMe" 
                                checked={loginData.rememberMe} 
                                onChange={(e) => handleChange(e, "login")} 
                            /> Remember Me
                        </label>
                    </CheckboxGroup>

                    {loginError && <ErrorText>{loginError}</ErrorText>}
                    <Button onClick={handleLogin}>Login</Button>
                </Section>

                <Divider />

                {/* Register Section */}
                <Section>
                    <Title>Register</Title>
                    <Input type="text" name="fullName" placeholder="Full Name" value={registerData.fullName} onChange={(e) => handleChange(e, "register")} />
                    <Input type="email" name="email" placeholder="Email" value={registerData.email} onChange={(e) => handleChange(e, "register")} />
                    <Input type="password" name="password" placeholder="Password" value={registerData.password} onChange={(e) => handleChange(e, "register")} />
                    <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={registerData.confirmPassword} onChange={(e) => handleChange(e, "register")} />
                    <Input type="tel" name="phoneNumber" maxLength="15" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, "")} placeholder="Phone Number" value={registerData.phoneNumber} onChange={(e) => handleChange(e, "register")} />

                    {/* User Type Selection */}
                    <RadioGroup>
                        <label>
                            <input type="radio" name="userType" value="buyer" checked={registerData.userType === "buyer"} onChange={(e) => handleChange(e, "register")} /> Buyer
                        </label>
                        <label>
                            <input type="radio" name="userType" value="seller" checked={registerData.userType === "seller"} onChange={(e) => handleChange(e, "register")} /> Seller
                        </label>
                    </RadioGroup>

                    {/* Terms & Conditions */}
                    <CheckboxGroup>
                        <CheckboxInput type="checkbox" id="terms" name="termsAccepted" checked={registerData.termsAccepted} onChange={(e) => handleChange(e, "register")} />
                        <label htmlFor="terms">
                            I agree to the <a href="#">Terms & Conditions</a>
                        </label>
                    </CheckboxGroup>

                    {registerError && <ErrorText>{registerError}</ErrorText>}
                    <Button onClick={handleRegister}>Register</Button>
                </Section>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Login;
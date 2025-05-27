import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { ModalOverlay, ModalContainer, Section, Title, Input, Button, CloseButton, Divider, RadioGroup, CheckboxGroup, CheckboxInput, ErrorText } from "./LoginStyles";
import api from "../config/axios";

const Login = ({ onClose, onLoginSuccess }) => {
    const { login } = useAuth();
    const [loginData, setLoginData] = useState({ email: "", password: "", rememberMe: false });
    const [registerData, setRegisterData] = useState({ 
        fullName: "", 
        email: "", 
        password: "", 
        confirmPassword: "", 
        phoneNumber: "", 
        role: "buyer",
        termsAccepted: false
    });
    
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
        setLoginError("");
        
        try {
            console.log('Attempting login with:', loginData.email);
            
            // Call login with email and password
            const user = await login(loginData.email, loginData.password);
            console.log('Login successful');
            
            if (onLoginSuccess) onLoginSuccess(user);
            onClose();
        } catch (error) {
            console.error("Error logging in:", error.response?.data || error);
            setLoginError(error.response?.data?.message || 'An error occurred during login. Please try again.');
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
            console.log('Attempting registration with:', registerData.email);
            
            // Prepare registration data
            const registrationData = {
                username: registerData.email, // Use email as username
                email: registerData.email,
                password: registerData.password,
                role: registerData.role,
                firstName: registerData.fullName.split(' ')[0] || '',
                lastName: registerData.fullName.split(' ').slice(1).join(' ') || '',
                phone: registerData.phoneNumber
            };
            
            const response = await api.post("/api/auth/register", registrationData);
            console.log('Registration response:', response.data);
            
            // After successful registration, try to log in
            try {
                const user = await login(registerData.email, registerData.password);
                console.log('Login successful after registration');
                if (onLoginSuccess) onLoginSuccess(user);
                onClose();
            } catch (loginError) {
                console.error('Login after registration failed:', loginError);
                setRegisterError('Registration successful but login failed. Please try logging in manually.');
            }
        } catch (err) {
            console.error('Registration error:', err.response?.data || err);
            setRegisterError(err.response?.data?.message || err.message || 'An error occurred during registration');
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
                            <input type="radio" name="role" value="buyer" checked={registerData.role === "buyer"} onChange={(e) => handleChange(e, "register")} /> Buyer
                        </label>
                        <label>
                            <input type="radio" name="role" value="seller" checked={registerData.role === "seller"} onChange={(e) => handleChange(e, "register")} /> Seller
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
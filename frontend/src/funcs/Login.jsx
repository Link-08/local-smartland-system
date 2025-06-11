import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { ModalOverlay, ModalContainer, Section, Title, Input, Button, CloseButton, Divider, RadioGroup, CheckboxGroup, CheckboxInput, ErrorText } from "./LoginStyles";
import api from "../config/axios";

const Login = ({ onClose }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: "", password: "", rememberMe: false });
    const [registerData, setRegisterData] = useState({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "", 
        confirmPassword: "", 
        phoneNumber: "", 
        role: "buyer",
        termsAccepted: false
    });
    
    const [loginError, setLoginError] = useState("");  
    const [registerError, setRegisterError] = useState("");  
    const [registerSuccess, setRegisterSuccess] = useState("");

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
            
            // Role-based redirection
            if (user.role === 'buyer') {
                navigate('/buyer-dashboard');
            } else if (user.role === 'seller') {
                navigate('/seller-dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
            
            // Only call onClose if it exists (modal usage)
            if (typeof onClose === 'function') {
                onClose();
            }
        } catch (error) {
            console.error("Error logging in:", error.response?.data || error);
            setLoginError(error.response?.data?.message || 'An error occurred during login. Please try again.');
        }
    };               
    
    const handleRegister = async () => {
        setRegisterError("");
        setRegisterSuccess("");
    
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
            // Call register with all required fields including phoneNumber
            await register(
                registerData.email,
                registerData.password,
                registerData.firstName,
                registerData.lastName,
                registerData.phoneNumber,
                registerData.role
            );
            setRegisterSuccess("User successfully registered");
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error("Registration error:", error.response?.data || error);
            setRegisterError(error.response?.data?.message || 'An error occurred during registration. Please try again.');
        }
    };

    const renderContent = () => (
        <>
            <Section>
                <Title>Login</Title>
                <form onSubmit={handleLogin}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) => handleChange(e, "login")}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => handleChange(e, "login")}
                        required
                    />
                    <CheckboxGroup>
                        <CheckboxInput
                            type="checkbox"
                            name="rememberMe"
                            checked={loginData.rememberMe}
                            onChange={(e) => handleChange(e, "login")}
                        />
                        <label>Remember me</label>
                    </CheckboxGroup>
                    {loginError && <ErrorText>{loginError}</ErrorText>}
                    <Button type="submit">Login</Button>
                </form>
            </Section>
            
            <Divider />
            
            <Section>
                <Title>Register</Title>
                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <Input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={registerData.firstName}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <Input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={registerData.lastName}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={registerData.confirmPassword}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <Input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={registerData.phoneNumber}
                        onChange={(e) => handleChange(e, "register")}
                        required
                    />
                    <RadioGroup>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="buyer"
                                checked={registerData.role === "buyer"}
                                onChange={(e) => handleChange(e, "register")}
                            />
                            Buyer
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="seller"
                                checked={registerData.role === "seller"}
                                onChange={(e) => handleChange(e, "register")}
                            />
                            Seller
                        </label>
                    </RadioGroup>
                    <CheckboxGroup>
                        <CheckboxInput
                            type="checkbox"
                            name="termsAccepted"
                            checked={registerData.termsAccepted}
                            onChange={(e) => handleChange(e, "register")}
                            required
                        />
                        <label>I accept the Terms & Conditions</label>
                    </CheckboxGroup>
                    {registerError && <ErrorText>{registerError}</ErrorText>}
                    {registerSuccess && <div style={{ color: 'green', marginBottom: '10px' }}>{registerSuccess}</div>}
                    <Button type="submit">Register</Button>
                </form>
            </Section>
        </>
    );

    // If onClose is provided, render as modal
    if (typeof onClose === 'function') {
        return (
            <ModalOverlay>
                <ModalContainer>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                    {renderContent()}
                </ModalContainer>
            </ModalOverlay>
        );
    }

    // Otherwise render as page
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default Login;
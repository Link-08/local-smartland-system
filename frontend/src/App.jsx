import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./funcs/Navbar";
import MapView from "./funcs/MapView";
import Admin from "./funcs/Admin";
import HomePage from "./funcs/HomePage";
import ListingOverview from "./funcs/ListingOverview";
import ListingPage from "./funcs/Listings";
import BuyerDashboard from "./funcs/BuyerDashboard";
import SellerDashboard from "./funcs/SellerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/map" element={<MapView />} />
                        
                        {/* Protected Routes */}
                        <Route 
                            path="/buyer-dashboard" 
                            element={
                                <ProtectedRoute requiredRole="buyer">
                                    <BuyerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/seller-dashboard" 
                            element={
                                <ProtectedRoute requiredRole="seller">
                                    <SellerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <Admin />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/listings" 
                            element={
                                <ProtectedRoute requiredRole="buyer">
                                    <ListingOverview />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/listings/:id" 
                            element={
                                <ProtectedRoute requiredRole="buyer">
                                    <ListingPage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
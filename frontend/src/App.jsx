import React, { useState } from "react";
import { AuthProvider } from "./funcs/AuthContext";
import Navbar from "./funcs/Navbar";
import MapView from "./funcs/MapView";
import Admin from "./funcs/Admin";
import HomePage from "./funcs/HomePage";
import ListingOverview from "./funcs/ListingOverview";
import ListingPage from "./funcs/Listings";
import BuyerDashboard from "./funcs/BuyerDashboard";
import SellerDashboard from "./funcs/SellerDashboard";
import Login from "./funcs/Login";

// Separate component for the main app content
const AppContent = () => {
    const [currentPage, setCurrentPage] = useState("home");

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage.toLowerCase()) {
            case "home":
                return <HomePage />;
            case "buyer dashboard":
                return <BuyerDashboard />;
            case "seller dashboard":
                return <SellerDashboard />;
            case "speclist":
                return <ListingPage />;
            case "listings":
                return <ListingOverview />;
            case "admin":
                return <Admin />;
            case "map":
                return <MapView />;
            case "login":
                return <Login />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="app-container">
            <Navbar navigateTo={navigateTo} currentPage={currentPage} />
            {renderPage()}
        </div>
    );
};

// Main App component
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
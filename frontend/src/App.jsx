import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./funcs/Navbar";
import MapView from "./funcs/MapView";
import Admin from "./funcs/Admin";
import HomePage from "./funcs/HomePage";
import ListingOverview from "./funcs/ListingOverview";
import ListingPage from "./funcs/Listings";
import BuyerDashboard from "./funcs/BuyerDashboard";
import SellerDashboard from "./funcs/SellerDashboard";
import Login from "./funcs/Login";
import { BrowserRouter } from "react-router-dom";

// Separate component for the main app content
const AppContent = () => {
    const [currentPage, setCurrentPage] = useState("home");
    const [selectedProperty, setSelectedProperty] = useState(null);

    const navigateTo = (page, data) => {
        setCurrentPage(page);
        if (page === 'speclist' && data && data.property) {
            setSelectedProperty(data.property);
        }
    };

    const renderPage = () => {
        switch (currentPage.toLowerCase()) {
            case "home":
                return <HomePage />;
            case "buyer dashboard":
                return <BuyerDashboard navigateTo={navigateTo} />;
            case "seller dashboard":
                return <SellerDashboard navigateTo={navigateTo} />;
            case "speclist":
                return <ListingPage property={selectedProperty} />;
            case "listings":
                return <ListingOverview navigateTo={navigateTo} />;
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
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
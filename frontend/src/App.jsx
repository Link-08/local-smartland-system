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

function App() {
    const [currentPage, setCurrentPage] = useState("home");

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    return (
        <AuthProvider>
            <div className="app-container">
                <Navbar navigateTo={navigateTo} currentPage={currentPage} />

                {currentPage === "home" && <HomePage />}
                {/* {currentPage === "about" && <AboutPage />} */}
                {currentPage === "buyer dashboard" && <BuyerDashboard />}
                {currentPage === "seller dashboard" && <SellerDashboard />}
                {currentPage === "speclist" && <ListingPage />}
                {currentPage === "listings" && <ListingOverview />}
                {currentPage === "admin" && <Admin />}
                {currentPage === "map" && <MapView />}
                {currentPage === "login" && <Login />}
            </div>
        </AuthProvider>
    );
}

export default App;
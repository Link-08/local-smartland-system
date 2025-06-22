import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { NavContainer, Logo, Smartland, System, NavLinks, NavItem, LoginButton, MenuToggle, ProfileSection, DropdownItem, Dropdown } from "./NavbarStyles";
import Login from "./Login";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Listen for auth:logout event
    useEffect(() => {
        const handleLogout = () => {
            navigate('/');
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, [navigate]);

    // Define menu items based on user role
    const getMenuItems = () => {
        if (!user) {
            return ["Home"];
        }

        switch (user.role) {
            case 'buyer':
                return ["Buyer Dashboard", "Listings", "Map"];
            case 'seller':
                return ["Seller Dashboard", "Map"];
            case 'admin':
                return ["Admin", "Map"];
            default:
                return ["Home"];
        }
    };

    const handleNavigation = (page) => {
        // Check if user is trying to access buyer-only pages
        if ((page === "listings") && user?.role !== "buyer") {
            return; // Prevent navigation for non-buyers
        }
        
        // Convert page name to route path
        const routeMap = {
            "home": "/",
            "buyer dashboard": "/buyer-dashboard",
            "seller dashboard": "/seller-dashboard",
            "admin": "/admin",
            "listings": "/listings",
            "map": "/map"
        };
        
        const path = routeMap[page.toLowerCase()] || "/";
        navigate(path);
        setMenuOpen(false);
    };

    const handleSettings = () => {
        navigate("/settings");
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    return (
        <>
            <NavContainer>
                <Logo onClick={() => navigate("/")}>
                    <Smartland>SMARTLAND</Smartland>
                    <System>SYSTEM</System>
                </Logo>
                <NavLinks $menuOpen={menuOpen}>
                    {getMenuItems().map((item) => (
                        <NavItem 
                            key={item} 
                            onClick={() => handleNavigation(item.toLowerCase())}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {item}
                        </NavItem>
                    ))}
                    {user ? (
                        <ProfileSection ref={dropdownRef}>
                            <FaCircleUser 
                                size={32} 
                                onClick={() => setDropdownOpen(!dropdownOpen)} 
                                style={{ cursor: "pointer", color: "#fff" }} 
                            />
                            {dropdownOpen && (
                                <Dropdown>
                                    <DropdownItem onClick={handleSettings}>Settings</DropdownItem>
                                    <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                                </Dropdown>
                            )}
                        </ProfileSection>
                    ) : (
                        <LoginButton onClick={() => setLoginOpen(true)}>Login / Register</LoginButton>
                    )}
                </NavLinks>
                <MenuToggle onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    ☰
                </MenuToggle>
            </NavContainer>
            {loginOpen && <Login onClose={() => setLoginOpen(false)} />}
        </>
    );
};

export default Navbar;
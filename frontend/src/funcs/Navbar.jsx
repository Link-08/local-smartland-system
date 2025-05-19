import { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "./AuthContext";
import { NavContainer, Logo, Smartland, System, NavLinks, NavItem, LoginButton, MenuToggle, ProfileSection, DropdownItem, Dropdown } from "./NavbarStyles";
import Login from "./Login";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = ({ navigateTo, currentPage }) => {
    const { user, logout } = useContext(AuthContext);
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

    // Define menu items based on user role
    const getMenuItems = () => {
        if (!user) {
            return ["Home"];
        }

        switch (user.role) {
            case 'buyer':
                return ["Buyer Dashboard", "SpecList", "Listings", "Map"];
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
        if ((page === "speclist" || page === "listings") && user?.role !== "buyer") {
            return; // Prevent navigation for non-buyers
        }
        navigateTo(page);
        setMenuOpen(false);
    };

    const handleSettings = () => {
        navigateTo("settings");
        setDropdownOpen(false);
    };

    // Role-based redirection after login
    const handleLoginSuccess = (user) => {
        if (user.role === 'admin') {
            navigateTo('admin');
        } else if (user.role === 'buyer') {
            navigateTo('listings');
        } else if (user.role === 'seller') {
            navigateTo('seller dashboard');
        } else {
            navigateTo('home');
        }
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigateTo('home');
    };

    return (
        <>
            <NavContainer>
                <Logo onClick={() => navigateTo("home")}>
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
            {loginOpen && <Login onClose={() => setLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />}
        </>
    );
};

export default Navbar;
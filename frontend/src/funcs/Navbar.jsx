import { useState, useContext } from "react";
import AuthContext from "./AuthContext";
import { NavContainer, Logo, Smartland, System, NavLinks, NavItem, LoginButton, MenuToggle, ProfileSection, DropdownItem, Dropdown } from "./NavbarStyles";
import Login from "./Login";

import { FaCircleUser } from "react-icons/fa6";

const menuItems = ["Home", "Buyer Dashboard", "Seller Dashboard", "SpecList", "Listings", "Map"];

const Navbar = ({ navigateTo, currentPage }) => {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSettings = () => {
        navigateTo("settings");
        setDropdownOpen(false);
    };

    const handleYourListings = () => {
        navigateTo("listings");
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        if (currentPage === 'admin') {
            navigateTo('home');
        }
    };

    return (
        <>
            <NavContainer>
                <Logo onClick={() => navigateTo("home")}>
                    <Smartland>SMARTLAND</Smartland>
                    <System>SYSTEM</System>
                </Logo>
                <NavLinks $menuOpen={menuOpen}>
                    {menuItems.map((item) => (
                        <NavItem key={item} onClick={() => navigateTo(item.toLowerCase())}>
                            {item}
                        </NavItem>
                    ))}
                    {user?.role === 'admin' && (
                        <NavItem onClick={() => navigateTo("admin")}>
                            Admin
                        </NavItem>
                    )}
                    {user ? (
                        <ProfileSection>
                            <FaCircleUser 
                                size={32} 
                                onClick={() => setDropdownOpen(!dropdownOpen)} 
                                style={{ cursor: "pointer", color: "#fff" }} 
                            />
                            {dropdownOpen && (
                                <Dropdown>
                                    <DropdownItem onClick={handleSettings}>Settings</DropdownItem>
                                    {user.role === 'seller' && (
                                        <DropdownItem onClick={handleYourListings}>Your Listings</DropdownItem>
                                    )}
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
import { useState, useContext } from "react";
import AuthContext from "./AuthContext";
import { NavContainer, Logo, Smartland, System, NavLinks, NavItem, LoginButton, MenuToggle, ProfileSection, DropdownItem, Dropdown } from "./NavbarStyles";
import Login from "./Login";

import { FaCircleUser } from "react-icons/fa6";

const menuItems = ["Home", "About", "Admin", "Map"];

const Navbar = ({ navigateTo }) => {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <>
            <NavContainer>
                <Logo onClick={() => navigateTo("home")}>
                    <Smartland>SMARTLAND</Smartland>
                    <System>SYSTEM</System>
                </Logo>
                <NavLinks menuOpen={menuOpen}>
                    {menuItems.map((item, index) => (
                        <NavItem key={index} onClick={() => navigateTo(item.toLowerCase())}>
                            {item}
                        </NavItem>
                    ))}
                    {user ? (
                        <ProfileSection>
                            <FaCircleUser 
                                size={32} 
                                onClick={() => setDropdownOpen(!dropdownOpen)} 
                                style={{ cursor: "pointer", color: "#fff" }} 
                            />
                            {dropdownOpen && (
                                <Dropdown>
                                    <DropdownItem>Settings</DropdownItem>
                                    <DropdownItem>Your Listings</DropdownItem>
                                    <DropdownItem onClick={logout}>Logout</DropdownItem>
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
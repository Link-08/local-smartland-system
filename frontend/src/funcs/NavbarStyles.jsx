import styled from "styled-components";

export const NavContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #223d3c;
    padding: 1rem 2rem;
    color: white;
    font-family: "Telegraf", sans-serif;
    box-sizing: border-box;
    z-index: 1000;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

export const Logo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Gatwick", sans-serif;
    font-weight: bold;
`;

export const Smartland = styled.span`
    font-size: 1.2rem;
`;

export const System = styled.span`
    font-size: 0.9rem;
    font-family: "Telegraf", sans-serif;
    text-align: center;
    width: 100%;
`;

export const NavLinks = styled.div`
    display: flex;
    gap: 4rem;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        position: absolute;
        top: 80px;
        right: 0;
        background: #223d3c;
        width: 100%;
        padding: 1rem;
        transform: ${({ $menuOpen }) => ($menuOpen ? "translateX(0)" : "translateX(100%)")};
        transition: transform 0.3s ease-in-out;
    }
`;

export const NavItem = styled.span`
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`;

export const LoginButton = styled.button`
    background: rgba(255, 251, 240, 0.5);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-family: "Telegraf", sans-serif;
    font-size: 1rem;
    border-radius: 8px;
    
    &:hover {
        opacity: 0.8;
    }
`;

export const MenuToggle = styled.div`
    display: none;
    font-size: 2rem;
    cursor: pointer;

    @media (max-width: 768px) {
        display: block;
    }
`;

export const ProfileSection = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 1001;
`;

export const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`;

export const Dropdown = styled.div`
    position: absolute;
    top: 45px;
    right: 0;
    background: #fff;
    color: #000;
    padding: 8px 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    min-width: 180px;
    z-index: 1002;
    animation: dropdownFadeIn 0.2s ease-in-out;

    @keyframes dropdownFadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        top: 70px;
        right: 16px;
        width: calc(100% - 32px);
        max-width: 300px;
    }
`;

export const DropdownItem = styled.p`
    padding: 10px 16px;
    margin: 0;
    cursor: pointer;
    font-size: 0.95rem;
    color: #333;
    transition: all 0.2s ease;
    
    &:hover {
        background: #f5f5f5;
        color: #223d3c;
    }

    &:active {
        background: #e8e8e8;
    }
`;

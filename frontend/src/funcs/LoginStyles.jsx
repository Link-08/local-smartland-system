import styled from "styled-components";

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
`;

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: row;
    background: #2a2a2a;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 700px;
    color: white;
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;


export const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 1rem;
`;


export const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: #fffbf0; /* Light beige to contrast gray */
    text-align: center;
    margin-bottom: 1rem;
`;

export const Input = styled.input`
    width: 100%;
    max-width: 250px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
`;

export const Button = styled.button`
    width: 100%; /* Matches input width */
    max-width: 250px; /* Restricts excessive width */
    padding: 0.7rem;
    background: #fffbf0;
    color: black;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem auto 0 auto; /* Centers the button horizontally */
    text-align: center;

    &:hover {
        opacity: 0.8;
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

export const FooterNote = styled.p`
    font-size: 0.85rem;
    color: #666;
    margin-top: 1rem;
    text-align: center;
`;

export const Divider = styled.div`
    width: 2px;
    background-color: rgba(255, 255, 255, 0.5);
    height: 100%;
    align-self: stretch;
    margin: 0 1.5rem;
`;

export const RadioGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
`;

export const RadioInput = styled.input`
    margin-right: 5px;
`;

export const CheckboxGroup = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
`;

export const CheckboxInput = styled.input`
    margin-right: 5px;
`;

export const ErrorText = styled.p`
    color: red;
    text-align: center;
    font-weight: bold;
    margin-top: -5px;
    font-size: 0.9rem;
`;
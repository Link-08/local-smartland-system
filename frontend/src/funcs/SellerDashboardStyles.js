import styled from 'styled-components';

export const SellerDashboardStyles = {
    FormInput: styled.input`
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.3s ease;

        &:focus {
            outline: none;
            border-color: #0a69a8;
        }

        &.error {
            border-color: #e74c3c;
        }
    `,

    ErrorMessage: styled.div`
        color: #e74c3c;
        font-size: 12px;
        margin-top: 4px;
    `,

    AvatarUploadButton: styled.button`
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 16px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 12px;
        width: 100%;

        &:hover {
            background-color: #e9ecef;
        }

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #0a69a8;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `,

    FormActions: styled.div`
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #eee;
    `,

    FormCancelButton: styled.button`
        padding: 8px 16px;
        background-color: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: #e9ecef;
        }
    `,

    FormSubmitButton: styled.button`
        padding: 8px 16px;
        background-color: #0a69a8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background-color: #085a8f;
        }

        &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `,

    ModalOverlay: styled.div`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `,

    ModalContainer: styled.div`
        background: white;
        border-radius: 8px;
        padding: 24px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    `,

    ModalHeader: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `,

    ModalTitle: styled.h2`
        margin: 0;
        font-size: 20px;
        color: #2c3e50;
    `,

    ModalCloseButton: styled.button`
        background: none;
        border: none;
        font-size: 24px;
        color: #666;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        border-radius: 4px;

        &:hover {
            background-color: #f0f0f0;
        }
    `,

    CopyButton: styled.button`
        background: none;
        border: none;
        padding: 4px;
        margin-left: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
            background-color: #f0f0f0;
        }
    `,

    ProfileTabsContainer: styled.div`
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        border-bottom: 1px solid #eee;
        padding-bottom: 16px;
    `,

    ProfileTab: styled.button`
        background: none;
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        color: ${props => props.$active ? '#0a69a8' : '#666'};
        cursor: pointer;
        border-bottom: 2px solid ${props => props.$active ? '#0a69a8' : 'transparent'};
        transition: all 0.2s;

        &:hover {
            color: #0a69a8;
        }
    `,

    ProfileTabContent: styled.div`
        display: ${props => props.$active ? 'block' : 'none'};
    `,

    AvatarUploadSection: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;
    `,

    AvatarPreview: styled.div`
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 16px;
        border: 2px solid #eee;
    `,

    FormRow: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
    `,

    FormGroup: styled.div`
        margin-bottom: 16px;
    `,

    FormLabel: styled.label`
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #2c3e50;
        font-weight: 500;
    `,
}; 
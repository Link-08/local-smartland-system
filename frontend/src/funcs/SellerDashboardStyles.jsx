import styled from 'styled-components';

export const SellerDashboardStyles = {
    // Modal components
    ModalOverlay: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    `,

    ModalContainer: styled.div`
    background-color: #34495E;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow: auto;
    padding: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    color: #ecf0f1;
    `,

    ModalHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    `,

    ModalTitle: styled.h2`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #ecf0f1;
    `,
        
    ModalCloseButton: styled.button`
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #ecf0f1;
        
        &:hover {
            color: #e74c3c;
        }
    `,

    FormTextarea: styled.textarea`
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        min-height: 80px;
        
        &:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
        }
    `,
    
    // Form elements
    FormGroup: styled.div`
    margin-bottom: 20px;
    width: 100%;
    `,

    FormLabel: styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #ecf0f1;
    `,

    FormInput: styled.input`
    width: calc(100% - 2px);
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #2C3E50;
    background-color: #34495E;
    color: #ecf0f1;
    font-size: 16px;
    transition: border 0.2s ease;
    box-sizing: border-box;
    margin: 0;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    &::placeholder {
        color: #7f8c8d;
    }
    `,

    FormSelect: styled.select`
    width: calc(100% - 2px);
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #2C3E50;
    background-color: #34495E;
    color: #ecf0f1;
    font-size: 16px;
    transition: border 0.2s ease;
    box-sizing: border-box;
    margin: 0;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    `,

    CropSelectContainer: styled.div`
        width: calc(100% - 2px);
        min-height: 46px;
        border-radius: 6px;
        border: 1px solid #2C3E50;
        background-color: #34495E;
        color: #ecf0f1;
        padding: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        box-sizing: border-box;
        margin: 0;
    `,

    CropTag: styled.div`
        display: inline-flex;
        align-items: center;
        background-color: #3498db;
        color: #ecf0f1;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 14px;
        gap: 6px;
    `,

    CropTagRemove: styled.span`
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        
        &:hover {
            color: #e74c3c;
        }
    `,

    CropSelectDropdown: styled.select`
        width: calc(100% - 2px);
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #2C3E50;
        background-color: #34495E;
        color: #ecf0f1;
        font-size: 16px;
        transition: border 0.2s ease;
        box-sizing: border-box;
        margin: 0 0 8px 0;
        
        &:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
    `,
    
    // Layout elements
    FormRow: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
    width: 100%;
    `,

    FormActions: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    `,

    FormCancelButton: styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background-color: #7f8c8d;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #95a5a6;
    }
    `,

    FormSubmitButton: styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background-color: #3498db;
    color: white;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #2980b9;
    }
    `,
    
    // Copy Account ID Button
    CopyButton: styled.button`
        background: #f0f0f0;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 8px;
        padding: 3px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: #e0e0e0;
        }
    `,
    
    // Profile Tab Components for Edit Profile Modal
    ProfileTabsContainer: styled.div`
    display: flex;
    border-bottom: 1px solid #2C3E50;
    margin-bottom: 24px;
    `,

    ProfileTab: styled.div`
    padding: 12px 24px;
    cursor: pointer;
    font-weight: ${props => props.$active ? '600' : '400'};
    color: ${props => props.$active ? '#3498db' : '#bdc3c7'};
    border-bottom: 2px solid ${props => props.$active ? '#3498db' : 'transparent'};
    transition: all 0.2s ease;

    &:hover {
        color: #3498db;
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
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #3498db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 16px;
        border: 4px solid rgba(52, 152, 219, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    `,
    
    AvatarImage: styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
    `,
    
    AvatarUploadButton: styled.label`
        padding: 8px 16px;
        border-radius: 6px;
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        color: #2C3E50;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: #e0e0e0;
        }
        
        input {
            display: none;
        }
    `,

    // Add these to your SellerDashboardStyles object
    ToolContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    `,

    ToolSection: styled.div`
    background-color: rgba(52, 73, 94, 0.05);
    border-radius: 8px;
    padding: 16px;
    `,

    ToolSectionTitle: styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #dddddd;
    margin-top: 0;
    margin-bottom: 12px;
    `,

    ToolGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    `,

    ToolCard: styled.div`
    background-color: #34495E;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `,

    ToolCardTitle: styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #ecf0f1;
    margin-top: 0;
    margin-bottom: 8px;
    `,

    ToolCardValue: styled.div`
    font-size: ${props => props.large ? '28px' : '18px'};
    font-weight: ${props => props.bold ? '700' : '500'};
    color: ${props => props.color || '#ecf0f1'};
    margin-bottom: 4px;
    `,

    RangeSlider: styled.input`
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: #2C3E50;
    outline: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    }

    &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
    }
    `,

    CheckboxGroup: styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 12px 0;
    `,

    Checkbox: styled.div`
    display: flex;
    align-items: center;
    color: #ecf0f1;

    input {
    margin-right: 6px;
    }

    label {
    cursor: pointer;
    }
    `,

    ToolResultBox: styled.div`
    background-color: rgba(52, 152, 219, 0.1);
    border-left: 4px solid #3498db;
    padding: 16px;
    margin-top: 16px;
    border-radius: 0 8px 8px 0;
    `,

    InsightCard: styled.div`
    background-color: ${props => props.$bgColor || 'rgba(52, 152, 219, 0.1)'};
    border-left: 4px solid ${props => props.$accentColor || '#3498db'};
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 0 8px 8px 0;
    `,

    ActivityIcon: styled.div`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${props => props.$bgColor || '#3498db'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$iconColor || 'white'};
    margin-right: 12px;
    `,

    TipCard: styled.div`
    background-color: ${props => props.$bgColor || 'rgba(52, 152, 219, 0.1)'};
    border-left: 4px solid ${props => props.$accentColor || '#3498db'};
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 0 8px 8px 0;
    `,

    TipTitle: styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #dddddd;
    margin-top: 0;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    `,

    TipText: styled.div`
    font-size: 14px;
    color: #dddddd;
    margin: 0;
    line-height: 1.5;
    `,

    StatCardTrend: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: ${props => props.$isPositive ? '#2ecc71' : '#e74c3c'};
    `,

    Tab: styled.div`
        padding: 8px 16px;
        cursor: pointer;
        font-weight: ${props => props.$active ? '600' : '400'};
        color: ${props => props.$active ? '#3498db' : '#7f8c8d'};
        border-bottom: 2px solid ${props => props.$active ? '#3498db' : 'transparent'};
        transition: all 0.2s ease;

        &:hover {
            color: #3498db;
        }
    `,

    ActionButton: styled.button`
        padding: ${props => props.$small ? '6px 12px' : '8px 16px'};
        border-radius: 6px;
        border: none;
        background-color: ${props => props.$primary ? '#3498db' : '#f0f0f0'};
        color: ${props => props.$primary ? 'white' : '#2C3E50'};
        font-size: ${props => props.$small ? '13px' : '14px'};
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
            background-color: ${props => props.$primary ? '#2980b9' : '#e0e0e0'};
        }
    `,

    ProfileButton: styled.button`
        padding: 10px 20px;
        border-radius: 6px;
        border: none;
        background-color: ${props => props.$primary ? '#3498db' : '#f0f0f0'};
        color: ${props => props.$primary ? 'white' : '#2C3E50'};
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
            background-color: ${props => props.$primary ? '#2980b9' : '#e0e0e0'};
        }
    `,

    // Improved Modal Styles
    ImprovedModalContainer: styled.div`
    background: linear-gradient(135deg, #34495E 0%, #2C3E50 100%);
    border-radius: 16px;
    width: 95%;
    max-width: 900px;
    max-height: 95vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    color: #ecf0f1;
    position: relative;
    `,

    ImprovedModalHeader: styled.div`
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    `,

    ImprovedModalTitle: styled.h2`
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 12px;
    `,

    ImprovedModalCloseButton: styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #ffffff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
        transition: all 0.2s ease;
        
        &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
    `,

    ImprovedModalContent: styled.div`
    padding: 32px;
    overflow-y: auto;
    max-height: calc(95vh - 120px);
    `,

    FormSection: styled.div`
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    `,

    FormSectionTitle: styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: #3498db;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    `,

    ImageUploadSection: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;
    border: 2px dashed rgba(52, 152, 219, 0.3);
    border-radius: 12px;
    background: rgba(52, 152, 219, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
        border-color: rgba(52, 152, 219, 0.6);
        background: rgba(52, 152, 219, 0.1);
    }
    
    &.has-image {
        border-color: #27ae60;
        background: rgba(39, 174, 96, 0.1);
    }
    `,

    ImagePreview: styled.div`
    width: 200px;
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    position: relative;
    `,

    ImagePreviewImg: styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    `,

    ImageUploadButton: styled.label`
    padding: 12px 24px;
    border-radius: 8px;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    border: none;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
    }
    
    input {
        display: none;
    }
    `,

    ImageUploadText: styled.div`
    text-align: center;
    color: #bdc3c7;
    font-size: 14px;
    `,

    ImprovedFormInput: styled.input`
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #ecf0f1;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #3498db;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    &::placeholder {
        color: #95a5a6;
    }
    `,

    ImprovedFormSelect: styled.select`
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #ecf0f1;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #3498db;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    option {
        background: #2C3E50;
        color: #ecf0f1;
    }
    `,

    ImprovedFormTextarea: styled.textarea`
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #ecf0f1;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    resize: vertical;
    min-height: 120px;
    font-family: inherit;

    &:focus {
        outline: none;
        border-color: #3498db;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }

    &::placeholder {
        color: #95a5a6;
    }
    `,

    ImprovedFormActions: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    `,

    ImprovedFormCancelButton: styled.button`
    padding: 14px 28px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #ecf0f1;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.3);
    }
    `,

    ImprovedFormSubmitButton: styled.button`
    padding: 14px 28px;
    border-radius: 8px;
    border: none;
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(39, 174, 96, 0.4);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
    `,

    LoadingSpinner: styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s ease-in-out infinite;
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    `,

    AmenitiesGrid: styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 12px;
    `,

    AmenityCheckbox: styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
    font-size: 14px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    input {
        margin-right: 8px;
        accent-color: #3498db;
    }
    `,
    }

export default SellerDashboardStyles;
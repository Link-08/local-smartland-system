import styled from 'styled-components';

export const ListingStyles = {
    PageWrapper: styled.div`
        width: 100vw;
        min-height: 100vh;
        display: flex;
        margin-top: 80px;
        flex-direction: column;
        background-color: #2C3E50;
        box-sizing: border-box;
        overflow-x: hidden;
    `,

    NavContainer: styled.nav`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        height: 80px;
        background-color: #2C3E50;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        flex-shrink: 0;
        
        @media (max-width: 768px) {
            padding: 0 16px;
        }
    `,

    Logo: styled.div`
        display: flex;
        flex-direction: column;
    `,

    PrimeEstate: styled.span`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
    `,

    Tagline: styled.span`
        font-size: 12px;
        color: #bdc3c7;
    `,

    NavLinks: styled.div`
        display: flex;
        gap: 24px;
        
        @media (max-width: 768px) {
            display: none; /* Hide on mobile - would need a hamburger menu implementation */
        }
    `,

    NavItem: styled.a`
        color: #ecf0f1;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 4px;

        &:hover {
        background-color: #34495E;
        }
    `,

    ProfileSection: styled.div`
        display: flex;
        align-items: center;
        gap: 16px;
    `,

    ActionButton: styled.button`
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;

        &:hover {
        background-color: #2980b9;
        }
    `,

    ListingContainer: styled.div`
        width: 100vw;
        padding: 24px;
        flex: 1;
        box-sizing: border-box;
        
        @media (max-width: 768px) {
            padding: 16px;
        }
    `,

    BreadcrumbNav: styled.div`
        font-size: 14px;
        color: #bdc3c7;
        margin-bottom: 24px;
    `,

    BreadcrumbLink: styled.a`
        color: #3498db;
        text-decoration: none;
        margin: 0 4px;

        &:hover {
        text-decoration: underline;
        }
    `,

    BreadcrumbCurrent: styled.span`
        color: #bdc3c7;
        margin-left: 4px;
    `,

    ListingHeader: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
        
        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    TitleSection: styled.div`
        flex: 1;
        min-width: 300px;
    `,

    ListingTitle: styled.h1`
        font-size: 32px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 8px 0;
    `,

    ListingLocation: styled.div`
        font-size: 16px;
        color: #bdc3c7;
    `,

    PriceSection: styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        
        @media (max-width: 768px) {
            align-items: flex-start;
        }
    `,

    ListingPrice: styled.div`
        font-size: 32px;
        font-weight: bold;
        color: #2ecc71;
    `,

    PriceUnit: styled.div`
        font-size: 14px;
        color: #bdc3c7;
    `,

    ContentGrid: styled.div`
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 24px;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    `,

    MainContent: styled.div`
        display: flex;
        flex-direction: column;
        gap: 32px;
    `,

    ImageGallery: styled.div`
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        background-color: #34495E;
    `,

    MainImage: styled.img`
        width: 100%;
        height: 500px;
        object-fit: cover;
        display: block;
        
        @media (max-width: 768px) {
            height: 300px;
        }
    `,

    PrevButton: styled.button`
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        
        &:hover {
            background: rgba(0, 0, 0, 0.7);
        }
    `,

    NextButton: styled.button`
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        
        &:hover {
            background: rgba(0, 0, 0, 0.7);
        }
    `,

    ThumbnailsContainer: styled.div`
        display: flex;
        gap: 8px;
        padding: 16px;
        overflow-x: auto;
    `,

    Thumbnail: styled.img`
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid ${props => props.active ? '#3498db' : 'transparent'};
        
        &:hover {
            border-color: #3498db;
        }
    `,

    Section: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    SectionTitle: styled.h2`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    PropertySpecs: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
    `,

    SpecItem: styled.div`
        display: flex;
        flex-direction: column;
        gap: 4px;
    `,

    SpecLabel: styled.div`
        font-size: 14px;
        color: #bdc3c7;
    `,

    SpecValue: styled.div`
        font-size: 16px;
        color: #ecf0f1;
    `,

    Description: styled.p`
        font-size: 16px;
        line-height: 1.6;
        color: #ecf0f1;
        margin: 0;
    `,

    AmenitiesList: styled.ul`
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
    `,

    AmenityItem: styled.li`
        font-size: 16px;
        color: #ecf0f1;
        display: flex;
        align-items: center;
        gap: 8px;
        
        &:before {
            content: "✓";
            color: #2ecc71;
        }
    `,

    RestrictionsList: styled.ul`
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,

    RestrictionItem: styled.li`
        font-size: 16px;
        color: #ecf0f1;
        display: flex;
        align-items: center;
        gap: 8px;
        
        &:before {
            content: "•";
            color: #e74c3c;
        }
    `,

    MapContainer: styled.div`
        width: 100%;
        height: 400px;
        background-color: #2C3E50;
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: hidden;
        position: relative;
        
        .leaflet-container {
            width: 100%;
            height: 100%;
            z-index: 1;
        }
    `,

    MapPlaceholder: styled.div`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #bdc3c7;
        font-style: italic;
    `,

    Address: styled.div`
        font-size: 16px;
        color: #ecf0f1;
        display: flex;
        align-items: center;
        margin-top: 12px;
    `,

    Sidebar: styled.div`
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,

    SellerCard: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    SellerHeader: styled.div`
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
    `,

    SellerAvatar: styled.img`
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
    `,

    SellerInfo: styled.div`
        flex: 1;
    `,

    SellerName: styled.div`
        font-size: 18px;
        font-weight: bold;
        color: #ecf0f1;
        margin-bottom: 4px;
    `,

    SellerRating: styled.div`
        font-size: 16px;
        color: #f1c40f;
    `,

    RatingValue: styled.span`
        color: #bdc3c7;
        margin-left: 4px;
    `,

    SellerStats: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
    `,

    StatItem: styled.div`
        text-align: center;
    `,

    StatValue: styled.div`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
    `,

    StatLabel: styled.div`
        font-size: 14px;
        color: #bdc3c7;
    `,

    ContactButton: styled.button`
        width: 100%;
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        
        &:hover {
            background-color: #2980b9;
        }
    `,

    ActionCard: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    ActionTitle: styled.h3`
        font-size: 18px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    ActionButtons: styled.div`
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,

    ShareButton: styled.button`
        width: 100%;
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        
        &:hover {
            background-color: #2980b9;
        }
    `,

    SaveButton: styled.button`
        width: 100%;
        padding: 12px;
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        
        &:hover {
            background-color: #27ae60;
        }
    `,

    StatsCard: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    StatsTitle: styled.h3`
        font-size: 18px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    StatsGrid: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    `,

    StatBox: styled.div`
        text-align: center;
        padding: 16px;
        background-color: #2C3E50;
        border-radius: 4px;
    `,

    StatNumber: styled.div`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
    `,

    Footer: styled.footer`
        padding: 40px 24px;
        background-color: #1a2530;
        margin-top: auto;
    `,

    FooterContent: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    `,

    FooterLogo: styled.div`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
    `,

    FooterLinks: styled.div`
        display: flex;
        gap: 24px;
        flex-wrap: wrap;
        justify-content: center;
        
        @media (max-width: 768px) {
            gap: 16px;
            flex-direction: column;
            align-items: center;
        }
    `,

    FooterLink: styled.a`
        color: #bdc3c7;
        text-decoration: none;
        font-size: 14px;

        &:hover {
        color: #3498db;
        }
    `,

    Copyright: styled.div`
        font-size: 14px;
        color: #7f8c8d;
    `,

    ModalOverlay: styled.div`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `,

    ModalContent: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    `,

    ModalHeader: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    `,

    ModalTitle: styled.h2`
        font-size: 24px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0;
    `,

    CloseButton: styled.button`
        background: none;
        border: none;
        color: #bdc3c7;
        font-size: 24px;
        cursor: pointer;
        
        &:hover {
            color: #ecf0f1;
        }
    `,

    ContactForm: styled.form`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,

    FormGroup: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,

    Label: styled.label`
        font-size: 14px;
        color: #bdc3c7;
    `,

    Input: styled.input`
        padding: 12px;
        background-color: #2C3E50;
        border: 1px solid #34495E;
        border-radius: 4px;
        color: #ecf0f1;
        font-size: 16px;
        
        &:focus {
            outline: none;
            border-color: #3498db;
        }
    `,

    TextArea: styled.textarea`
        padding: 12px;
        background-color: #2C3E50;
        border: 1px solid #34495E;
        border-radius: 4px;
        color: #ecf0f1;
        font-size: 16px;
        resize: vertical;
        
        &:focus {
            outline: none;
            border-color: #3498db;
        }
    `,

    SendButton: styled.button`
        padding: 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        
        &:hover {
            background-color: #2980b9;
        }
    `,

    MobileMenuButton: styled.button`
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: #ecf0f1;
        cursor: pointer;
        
        @media (max-width: 768px) {
            display: block;
        }
    `,

    // Mobile Menu Component
    MobileMenu: styled.div`
        display: none;
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background-color: #2C3E50;
        padding: 16px;
        flex-direction: column;
        gap: 16px;
        z-index: 100;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        
        &.open {
            display: flex;
        }
    `,

    MobileNavItem: styled.a`
        color: #ecf0f1;
        font-size: 18px;
        font-weight: 500;
        text-decoration: none;
        padding: 12px 8px;
        border-bottom: 1px solid #34495E;
        
        &:last-child {
            border-bottom: none;
        }
    `,
};

export default ListingStyles;
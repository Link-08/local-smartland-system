import styled from 'styled-components';

export const ListingStyles = {
    PageWrapper: styled.div`
        width: 100%;
        min-height: 100vh;
        display: flex;
        margin-top: 80px;
        flex-direction: column;
        background-color: #2C3E50;
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
        margin: 0 auto;
        padding: 24px;
        flex: 1;
        
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

    GalleryControls: styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        pointer-events: none;
        
        @media (max-width: 480px) {
            padding: 0 8px;
        }
    `,

    // Base button style
    GalleryButtonBase: styled.button`
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 20px;
        pointer-events: auto;
        transition: background-color 0.2s ease;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
    `,
    
    // Left button positioned at left side
    GalleryLeftButton: styled.button`
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 20px;
        pointer-events: auto;
        transition: background-color 0.2s ease;
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);

        &:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
    `,
    
    // Right button positioned at right side
    GalleryRightButton: styled.button`
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 20px;
        pointer-events: auto;
        transition: background-color 0.2s ease;
        position: absolute;
        top: 50%;
        right: 45px;
        transform: translateY(-50%);

        &:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }
    `,

    ImageThumbnails: styled.div`
        display: flex;
        gap: 8px;
        padding: 16px;
        overflow-x: auto;
        
        @media (max-width: 480px) {
            padding: 8px;
            gap: 4px;
        }
    `,

    ThumbnailWrapper: styled.div`
        border: 2px solid ${props => props.active ? '#3498db' : 'transparent'};
        border-radius: 4px;
        overflow: hidden;
        width: 80px;
        height: 60px;
        flex-shrink: 0;
        
        @media (max-width: 480px) {
            width: 60px;
            height: 45px;
        }
    `,

    Thumbnail: styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
        transition: opacity 0.2s ease;

        &:hover {
        opacity: 0.8;
        }
    `,

    Section: styled.section`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
        
        @media (max-width: 768px) {
            padding: 16px;
        }
    `,

    SectionTitle: styled.h2`
        font-size: 20px;
        font-weight: 600;
        color: #ecf0f1;
        margin: 0 0 16px 0;
        padding-bottom: 12px;
        border-bottom: 1px solid #2C3E50;
    `,

    PropertySpecs: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
        
        @media (max-width: 480px) {
            grid-template-columns: 1fr 1fr;
        }
    `,

    SpecItem: styled.div``,

    SpecLabel: styled.div`
        font-size: 14px;
        color: #bdc3c7;
        margin-bottom: 4px;
    `,

    SpecValue: styled.div`
        font-size: 16px;
        font-weight: 500;
        color: #ecf0f1;
    `,

    Description: styled.p`
        font-size: 16px;
        line-height: 1.6;
        color: #ecf0f1;
        margin: 0;
    `,

    AmenitiesList: styled.ul`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        padding: 0;
        margin: 0;
        list-style-type: none;
        
        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    `,

    AmenityItem: styled.li`
        font-size: 16px;
        color: #ecf0f1;
        display: flex;
        align-items: center;

        &::before {
        content: "✓";
        color: #2ecc71;
        font-weight: bold;
        margin-right: 8px;
        }
    `,

    RestrictionsList: styled.ul`
        padding: 0 0 0 20px;
        margin: 0;
    `,

    RestrictionItem: styled.li`
        font-size: 16px;
        color: #ecf0f1;
        margin-bottom: 8px;
        line-height: 1.5;

        &:last-child {
        margin-bottom: 0;
        }
    `,

    MapContainer: styled.div`
        width: 100%;
        height: 300px;
        background-color: #2C3E50;
        border-radius: 8px;
        margin-bottom: 16px;
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
        margin-bottom: 16px;
    `,

    SellerAvatar: styled.img`
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
    `,

    SellerInfo: styled.div``,

    SellerName: styled.div`
        font-size: 18px;
        font-weight: 600;
        color: #ecf0f1;
        margin-bottom: 4px;
    `,

    SellerRating: styled.div`
        color: #f1c40f;
        font-size: 14px;
    `,

    RatingValue: styled.span`
        color: #bdc3c7;
        margin-left: 4px;
    `,

    SellerStats: styled.div`
        display: flex;
        justify-content: space-around;
        margin-bottom: 16px;
    `,

    StatItem: styled.div`
        text-align: center;
    `,

    StatValue: styled.div`
        font-size: 18px;
        font-weight: 600;
        color: #ecf0f1;
    `,

    StatLabel: styled.div`
        font-size: 12px;
        color: #bdc3c7;
    `,

    ContactButton: styled.button`
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        transition: background-color 0.2s ease;

        &:hover {
        background-color: #27ae60;
        }
    `,

    ActionCard: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    ActionTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    ActionButtons: styled.div`
        display: flex;
        flex-direction: column;
        gap: 12px;
    `,

    ShareButton: styled.button`
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.2s ease;

        &:hover {
        background-color: #2980b9;
        }
    `,

    SaveButton: styled.button`
        background-color: #9b59b6;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.2s ease;

        &:hover {
        background-color: #8e44ad;
        }
    `,

    StatsCard: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        padding: 24px;
    `,

    StatsTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    StatsGrid: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    `,

    StatBox: styled.div`
        background-color: #2C3E50;
        padding: 16px;
        border-radius: 4px;
        text-align: center;
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
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `,

    ModalContent: styled.div`
        background-color: #34495E;
        border-radius: 8px;
        width: 500px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        color: #ecf0f1;
        
        @media (max-width: 480px) {
            padding: 16px;
            width: 100%;
        }
    `,

    ModalHeader: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    `,

    ModalTitle: styled.h2`
        font-size: 20px;
        margin: 0;
        color: #ecf0f1;
    `,

    CloseButton: styled.button`
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #ecf0f1;
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
        width: 100%;
        padding: 12px 16px;
        border-radius: 4px;
        border: 1px solid #2C3E50;
        background-color: #2C3E50;
        color: #ecf0f1;
        font-size: 16px;
        box-sizing: border-box;

        &::placeholder {
        color: #7f8c8d;
        }

        &:focus {
        outline: none;
        border-color: #3498db;
        }
    `,

    TextArea: styled.textarea`
        width: 100%;
        padding: 12px 16px;
        border-radius: 4px;
        border: 1px solid #2C3E50;
        background-color: #2C3E50;
        color: #ecf0f1;
        font-size: 16px;
        resize: vertical;
        box-sizing: border-box;

        &::placeholder {
        color: #7f8c8d;
        }

        &:focus {
        outline: none;
        border-color: #3498db;
        }
    `,

    SendButton: styled.button`
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        transition: background-color 0.2s ease;

        &:hover {
        background-color: #27ae60;
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
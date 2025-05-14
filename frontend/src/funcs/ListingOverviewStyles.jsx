import styled from 'styled-components';

export const ListingOverviewStyles = {
    // Main layout components
    PageWrapper: styled.div`
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #2C3E50;
        overflow-x: hidden;
        position: relative;
        max-width: 100vw;
    `,

    ProfileSection: styled.div`
        display: flex;
        align-items: center;
        gap: 16px;

        @media (max-width: 768px) {
        gap: 8px;
        }
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
        display: flex;
        align-items: center;
        transition: all 0.2s ease;

        &:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
        padding: 8px 12px;
        font-size: 13px;
        }
    `,

    // Main container
    MainContainer: styled.main`
        padding: 0 5%;
        margin: 100px auto 40px;
        width: 100vw;
        max-width: 100vw;
        box-sizing: border-box;
        position: relative; // Added to establish stacking context
        z-index: 0; // Base z-index for content

        @media (max-width: 768px) {
            padding: 0 4%;
            margin: 90px auto 20px;
        }
    `,

    // Page header
    PageHeader: styled.div`
        margin-bottom: 32px;
        text-align: center;
    `,

    PageTitle: styled.h1`
        font-size: 32px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;

        @media (max-width: 768px) {
        font-size: 28px;
        }
    `,

    PageDescription: styled.p`
        font-size: 16px;
        color: #7f8c8d;
        margin: 0 auto;

        @media (max-width: 768px) {
        font-size: 14px;
        }
    `,

    // Filters section
    FiltersContainer: styled.div`
        background-color: #fff;
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        width: 100%;
        box-sizing: border-box; // Added to include padding in width calculation
        max-width: 100%; // Added to prevent overflow
        position: relative; // Added to control stacking context
        z-index: 1; // Lower z-index than navigation but still above other content
    `,

    FilterTitle: styled.h2`
        font-size: 18px;
        font-weight: 600;
        color: #7f8c8d;
        display: flex;
        align-items: center;
    `,

    FilterGroup: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        margin-bottom: 16px; // Added margin-bottom for better spacing
    `,

    FilterLabel: styled.label`
        font-size: 14px;
        font-weight: 600;
        color: #34495E;
        display: flex;
        align-items: center;
    `,

    FilterSelect: styled.select`
        padding: 10px 16px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        background-color: #f8f9fa;
        font-size: 14px;
        color: #2C3E50;
        width: 100%;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232C3E50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 32px;

        &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
    `,

    RangeContainer: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        box-sizing: border-box;
    `,

    RangeInput: styled.input`
        padding: 10px 16px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        background-color: #f8f9fa;
        font-size: 14px;
        color: #2C3E50;
        flex: 1;
        box-sizing: border-box;
        width: 100%; // Added width
        min-width: 0; // Prevent flex items from overflowing
        margin: 0; // Reset margin
        height: 40px; // Fixed height for consistency

        &:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        &::placeholder {
            color: #bdc3c7;
        }
        
        // Fix for number input appearance
        &[type="number"] {
            -moz-appearance: textfield; // Firefox
        }
        
        &[type="number"]::-webkit-inner-spin-button,
        &[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    `,

    RangeSeparator: styled.span`
        color: #7f8c8d;
        font-size: 14px;
        margin: 0 4px;
        flex-shrink: 0;
        line-height: 1;
    `,

    CheckboxContainer: styled.div`
        display: flex;
        flex-direction: column;
        gap: 10px;
    `,

    CheckboxGroup: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
    `,
    
    FilterInput: styled.input`
        width: 18px;
        height: 18px;
        accent-color: #3498db;
        cursor: pointer;
    `,

    CheckboxLabel: styled.label`
        font-size: 14px;
        color: #2C3E50;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
    `,

    ButtonsContainer: styled.div`
        display: flex;
        gap: 16px;
        margin-top: 24px;

        @media (max-width: 576px) {
        flex-direction: column;
        }
    `,

    ApplyFilterButton: styled.button`
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;

        &:hover {
        background-color: #2980b9;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    `,

    ClearFilterButton: styled.button`
        background-color: #f8f9fa;
        color: #2C3E50;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;

        &:hover {
        background-color: #e0e0e0;
        }
    `,

    // Results controls
    ResultControls: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
        position: relative; // Added position
        z-index: 0; // Added z-index
        
        @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        }
    `,

    ResultCount: styled.div`
        font-size: 16px;
        color: white;
    `,

    ResultHighlight: styled.span`
        font-weight: 600;
    `,

    SortContainer: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    SortLabel: styled.span`
        font-size: 14px;
        color: white;
    `,

    SortSelect: styled.select`
        padding: 8px 32px 8px 12px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        background-color: #f8f9fa;
        font-size: 14px;
        color: #2C3E50;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232C3E50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;

        &:focus {
        outline: none;
        border-color: #3498db;
        }
    `,

    ViewToggle: styled.div`
        display: flex;
        background-color: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        overflow: hidden;
    `,

    ViewButton: styled.button`
        background-color: ${props => props.active ? '#3498db' : 'transparent'};
        color: ${props => props.active ? 'white' : '#7f8c8d'};
        border: none;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        transition: all 0.2s ease;

        &:hover {
        background-color: ${props => props.active ? '#3498db' : '#e0e0e0'};
        }
    `,

    // Listings grid
    GridContainer: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;

        @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
    `,

    // Listings list
    ListContainer: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,

    // Listing card (Grid view)
    ListingCard: styled.div`
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
    `,

    // Listing card (List view)
    ListingCardHorizontal: styled.div`
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        display: flex;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            flex-direction: column;
        }
    `,

    ListingImageContainer: styled.div`
        position: relative;
        height: 200px;
        overflow: hidden;
        
        .image-carousel {
            height: 100%;
            width: 100%;
            position: relative;
        }
        
        .image-counter {
            position: absolute;
            bottom: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            z-index: 2;
        }
        
        .carousel-controls {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1;
            
            &:hover {
                opacity: 1;
            }
        }
        
        .carousel-button {
            background: rgba(0, 0, 0, 0.5);
            color: white;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            border: none;
            margin: 0 12px;
            transition: all 0.2s ease;
            
            &:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }
        }
        
        .carousel-indicators {
            position: absolute;
            bottom: 12px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 6px;
            z-index: 2;
        }
        
        .indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            
            &.active {
                background: white;
                transform: scale(1.2);
            }
        }
    `,

    ListingImageContainerHorizontal: styled.div`
        position: relative;
        overflow: hidden;
        flex-shrink: 0;

        @media (max-width: 768px) {
        width: 100% !important;
        }
    `,

    ListingImage: styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        ${() => ListingOverviewStyles.ListingCard}:hover &, 
        ${() => ListingOverviewStyles.ListingCardHorizontal}:hover & {
        transform: scale(1.05);
    `,

    ListingBadge: styled.div`
        position: absolute;
        top: 12px;
        left: ${props => props.type === 'featured' ? '12px' : 'auto'};
        right: ${props => props.type !== 'featured' ? '12px' : 'auto'};
        background-color: ${props => props.type === 'featured' ? '#f39c12' : '#2ecc71'};
        color: white;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        z-index: 1;
    `,

    ListingContent: styled.div`
        padding: 20px;
    `,

    ListingContentHorizontal: styled.div`
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;

        @media (min-width: 769px) {
        flex-direction: row;
        }

        & > div:first-child {
        flex: 1;
        margin-right: 16px;
        }

        & > div:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 150px;

        @media (max-width: 768px) {
            margin-top: 16px;
        }
        }
    `,

    ListingTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 8px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    `,

    ListingLocation: styled.div`
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
    `,

    ListingPrice: styled.div`
        font-size: 20px;
        font-weight: 700;
        color: #2ecc71;
        margin-bottom: 16px;
    `,

    ListingSpecs: styled.div`
        display: flex;
        gap: 24px;
        margin-bottom: 16px;
    `,

    ListingSpecItem: styled.div`
        display: flex;
        flex-direction: column;
    `,

    SpecValue: styled.div`
        font-size: 16px;
        font-weight: 600;
        color: #2C3E50;
        display: flex;
        align-items: center;
    `,

    SpecLabel: styled.div`
        font-size: 12px;
        color: #7f8c8d;
        margin-top: 2px;
    `,

    ListingTags: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    `,

    ListingTag: styled.div`
        background-color: #f8f9fa;
        color: #34495E;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
    `,

    ListingFooter: styled.div`
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: auto;
    `,

    ListingSellerInfo: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
    `,

    SellerAvatar: styled.img`
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
    `,

    SellerName: styled.div`
        font-size: 14px;
        color: #2C3E50;
    `,

    ListingDate: styled.div`
        font-size: 12px;
        color: #7f8c8d;
        display: flex;
        align-items: center;
    `,

    // Pagination
    PaginationContainer: styled.div`
        display: flex;
        justify-content: center;
        margin-top: 40px;
        margin-bottom: 20px;
    `,

    PaginationControls: styled.div`
        display: flex;
        gap: 8px;
    `,

    PaginationButton: styled.button`
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        border: none;
        cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
        background-color: ${props => props.active ? '#3498db' : '#fff'};
        color: ${props => props.active ? '#fff' : props.disabled ? '#bdc3c7' : '#2C3E50'};
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        opacity: ${props => props.disabled ? 0.6 : 1};
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
        background-color: ${props => props.active ? '#2980b9' : '#f8f9fa'};
        }
    `,

    // Empty state
    EmptyState: styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        text-align: center;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    `,

    EmptyStateIcon: styled.div`
        font-size: 48px;
        margin-bottom: 16px;
    `,

    EmptyStateTitle: styled.h3`
        font-size: 20px;
        font-weight: 600;
        color: #2C3E50;
        margin-bottom: 8px;
    `,

    EmptyStateText: styled.p`
        font-size: 16px;
        color: #7f8c8d;
        margin-bottom: 24px;
        max-width: 400px;
    `,

    EmptyStateButton: styled.button`
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
        background-color: #2980b9;
        }
    `,

    // Footer
    Footer: styled.footer`
        background-color: #2C3E50;
        padding: 40px 0;
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
    `,

    FooterLink: styled.a`
        color: #bdc3c7;
        text-decoration: none;
        font-size: 14px;
        transition: color 0.2s ease;

        &:hover {
        color: #3498db;
        }
    `,

    Copyright: styled.div`
        font-size: 14px;
        color: #7f8c8d;
    `,

    // Filter grid container for more organized filters
    FiltersGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        width: 100%;
        position: relative; // Added position
        z-index: 0; // Added z-index
    `,

    // Added responsive helper
    ResponsiveRow: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        width: 100%;
        
        @media (max-width: 768px) {
        flex-direction: column;
        }
    `,

    // Added filter header with close button
    FilterHeader: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        width: 100%;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 16px;
    `,

    // Close button for filters
    CloseButton: styled.button`
        background: none;
        border: none;
        font-size: 20px;
        color: #7f8c8d;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;
        
        &:hover {
        color: #e74c3c;
        }
    `,

    // Featured listings section
    FeaturedSection: styled.div`
        margin-bottom: 40px;
    `,

    FeaturedTitle: styled.h2`
        font-size: 24px;
        font-weight: 700;
        color: #2C3E50;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;

        &::before {
        content: '';
        display: block;
        width: 24px;
        height: 4px;
        background-color: #f39c12;
        border-radius: 2px;
        }
    `,

    // Animation for cards
    AnimatedCard: styled.div`
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        
        &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
    `,

    // Improved badge
    EnhancedBadge: styled.div`
        position: absolute;
        top: 12px;
        left: ${props => props.position === 'left' ? '12px' : 'auto'};
        right: ${props => props.position === 'right' ? '12px' : 'auto'};
        background-color: ${props => 
        props.type === 'featured' ? '#f39c12' : 
        props.type === 'new' ? '#3498db' : 
        props.type === 'irrigated' ? '#2ecc71' : 
        '#e74c3c'};
        color: white;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1;
    `,

    // Quick action buttons
    QuickActions: styled.div`
        position: absolute;
        bottom: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.3s ease;

        ${() => ListingOverviewStyles.ListingCard}:hover &, 
        ${() => ListingOverviewStyles.ListingCardHorizontal}:hover & {
        opacity: 1;
    `,

    QuickActionButton: styled.button`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
        color: #2C3E50;
        
        &:hover {
        background-color: #f8f9fa;
        transform: scale(1.1);
        }
    `,

    SearchContainer: styled.div`
        display: flex;
        width: 100%;
        margin-bottom: 24px;
        max-width: 95%;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        background: rgba(44, 62, 80, 0.5);
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(8px);
        
        @media (max-width: 768px) {
            padding: 12px;
            flex-direction: column;
        }
    `,

    SearchInput: styled.input`
        flex: 1;
        padding: 14px 16px;
        border-radius: 8px 0 0 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 16px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
        transition: all 0.2s ease;
        
        &:focus {
            outline: none;
            border-color: #3498db;
            background-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
        }
        
        &::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        @media (max-width: 768px) {
            border-radius: 8px;
            margin-bottom: 10px;
        }
    `,

    SearchButton: styled.button`
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        border: none;
        border-radius: 0 8px 8px 0;
        padding: 14px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(41, 128, 185, 0.4);
        
        &:hover {
            background: linear-gradient(135deg, #2980b9, #2573a7);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(41, 128, 185, 0.5);
        }
        
        &:active {
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            border-radius: 8px;
            width: 100%;
        }
    `,

    HeroBanner: styled.div`
        position: relative;
        width: 100%;
        margin-bottom: 32px;
        padding: 40px 0;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.8), rgba(44, 62, 80, 0.9));
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('/images/farm-pattern.png') repeat;
            opacity: 0.1;
            z-index: 0;
        }
        
        @media (max-width: 768px) {
            padding: 30px 16px;
        }
    `,

    HeroTitle: styled.h1`
        font-size: 35px;
        color: white;
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        
        @media (max-width: 768px) {
            font-size: 26px;
        }
    `,

    HeroSubtitle: styled.p`
        font-size: 18px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 32px;
        position: relative;
        z-index: 1;
        
        @media (max-width: 768px) {
            font-size: 16px;
            margin-bottom: 24px;
        }
    `,

    CategoriesNav: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #fff;
        border-radius: 8px;
        margin-bottom: 24px;
        overflow-x: auto;
        padding: 0 16px;
        width: 100%;
        box-sizing: border-box;
        justify-content: space-between;

        @media (max-width: 768px) {
            flex-direction: column;
            padding: 0;
        }
    `,

    CategoryItem: styled.button`
        background: none;
        border: none;
        color: ${props => props.active ? '#3498db' : '#fff'};
        font-weight: ${props => props.active ? '600' : '400'};
        font-size: 16px;  // Adjust font size for better readability
        padding: 12px 16px;  // Adjust padding for mobile
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        white-space: nowrap;
        width: 100%;  // Make buttons full width in the stacked layout

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: ${props => props.active ? '80%' : '0%'};
            height: 3px;
            background-color: #3498db;
            transition: all 0.2s ease;
        }

        &:hover {
            color: #3498db;

            &:after {
                width: 80%;
            }
        }

        @media (max-width: 768px) {
            font-size: 14px;  // Slightly smaller font size for mobile
            padding: 10px;  // Adjust padding for mobile
            margin-bottom: 10px;

            &:hover {
                &:after {
                    width: 30%;
                }
            }

            &:after {
                width: ${props => props.active ? '30%' : '0%'};
            }
        }
    `,
};

export default ListingOverviewStyles;
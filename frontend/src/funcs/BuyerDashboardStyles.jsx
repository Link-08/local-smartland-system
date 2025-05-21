// Import the existing styles
import { ListingOverviewStyles } from './ListingOverviewStyles';
import styled from 'styled-components';

// Create Dashboard specific styles extending from existing ones
export const DashboardStyles = {
    ...ListingOverviewStyles,
    
    // Dashboard specific styles
    DashboardContainer: styled.div`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: #2C3E50;
        overflow-x: hidden;
        position: relative;
        width: 100vw;
    `,
    
    DashboardHeader: styled.header`
        background-color: #34495e;
        padding: 16px 5%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    `,
    
    HeaderContent: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    
    HeaderLogo: styled.div`
        font-size: 24px;
        font-weight: 700;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
    `,
    
    HeaderActions: styled.div`
        display: flex;
        align-items: center;
        gap: 16px;
    `,
    
    ProfileDropdown: styled.div`
        position: relative;
        cursor: pointer;
    `,
    
    ProfileImage: styled.div`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #3498db;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        border: 2px solid #fff;
    `,
    
    ProfileMenu: styled.div`
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 220px;
        z-index: 1000;
        overflow: hidden;
        display: ${props => props.isOpen ? 'block' : 'none'};
    `,
    
    ProfileMenuItem: styled.div`
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #2C3E50;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
        background-color: #f8f9fa;
        color: #3498db;
        }
        
        &:not(:last-child) {
        border-bottom: 1px solid #f1f1f1;
        }
    `,
    
    NotificationBadge: styled.div`
        position: relative;
        cursor: pointer;
        
        &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 8px;
        height: 8px;
        background-color: #e74c3c;
        border-radius: 50%;
        display: ${props => props.hasNotifications ? 'block' : 'none'};
        }
    `,
    
    DashboardContent: styled.div`
        margin-top: 80px;
        padding: 20px 5%;
        flex: 1;
    `,
    
    WelcomeSection: styled.div`
        padding: 24px;
        background: linear-gradient(135deg, #3498db, #2980b9);
        border-radius: 12px;
        margin-bottom: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        
        &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30%;
        height: 100%;
        background-image: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1189&q=80');
        background-size: cover;
        background-position: center;
        opacity: 0.2;
        z-index: 0;
        }
    `,
    
    WelcomeContent: styled.div`
        position: relative;
        z-index: 1;
        width: 70%;
        
        @media (max-width: 768px) {
        width: 100%;
        }
    `,
    
    WelcomeTitle: styled.h1`
        font-size: 24px;
        font-weight: 700;
        color: white;
        margin-bottom: 8px;
    `,
    
    WelcomeText: styled.p`
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 24px;
    `,
    
    QuickActionsContainer: styled.div`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin-bottom: 30px;
        
        @media (max-width: 992px) {
            grid-template-columns: repeat(2, 1fr);
        }
        
        @media (max-width: 576px) {
            grid-template-columns: 1fr;
        }
    `,
    
    QuickActionCard: styled.div`
        background-color: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
    `,
    
    QuickActionIcon: styled.div`
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: ${props => props.$accentColor || '#3498db'};
        background-color: ${props => props.$bgColor || 'rgba(52, 152, 219, 0.1)'};
    `,
    
    QuickActionTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0;
    `,
    
    QuickActionDescription: styled.p`
        font-size: 14px;
        color: #7f8c8d;
        margin: 0;
    `,
    
    ActionLink: styled.div`
        display: flex;
        align-items: center;
        gap: 8px;
        color: #3498db;
        font-size: 14px;
        font-weight: 600;
        margin-top: auto;
        
        &:hover {
        text-decoration: underline;
        }
    `,
    
    SectionTitle: styled.h2`
        font-size: 20px;
        font-weight: 600;
        color: white;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    `,
    
    GridContainer: styled.div`
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
        
        @media (max-width: 992px) {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
        }
    `,
    
    SavedPropertiesSection: styled.div`
        margin-bottom: 24px;
    `,
    
    ViewAllLink: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
        color: #3498db;
        font-size: 14px;
        cursor: pointer;
        margin-left: auto;
        
        &:hover {
        text-decoration: underline;
        }
    `,
    
    TabsContainer: styled.div`
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 8px;
    `,
    
    Tab: styled.div`
        padding: 8px 16px;
        cursor: pointer;
        position: relative;
        color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
        font-weight: ${props => props.$active ? '600' : '400'};
        
        &::after {
        content: '';
        position: absolute;
        bottom: -9px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: ${props => props.$active ? '#3498db' : 'transparent'};
        border-radius: 3px 3px 0 0;
        transition: all 0.2s ease;
        }
        
        &:hover {
        color: white;
        }
    `,
    
    StatCard: styled.div`
        background-color: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
    `,
    
    StatCardTitle: styled.h3`
        font-size: 16px;
        font-weight: 600;
        color: #7f8c8d;
        margin: 0 0 12px 0;
    `,
    
    StatCardValue: styled.div`
        font-size: 24px;
        font-weight: 700;
        color: #2C3E50;
        margin-bottom: 4px;
    `,
    
    StatCardTrend: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: ${props => props.isPositive ? '#2ecc71' : '#e74c3c'};
    `,
    
    RecentActivitySection: styled.div`
        background-color: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    `,
    
    RecentActivityTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 16px 0;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f1f1;
    `,
    
    ActivityList: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `,
    
    ActivityItem: styled.div`
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f8f9fa;
    `,
    
    ActivityIcon: styled.div`
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${props => props.$bgColor || 'rgba(52, 152, 219, 0.1)'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${props => props.$iconColor || '#3498db'};
        flex-shrink: 0;
    `,
    
    ActivityContent: styled.div`
        flex: 1;
    `,
    
    ActivityTitle: styled.h4`
        font-size: 14px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 4px 0;
    `,
    
    ActivityTime: styled.p`
        font-size: 12px;
        color: #7f8c8d;
        margin: 0;
    `,
    
    PropertyCard: styled.div`
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        margin-bottom: 16px;
        
        &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
    `,
    
    PropertyImageContainer: styled.div`
        width: 30%;
        min-width: 150px;
        max-width: 250px;
        height: auto;
        position: relative;
        overflow: hidden;
        
        @media (max-width: 768px) {
        width: 100%;
        height: 200px;
        }
    `,
    
    PropertyImage: styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        
        ${() => DashboardStyles.PropertyCard}:hover & {
        transform: scale(1.05);
        }
    `,
    
    PropertyContent: styled.div`
        padding: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
    `,
    
    PropertyTitle: styled.h3`
        font-size: 16px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 8px 0;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    `,
    
    PropertyLocation: styled.div`
        font-size: 13px;
        color: #7f8c8d;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
    `,
    
    PropertyPrice: styled.div`
        font-size: 18px;
        font-weight: 700;
        color: #2ecc71;
        margin-bottom: 12px;
    `,
    
    PropertySpecs: styled.div`
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
    `,
    
    PropertySpec: styled.div`
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #7f8c8d;
    `,
    
    PropertyActions: styled.div`
        display: flex;
        justify-content: space-between;
        margin-top: auto;
    `,
    
    ProfileSection: styled.div`
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        margin-bottom: 24px;
    `,
    
    ProfileHeader: styled.div`
        padding: 24px;
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        text-align: center;
    `,
    
    ProfileAvatarLarge: styled.div`
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #3498db;
        font-size: 36px;
        font-weight: 600;
        margin: 0 auto 16px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `,
    
    ProfileName: styled.h2`
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 4px 0;
    `,
    
    ProfileRole: styled.p`
        font-size: 14px;
        opacity: 0.9;
        margin: 0;
    `,
    
    ProfileDetails: styled.div`
        padding: 24px;
    `,
    
    ProfileDetailItem: styled.div`
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f1f1f1;
        
        &:last-child {
        border-bottom: none;
        }
    `,
    
    ProfileDetailLabel: styled.div`
        font-size: 14px;
        color: #7f8c8d;
        font-weight: 500;
    `,
    
    ProfileDetailValue: styled.div`
        font-size: 14px;
        color: #2C3E50;
        font-weight: 600;
    `,
    
    ProfileActions: styled.div`
        padding: 0 24px 24px;
        display: flex;
        gap: 12px;
    `,
    
    ProfileButton: styled.button`
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: ${props => props.primary ? '#0a69a8' : '#f0f0f0'};
        color: ${props => props.primary ? 'white' : '#333'};
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: ${props => props.primary ? '#095a8f' : '#e0e0e0'};
        }
    `,
    
    MarketInsightsSection: styled.div`
        background-color: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 24px;
    `,
    
    InsightsTitle: styled.h3`
        font-size: 18px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 16px 0;
    `,
    
    InsightCard: styled.div`
        padding: 16px;
        border-radius: 8px;
        background-color: #f8f9fa;
        margin-bottom: 12px;
        border-left: 4px solid ${props => props.$accentColor || '#3498db'};
    `,
    
    InsightTitle: styled.h4`
        font-size: 16px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 8px 0;
    `,
    
    InsightText: styled.p`
        font-size: 14px;
        color: #7f8c8d;
        margin: 0;
        line-height: 1.5;
    `,
    
    CompareSection: styled.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
    `,
    
    CompareRow: styled.div`
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding-bottom: 12px;
        
        &::-webkit-scrollbar {
        height: 6px;
        }
        
        &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
        }
        
        &::-webkit-scrollbar-thumb {
        background: #bdc3c7;
        border-radius: 10px;
        }
        
        &::-webkit-scrollbar-thumb:hover {
        background: #95a5a6;
        }
    `,
    
    CompareCard: styled.div`
        min-width: 250px;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
    `,
    
    CompareCardHeader: styled.div`
        height: 100px;
        position: relative;
        overflow: hidden;
    `,
    
    CompareCardImage: styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
    `,
    
    CompareCardContent: styled.div`
        padding: 16px;
    `,
    
    CompareCardTitle: styled.h4`
        font-size: 14px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0 0 8px 0;
    `,
    
    CompareCardPrice: styled.div`
        font-size: 16px;
        font-weight: 700;
        color: #2ecc71;
        margin-bottom: 8px;
    `,
    
    CompareCardSpecs: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
    `,
    
    CompareCardSpec: styled.div`
        display: flex;
        justify-content: space-between;
        font-size: 12px;
    `,
    
    CompareCardSpecLabel: styled.span`
        color: #7f8c8d;
    `,
    
    CompareCardSpecValue: styled.span`
        color: #2C3E50;
        font-weight: 500;
    `,
    
    DashboardFooter: styled.footer`
        margin-top: auto;
        background-color: #34495e;
        padding: 24px 0;
        text-align: center;
    `,
    
    FooterText: styled.p`
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
    `,
    
    BadgeCount: styled.span`
        background-color: #e74c3c;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 4px;
    `,
    
    LoginButton: styled(ListingOverviewStyles.ActionButton)`
        margin-left: 12px;
    `,
    
    NotificationContainer: styled.div`
        position: relative;
    `,
    
    NotificationDropdown: styled.div`
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 320px;
        z-index: 1000;
        overflow: hidden;
        display: ${props => props.isOpen ? 'block' : 'none'};
        
        @media (max-width: 400px) {
        width: 280px;
        right: -100px;
        }
    `,
    
    NotificationHeader: styled.div`
        padding: 12px 16px;
        border-bottom: 1px solid #f1f1f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `,
    
    NotificationTitle: styled.h3`
        font-size: 16px;
        font-weight: 600;
        color: #2C3E50;
        margin: 0;
    `,
    
    NotificationMarkRead: styled.span`
        font-size: 12px;
        color: #3498db;
        cursor: pointer;
        
        &:hover {
        text-decoration: underline;
        }
    `,
    
    NotificationList: styled.div`
        max-height: 360px;
        overflow-y: auto;
        
        &::-webkit-scrollbar {
        width: 6px;
        }
        
        &::-webkit-scrollbar-track {
        background: #f1f1f1;
        }
        
        &::-webkit-scrollbar-thumb {
        background: #bdc3c7;
        border-radius: 10px;
        }
        
        &::-webkit-scrollbar-thumb:hover {
        background: #95a5a6;
        }
    `,
    
    NotificationItem: styled.div`
        padding: 12px 16px;
        display: flex;
        gap: 12px;
        border-bottom: 1px solid #f1f1f1;
        background-color: ${props => props.unread ? 'rgba(52, 152, 219, 0.05)' : 'transparent'};
        cursor: pointer;
        
        &:hover {
        background-color: #f8f9fa;
        }
    `,
    
    NotificationIcon: styled.div`
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: ${props => props.bgColor || 'rgba(52, 152, 219, 0.1)'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${props => props.iconColor || '#3498db'};
        flex-shrink: 0;
    `,
    
    NotificationContent: styled.div`
        flex: 1;
    `,
    
    NotificationMessage: styled.p`
        font-size: 14px;
        color: #2C3E50;
        margin: 0 0 4px 0;
    `,
    
    NotificationTimestamp: styled.span`
        font-size: 12px;
        color: #7f8c8d;
    `,
    
    NotificationFooter: styled.div`
        padding: 12px 16px;
        text-align: center;
        border-top: 1px solid #f1f1f1;
    `,
    
    NotificationViewAll: styled.span`
        font-size: 14px;
        color: #3498db;
        cursor: pointer;
        
        &:hover {
        text-decoration: underline;
        }
    `,
    
    UnreadIndicator: styled.div`
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #3498db;
        margin-left: auto;
    `,

    SuitableCrops: styled.div`
        margin-top: 10px;
        font-size: 0.9rem;
        color: #666;
        display: flex;
        align-items: center;
        line-height: 1.4;
    `,

    // Edit Profile Modal Styles
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

    ProfileTabsContainer: styled.div`
        display: flex;
        border-bottom: 1px solid rgba(236, 240, 241, 0.1);
        padding: 0 24px;
    `,

    ProfileTab: styled.button`
        padding: 12px 24px;
        background: none;
        border: none;
        border-bottom: 2px solid ${props => props.$active ? '#3498db' : 'transparent'};
        color: ${props => props.$active ? '#3498db' : 'rgba(236, 240, 241, 0.6)'};
        font-weight: ${props => props.$active ? '600' : '400'};
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            color: #3498db;
        }
    `,

    ProfileTabContent: styled.div`
        padding: 24px;
        display: ${props => props.$active ? 'block' : 'none'};
    `,

    FormRow: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
    `,

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

    FormActions: styled.div`
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid rgba(236, 240, 241, 0.1);
    `,

    FormCancelButton: styled.button`
        padding: 8px 16px;
        border: 1px solid #2C3E50;
        border-radius: 4px;
        background-color: transparent;
        color: #ecf0f1;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: rgba(236, 240, 241, 0.1);
        }
    `,

    FormSubmitButton: styled.button`
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: #3498db;
        color: white;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: #2980b9;
        }
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
        background-color: #2C3E50;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ecf0f1;
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 16px;
        border: 4px solid rgba(52, 152, 219, 0.3);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
        background-color: #2C3E50;
        border: 1px solid #34495E;
        color: #ecf0f1;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        margin-bottom: 16px;
        &:hover {
            background-color: #34495E;
        }
        input {
            display: none;
        }
    `,
};

export default DashboardStyles;
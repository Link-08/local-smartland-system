import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: 'Arial', sans-serif;
        background-color: #2C3E50;
        color: #ecf0f1;
    }

    #root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

export const HomeStyles = {
    HomeWrapper: styled.div`
        width: auto;
        min-height: 100vh;
    	margin-top: 80px;
        display: flex;
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

    HeroSection: styled.section`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 40px 80px;
        background-color: #34495E;
        min-height: 500px;
    `,

    HeroContent: styled.div`
        flex: 1;
    `,

    HeroTitle: styled.h1`
        font-size: 48px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    HeroSubtitle: styled.h2`
        font-size: 24px;
        font-weight: normal;
        color: #3498db;
        margin: 0 0 16px 0;
    `,

    HeroDescription: styled.p`
        font-size: 16px;
        line-height: 1.6;
        color: #bdc3c7;
        margin: 0 0 32px 0;
    `,

    ExploreButton: styled.button`
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 16px 32px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
        background-color: #27ae60;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    `,

    HeroImageContainer: styled.div`
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 600px;
    `,

    HeroImage: styled.img`
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    `,

    FeaturesSection: styled.section`
        padding: 80px 80px;
        background-color: #2C3E50;
        
        @media (max-width: 1024px) {
        padding: 40px 24px;
        }
    `,

    SectionTitle: styled.h2`
        font-size: 32px;
        font-weight: bold;
        color: #ecf0f1;
        text-align: center;
        margin-bottom: 48px;
    `,

    FeaturesGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
    `,

    FeatureCard: styled.div`
        background-color: #34495E;
        padding: 32px 24px;
        border-radius: 8px;
        text-align: center;
        transition: all 0.2s ease;

        &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
    `,

    FeatureIcon: styled.div`
        font-size: 48px;
        margin-bottom: 16px;
    `,

    FeatureTitle: styled.h3`
        font-size: 20px;
        font-weight: bold;
        color: #ecf0f1;
        margin: 0 0 16px 0;
    `,

    FeatureText: styled.p`
        font-size: 16px;
        color: #bdc3c7;
        line-height: 1.5;
    `,

    CTASection: styled.section`
        padding: 80px 24px;
        background-color: #3498db;
        text-align: center;
    `,

    CTAContent: styled.div`
        max-width: 600px;
        margin: 0 auto;
    `,

    CTATitle: styled.h2`
        font-size: 36px;
        font-weight: bold;
        color: white;
        margin: 0 0 16px 0;
    `,

    CTAText: styled.p`
        font-size: 18px;
        color: #ecf0f1;
        margin: 0 0 32px 0;
    `,

    CTAButton: styled.button`
        background-color: #2C3E50;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 16px 32px;
        cursor: pointer;
        font-size: 18px;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
        background-color: #34495E;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
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
};

export default HomeStyles;
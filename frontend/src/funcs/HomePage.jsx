import React from 'react';
import { HomeStyles } from './HomePageStyles';

// Method 2: Remove useNavigate and use regular anchor links or window.location
const HomePage = () => {
    const handleExploreClick = () => {
        window.location.href = '/listings';
    };

    return (
        <HomeStyles.HomeWrapper>
            <HomeStyles.HeroSection>
                <HomeStyles.HeroContent>
                <HomeStyles.HeroTitle>Find Your Perfect Lot</HomeStyles.HeroTitle>
                <HomeStyles.HeroSubtitle>
                    Discover prime land opportunities for your next home or investment
                </HomeStyles.HeroSubtitle>
                <HomeStyles.HeroDescription>
                    Browse through our extensive collection of residential, commercial, and 
                    agricultural lots. Each listing comes with detailed specifications, location 
                    information, and direct contact with verified sellers.
                </HomeStyles.HeroDescription>
                <HomeStyles.ExploreButton onClick={handleExploreClick}>
                    Explore Available Lots
                </HomeStyles.ExploreButton>
                </HomeStyles.HeroContent>
                <HomeStyles.HeroImageContainer>
                <HomeStyles.HeroImage src="/api/placeholder/600/400" alt="Featured property" />
                </HomeStyles.HeroImageContainer>
            </HomeStyles.HeroSection>
            
            {/* Features section remains the same */}
            <HomeStyles.FeaturesSection>
                <HomeStyles.SectionTitle>Why Choose PrimeEstate?</HomeStyles.SectionTitle>
                <HomeStyles.FeaturesGrid>
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>🏡</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Verified Listings</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    All our lots are verified by our expert team to ensure accurate information
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>📍</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Prime Locations</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Discover lots in desirable neighborhoods with excellent amenities
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>💼</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Direct Contact</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Connect directly with property owners without intermediaries
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>📊</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Market Insights</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Get valuable information about property value trends in each area
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                </HomeStyles.FeaturesGrid>
            </HomeStyles.FeaturesSection>
            
            <HomeStyles.CTASection>
                <HomeStyles.CTAContent>
                <HomeStyles.CTATitle>Ready to Find Your Perfect Lot?</HomeStyles.CTATitle>
                <HomeStyles.CTAText>
                    Start browsing our exclusive collection of prime lots today
                </HomeStyles.CTAText>
                <HomeStyles.CTAButton onClick={handleExploreClick}>
                    View All Listings
                </HomeStyles.CTAButton>
                </HomeStyles.CTAContent>
            </HomeStyles.CTASection>
            
            <HomeStyles.Footer>
                <HomeStyles.FooterContent>
                <HomeStyles.FooterLogo>PrimeEstate</HomeStyles.FooterLogo>
                <HomeStyles.FooterLinks>
                    <HomeStyles.FooterLink href="/about">About Us</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/terms">Terms</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/privacy">Privacy</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/contact">Contact</HomeStyles.FooterLink>
                </HomeStyles.FooterLinks>
                <HomeStyles.Copyright>
                    © {new Date().getFullYear()} PrimeEstate. All rights reserved.
                </HomeStyles.Copyright>
                </HomeStyles.FooterContent>
            </HomeStyles.Footer>
        </HomeStyles.HomeWrapper>
    );
};

export default HomePage;
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
                <HomeStyles.HeroTitle>Find Your Perfect Agricultural Land</HomeStyles.HeroTitle>
                <HomeStyles.HeroSubtitle>
                    Discover prime farmland, ranch and agricultural opportunities for your next venture
                </HomeStyles.HeroSubtitle>
                <HomeStyles.HeroDescription>
                    Browse through our extensive collection of fertile farmland, ranches, orchards, and 
                    agricultural investments. Each listing comes with detailed soil analysis, water rights information, 
                    and direct contact with verified landowners.
                </HomeStyles.HeroDescription>
                <HomeStyles.ExploreButton onClick={handleExploreClick}>
                    Explore Available Farmland
                </HomeStyles.ExploreButton>
                </HomeStyles.HeroContent>
                <HomeStyles.HeroImageContainer>
                <HomeStyles.HeroImage src="/api/placeholder/600/400" alt="Featured agricultural property" />
                </HomeStyles.HeroImageContainer>
            </HomeStyles.HeroSection>
            
            {/* Features section remains the same */}
            <HomeStyles.FeaturesSection>
                <HomeStyles.SectionTitle>Why Choose Smartland?</HomeStyles.SectionTitle>
                <HomeStyles.FeaturesGrid>
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>🌾</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Verified Agricultural Listings</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    All our agricultural properties are verified by farming experts to ensure soil quality and water access
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>🚜</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Premium Farmland</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Discover productive land in fertile regions with excellent growing conditions
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>👨‍🌾</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Direct Owner Contact</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Connect directly with agricultural landowners without intermediaries
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                
                <HomeStyles.FeatureCard>
                    <HomeStyles.FeatureIcon>📊</HomeStyles.FeatureIcon>
                    <HomeStyles.FeatureTitle>Farming Insights</HomeStyles.FeatureTitle>
                    <HomeStyles.FeatureText>
                    Get valuable information about crop yields, climate data, and agricultural subsidies in each area
                    </HomeStyles.FeatureText>
                </HomeStyles.FeatureCard>
                </HomeStyles.FeaturesGrid>
            </HomeStyles.FeaturesSection>
            
            <HomeStyles.CTASection>
                <HomeStyles.CTAContent>
                <HomeStyles.CTATitle>Ready to Find Your Perfect Agricultural Property?</HomeStyles.CTATitle>
                <HomeStyles.CTAText>
                    Start browsing our exclusive collection of prime farmland, ranches and agricultural investments today
                </HomeStyles.CTAText>
                <HomeStyles.CTAButton onClick={handleExploreClick}>
                    View All Agricultural Listings
                </HomeStyles.CTAButton>
                </HomeStyles.CTAContent>
            </HomeStyles.CTASection>
            
            {/* <HomeStyles.Footer>
                <HomeStyles.FooterContent>
                <HomeStyles.FooterLogo>Smartland</HomeStyles.FooterLogo>
                <HomeStyles.FooterLinks>
                    <HomeStyles.FooterLink href="/about">About Us</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/terms">Terms</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/privacy">Privacy</HomeStyles.FooterLink>
                    <HomeStyles.FooterLink href="/contact">Contact</HomeStyles.FooterLink>
                </HomeStyles.FooterLinks>
                <HomeStyles.Copyright>
                    © {new Date().getFullYear()} Smartland. All rights reserved.
                </HomeStyles.Copyright>
                </HomeStyles.FooterContent>
            </HomeStyles.Footer> */}
        </HomeStyles.HomeWrapper>
    );
};

export default HomePage;
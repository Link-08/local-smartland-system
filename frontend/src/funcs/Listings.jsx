import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListingStyles } from './ListingsStyles';
import cabanatuanLots from './cabanatuanLots.json';

// Mock data for agricultural land in Cabanatuan
const mockListing = {
    id: 'lot-456',
    title: 'Prime Agricultural Land in Sangitan, Cabanatuan City',
    description: 'This fertile agricultural lot offers excellent growing conditions for various crops and fruit trees. Located in Barangay Sangitan, Cabanatuan City, this 3-hectare property features rich loamy soil, ideal for rice, corn, vegetables, or fruit orchards. The land comes with water rights from a nearby irrigation canal and has been previously used for rice farming with consistent yields. The property has good road access for farm equipment and transportation of produce to local markets. Cabanatuan Public Market is just 15 minutes away, and the property is located near other successful farms in the area. This is an excellent opportunity for both experienced farmers and agricultural investors looking to capitalize on Nueva Ecija\'s reputation as the "Rice Granary of the Philippines."',
    price: 2500000,
    size: '3 hectares',
    type: 'Agricultural',
    address: 'Purok 3, Barangay Sangitan, Cabanatuan City, Nueva Ecija',
    coordinates: { lat: 15.4875, lng: 120.9675 },
    amenities: ['Irrigation Access', 'Farm-to-Market Road', 'Electric Power Lines Nearby', 'Potable Water Source'],
    restrictions: ['Agricultural Use Only', 'No Residential Development Allowed', 'Must Follow Local Farming Regulations'],
    zoning: 'A-1 Agricultural',
    seller: {
        id: 'user-789',
        name: 'Ricardo Santos',
        profileImage: '/api/placeholder/40/40',
        rating: 4.7,
        listings: 8,
        memberSince: '2019-06-12'
    },
    images: [
        '/api/placeholder/800/500',
        '/api/placeholder/800/500',
        '/api/placeholder/800/500',
        '/api/placeholder/800/500'
    ],
    listedDate: '2024-04-15',
    views: 284,
    saved: 31,
    soilType: 'Loamy',
    previousCrops: ['Rice', 'Corn'],
    averageYield: '5.2 tons per hectare (rice)',
    waterSource: 'Irrigation canal + seasonal rainfall',
    topography: 'Mostly flat with slight slope for drainage'
};

const getSellerInfo = (sellerKey) => {
  // Example mapping, you can expand this as needed
  const sellerProfiles = {
    'real-estate.ph': {
      name: 'Real Estate PH',
      profileImage: '/api/placeholder/40/40',
      rating: 4.5,
      listings: 12,
      memberSince: '2018-01-01',
    },
    'dotproperty.com.ph': {
      name: 'Dot Property',
      profileImage: '/api/placeholder/40/40',
      rating: 4.2,
      listings: 7,
      memberSince: '2019-03-15',
    },
    'arealtyco.net': {
      name: 'A Realty Co.',
      profileImage: '/api/placeholder/40/40',
      rating: 4.0,
      listings: 5,
      memberSince: '2020-07-10',
    },
    'myproperty.ph': {
      name: 'MyProperty',
      profileImage: '/api/placeholder/40/40',
      rating: 4.3,
      listings: 9,
      memberSince: '2017-11-20',
    },
    'lamudi.com.ph': {
      name: 'Lamudi',
      profileImage: '/api/placeholder/40/40',
      rating: 4.6,
      listings: 15,
      memberSince: '2016-05-05',
    },
  };
  return sellerProfiles[sellerKey] || {
    name: sellerKey,
    profileImage: '/api/placeholder/40/40',
    rating: 4.0,
    listings: 1,
    memberSince: '2021-01-01',
  };
};

const ListingPage = ({ property }) => {
    const { id } = useParams();
    const lot = cabanatuanLots.find(l => l.name === (property?.title || mockListing.title));
    const sellerInfo = lot ? getSellerInfo(lot.seller) : mockListing.seller;
    const listing = {
        ...mockListing,
        ...property,
        ...(lot ? {
            title: lot.name,
            address: lot.location,
            price: lot.price_php,
            seller: sellerInfo,
        } : {}),
        images: (property && property.images && property.images.length > 0)
            ? property.images
            : mockListing.images
    };
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    
    const handlePrevImage = () => {
        setActiveImageIndex(prev => 
        prev === 0 ? listing.images.length - 1 : prev - 1
        );
    };
    
    const handleNextImage = () => {
        setActiveImageIndex(prev => 
        prev === listing.images.length - 1 ? 0 : prev + 1
        );
    };
    
    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };
    
    const handleShare = () => {
        // In a real app, implement share functionality
        alert('Share functionality would be implemented here');
    };
    
    const handleSave = () => {
        // In a real app, implement save functionality
        alert('Save functionality would be implemented here');
    };
    
    const handleContact = () => {
        setContactModalOpen(true);
    };
    
    const closeContactModal = () => {
        setContactModalOpen(false);
    };

    return (
        <ListingStyles.PageWrapper>
            <ListingStyles.ListingContainer>
                <ListingStyles.BreadcrumbNav>
                    <ListingStyles.BreadcrumbLink href="/">Home</ListingStyles.BreadcrumbLink> &gt; 
                    <ListingStyles.BreadcrumbLink href="/listings"> Agricultural Lots</ListingStyles.BreadcrumbLink> &gt; 
                    <ListingStyles.BreadcrumbCurrent> {listing.title}</ListingStyles.BreadcrumbCurrent>
                </ListingStyles.BreadcrumbNav>
                
                <ListingStyles.ListingHeader>
                    <ListingStyles.TitleSection>
                        <ListingStyles.ListingTitle>{listing.title}</ListingStyles.ListingTitle>
                        <ListingStyles.ListingLocation>{listing.address}</ListingStyles.ListingLocation>
                    </ListingStyles.TitleSection>
                    <ListingStyles.PriceSection>
                        <ListingStyles.ListingPrice>₱{listing.price && typeof listing.price === 'number' ? listing.price.toLocaleString() : ''}</ListingStyles.ListingPrice>
                        <ListingStyles.PriceUnit>PHP</ListingStyles.PriceUnit>
                    </ListingStyles.PriceSection>
                </ListingStyles.ListingHeader>
                
                <ListingStyles.ContentGrid>
                <ListingStyles.MainContent>
                    <ListingStyles.ImageGallery>
                    <ListingStyles.MainImage src={listing.images[activeImageIndex]} alt={`Image ${activeImageIndex + 1} of agricultural property`} />
                    <ListingStyles.GalleryControls>
                        <ListingStyles.GalleryLeftButton onClick={handlePrevImage}>&lt;</ListingStyles.GalleryLeftButton>
                        <ListingStyles.GalleryRightButton onClick={handleNextImage}>&gt;</ListingStyles.GalleryRightButton>
                    </ListingStyles.GalleryControls>
                    <ListingStyles.ImageThumbnails>
                        {listing.images.map((img, index) => (
                        <ListingStyles.ThumbnailWrapper key={index} active={index === activeImageIndex}>
                            <ListingStyles.Thumbnail 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`} 
                            onClick={() => handleThumbnailClick(index)}
                            />
                        </ListingStyles.ThumbnailWrapper>
                        ))}
                    </ListingStyles.ImageThumbnails>
                    </ListingStyles.ImageGallery>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Overview</ListingStyles.SectionTitle>
                    <ListingStyles.PropertySpecs>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Size</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.size}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Type</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.type}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Soil Type</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.soilType}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Zoning</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.zoning}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Listed</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>
                            {new Date(listing.listedDate).toLocaleDateString()}
                        </ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Water Source</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.waterSource}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                    </ListingStyles.PropertySpecs>
                    </ListingStyles.Section>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Description</ListingStyles.SectionTitle>
                    <ListingStyles.Description>{listing.description}</ListingStyles.Description>
                    </ListingStyles.Section>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Farm Details</ListingStyles.SectionTitle>
                    <ListingStyles.PropertySpecs>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Previous Crops</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.previousCrops.join(', ')}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Average Yield</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.averageYield}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Topography</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.topography}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                    </ListingStyles.PropertySpecs>
                    </ListingStyles.Section>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Amenities</ListingStyles.SectionTitle>
                    <ListingStyles.AmenitiesList>
                        {listing.amenities.map((amenity, index) => (
                        <ListingStyles.AmenityItem key={index}>{amenity}</ListingStyles.AmenityItem>
                        ))}
                    </ListingStyles.AmenitiesList>
                    </ListingStyles.Section>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Restrictions</ListingStyles.SectionTitle>
                    <ListingStyles.RestrictionsList>
                        {listing.restrictions.map((restriction, index) => (
                        <ListingStyles.RestrictionItem key={index}>{restriction}</ListingStyles.RestrictionItem>
                        ))}
                    </ListingStyles.RestrictionsList>
                    </ListingStyles.Section>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Location</ListingStyles.SectionTitle>
                    <ListingStyles.MapContainer>
                        {/* In a real app, this would be replaced with a proper map component */}
                        <ListingStyles.MapPlaceholder>
                        Map showing location at {listing.address}
                        </ListingStyles.MapPlaceholder>
                    </ListingStyles.MapContainer>
                    <ListingStyles.Address>{listing.address}</ListingStyles.Address>
                    </ListingStyles.Section>
                </ListingStyles.MainContent>
                
                <ListingStyles.Sidebar>
                    <ListingStyles.SellerCard>
                    <ListingStyles.SellerHeader>
                        <ListingStyles.SellerAvatar src={listing.seller.profileImage} alt={listing.seller.name} />
                        <ListingStyles.SellerInfo>
                        <ListingStyles.SellerName>{listing.seller.name}</ListingStyles.SellerName>
                        <ListingStyles.SellerRating>
                            {'★'.repeat(Math.round(listing.seller.rating))} 
                            <ListingStyles.RatingValue>({listing.seller.rating})</ListingStyles.RatingValue>
                        </ListingStyles.SellerRating>
                        </ListingStyles.SellerInfo>
                    </ListingStyles.SellerHeader>
                    <ListingStyles.SellerStats>
                        <ListingStyles.StatItem>
                        <ListingStyles.StatValue>{listing.seller.listings}</ListingStyles.StatValue>
                        <ListingStyles.StatLabel>Listings</ListingStyles.StatLabel>
                        </ListingStyles.StatItem>
                        <ListingStyles.StatItem>
                        <ListingStyles.StatValue>
                            {new Date(listing.seller.memberSince).getFullYear()}
                        </ListingStyles.StatValue>
                        <ListingStyles.StatLabel>Member Since</ListingStyles.StatLabel>
                        </ListingStyles.StatItem>
                    </ListingStyles.SellerStats>
                    <ListingStyles.ContactButton onClick={handleContact}>
                        Contact Seller
                    </ListingStyles.ContactButton>
                    </ListingStyles.SellerCard>
                    
                    <ListingStyles.ActionCard>
                    <ListingStyles.ActionTitle>Actions</ListingStyles.ActionTitle>
                    <ListingStyles.ActionButtons>
                        <ListingStyles.ShareButton onClick={handleShare}>
                        Share Listing
                        </ListingStyles.ShareButton>
                        <ListingStyles.SaveButton onClick={handleSave}>
                        Save to Favorites
                        </ListingStyles.SaveButton>
                    </ListingStyles.ActionButtons>
                    </ListingStyles.ActionCard>
                    
                    <ListingStyles.StatsCard>
                    <ListingStyles.StatsTitle>Listing Activity</ListingStyles.StatsTitle>
                    <ListingStyles.StatsGrid>
                        <ListingStyles.StatBox>
                        <ListingStyles.StatNumber>{listing.views}</ListingStyles.StatNumber>
                        <ListingStyles.StatLabel>Views</ListingStyles.StatLabel>
                        </ListingStyles.StatBox>
                        <ListingStyles.StatBox>
                        <ListingStyles.StatNumber>{listing.saved}</ListingStyles.StatNumber>
                        <ListingStyles.StatLabel>Saved</ListingStyles.StatLabel>
                        </ListingStyles.StatBox>
                    </ListingStyles.StatsGrid>
                    </ListingStyles.StatsCard>
                </ListingStyles.Sidebar>
                </ListingStyles.ContentGrid>
            </ListingStyles.ListingContainer>
            
            {contactModalOpen && (
                <ListingStyles.ModalOverlay>
                    <ListingStyles.ModalContent>
                        <ListingStyles.ModalHeader>
                        <ListingStyles.ModalTitle>Contact {listing.seller.name}</ListingStyles.ModalTitle>
                        <ListingStyles.CloseButton onClick={closeContactModal}>×</ListingStyles.CloseButton>
                        </ListingStyles.ModalHeader>
                        <ListingStyles.ContactForm>
                        <ListingStyles.FormGroup>
                            <ListingStyles.Label>Your Name</ListingStyles.Label>
                            <ListingStyles.Input type="text" placeholder="Enter your name" />
                        </ListingStyles.FormGroup>
                        <ListingStyles.FormGroup>
                            <ListingStyles.Label>Your Email</ListingStyles.Label>
                            <ListingStyles.Input type="email" placeholder="Enter your email" />
                        </ListingStyles.FormGroup>
                        <ListingStyles.FormGroup>
                            <ListingStyles.Label>Phone Number</ListingStyles.Label>
                            <ListingStyles.Input type="tel" placeholder="Enter your phone number" />
                        </ListingStyles.FormGroup>
                        <ListingStyles.FormGroup>
                            <ListingStyles.Label>Message</ListingStyles.Label>
                            <ListingStyles.TextArea 
                            placeholder="I'm interested in this agricultural property and would like more information about the soil conditions and irrigation access..."
                            rows={5}
                            />
                        </ListingStyles.FormGroup>
                        <ListingStyles.SendButton>Send Message</ListingStyles.SendButton>
                        </ListingStyles.ContactForm>
                    </ListingStyles.ModalContent>
                </ListingStyles.ModalOverlay>
            )}
        </ListingStyles.PageWrapper>
    );
};

export default ListingPage;
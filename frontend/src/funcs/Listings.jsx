import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ListingStyles } from './ListingsStyles';
import { formatPrice, formatDate } from './formatUtils';
import api from '../api';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaStar, FaList, FaRegCalendarAlt } from 'react-icons/fa';

const getSellerInfo = (sellerKey) => {
  // Example mapping, you can expand this as needed
  const sellerProfiles = {
    'seller': {
      name: 'Real Estate PH',
      profileImage: '/api/placeholder/40/40',
      rating: 4.5,
      listings: 12,
      memberSince: '2018-01-01',
    }
  };
  return sellerProfiles[sellerKey] || {
    name: 'Unknown Seller',
    profileImage: '/api/placeholder/40/40',
    rating: 0,
    listings: 0,
    memberSince: '2024-01-01',
  };
};

const ListingPage = ({ property }) => {
    const { id } = useParams();
    const [listing, setListing] = useState(property ? {
        ...property,
        images: property.images || [property.imageUrl || '/api/placeholder/800/500'],
        seller: {
            name: property.sellerName || 'Unknown Seller',
            profileImage: property.sellerAvatar || '/api/placeholder/40/40',
            rating: 0,
            listings: 0,
            memberSince: new Date().toISOString(),
        },
        amenities: property.amenities || [],
        restrictions: property.restrictions || [],
        views: property.views || 0,
        saved: property.saved || 0
    } : null);
    const [loading, setLoading] = useState(!property);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [contactModalOpen, setContactModalOpen] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/properties/${id}`);
                const propertyData = response.data;
                
                setListing({
                    ...propertyData,
                    images: propertyData.images || [propertyData.image || '/api/placeholder/800/500'],
                    seller: {
                        name: `${propertyData.seller?.firstName} ${propertyData.seller?.lastName}`,
                        profileImage: propertyData.seller?.avatar || '/api/placeholder/40/40',
                        rating: propertyData.seller?.rating || 0,
                        listings: propertyData.seller?.listings || 0,
                        memberSince: propertyData.seller?.memberSince || new Date().toISOString(),
                    },
                    amenities: propertyData.amenities || [],
                    restrictions: propertyData.restrictions || [],
                    views: propertyData.views || 0,
                    saved: propertyData.saved || 0
                });
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('Failed to load property details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we don't have property data and we have an ID
        if (!property && id) {
            fetchProperty();
        }
    }, [id, property]);
    
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
    
    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to save properties to favorites');
            return;
        }

        try {
            const response = await api.post(`/api/favorites/${listing.id}`);
            if (response.status === 201) {
                // Update the saved count in the UI
                setListing(prev => ({
                    ...prev,
                    saved: prev.saved + 1
                }));
                alert('Property saved to favorites');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert('Property is already in your favorites');
            } else if (error.response?.status === 401) {
                alert('Please log in to save properties to favorites');
            } else {
                console.error('Error saving property:', error);
                alert('Failed to save property to favorites');
            }
        }
    };
    
    const handleContact = () => {
        setContactModalOpen(true);
    };
    
    const closeContactModal = () => {
        setContactModalOpen(false);
    };

    if (loading) {
        return <div>Loading property details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!listing) {
        return <div>Property not found</div>;
    }

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
                        <ListingStyles.ListingLocation>{listing.location}</ListingStyles.ListingLocation>
                    </ListingStyles.TitleSection>
                    <ListingStyles.PriceSection>
                        <ListingStyles.ListingPrice>{formatPrice(listing.price)}</ListingStyles.ListingPrice>
                        <ListingStyles.PriceUnit>PHP</ListingStyles.PriceUnit>
                    </ListingStyles.PriceSection>
                </ListingStyles.ListingHeader>
                
                <ListingStyles.ContentGrid>
                <ListingStyles.MainContent>
                    <ListingStyles.ImageGallery>
                    <ListingStyles.MainImage src={listing.images[activeImageIndex] || listing.image} alt={listing.title} />
                    {listing.images.length > 1 && (
                        <>
                            <ListingStyles.PrevButton onClick={handlePrevImage}>
                                <FaChevronLeft />
                            </ListingStyles.PrevButton>
                            <ListingStyles.NextButton onClick={handleNextImage}>
                                <FaChevronRight />
                            </ListingStyles.NextButton>
                        </>
                    )}
                    <ListingStyles.ThumbnailsContainer>
                        {listing.images.map((image, index) => (
                        <ListingStyles.Thumbnail
                            key={index}
                            src={image}
                            alt={`${listing.title} - Image ${index + 1}`}
                            active={index === activeImageIndex}
                            onClick={() => handleThumbnailClick(index)}
                        />
                        ))}
                    </ListingStyles.ThumbnailsContainer>
                    </ListingStyles.ImageGallery>
                    
                    <ListingStyles.Section>
                    <ListingStyles.SectionTitle>Overview</ListingStyles.SectionTitle>
                    <ListingStyles.PropertySpecs>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Size</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.acres} hectares</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Type</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.category}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Water Rights</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.waterRights}</ListingStyles.SpecValue>
                        </ListingStyles.SpecItem>
                        <ListingStyles.SpecItem>
                        <ListingStyles.SpecLabel>Listed</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>
                            {formatDate(listing.datePosted)}
                        </ListingStyles.SpecValue>
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
                        <ListingStyles.SpecLabel>Suitable Crops</ListingStyles.SpecLabel>
                        <ListingStyles.SpecValue>{listing.suitableCrops}</ListingStyles.SpecValue>
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
                        <ListingStyles.MapPlaceholder>
                        Map showing location at {listing.location}
                        </ListingStyles.MapPlaceholder>
                    </ListingStyles.MapContainer>
                    <ListingStyles.Address>{listing.location}</ListingStyles.Address>
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
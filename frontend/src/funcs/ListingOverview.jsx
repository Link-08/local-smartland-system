import React, { useState, useEffect } from 'react';
import { ListingOverviewStyles as S } from './ListingOverviewStyles';
import { FaList, FaThLarge, FaSearch, FaFilter, FaHome, FaEye, FaStar, FaTree, FaTint, FaSeedling, FaMapMarkerAlt, FaRulerCombined, FaChevronLeft, FaChevronRight, FaAngleDown, FaRegCalendarAlt, FaTimes, FaUser, FaPhone, FaEnvelope, FaHeart, FaShare, FaCheck, FaWater, FaTractor, FaBuilding, FaChartBar, FaWarehouse, FaExclamationTriangle, FaMountain, FaCircleNotch } from 'react-icons/fa';
import { formatPrice, formatDate } from './formatUtils';
import api from '../api';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import barangaysData from './barangays.json';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ListingOverview = ({ navigateTo }) => {
    // Add CSS for loading animation
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    
    // State for filters and view
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('newest');
    
    // Modal state
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyModalOpen, setPropertyModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    
    // Filter states
    const [selectedBarangay, setSelectedBarangay] = useState('All Barangays');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sizeRange, setSizeRange] = useState({ min: '', max: '' });
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [selectedFruits, setSelectedFruits] = useState([]);
    const [hasIrrigation, setHasIrrigation] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // New filter states for additional property fields
    const [selectedPropertyType, setSelectedPropertyType] = useState('All Types');
    const [selectedTopography, setSelectedTopography] = useState('All Topography');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [hasRestrictions, setHasRestrictions] = useState(false);
    
    // Transform and enhance the property data
    const [listingsData, setListingsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [barangayOptions, setBarangayOptions] = useState(['All Barangays']);
    const [cropTypes, setCropTypes] = useState([]);
    const [fruitTypes, setFruitTypes] = useState([]);
    const [propertyTypeOptions, setPropertyTypeOptions] = useState(['All Types']);
    const [topographyOptions, setTopographyOptions] = useState(['All Topography']);
    const [amenityOptions, setAmenityOptions] = useState([]);
    
    // State for favorite status tracking
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const [checkingFavorite, setCheckingFavorite] = useState({});

    // Fetch properties from the server
    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/properties');
            const properties = response.data;
            
            // Extract unique barangays from properties
            const uniqueBarangays = ['All Barangays', ...new Set(properties.map(prop => prop.location.split(',')[0].trim()))];
            setBarangayOptions(uniqueBarangays);

            // Extract unique crops and fruits
            const allCrops = properties.flatMap(prop => 
                prop.suitableCrops ? prop.suitableCrops.split(',').map(crop => crop.trim()) : []
            );
            setCropTypes([...new Set(allCrops)]);
            setFruitTypes([...new Set(allCrops)]); // Using same data for now, can be separated if needed
            
            // Extract unique property types and topography
            const uniquePropertyTypes = ['All Types', ...new Set(properties.map(prop => prop.type).filter(Boolean))];
            const uniqueTopography = ['All Topography', ...new Set(properties.map(prop => prop.topography).filter(Boolean))];
            
            // Extract unique amenities
            const allAmenities = properties.flatMap(prop => 
                prop.amenities ? (Array.isArray(prop.amenities) ? prop.amenities : [prop.amenities]) : []
            );
            const uniqueAmenities = [...new Set(allAmenities)];
            
            setPropertyTypeOptions(uniquePropertyTypes);
            setTopographyOptions(uniqueTopography);
            setAmenityOptions(uniqueAmenities);
            
            const enhancedListings = properties.map(property => ({
                ...property,
                id: property.id,
                title: property.title,
                location: property.location,
                price: property.showPrice ? `₱${property.price.toLocaleString()}` : 'Price on Request',
                pricePerSqm: property.showPrice ? `₱${Math.round(property.price / property.acres).toLocaleString()}` : 'N/A',
                size: `${property.acres.toLocaleString()} hectares`,
                category: property.category || 'Agricultural',
                features: property.features || '',
                crops: property.suitableCrops ? property.suitableCrops.split(',').map(crop => crop.trim()) : [],
                fruits: property.suitableCrops ? property.suitableCrops.split(',').map(crop => crop.trim()) : [],
                hasIrrigation: property.waterRights?.toLowerCase().includes('irrigation') || false,
                isFeatured: property.isFeatured || false,
                imageUrl: property.image || "/api/placeholder/400/320",
                images: property.images || [
                    "/api/placeholder/800/500",
                    "/api/placeholder/800/500",
                    "/api/placeholder/800/500",
                    "/api/placeholder/800/500"
                ],
                sellerName: property.seller && (property.seller.firstName || property.seller.lastName)
                    ? [property.seller.firstName, property.seller.lastName].filter(Boolean).join(' ')
                    : "Unknown Seller",
                sellerAvatar: property.seller?.avatar 
                    ? (property.seller.avatar.startsWith('http') 
                        ? property.seller.avatar 
                        : `${api.defaults.baseURL}${property.seller.avatar}`)
                    : `${api.defaults.baseURL}/api/placeholder/50/50`,
                postedDate: new Date(property.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                type: property.type || 'Agricultural Land',
                topography: property.topography || 'Flat to rolling',
                averageYield: property.averageYield || 'Not specified',
                amenities: property.amenities || [],
                restrictionsText: property.restrictionsText || '',
                hasRestrictions: Boolean(property.restrictionsText && property.restrictionsText.trim()),
                remarks: property.remarks || '',
                barangay: property.barangay || null,
                barangayData: property.barangayData || null
            }));
            
            setListingsData(enhancedListings);
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError('Failed to load properties. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    // Handle crop checkbox changes
    const handleCropChange = (crop) => {
        if (selectedCrops.includes(crop)) {
            setSelectedCrops(selectedCrops.filter(item => item !== crop));
        } else {
            setSelectedCrops([...selectedCrops, crop]);
        }
    };

    // Handle fruit checkbox changes
    const handleFruitChange = (fruit) => {
        if (selectedFruits.includes(fruit)) {
            setSelectedFruits(selectedFruits.filter(item => item !== fruit));
        } else {
            setSelectedFruits([...selectedFruits, fruit]);
        }
    };

    // Handle property type selection
    const handlePropertyTypeChange = (type) => {
        setSelectedPropertyType(type);
    };

    // Handle topography selection
    const handleTopographyChange = (topography) => {
        setSelectedTopography(topography);
    };

    // Handle amenity checkbox changes
    const handleAmenityChange = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    // Apply filters
    const applyFilters = () => {
        let filtered = [...listingsData];

        // Filter by barangay
        if (selectedBarangay !== 'All Barangays') {
            filtered = filtered.filter(listing => 
                listing.location.toLowerCase().includes(selectedBarangay.toLowerCase())
            );
        }

        // Filter by price range
        if (priceRange.min) {
            filtered = filtered.filter(listing => {
                const price = parseInt(listing.price.replace(/[^0-9]/g, ''));
                return price >= parseInt(priceRange.min);
            });
        }
        if (priceRange.max) {
            filtered = filtered.filter(listing => {
                const price = parseInt(listing.price.replace(/[^0-9]/g, ''));
                return price <= parseInt(priceRange.max);
            });
        }

        // Filter by size range
        if (sizeRange.min) {
            filtered = filtered.filter(listing => {
                const size = parseInt(listing.size.replace(/[^0-9]/g, ''));
                return size >= parseInt(sizeRange.min);
            });
        }
        if (sizeRange.max) {
            filtered = filtered.filter(listing => {
                const size = parseInt(listing.size.replace(/[^0-9]/g, ''));
                return size <= parseInt(sizeRange.max);
            });
        }

        // Filter by crops
        if (selectedCrops.length > 0) {
            filtered = filtered.filter(listing => 
                selectedCrops.some(crop => listing.crops.includes(crop))
            );
        }

        // Filter by fruits
        if (selectedFruits.length > 0) {
            filtered = filtered.filter(listing => 
                selectedFruits.some(fruit => listing.fruits.includes(fruit))
            );
        }

        // Filter by irrigation
        if (hasIrrigation) {
            filtered = filtered.filter(listing => listing.hasIrrigation);
        }

        // Filter by property type
        if (selectedPropertyType !== 'All Types') {
            filtered = filtered.filter(listing => listing.type === selectedPropertyType);
        }

        // Filter by topography
        if (selectedTopography !== 'All Topography') {
            filtered = filtered.filter(listing => listing.topography === selectedTopography);
        }

        // Filter by amenities
        if (selectedAmenities.length > 0) {
            filtered = filtered.filter(listing => 
                selectedAmenities.some(amenity => 
                    listing.amenities && listing.amenities.includes(amenity)
                )
            );
        }

        // Filter by restrictions
        if (hasRestrictions) {
            filtered = filtered.filter(listing => listing.hasRestrictions);
        }

        // Apply search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(listing => 
                listing.title.toLowerCase().includes(term) ||
                listing.location.toLowerCase().includes(term) ||
                listing.features.toLowerCase().includes(term)
            );
        }

        // Apply category filter
        filtered = filterListingsByCategory(filtered);

        setListingsData(filtered);
        setShowFilters(false);
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedBarangay('All Barangays');
        setPriceRange({ min: '', max: '' });
        setSizeRange({ min: '', max: '' });
        setSelectedCrops([]);
        setSelectedFruits([]);
        setHasIrrigation(false);
        setSearchTerm('');
        setActiveCategory('all');
        setSelectedPropertyType('All Types');
        setSelectedTopography('All Topography');
        setSelectedAmenities([]);
        setHasRestrictions(false);
        fetchProperties();
    };

    const filterListingsByCategory = (listings) => {
        if (activeCategory === 'all') return listings;
        return listings.filter(listing => {
            switch(activeCategory) {
                case 'crops':
                    return listing.crops && listing.crops.length > 0;
                case 'fruits':
                    return listing.fruits && listing.fruits.length > 0;
                case 'irrigated':
                    return listing.hasIrrigation;
                case 'featured':
                    return listing.isFeatured;
                default:
                    return true;
            }
        });
    };

    const filterListingsBySearch = (listings) => {
        if (!searchTerm) return listings;
        const term = searchTerm.toLowerCase();
        return listings.filter(listing => 
            listing.title.toLowerCase().includes(term) ||
            listing.location.toLowerCase().includes(term) ||
            (listing.description && listing.description.toLowerCase().includes(term))
        );
    };

    const sortListings = (listings) => {
        const sorted = [...listings];
        switch (sortOption) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
                break;
            case 'price_high':
                sorted.sort((a, b) => 
                    parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
                );
                break;
            case 'price_low':
                sorted.sort((a, b) => 
                    parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
                );
                break;
            case 'size_high':
                sorted.sort((a, b) => 
                    parseInt(b.size.replace(/[^0-9]/g, '')) - parseInt(a.size.replace(/[^0-9]/g, ''))
                );
                break;
            case 'size_low':
                sorted.sort((a, b) => 
                    parseInt(a.size.replace(/[^0-9]/g, '')) - parseInt(b.size.replace(/[^0-9]/g, ''))
                );
                break;
            default:
                break;
        }
        return sorted;
    };

    const listingsPerPage = 6;
    const startIdx = (currentPage - 1) * listingsPerPage;
    const endIdx = startIdx + listingsPerPage;
    const sortedListings = sortListings(filterListingsByCategory(filterListingsBySearch(listingsData)));
    const paginatedListings = sortedListings.slice(startIdx, endIdx);

    // Render pagination
    const renderPagination = () => {
        const totalPages = Math.ceil(sortedListings.length / listingsPerPage);
        
        return (
            <S.PaginationContainer>
                <S.PaginationControls>
                    <S.PaginationButton 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                        <FaChevronLeft />
                    </S.PaginationButton>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <S.PaginationButton
                            key={index + 1}
                            $active={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </S.PaginationButton>
                    ))}
                    
                    <S.PaginationButton 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    >
                        <FaChevronRight />
                    </S.PaginationButton>
                </S.PaginationControls>
            </S.PaginationContainer>
        );
    };

    // Render listing card based on view mode
    const renderListingCard = (listing) => {
        const slug = listing.slug || generateSlug(listing.title);
    
        // Modal handler
        const openModal = () => {
            openPropertyModal(listing);
        }

        if (viewMode === 'grid') {
            return (
                <S.ListingCard key={listing.id} onClick={openModal} style={{ cursor: 'pointer' }}>
                    <S.ListingImageContainer>
                        <S.ListingImage 
                            src={listing.imageUrl} 
                            alt={listing.title}
                            onError={(e) => {
                                console.error('Error loading property image:', e);
                                e.target.src = `${api.defaults.baseURL}/api/placeholder/400/320`;
                            }}
                        />
                        {listing.isFeatured && <S.ListingBadge type="featured">Featured</S.ListingBadge>}
                        {listing.hasIrrigation && <S.ListingBadge style={{ right: 12, left: 'auto' }}>Irrigated</S.ListingBadge>}
                        {listing.hasRestrictions && (
                            <S.ListingBadge style={{ 
                                right: listing.hasIrrigation ? 80 : 12, 
                                left: 'auto',
                                backgroundColor: '#e74c3c',
                                color: 'white'
                            }}>
                                <FaExclamationTriangle style={{ marginRight: 4 }} />
                                Restrictions
                            </S.ListingBadge>
                        )}
                    </S.ListingImageContainer>
                    
                    <S.ListingContent>
                        <S.ListingTitle>{listing.title}</S.ListingTitle>
                        <S.ListingLocation>
                            <FaMapMarkerAlt style={{ marginRight: 4 }} />
                            {listing.location}
                        </S.ListingLocation>
                        
                        <S.ListingPrice>
                            {listing.showPrice ? formatPrice(listing.price) : 'Price on Request'}
                        </S.ListingPrice>
                        
                        <S.ListingSpecs>
                            <S.ListingSpecItem>
                                <S.SpecValue>
                                    <FaRulerCombined style={{ marginRight: 4 }} />
                                    {listing.size}
                                </S.SpecValue>
                                <S.SpecLabel>Area</S.SpecLabel>
                            </S.ListingSpecItem>
                            <S.ListingSpecItem>
                                <S.SpecValue>{listing.pricePerSqm}</S.SpecValue>
                                <S.SpecLabel>Per sqm</S.SpecLabel>
                            </S.ListingSpecItem>
                        </S.ListingSpecs>
                        
                        {/* Enhanced Property Details */}
                        <div style={{ 
                            backgroundColor: '#f8f9fa', 
                            padding: '8px', 
                            borderRadius: '6px', 
                            margin: '8px 0',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '6px',
                                fontSize: '12px'
                            }}>
                                {listing.type && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaBuilding size={12} style={{ color: '#6c757d' }} />
                                        <span style={{ fontWeight: '500', color: '#495057' }}>{listing.type}</span>
                                    </div>
                                )}
                                {listing.topography && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaTractor size={12} style={{ color: '#6c757d' }} />
                                        <span style={{ fontWeight: '500', color: '#495057' }}>{listing.topography}</span>
                                    </div>
                                )}
                                {listing.averageYield && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '4px',
                                        gridColumn: '1 / -1'
                                    }}>
                                        <FaChartBar size={12} style={{ color: '#6c757d' }} />
                                        <span style={{ fontWeight: '500', color: '#495057' }}>Avg Yield: {listing.averageYield}</span>
                                    </div>
                                )}
                                {listing.hasRestrictions && (
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '4px',
                                        gridColumn: '1 / -1'
                                    }}>
                                        <FaExclamationTriangle size={12} style={{ color: '#e74c3c' }} />
                                        <span style={{ fontWeight: '500', color: '#e74c3c' }}>Has Restrictions</span>
                                    </div>
                                )}
                            </div>
                            
                            {listing.amenities && listing.amenities.length > 0 && (
                                <div style={{ 
                                    marginTop: '6px', 
                                    paddingTop: '6px', 
                                    borderTop: '1px solid #dee2e6'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '4px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        color: '#495057'
                                    }}>
                                        <FaWarehouse size={10} style={{ marginRight: '3px' }} /> Amenities:
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        flexWrap: 'wrap', 
                                        gap: '3px'
                                    }}>
                                        {listing.amenities.slice(0, 2).map((amenity, idx) => (
                                            <span key={idx} style={{ 
                                                backgroundColor: '#e9ecef', 
                                                padding: '1px 4px', 
                                                borderRadius: '3px',
                                                fontSize: '10px',
                                                color: '#6c757d'
                                            }}>
                                                {amenity}
                                            </span>
                                        ))}
                                        {listing.amenities.length > 2 && (
                                            <span style={{ 
                                                backgroundColor: '#e9ecef', 
                                                padding: '1px 4px', 
                                                borderRadius: '3px',
                                                fontSize: '10px',
                                                color: '#6c757d'
                                            }}>
                                                +{listing.amenities.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <S.ListingTags>
                            {listing.crops.map((crop, idx) => (
                                <S.ListingTag key={`crop-${idx}`}>
                                    <FaSeedling style={{ marginRight: 4 }} />
                                    {crop}
                                </S.ListingTag>
                            ))}
                            {listing.fruits.map((fruit, idx) => (
                                <S.ListingTag key={`fruit-${idx}`}>
                                    <FaTree style={{ marginRight: 4 }} />
                                    {fruit}
                                </S.ListingTag>
                            ))}
                        </S.ListingTags>
                        
                        <S.ListingFooter>
                            <S.ListingSellerInfo>
                                {listing.sellerAvatar ? (
                                    <S.SellerAvatar 
                                        src={listing.sellerAvatar} 
                                        alt={listing.sellerName}
                                        onError={(e) => {
                                            console.error('Error loading seller avatar:', e);
                                            // Hide the broken image and show fallback
                                            e.target.style.display = 'none';
                                            const parent = e.target.parentNode;
                                            const fallback = document.createElement('div');
                                            fallback.style.cssText = `
                                                width: 28px;
                                                height: 28px;
                                                border-radius: 50%;
                                                background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: white;
                                                font-weight: bold;
                                                font-size: 12px;
                                            `;
                                            fallback.textContent = listing.sellerName ? listing.sellerName.charAt(0).toUpperCase() : '?';
                                            parent.insertBefore(fallback, e.target);
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        {listing.sellerName ? listing.sellerName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <S.SellerName>{listing.sellerName}</S.SellerName>
                            </S.ListingSellerInfo>
                            <S.ListingDate><FaRegCalendarAlt style={{ marginRight: 4 }} />{formatDate(listing.postedDate)}</S.ListingDate>
                        </S.ListingFooter>
                    </S.ListingContent>
                </S.ListingCard>
            );
        } else {
            // List view rendering
            return (
                <S.ListingCardHorizontal key={listing.id} onClick={openModal} style={{ cursor: 'pointer' }}>
                    <S.ListingImageContainerHorizontal style={{ width: '280px', height: '220px' }}>
                        <S.ListingImage 
                            src={listing.imageUrl} 
                            alt={listing.title}
                            onError={(e) => {
                                console.error('Error loading property image:', e);
                                e.target.src = `${api.defaults.baseURL}/api/placeholder/280/220`;
                            }}
                        />
                        {listing.isFeatured && <S.ListingBadge type="featured">Featured</S.ListingBadge>}
                        {listing.hasIrrigation && <S.ListingBadge style={{ right: 12, left: 'auto' }}>Irrigated</S.ListingBadge>}
                        {listing.hasRestrictions && (
                            <S.ListingBadge style={{ 
                                right: listing.hasIrrigation ? 80 : 12, 
                                left: 'auto',
                                backgroundColor: '#e74c3c',
                                color: 'white'
                            }}>
                                <FaExclamationTriangle style={{ marginRight: 4 }} />
                                Restrictions
                            </S.ListingBadge>
                        )}
                    </S.ListingImageContainerHorizontal>
                    
                    <S.ListingContentHorizontal>
                        <div>
                            <S.ListingTitle>{listing.title}</S.ListingTitle>
                            <S.ListingLocation>
                                <FaMapMarkerAlt style={{ marginRight: 4 }} />
                                {listing.location}
                            </S.ListingLocation>
                            
                            <S.ListingSpecs>
                                <S.ListingSpecItem>
                                    <S.SpecValue>
                                        <FaRulerCombined style={{ marginRight: 4 }} />
                                        {listing.size}
                                    </S.SpecValue>
                                    <S.SpecLabel>Area</S.SpecLabel>
                                </S.ListingSpecItem>
                                <S.ListingSpecItem>
                                    <S.SpecValue>{listing.pricePerSqm}</S.SpecValue>
                                    <S.SpecLabel>Per sqm</S.SpecLabel>
                                </S.ListingSpecItem>
                            </S.ListingSpecs>
                            
                            {/* Enhanced Property Details */}
                            <div style={{ 
                                backgroundColor: '#f8f9fa', 
                                padding: '8px', 
                                borderRadius: '6px', 
                                margin: '8px 0',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '6px',
                                    fontSize: '12px'
                                }}>
                                    {listing.type && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaBuilding size={12} style={{ color: '#6c757d' }} />
                                            <span style={{ fontWeight: '500', color: '#495057' }}>{listing.type}</span>
                                        </div>
                                    )}
                                    {listing.topography && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FaTractor size={12} style={{ color: '#6c757d' }} />
                                            <span style={{ fontWeight: '500', color: '#495057' }}>{listing.topography}</span>
                                        </div>
                                    )}
                                    {listing.averageYield && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            gridColumn: '1 / -1'
                                        }}>
                                            <FaChartBar size={12} style={{ color: '#6c757d' }} />
                                            <span style={{ fontWeight: '500', color: '#495057' }}>Avg Yield: {listing.averageYield}</span>
                                        </div>
                                    )}
                                    {listing.hasRestrictions && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            gridColumn: '1 / -1'
                                        }}>
                                            <FaExclamationTriangle size={12} style={{ color: '#e74c3c' }} />
                                            <span style={{ fontWeight: '500', color: '#e74c3c' }}>Has Restrictions</span>
                                        </div>
                                    )}
                                </div>
                                
                                {listing.amenities && listing.amenities.length > 0 && (
                                    <div style={{ 
                                        marginTop: '6px', 
                                        paddingTop: '6px', 
                                        borderTop: '1px solid #dee2e6'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            marginBottom: '4px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            color: '#495057'
                                        }}>
                                            <FaWarehouse size={10} style={{ marginRight: '3px' }} /> Amenities:
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: '3px'
                                        }}>
                                            {listing.amenities.slice(0, 2).map((amenity, idx) => (
                                                <span key={idx} style={{ 
                                                    backgroundColor: '#e9ecef', 
                                                    padding: '1px 4px', 
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    color: '#6c757d'
                                                }}>
                                                    {amenity}
                                                </span>
                                            ))}
                                            {listing.amenities.length > 2 && (
                                                <span style={{ 
                                                    backgroundColor: '#e9ecef', 
                                                    padding: '1px 4px', 
                                                    borderRadius: '3px',
                                                    fontSize: '10px',
                                                    color: '#6c757d'
                                                }}>
                                                    +{listing.amenities.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <S.ListingTags>
                                {listing.crops.map((crop, idx) => (
                                    <S.ListingTag key={`crop-${idx}`}>
                                        <FaSeedling style={{ marginRight: 4 }} />
                                        {crop}
                                    </S.ListingTag>
                                ))}
                                {listing.fruits.map((fruit, idx) => (
                                    <S.ListingTag key={`fruit-${idx}`}>
                                        <FaTree style={{ marginRight: 4 }} />
                                        {fruit}
                                    </S.ListingTag>
                                ))}
                            </S.ListingTags>
                        </div>
                        
                        <div>
                            <S.ListingPrice>
                                {listing.showPrice ? formatPrice(listing.price) : 'Price on Request'}
                            </S.ListingPrice>
                            
                            <S.ListingFooter>
                                <S.ListingSellerInfo>
                                    {listing.sellerAvatar ? (
                                        <S.SellerAvatar 
                                            src={listing.sellerAvatar} 
                                            alt={listing.sellerName}
                                            onError={(e) => {
                                                console.error('Error loading seller avatar:', e);
                                                // Hide the broken image and show fallback
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentNode;
                                                const fallback = document.createElement('div');
                                                fallback.style.cssText = `
                                                    width: 28px;
                                                    height: 28px;
                                                    border-radius: 50%;
                                                    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    color: white;
                                                    font-weight: bold;
                                                    font-size: 12px;
                                                `;
                                                fallback.textContent = listing.sellerName ? listing.sellerName.charAt(0).toUpperCase() : '?';
                                                parent.insertBefore(fallback, e.target);
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}>
                                            {listing.sellerName ? listing.sellerName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <S.SellerName>{listing.sellerName}</S.SellerName>
                                </S.ListingSellerInfo>
                                <S.ListingDate><FaRegCalendarAlt style={{ marginRight: 4 }} />{formatDate(listing.postedDate)}</S.ListingDate>
                            </S.ListingFooter>
                        </div>
                    </S.ListingContentHorizontal>
                </S.ListingCardHorizontal>
            );
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Modal functions
    const openPropertyModal = (property) => {
        setSelectedProperty(property);
        setPropertyModalOpen(true);
        setActiveImageIndex(0);
        // Check favorite status when modal opens
        checkFavoriteStatus(property.id);
        // Record property view in recently viewed system
        recordPropertyView(property.id);
    };

    // Function to record property view
    const recordPropertyView = async (propertyId) => {
        try {
            await api.post('/api/recently-viewed/record', { propertyId });
        } catch (error) {
            console.error('Error recording property view:', error);
        }
    };

    const closePropertyModal = () => {
        setPropertyModalOpen(false);
        setSelectedProperty(null);
        setActiveImageIndex(0);
    };

    const handlePrevImage = () => {
        if (selectedProperty && selectedProperty.images) {
            setActiveImageIndex(prev => 
                prev === 0 ? selectedProperty.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (selectedProperty && selectedProperty.images) {
            setActiveImageIndex(prev => 
                prev === selectedProperty.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };

    const handleSaveProperty = async () => {
        if (!selectedProperty) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to save properties to favorites');
            return;
        }

        const propertyId = selectedProperty.id;
        const isCurrentlyFavorited = favoriteStatus[propertyId];

        try {
            if (isCurrentlyFavorited) {
                // Remove from favorites
                const response = await api.delete(`/api/favorites/${propertyId}`);
                if (response.status === 200) {
                    setFavoriteStatus(prev => ({ ...prev, [propertyId]: false }));
                    alert('Property removed from favorites');
                }
            } else {
                // Add to favorites
                const response = await api.post(`/api/favorites/${propertyId}`);
                if (response.status === 201) {
                    setFavoriteStatus(prev => ({ ...prev, [propertyId]: true }));
                    alert('Property saved to favorites');
                }
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

    const handleShareProperty = () => {
        if (navigator.share) {
            navigator.share({
                title: selectedProperty.title,
                text: `Check out this agricultural property: ${selectedProperty.title}`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleContactSeller = () => {
        setContactModalOpen(true);
    };

    const closeContactModal = () => {
        setContactModalOpen(false);
    };

    // Function to check if a property is favorited
    const checkFavoriteStatus = async (propertyId) => {
        if (!propertyId) return;
        
        setCheckingFavorite(prev => ({ ...prev, [propertyId]: true }));
        try {
            const response = await api.get(`/api/favorites/check/${propertyId}`);
            setFavoriteStatus(prev => ({ 
                ...prev, 
                [propertyId]: response.data.isFavorite 
            }));
        } catch (error) {
            console.error('Error checking favorite status:', error);
            setFavoriteStatus(prev => ({ ...prev, [propertyId]: false }));
        } finally {
            setCheckingFavorite(prev => ({ ...prev, [propertyId]: false }));
        }
    };

    const filteredListings = filterListingsByCategory(filterListingsBySearch(listingsData));

    if (loading) {
        return <div>Loading properties...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <S.PageWrapper>
            {/* Main Content - Fixed width container */}
            <S.MainContainer>
                {/* Hero Banner with Search */}
                <S.HeroBanner>
                    <S.HeroTitle>Find Your Perfect Farmland</S.HeroTitle>
                    <S.HeroSubtitle>
                        Discover agricultural properties in <span style={{ fontWeight: 700 }}>Cabanatuan, Nueva Ecija</span> for crops, fruits, and sustainable farming
                    </S.HeroSubtitle>
                    
                    <S.SearchContainer>
                        <S.SearchInput 
                            type="text" 
                            placeholder="Search for properties or locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <S.SearchButton>
                            <FaSearch style={{ marginRight: 8 }} />
                            Search
                        </S.SearchButton>
                    </S.SearchContainer>
                </S.HeroBanner>
                
                {/* Categories navbar with updated styling */}
                <S.CategoriesNav>
                    <S.CategoryItem $active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                        <FaHome style={{ marginRight: 8 }} />
                        All Properties
                    </S.CategoryItem>
                    <S.CategoryItem $active={activeCategory === 'crops'} onClick={() => setActiveCategory('crops')}>
                        <FaSeedling style={{ marginRight: 8 }} />
                        Best for Crops
                    </S.CategoryItem>
                    <S.CategoryItem $active={activeCategory === 'fruits'} onClick={() => setActiveCategory('fruits')}>
                        <FaTree style={{ marginRight: 8 }} />
                        Fruit Orchards
                    </S.CategoryItem>
                    <S.CategoryItem $active={activeCategory === 'irrigated'} onClick={() => setActiveCategory('irrigated')}>
                        <FaTint style={{ marginRight: 8 }} />
                        Irrigated Lands
                    </S.CategoryItem>
                    <S.CategoryItem $active={activeCategory === 'featured'} onClick={() => setActiveCategory('featured')}>
                        <FaStar style={{ marginRight: 8 }} />
                        Featured
                    </S.CategoryItem>
                </S.CategoriesNav>

                {/* Filters Section - Fixed layout */}
                {showFilters && (
                    <S.FiltersContainer>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <S.FilterTitle>
                                <FaFilter style={{ marginRight: 8 }} />
                                Filter Properties
                            </S.FilterTitle>
                            <span 
                                style={{ cursor: 'pointer', color: '#bdc3c7' }} 
                                onClick={() => setShowFilters(false)}
                            >
                                <FaTimes />
                            </span>
                        </div>
                        
                        {/* Improved grid layout with better constraints */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                            {/* Barangay Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Location</S.FilterLabel>
                                <S.FilterSelect 
                                    value={selectedBarangay}
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                >
                                    {barangayOptions.map((barangay, index) => (
                                        <option key={index} value={barangay}>{barangay}</option>
                                    ))}
                                </S.FilterSelect>
                            </S.FilterGroup>
                            
                            {/* Price Range Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Price Range (₱)</S.FilterLabel>
                                <S.RangeContainer>
                                    <S.RangeInput 
                                        type="number" 
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                    />
                                    <S.RangeSeparator>to</S.RangeSeparator>
                                    <S.RangeInput 
                                        type="number" 
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                    />
                                </S.RangeContainer>
                            </S.FilterGroup>
                            
                            {/* Size Range Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Land Size (hectares)</S.FilterLabel>
                                <S.RangeContainer>
                                    <S.RangeInput 
                                        type="number" 
                                        placeholder="Min"
                                        value={sizeRange.min}
                                        onChange={(e) => setSizeRange({...sizeRange, min: e.target.value})}
                                    />
                                    <S.RangeSeparator>to</S.RangeSeparator>
                                    <S.RangeInput 
                                        type="number" 
                                        placeholder="Max"
                                        value={sizeRange.max}
                                        onChange={(e) => setSizeRange({...sizeRange, max: e.target.value})}
                                    />
                                </S.RangeContainer>
                            </S.FilterGroup>
                            
                            {/* Crop Types Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>
                                    <FaSeedling style={{ marginRight: 4 }} />
                                    Crops
                                </S.FilterLabel>
                                <S.CheckboxContainer>
                                    {cropTypes.map((crop, index) => (
                                        <S.CheckboxGroup key={index}>
                                            <S.FilterInput 
                                                type="checkbox"
                                                id={`crop-${index}`}
                                                checked={selectedCrops.includes(crop)}
                                                onChange={() => handleCropChange(crop)}
                                            />
                                            <S.CheckboxLabel htmlFor={`crop-${index}`}>{crop}</S.CheckboxLabel>
                                        </S.CheckboxGroup>
                                    ))}
                                </S.CheckboxContainer>
                            </S.FilterGroup>
                            
                            {/* Fruit Types Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>
                                    <FaTree style={{ marginRight: 4 }} />
                                    Fruit-bearing Trees
                                </S.FilterLabel>
                                <S.CheckboxContainer>
                                    {fruitTypes.map((fruit, index) => (
                                        <S.CheckboxGroup key={index}>
                                            <S.FilterInput 
                                                type="checkbox"
                                                id={`fruit-${index}`}
                                                checked={selectedFruits.includes(fruit)}
                                                onChange={() => handleFruitChange(fruit)}
                                            />
                                            <S.CheckboxLabel htmlFor={`fruit-${index}`}>{fruit}</S.CheckboxLabel>
                                        </S.CheckboxGroup>
                                    ))}
                                </S.CheckboxContainer>
                            </S.FilterGroup>
                            
                            {/* Irrigation Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Features</S.FilterLabel>
                                <S.CheckboxGroup>
                                    <S.FilterInput 
                                        type="checkbox"
                                        id="irrigation"
                                        checked={hasIrrigation}
                                        onChange={() => setHasIrrigation(!hasIrrigation)}
                                    />
                                    <S.CheckboxLabel htmlFor="irrigation">
                                        <FaTint style={{ marginRight: 4 }} />
                                        Has Irrigation System
                                    </S.CheckboxLabel>
                                </S.CheckboxGroup>
                            </S.FilterGroup>
                            
                            {/* Property Type Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Property Type</S.FilterLabel>
                                <S.FilterSelect 
                                    value={selectedPropertyType}
                                    onChange={(e) => handlePropertyTypeChange(e.target.value)}
                                >
                                    {propertyTypeOptions.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </S.FilterSelect>
                            </S.FilterGroup>
                            
                            {/* Topography Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Topography</S.FilterLabel>
                                <S.FilterSelect 
                                    value={selectedTopography}
                                    onChange={(e) => handleTopographyChange(e.target.value)}
                                >
                                    {topographyOptions.map((topography, index) => (
                                        <option key={index} value={topography}>{topography}</option>
                                    ))}
                                </S.FilterSelect>
                            </S.FilterGroup>
                            
                            {/* Amenities Filter */}
                            {amenityOptions.length > 0 && (
                                <S.FilterGroup>
                                    <S.FilterLabel>
                                        <FaBuilding style={{ marginRight: 4 }} />
                                        Amenities
                                    </S.FilterLabel>
                                    <S.CheckboxContainer>
                                        {amenityOptions.map((amenity, index) => (
                                            <S.CheckboxGroup key={index}>
                                                <S.FilterInput 
                                                    type="checkbox"
                                                    id={`amenity-${index}`}
                                                    checked={selectedAmenities.includes(amenity)}
                                                    onChange={() => handleAmenityChange(amenity)}
                                                />
                                                <S.CheckboxLabel htmlFor={`amenity-${index}`}>{amenity}</S.CheckboxLabel>
                                            </S.CheckboxGroup>
                                        ))}
                                    </S.CheckboxContainer>
                                </S.FilterGroup>
                            )}
                            
                            {/* Restrictions Filter */}
                            <S.FilterGroup>
                                <S.FilterLabel>Property Status</S.FilterLabel>
                                <S.CheckboxGroup>
                                    <S.FilterInput 
                                        type="checkbox"
                                        id="restrictions"
                                        checked={hasRestrictions}
                                        onChange={() => setHasRestrictions(!hasRestrictions)}
                                    />
                                    <S.CheckboxLabel htmlFor="restrictions">
                                        <FaExclamationTriangle style={{ marginRight: 4 }} />
                                        Has Restrictions
                                    </S.CheckboxLabel>
                                </S.CheckboxGroup>
                            </S.FilterGroup>
                        </div>
                        
                        <S.ButtonsContainer style={{ marginTop: '20px' }}>
                            <S.ApplyFilterButton onClick={applyFilters}>
                                Apply Filters
                            </S.ApplyFilterButton>
                            <S.ClearFilterButton onClick={clearFilters}>
                                Clear Filters
                            </S.ClearFilterButton>
                        </S.ButtonsContainer>
                    </S.FiltersContainer>
                )}
                
                {!showFilters && (
                    <S.ActionButton 
                        style={{ 
                            marginBottom: 24,
                            backgroundColor: 'rgba(52, 152, 219, 0.9)',
                            borderRadius: '8px'
                        }}
                        onClick={() => setShowFilters(true)}
                    >
                        <FaFilter style={{ marginRight: 8 }} />
                        Show Filters
                    </S.ActionButton>
                )}

                {/* Results Controls */}
                <S.ResultControls>
                    <S.ResultCount>
                        Showing <S.ResultHighlight>{filteredListings.length}</S.ResultHighlight> listings
                    </S.ResultCount>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <S.SortContainer>
                            <S.SortLabel>Sort by:</S.SortLabel>
                            <S.SortSelect 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="price_high">Price (High to Low)</option>
                                <option value="price_low">Price (Low to High)</option>
                                <option value="size_high">Size (High to Low)</option>
                                <option value="size_low">Size (Low to High)</option>
                            </S.SortSelect>
                        </S.SortContainer>
                        
                        <S.ViewToggle>
                            <S.ViewButton
                                $active={viewMode === 'grid'}
                                onClick={() => setViewMode('grid')}
                            >
                                <FaThLarge style={{ marginRight: viewMode === 'grid' ? 4 : 0 }} />
                                {viewMode === 'grid' && 'Grid'}
                            </S.ViewButton>
                            <S.ViewButton
                                $active={viewMode === 'list'}
                                onClick={() => setViewMode('list')}
                            >
                                <FaList style={{ marginRight: viewMode === 'list' ? 4 : 0 }} />
                                {viewMode === 'list' && 'List'}
                            </S.ViewButton>
                        </S.ViewToggle>
                    </div>
                </S.ResultControls>

                {/* Listings Grid or List */}
                {paginatedListings.length > 0 ? (
                    <div>
                        {viewMode === 'grid' ? (
                            <S.GridContainer>
                                {paginatedListings.map(listing => renderListingCard(listing))}
                            </S.GridContainer>
                        ) : (
                            <S.ListContainer>
                                {paginatedListings.map(listing => renderListingCard(listing))}
                            </S.ListContainer>
                        )}
                        
                        {renderPagination()}
                    </div>
                ) : (
                    <S.EmptyState>
                        <S.EmptyStateIcon>🌱</S.EmptyStateIcon>
                        <S.EmptyStateTitle>No matching listings found</S.EmptyStateTitle>
                        <S.EmptyStateText>
                            Try adjusting your filters or search criteria to find what you're looking for.
                        </S.EmptyStateText>
                        <S.EmptyStateButton onClick={clearFilters}>
                            Clear All Filters
                        </S.EmptyStateButton>
                    </S.EmptyState>
                )}
            </S.MainContainer>

            {/* Property Details Modal */}
            {propertyModalOpen && selectedProperty && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        width: '1000px',
                        overflow: 'auto',
                        position: 'relative'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px 24px',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>
                                {selectedProperty.title}
                            </h2>
                            <button
                                onClick={closePropertyModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '24px' }}>
                            {/* Image Gallery */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    position: 'relative',
                                    height: '400px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginBottom: '12px'
                                }}>
                                    <img
                                        src={selectedProperty.images[activeImageIndex] || selectedProperty.imageUrl}
                                        alt={selectedProperty.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            console.error('Error loading property image:', e);
                                            e.target.src = `${api.defaults.baseURL}/api/placeholder/800/500`;
                                        }}
                                    />
                                    {selectedProperty.images && selectedProperty.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePrevImage}
                                                style={{
                                                    position: 'absolute',
                                                    left: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    borderRadius: '50%',
                                                    cursor: 'pointer',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                <FaChevronRight />
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                {/* Thumbnails */}
                                {selectedProperty.images && selectedProperty.images.length > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        overflowX: 'auto',
                                        padding: '4px 0'
                                    }}>
                                        {selectedProperty.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`${selectedProperty.title} - Image ${index + 1}`}
                                                onClick={() => handleThumbnailClick(index)}
                                                style={{
                                                    width: '80px',
                                                    height: '60px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    border: index === activeImageIndex ? '2px solid #3498db' : '2px solid transparent',
                                                    opacity: index === activeImageIndex ? 1 : 0.7,
                                                    transition: 'all 0.2s'
                                                }}
                                                onError={(e) => {
                                                    console.error('Error loading thumbnail image:', e);
                                                    e.target.src = `${api.defaults.baseURL}/api/placeholder/80/60`;
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Property Details Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '24px'
                            }}>
                                {/* Left Column - Property Details */}
                                <div>
                                    {/* Price and Location */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '20px'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                fontSize: '28px',
                                                fontWeight: '700',
                                                color: '#2c3e50',
                                                margin: '0 0 8px 0'
                                            }}>
                                                {selectedProperty.price}
                                            </h3>
                                            <p style={{
                                                fontSize: '16px',
                                                color: '#7f8c8d',
                                                margin: 0,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <FaMapMarkerAlt style={{ marginRight: '6px' }} />
                                                {selectedProperty.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Property Specifications */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '16px',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Land Size
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.size}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Price per Hectare
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.showPrice ? selectedProperty.pricePerSqm : 'N/A'}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Property Type
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.type || 'Not specified'}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Topography
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.topography || 'Not specified'}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Water Rights
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.waterRights || 'Not specified'}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: '#f8f9fa',
                                            padding: '16px',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#7f8c8d',
                                                marginBottom: '4px'
                                            }}>
                                                Listed Date
                                            </div>
                                            <div style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50'
                                            }}>
                                                {selectedProperty.postedDate}
                                            </div>
                                        </div>
                                        {selectedProperty.averageYield && (
                                            <div style={{
                                                background: '#f8f9fa',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                gridColumn: '1 / -1'
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#7f8c8d',
                                                    marginBottom: '4px'
                                                }}>
                                                    Average Yield
                                                </div>
                                                <div style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#2c3e50'
                                                }}>
                                                    {selectedProperty.averageYield}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProperty.hasRestrictions && (
                                            <div style={{
                                                background: '#fff5f5',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                gridColumn: '1 / -1',
                                                border: '1px solid #fed7d7'
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#e53e3e',
                                                    marginBottom: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <FaExclamationTriangle style={{ marginRight: '6px' }} />
                                                    Property Restrictions
                                                </div>
                                                <div style={{
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    color: '#2c3e50'
                                                }}>
                                                    {selectedProperty.restrictionsText || 'This property has restrictions. Please contact the seller for details.'}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {selectedProperty.description && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                margin: '0 0 12px 0'
                                            }}>
                                                Description
                                            </h4>
                                            <p style={{
                                                fontSize: '16px',
                                                lineHeight: '1.6',
                                                color: '#34495e',
                                                margin: 0
                                            }}>
                                                {selectedProperty.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Suitable Crops */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 12px 0',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <FaSeedling style={{ marginRight: '8px', color: '#27ae60' }} />
                                            Suitable Crops
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {selectedProperty.crops.map((crop, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        background: '#e8f5e8',
                                                        color: '#27ae60',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {crop}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                margin: '0 0 12px 0'
                                            }}>
                                                Amenities
                                            </h4>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}>
                                                {selectedProperty.amenities.map((amenity, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontSize: '16px',
                                                            color: '#34495e'
                                                        }}
                                                    >
                                                        <FaCheck style={{
                                                            marginRight: '8px',
                                                            color: '#27ae60',
                                                            fontSize: '14px'
                                                        }} />
                                                        {amenity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Remarks */}
                                    {selectedProperty.remarks && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                margin: '0 0 12px 0'
                                            }}>
                                                Additional Remarks
                                            </h4>
                                            <p style={{
                                                fontSize: '16px',
                                                lineHeight: '1.6',
                                                color: '#34495e',
                                                margin: 0,
                                                padding: '16px',
                                                background: '#f8f9fa',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                {selectedProperty.remarks}
                                            </p>
                                        </div>
                                    )}

                                    {/* Location Map */}
                                    <div style={{ marginBottom: '24px' }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 12px 0',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <FaMapMarkerAlt style={{ marginRight: '8px', color: '#3498db' }} />
                                            Location & Barangay
                                        </h4>
                                        
                                        {/* Map Container */}
                                        <div style={{
                                            height: '300px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '2px solid #e0e0e0',
                                            marginBottom: '16px'
                                        }}>
                                            <MapContainer
                                                center={selectedProperty.barangayData?.center || [15.4841, 120.9685]}
                                                zoom={13}
                                                style={{ height: '100%', width: '100%' }}
                                                zoomControl={true}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                
                                                {/* Property Marker */}
                                                {(selectedProperty.coordinates || selectedProperty.barangayData?.center) && (
                                                    <Marker position={selectedProperty.coordinates || selectedProperty.barangayData.center}>
                                                        <Popup>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <strong>{selectedProperty.title}</strong><br />
                                                                {selectedProperty.location}
                                                                {selectedProperty.barangay && (
                                                                    <>
                                                                        <br />
                                                                        <small>Barangay: {selectedProperty.barangay}</small>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                )}
                                                
                                                {/* Barangay Radius Circle */}
                                                {selectedProperty.barangayData?.center && selectedProperty.barangayData?.radius && (
                                                    <Circle
                                                        center={selectedProperty.barangayData.center}
                                                        radius={selectedProperty.barangayData.radius}
                                                        pathOptions={{
                                                            color: '#3498db',
                                                            fillColor: '#3498db',
                                                            fillOpacity: 0.2,
                                                            weight: 2,
                                                            dashArray: '5, 5'
                                                        }}
                                                    >
                                                        <Popup>
                                                            <div style={{ 
                                                                color: '#333',
                                                                padding: '8px',
                                                                maxWidth: '250px'
                                                            }}>
                                                                <h3 style={{ 
                                                                    margin: '0 0 8px 0',
                                                                    fontSize: '1.1em',
                                                                    color: '#2C3E50',
                                                                    borderBottom: '1px solid #eee',
                                                                    paddingBottom: '4px'
                                                                }}>
                                                                    {selectedProperty.barangay}
                                                                </h3>
                                                                
                                                                <div style={{ 
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'auto 1fr',
                                                                    gap: '4px 8px',
                                                                    fontSize: '0.9em'
                                                                }}>
                                                                    <strong>Elevation:</strong>
                                                                    <span>{selectedProperty.barangayData.elevation}m</span>
                                                                    
                                                                    <strong>Radius:</strong>
                                                                    <span>{selectedProperty.barangayData.radius}m</span>
                                                                    
                                                                    {selectedProperty.barangayData.soilType && (
                                                                        <>
                                                                            <strong>Soil Type:</strong>
                                                                            <span>{selectedProperty.barangayData.soilType}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Popup>
                                                    </Circle>
                                                )}
                                            </MapContainer>
                                        </div>
                                        
                                        {/* Barangay Information */}
                                        {selectedProperty.barangay && (
                                            <div style={{
                                                padding: '16px',
                                                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(52, 152, 219, 0.3)',
                                                color: '#2c3e50'
                                            }}>
                                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid rgba(52, 152, 219, 0.2)', paddingBottom: '8px' }}>
                                                    <FaMapMarkerAlt style={{ marginRight: '8px', color: '#3498db' }} />
                                                    Barangay: {selectedProperty.barangay}
                                                </div>
                                                {selectedProperty.barangayData && (
                                                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                                            <FaMountain style={{ marginRight: '10px', color: '#3498db', flexShrink: 0 }} />
                                                            Elevation: {selectedProperty.barangayData.elevation}m
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                                            <FaCircleNotch style={{ marginRight: '10px', color: '#3498db', flexShrink: 0 }} />
                                                            Radius: {selectedProperty.barangayData.radius}m
                                                        </div>
                                                        {selectedProperty.barangayData.soilType && (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <FaSeedling style={{ marginRight: '10px', color: '#3498db', flexShrink: 0 }} />
                                                                Soil Type: {selectedProperty.barangayData.soilType}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Seller Info & Actions */}
                                <div>
                                    {/* Seller Information */}
                                    <div style={{
                                        background: '#f8f9fa',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 16px 0'
                                        }}>
                                            Seller Information
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '16px'
                                        }}>
                                            {selectedProperty.sellerAvatar ? (
                                                <S.SellerAvatar 
                                                    src={selectedProperty.sellerAvatar} 
                                                    alt={selectedProperty.sellerName}
                                                    onError={(e) => {
                                                        console.error('Error loading seller avatar:', e);
                                                        // Hide the broken image and show fallback
                                                        e.target.style.display = 'none';
                                                        const parent = e.target.parentNode;
                                                        const fallback = document.createElement('div');
                                                        fallback.style.cssText = `
                                                            width: 28px;
                                                            height: 28px;
                                                            border-radius: 50%;
                                                            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                            display: flex;
                                                            align-items: center;
                                                            justify-content: center;
                                                            color: white;
                                                            font-weight: bold;
                                                            font-size: 12px;
                                                        `;
                                                        fallback.textContent = selectedProperty.sellerName ? selectedProperty.sellerName.charAt(0).toUpperCase() : '?';
                                                        parent.insertBefore(fallback, e.target);
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}>
                                                    {selectedProperty.sellerName ? selectedProperty.sellerName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    color: '#2c3e50'
                                                }}>
                                                    {selectedProperty.sellerName}
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#7f8c8d'
                                                }}>
                                                    Member since {new Date(selectedProperty.createdAt).getFullYear()}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleContactSeller}
                                            style={{
                                                width: '100%',
                                                background: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <FaEnvelope />
                                            Contact Seller
                                        </button>
                                    </div>

                                    {/* Property Status */}
                                    <div style={{
                                        background: '#f8f9fa',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 16px 0'
                                        }}>
                                            Property Status
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Status</span>
                                                <span style={{
                                                    background: '#27ae60',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    Active
                                                </span>
                                            </div>
                                            {selectedProperty.hasIrrigation && (
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Irrigation</span>
                                                    <span style={{
                                                        background: '#3498db',
                                                        color: 'white',
                                                        padding: '4px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <FaWater />
                                                        Available
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div style={{
                                        background: '#f8f9fa',
                                        padding: '20px',
                                        borderRadius: '12px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 16px 0'
                                        }}>
                                            Quick Actions
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            <button
                                                onClick={handleSaveProperty}
                                                disabled={checkingFavorite[selectedProperty?.id]}
                                                style={{
                                                    width: '100%',
                                                    background: favoriteStatus[selectedProperty?.id] ? '#95a5a6' : '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    cursor: checkingFavorite[selectedProperty?.id] ? 'not-allowed' : 'pointer',
                                                    fontSize: '16px',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    opacity: checkingFavorite[selectedProperty?.id] ? 0.7 : 1
                                                }}
                                            >
                                                {checkingFavorite[selectedProperty?.id] ? (
                                                    <>
                                                        <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                        Checking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaHeart />
                                                        {favoriteStatus[selectedProperty?.id] ? 'Remove from Favorites' : 'Save to Favorites'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Seller Modal */}
            {contactModalOpen && selectedProperty && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        maxWidth: '400px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}>
                                Contact {selectedProperty.sellerName}
                            </h3>
                            <button
                                onClick={closeContactModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    padding: '4px',
                                    borderRadius: '4px'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{
                            background: '#f8f9fa',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                {selectedProperty.sellerAvatar ? (
                                    <S.SellerAvatar 
                                        src={selectedProperty.sellerAvatar} 
                                        alt={selectedProperty.sellerName}
                                        onError={(e) => {
                                            console.error('Error loading seller avatar:', e);
                                            e.target.style.display = 'none';
                                            const parent = e.target.parentNode;
                                            const fallback = document.createElement('div');
                                            fallback.style.cssText = `
                                                width: 40px;
                                                height: 40px;
                                                border-radius: 50%;
                                                background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: white;
                                                font-weight: bold;
                                                font-size: 16px;
                                            `;
                                            fallback.textContent = selectedProperty.sellerName ? selectedProperty.sellerName.charAt(0).toUpperCase() : '?';
                                            parent.insertBefore(fallback, e.target);
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '16px'
                                    }}>
                                        {selectedProperty.sellerName ? selectedProperty.sellerName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                )}
                                <div style={{ marginLeft: '12px' }}>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2c3e50'
                                    }}>
                                        {selectedProperty.sellerName}
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#7f8c8d'
                                    }}>
                                        Property Seller
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#7f8c8d',
                                    marginBottom: '4px'
                                }}>
                                    Email Address
                                </div>
                                <div style={{
                                    fontSize: '16px',
                                    color: '#2c3e50',
                                    fontWeight: '500'
                                }}>
                                    {selectedProperty.seller?.email || 'Email not available'}
                                </div>
                            </div>

                            <div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#7f8c8d',
                                    marginBottom: '4px'
                                }}>
                                    Phone Number
                                </div>
                                <div style={{
                                    fontSize: '16px',
                                    color: '#2c3e50',
                                    fontWeight: '500'
                                }}>
                                    {selectedProperty.seller?.phone || 'Phone not available'}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <button
                                onClick={closeContactModal}
                                style={{
                                    flex: 1,
                                    background: '#95a5a6',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}
                            >
                                Close
                            </button>
                            {selectedProperty.seller?.email && (
                                <button
                                    onClick={() => {
                                        window.open(`mailto:${selectedProperty.seller.email}?subject=Inquiry about ${selectedProperty.title}`, '_blank');
                                        closeContactModal();
                                    }}
                                    style={{
                                        flex: 1,
                                        background: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <FaEnvelope />
                                    Send Email
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </S.PageWrapper>
    );
};

export default ListingOverview;
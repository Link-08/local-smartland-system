import React, { useState, useEffect } from 'react';
import { ListingOverviewStyles as S } from './ListingOverviewStyles';
import { FaList, FaThLarge, FaSearch, FaFilter, FaHome, FaEye, FaStar, FaTree, FaTint, FaSeedling, FaMapMarkerAlt, FaRulerCombined, FaChevronLeft, FaChevronRight, FaAngleDown, FaRegCalendarAlt, FaTimes } from 'react-icons/fa';
import cabanatuanLots from './cabanatuanLots.json';
import barangays from './barangays.json';

const ListingOverview = () => {
    // State for filters and view
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('newest');
    
    // Filter states
    const [selectedBarangay, setSelectedBarangay] = useState('All Barangays');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sizeRange, setSizeRange] = useState({ min: '', max: '' });
    const [selectedCrops, setSelectedCrops] = useState([]);
    const [selectedFruits, setSelectedFruits] = useState([]);
    const [hasIrrigation, setHasIrrigation] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    
    // Transform and enhance the property data
    const [listingsData, setListingsData] = useState([]);

    useEffect(() => {
        const enhancedListings = cabanatuanLots.map(lot => {
            // Find matching barangay data
            const barangayData = barangays.find(b => 
                lot.location.toLowerCase().includes(b.name.toLowerCase())
            );

            // Calculate price per sqm
            const pricePerSqm = Array.isArray(lot.price_php) 
                ? lot.price_php.map(price => Math.round(price / (Array.isArray(lot.lot_area_sqm) ? lot.lot_area_sqm[0] : lot.lot_area_sqm)))
                : Math.round(lot.price_php / lot.lot_area_sqm);

            return {
                id: Math.random().toString(36).substr(2, 9),
                title: lot.name,
                location: lot.location,
                price: `₱${lot.price_php.toLocaleString()}`,
                pricePerSqm: `₱${pricePerSqm.toLocaleString()}`,
                size: `${lot.lot_area_sqm.toLocaleString()} sqm`,
                category: lot.category,
                features: lot.features,
                crops: barangayData?.fruits ? Object.entries(barangayData.fruits)
                    .filter(([_, value]) => value === "High" || value === "Moderate")
                    .map(([key]) => key) : [],
                fruits: barangayData?.fruits ? Object.entries(barangayData.fruits)
                    .filter(([_, value]) => value === "High" || value === "Moderate")
                    .map(([key]) => key) : [],
                hasIrrigation: lot.features?.toLowerCase().includes('irrigation') || false,
                isFeatured: lot.isFeatured || false,
                imageUrl: "/api/placeholder/400/320",
                sellerName: "SmartLand System",
                sellerAvatar: "/api/placeholder/50/50",
                postedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };
        });

        setListingsData(enhancedListings);
    }, []);

    // Get unique barangay names for filter
    const barangayOptions = ['All Barangays', ...new Set(barangays.map(b => b.name))];

    // Get unique crop and fruit types from barangay data
    const cropTypes = [...new Set(barangays.flatMap(b => 
        Object.entries(b.fruits)
            .filter(([_, value]) => value === "High" || value === "Moderate")
            .map(([key]) => key)
    ))];

    const fruitTypes = [...new Set(barangays.flatMap(b => 
        Object.entries(b.fruits)
            .filter(([_, value]) => value === "High" || value === "Moderate")
            .map(([key]) => key)
    ))];

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
        
        // Reset listings to original data
        const enhancedListings = cabanatuanLots.map(lot => {
            const barangayData = barangays.find(b => 
                lot.location.toLowerCase().includes(b.name.toLowerCase())
            );
            const pricePerSqm = Array.isArray(lot.price_php) 
                ? lot.price_php.map(price => Math.round(price / (Array.isArray(lot.lot_area_sqm) ? lot.lot_area_sqm[0] : lot.lot_area_sqm)))
                : Math.round(lot.price_php / lot.lot_area_sqm);

            return {
                id: Math.random().toString(36).substr(2, 9),
                title: lot.name,
                location: lot.location,
                price: `₱${lot.price_php.toLocaleString()}`,
                pricePerSqm: `₱${pricePerSqm.toLocaleString()}`,
                size: `${lot.lot_area_sqm.toLocaleString()} sqm`,
                category: lot.category,
                features: lot.features,
                crops: barangayData?.fruits ? Object.entries(barangayData.fruits)
                    .filter(([_, value]) => value === "High" || value === "Moderate")
                    .map(([key]) => key) : [],
                fruits: barangayData?.fruits ? Object.entries(barangayData.fruits)
                    .filter(([_, value]) => value === "High" || value === "Moderate")
                    .map(([key]) => key) : [],
                hasIrrigation: lot.features?.toLowerCase().includes('irrigation') || false,
                isFeatured: lot.isFeatured || false,
                imageUrl: "/api/placeholder/400/320",
                sellerName: "SmartLand System",
                sellerAvatar: "/api/placeholder/50/50",
                postedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            };
        });

        setListingsData(enhancedListings);
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
                active={currentPage === index + 1}
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
    
        // Navigation handler
        const navigateToListing = () => {
            // Use your router's navigation method
            // For example with React Router:
            // history.push(`/properties/${slug}`);
            
            // Or with Next.js:
            // router.push(`/properties/${slug}`);
            
            // For now, we'll just log it
            console.log(`Navigating to: /properties/${slug}`);
        }
        if (viewMode === 'grid') {
            return (
                <S.ListingCard key={listing.id}>
                <S.ListingImageContainer>
                    <S.ListingImage src={listing.imageUrl} alt={listing.title} />
                    {listing.isFeatured && <S.ListingBadge type="featured">Featured</S.ListingBadge>}
                    {listing.hasIrrigation && <S.ListingBadge style={{ right: 12, left: 'auto' }}>Irrigated</S.ListingBadge>}
                </S.ListingImageContainer>
                
                <S.ListingContent>
                    <S.ListingTitle>{listing.title}</S.ListingTitle>
                    <S.ListingLocation>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {listing.location}
                    </S.ListingLocation>
                    
                    <S.ListingPrice>{listing.price}</S.ListingPrice>
                    
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
                        <S.SellerAvatar src={listing.sellerAvatar} alt={listing.sellerName} />
                        <S.SellerName>{listing.sellerName}</S.SellerName>
                    </S.ListingSellerInfo>
                    <S.ListingDate><FaRegCalendarAlt style={{ marginRight: 4 }} />{listing.postedDate}</S.ListingDate>
                    </S.ListingFooter>
                </S.ListingContent>
                </S.ListingCard>
            );
        } else {
        // List view rendering
            return (
                <S.ListingCardHorizontal key={listing.id}>
                    <S.ListingImageContainerHorizontal style={{ width: '280px', height: '220px' }}>
                        <S.ListingImage src={listing.imageUrl} alt={listing.title} />
                        {listing.isFeatured && <S.ListingBadge type="featured">Featured</S.ListingBadge>}
                        {listing.hasIrrigation && <S.ListingBadge style={{ right: 12, left: 'auto' }}>Irrigated</S.ListingBadge>}
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
                        <S.ListingPrice>{listing.price}</S.ListingPrice>
                        
                        <S.ListingFooter>
                            <S.ListingSellerInfo>
                            <S.SellerAvatar src={listing.sellerAvatar} alt={listing.sellerName} />
                            <S.SellerName>{listing.sellerName}</S.SellerName>
                            </S.ListingSellerInfo>
                            <S.ListingDate><FaRegCalendarAlt style={{ marginRight: 4 }} />{listing.postedDate}</S.ListingDate>
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

    const filteredListings = filterListingsByCategory(filterListingsBySearch(listingsData));

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
                    <S.CategoryItem active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                        <FaHome style={{ marginRight: 8 }} />
                        All Properties
                    </S.CategoryItem>
                    <S.CategoryItem active={activeCategory === 'crops'} onClick={() => setActiveCategory('crops')}>
                        <FaSeedling style={{ marginRight: 8 }} />
                        Best for Crops
                    </S.CategoryItem>
                    <S.CategoryItem active={activeCategory === 'fruits'} onClick={() => setActiveCategory('fruits')}>
                        <FaTree style={{ marginRight: 8 }} />
                        Fruit Orchards
                    </S.CategoryItem>
                    <S.CategoryItem active={activeCategory === 'irrigated'} onClick={() => setActiveCategory('irrigated')}>
                        <FaTint style={{ marginRight: 8 }} />
                        Irrigated Lands
                    </S.CategoryItem>
                    <S.CategoryItem active={activeCategory === 'featured'} onClick={() => setActiveCategory('featured')}>
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
                                <S.FilterLabel>Land Size (sqm)</S.FilterLabel>
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
                                active={viewMode === 'grid'}
                                onClick={() => setViewMode('grid')}
                            >
                                <FaThLarge style={{ marginRight: viewMode === 'grid' ? 4 : 0 }} />
                                {viewMode === 'grid' && 'Grid'}
                            </S.ViewButton>
                            <S.ViewButton
                                active={viewMode === 'list'}
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
        </S.PageWrapper>
    );
};

export default ListingOverview;
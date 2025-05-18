import React, { useState, useEffect } from 'react';
import { 
  FaCamera, FaUser, FaSignOutAlt, FaFileAlt, FaTags, 
  FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
  FaBed, FaBath, FaRulerCombined, FaRegClock,
  FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
  FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse,
  FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaChartBar,
  FaExclamationTriangle, FaCheck, FaEye
} from 'react-icons/fa';
import { DashboardStyles } from "./BuyerDashboardStyles";
import { SellerDashboardStyles } from "./SellerDashboardStyles";
import { ListingStyles } from "./ListingsStyles";

const SellerDashboard = () => {
    // State for UI interactions
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('listings');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [newProperty, setNewProperty] = useState({
        title: '',
        location: '',
        price: '',
        acres: '',
        waterRights: '',
        suitableCrops: '',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' // Default image
    });
    const [editPropertyOpen, setEditPropertyOpen] = useState(false);
    const [editProperty, setEditProperty] = useState({
        id: '',
        title: '',
        location: '',
        price: '',
        acres: '',
        waterRights: '',
        suitableCrops: '',
        image: '',
        status: '',
        viewCount: 0,
        inquiries: 0,
        datePosted: ''
    });
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [activeProfileTab, setActiveProfileTab] = useState('personal');
    // Add these state variables to your component
    const [toolModalOpen, setToolModalOpen] = useState(false);
    const [activeToolModal, setActiveToolModal] = useState(null); // 'priceCalculator', 'marketAnalysis', or 'listingEnhancement'
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewListing, setPreviewListing] = useState(null);
    
    // Add this useEffect to handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            if (addNewOpen) setAddNewOpen(false);
            if (editPropertyOpen) setEditPropertyOpen(false);
            if (editProfileOpen) setEditProfileOpen(false);
            if (toolModalOpen) setToolModalOpen(false); // For the new seller tools modals
        }
        };
    
        // Add event listener
        window.addEventListener('keydown', handleKeyDown);
        
        // Clean up
        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [addNewOpen, editPropertyOpen, editProfileOpen, toolModalOpen]);

    // Mock user data (same as provided)
    const user = {
        firstName: 'Alex',
        lastName: 'Johnson',
        accountId: 'SELL24578',
        email: 'alex.johnson@example.com',
        phone: '0912 345 6789',
        username: 'alexj24',
        listingCount: 4,
        avatar: 'AJ'
    };

    const [userProfile, setUserProfile] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        password: '',
        confirmPassword: '',
        avatar: user.avatar || ''
    });
    
    // Mock property listings the seller owns
    const sellerListings = [
        {
        id: 1,
        title: 'Prime Rice Farm with Irrigation',
        location: 'Barangay Imelda, Cabanatuan, Nueva Ecija',
        price: '₱8,750,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 5.2, // In hectares
        waterRights: 'NIA Irrigation',
        suitableCrops: 'Rice, Corn, Vegetables',
        status: 'active',
        viewCount: 245,
        inquiries: 12,
        datePosted: '2025-03-15'
        },
        {
        id: 2,
        title: 'Fertile Farmland for Root Crops',
        location: 'Barangay Bantug, Cabanatuan, Nueva Ecija',
        price: '₱6,800,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 3.5, // In hectares
        waterRights: 'Deep Well',
        suitableCrops: 'Onions, Garlic, Sweet Potato',
        status: 'active',
        viewCount: 189,
        inquiries: 8,
        datePosted: '2025-04-02'
        },
        {
        id: 3,
        title: 'Orchard Land with Established Trees',
        location: 'Barangay San Josef, Cabanatuan, Nueva Ecija',
        price: '₱12,500,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 7.8, // In hectares
        waterRights: 'Deep Well + Rainwater Collection',
        suitableCrops: 'Mango, Guava, Calamansi, Banana',
        status: 'pending',
        viewCount: 56,
        inquiries: 3,
        datePosted: '2025-05-08'
        },
        {
        id: 4,
        title: 'Lowland Farm with Rich Soil',
        location: 'Barangay Pamaldan, Cabanatuan, Nueva Ecija',
        price: '₱4,950,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 2.3, // In hectares
        waterRights: 'Creek Access',
        suitableCrops: 'Eggplant, Okra, String Beans, Bitter Gourd',
        status: 'sold',
        viewCount: 321,
        inquiries: 15,
        datePosted: '2025-02-20'
        }
    ];

    // Mock recent activities for seller
    const recentActivities = [
        {
        id: 1,
        type: 'inquiry',
        title: 'New inquiry received for "Prime Rice Farm with Irrigation"',
        time: '2 hours ago',
        icon: <FaExclamationTriangle />,
        iconColor: '#3498db',
        bgColor: 'rgba(52, 152, 219, 0.1)'
        },
        {
        id: 2,
        type: 'view',
        title: 'Your "Fertile Farmland for Root Crops" received 28 new views',
        time: '1 day ago',
        icon: <FaEye />,
        iconColor: '#2ecc71',
        bgColor: 'rgba(46, 204, 113, 0.1)'
        },
        {
        id: 3,
        type: 'update',
        title: 'Your "Orchard Land" listing has been approved',
        time: '2 days ago',
        icon: <FaCheck />,
        iconColor: '#27ae60',
        bgColor: 'rgba(39, 174, 96, 0.1)'
        }
    ];

    // Mock market insights specific to sellers
    const marketInsights = [
        {
        id: 1,
        title: 'Price Trends for Rice Farms',
        text: 'Rice farm prices in Nueva Ecija have increased by 8% in the last quarter. Properties with NIA Irrigation command 15% premium.',
        accentColor: '#3498db'
        },
        {
        id: 2,
        title: 'Most Sought-After Areas',
        text: 'Farms in Barangay Imelda and Bantug are receiving the most inquiries, with an average time-to-sale of 45 days.',
        accentColor: '#e67e22'
        },
        {
        id: 3,
        title: 'Listing Optimization Tips',
        text: 'Listings with detailed soil analysis and crop history receive 40% more inquiries. Consider adding these details to boost interest.',
        accentColor: '#2ecc71'
        }
    ];

    // Mock performance metrics
    const performanceMetrics = [
        {
        title: 'Total Views',
        value: '811',
        trend: '+12%',
        isPositive: true
        },
        {
        title: 'Total Inquiries',
        value: '38',
        trend: '+5%',
        isPositive: true
        },
        {
        title: 'Avg. Time to Sale',
        value: '52 days',
        trend: '-8%',
        isPositive: true
        }
    ];

    // Function to handle edit listing
    const handleEditListing = (listing) => {
        setEditProperty({...listing});
        setEditPropertyOpen(true);
    };

    // Example usage in a React component
    const CropSelector = ({ value, onChange, name, required, placeholder }) => {
        // Parse the current value string into an array (assuming comma-separated values)
        const [selectedCrops, setSelectedCrops] = React.useState(() => {
            return value ? value.split(',').map(crop => crop.trim()) : [];
        });
        
        // Define the cropOptions array
        const cropOptions = [
            { value: 'rice', label: 'Rice' },
            { value: 'corn', label: 'Corn' },
            { value: 'vegetables', label: 'Vegetables' },
            { value: 'sugarcane', label: 'Sugarcane' },
            { value: 'coconut', label: 'Coconut' },
            { value: 'banana', label: 'Banana' },
            { value: 'mango', label: 'Mango' },
            { value: 'coffee', label: 'Coffee' }
        ];
        
        // This effect runs when the props.value changes
        React.useEffect(() => {
            if (value === undefined) return;
            
            const newCrops = value ? value.split(',').map(crop => crop.trim()) : [];
            // Only update the state if the values actually differ to prevent loops
            if (JSON.stringify(newCrops) !== JSON.stringify(selectedCrops)) {
                setSelectedCrops(newCrops);
            }
        }, [value]);
        
        // When a user selects a crop from the dropdown
        const handleSelectCrop = (e) => {
            const selectedValue = e.target.value;
            if (!selectedValue) return;
            
            const selectedLabel = cropOptions.find(option => option.value === selectedValue)?.label;
            
            if (selectedLabel && !selectedCrops.includes(selectedLabel)) {
                const newSelectedCrops = [...selectedCrops, selectedLabel];
                setSelectedCrops(newSelectedCrops);
                
                // Update the parent form with the new value string
                const newValue = newSelectedCrops.join(', ');
                onChange({ target: { name, value: newValue } });
                
                e.target.value = ''; // Reset dropdown
            }
        };
        
        // When a user removes a crop tag
        const handleRemoveCrop = (cropToRemove) => {
            const newSelectedCrops = selectedCrops.filter(crop => crop !== cropToRemove);
            setSelectedCrops(newSelectedCrops);
            
            // Update the parent form with the new value string
            const newValue = newSelectedCrops.join(', ');
            onChange({ target: { name, value: newValue } });
        };
        
        return (
            <>  
                <SellerDashboardStyles.CropSelectContainer>
                    {selectedCrops.length === 0 ? (
                        <span style={{ color: '#7f8c8d', padding: '4px' }}>{placeholder || "No crops selected"}</span>
                    ) : (
                        selectedCrops.map(crop => (
                            <SellerDashboardStyles.CropTag key={crop}>
                                {crop}
                                <SellerDashboardStyles.CropTagRemove onClick={() => handleRemoveCrop(crop)}>×</SellerDashboardStyles.CropTagRemove>
                            </SellerDashboardStyles.CropTag>
                        ))
                    )}
                </SellerDashboardStyles.CropSelectContainer>

                <SellerDashboardStyles.CropSelectDropdown onChange={handleSelectCrop}>
                    <option value="">Select crops...</option>
                    {cropOptions.map(crop => (
                        <option key={crop.value} value={crop.value}>{crop.label}</option>
                    ))}
                </SellerDashboardStyles.CropSelectDropdown>
                
                <input 
                    type="hidden"
                    name={name}
                    value={selectedCrops.join(', ')}
                    required={required}
                />
            </>
        );
    };   
    
    const handleEditPropertyChange = (e) => {
        const { name, value } = e.target;
        setEditProperty(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleEditPropertySubmit = (e) => {
        e.preventDefault();
        
        // Update listing in your state or make API call
        const updatedListings = sellerListings.map(listing => 
            listing.id === editProperty.id ? editProperty : listing
        );
        
        // Update your state with the new listings
        // setSellerListings(updatedListings);
        
        // Close the modal
        setEditPropertyOpen(false);
        
        // Show success notification
        alert('Property updated successfully!');
    };

    const handleEditProfile = () => {
        setUserProfile({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            username: user.username || '',
            password: '',
            confirmPassword: '',
            avatar: user.avatar || ''
        });
        setEditProfileOpen(true);
    };
    
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (userProfile.password && userProfile.password !== userProfile.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        // Update user profile in your state or make API call
        // setUser({...user, ...userProfile});
        
        // Close the modal
        setEditProfileOpen(false);
        
        // Show success notification
        alert('Profile updated successfully!');
    };

    const handlePreviewListing = (listing) => {
        setPreviewListing(listing);
        setPreviewModalOpen(true);
    };
      
    const closePreviewModal = () => {
        setPreviewModalOpen(false);
    };

    // Function to handle delete listing
    const handleDeleteListing = (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
        alert(`Listing ID ${listingId} would be deleted in a real application`);
        // Add actual delete functionality here
        }
    };

    // Function to handle adding new listing
    const handleAddNewListing = () => {
        setAddNewOpen(true);
    };

    // Function to handle logout
    const handleLogout = () => {
        alert('Logout functionality will be implemented here');
        // Add actual logout functionality here
    };

    const handleOpenTool = (tool) => {
        setActiveToolModal(tool);
        setToolModalOpen(true);
    };

    // Function to get status badge style
    const getStatusStyle = (status) => {
        switch (status) {
        case 'active':
            return { background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71' };
        case 'pending':
            return { background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12' };
        case 'sold':
            return { background: 'rgba(52, 152, 219, 0.1)', color: '#3498db' };
        default:
            return { background: 'rgba(189, 195, 199, 0.1)', color: '#bdc3c7' };
        }
    };

    const handleNewPropertyChange = (e) => {
        const { name, value } = e.target;
        setNewProperty(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handler for form submission
    const handleNewPropertySubmit = (e) => {
        e.preventDefault();
        
        // In a real application, you would send this data to your backend
        alert(`New property "${newProperty.title}" would be added to your listings in a real application.`);
        
        // Close the modal and reset the form
        setAddNewOpen(false);
        setNewProperty({
            title: '',
            location: '',
            price: '',
            acres: '',
            waterRights: '',
            suitableCrops: '',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
        });
    };

    return (
        <DashboardStyles.DashboardContainer>
            {/* Main Content */}
            <DashboardStyles.DashboardContent>
                {/* Welcome Section */}
                {/* <DashboardStyles.WelcomeSection>
                <DashboardStyles.WelcomeContent>
                    <DashboardStyles.WelcomeTitle>
                    Welcome to your Seller Dashboard, {user.firstName}!
                    </DashboardStyles.WelcomeTitle>
                    <DashboardStyles.WelcomeText>
                    Manage your agricultural property listings, track performance metrics, and respond to inquiries from potential buyers. Your success in selling farm properties starts here.
                    </DashboardStyles.WelcomeText>
                    
                    <DashboardStyles.ActionButton primary onClick={handleAddNewListing} style={{ backgroundColor: "#0a69a8" }}>
                    Add New Property Listing <FaPlus style={{ marginLeft: 8 }} />
                    </DashboardStyles.ActionButton>
                </DashboardStyles.WelcomeContent>
                </DashboardStyles.WelcomeSection> */}
                
                <div style={{ marginBottom: '24px' }}>
                    <DashboardStyles.SectionTitle>
                        <FaChartBar size={20} style={{ marginRight: 8 }} /> Performance Metrics
                    </DashboardStyles.SectionTitle>
                    {/* MOVED: Performance Metrics Section - NOW AT THE TOP */}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {performanceMetrics.map((metric, index) => (
                        <DashboardStyles.StatCard key={index}>
                            <DashboardStyles.StatCardTitle>{metric.title}</DashboardStyles.StatCardTitle>
                            <DashboardStyles.StatCardValue>{metric.value}</DashboardStyles.StatCardValue>
                            <DashboardStyles.StatCardTrend isPositive={metric.isPositive}>
                            {metric.isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />} {metric.trend}
                            </DashboardStyles.StatCardTrend>
                        </DashboardStyles.StatCard>
                        ))}
                    </div>
                </div>
                {/* Main Grid Content */}
                <DashboardStyles.GridContainer>
                    {/* Left Column */}
                    <div className="left-column" style={{ order: 1 }}>
                        {/* Listings Section */}
                        <DashboardStyles.SavedPropertiesSection>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <DashboardStyles.SectionTitle>
                                <FaTractor size={20} style={{ marginRight: 8 }} /> Your Property Listings
                            </DashboardStyles.SectionTitle>
                            <DashboardStyles.ViewAllLink onClick={handleAddNewListing}>
                            Add New <FaPlus size={12} style={{ marginLeft: 4 }} />
                            </DashboardStyles.ViewAllLink>
                        </div>
                        
                        <DashboardStyles.TabsContainer>
                            <DashboardStyles.Tab active={activeTab === 'listings'} onClick={() => setActiveTab('listings')}>
                            All Listings ({sellerListings.length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
                            Active ({sellerListings.filter(l => l.status === 'active').length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                            Pending ({sellerListings.filter(l => l.status === 'pending').length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab active={activeTab === 'sold'} onClick={() => setActiveTab('sold')}>
                            Sold ({sellerListings.filter(l => l.status === 'sold').length})
                            </DashboardStyles.Tab>
                        </DashboardStyles.TabsContainer>
                        
                        {sellerListings
                            .filter(listing => {
                            if (activeTab === 'listings') return true;
                            return listing.status === activeTab;
                            })
                            .map(listing => (
                            <DashboardStyles.PropertyCard key={listing.id}>
                            <DashboardStyles.PropertyImageContainer>
                                <DashboardStyles.PropertyImage src={listing.image} alt={listing.title} />
                                <div style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                ...getStatusStyle(listing.status)
                                }}>
                                {listing.status.toUpperCase()}
                                </div>
                            </DashboardStyles.PropertyImageContainer>
                            
                            <DashboardStyles.PropertyContent>
                                <DashboardStyles.PropertyTitle>{listing.title}</DashboardStyles.PropertyTitle>
                                <DashboardStyles.PropertyLocation>
                                <FaMapMarkerAlt size={12} /> {listing.location}
                                </DashboardStyles.PropertyLocation>
                                <DashboardStyles.PropertyPrice>{listing.price}</DashboardStyles.PropertyPrice>
                                
                                <DashboardStyles.PropertySpecs>
                                <DashboardStyles.PropertySpec>
                                    <FaRulerCombined size={14} /> {listing.acres} Hectares
                                </DashboardStyles.PropertySpec>
                                <DashboardStyles.PropertySpec>
                                    <FaWater size={14} /> {listing.waterRights}
                                </DashboardStyles.PropertySpec>
                                </DashboardStyles.PropertySpecs>
                                
                                <DashboardStyles.SuitableCrops>
                                <FaSeedling size={14} style={{ marginRight: '5px' }} /> <strong>Ideal for:</strong>&nbsp; {listing.suitableCrops}
                                </DashboardStyles.SuitableCrops>
                                
                                <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginTop: '12px',
                                padding: '8px 0',
                                borderTop: '1px solid #f0f0f0',
                                fontSize: '13px',
                                color: '#7f8c8d'
                                }}>
                                <span><FaEye size={12} style={{ marginRight: '4px' }} /> {listing.viewCount} views</span>
                                <span><FaExclamationTriangle size={12} style={{ marginRight: '4px' }} /> {listing.inquiries} inquiries</span>
                                <span><FaRegClock size={12} style={{ marginRight: '4px' }} /> Listed: {listing.datePosted}</span>
                                </div>
                                
                                <DashboardStyles.PropertyActions>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <DashboardStyles.ActionButton small onClick={() => handleEditListing(listing)} style={{ backgroundColor: "#3498db" }}>
                                        <FaEdit size={12} style={{ marginRight: '4px' }} /> Edit
                                        </DashboardStyles.ActionButton>
                                        {listing.status !== 'sold' && (
                                        <DashboardStyles.ActionButton small onClick={() => handleDeleteListing(listing.id)} style={{ backgroundColor: "#e74c3c" }}>
                                            <FaTrash size={12} style={{ marginRight: '4px' }} /> Delete
                                        </DashboardStyles.ActionButton>
                                        )}
                                    </div>
                                    <DashboardStyles.ActionButton small onClick={() => handlePreviewListing(listing)} style={{ backgroundColor: "#2ecc71" }}>
                                        <FaEye size={12} style={{ marginRight: '4px' }} /> Preview
                                    </DashboardStyles.ActionButton>
                                </DashboardStyles.PropertyActions>
                            </DashboardStyles.PropertyContent>
                            </DashboardStyles.PropertyCard>
                        ))}
                        </DashboardStyles.SavedPropertiesSection>
                        
                        {/* Market Insights Section */}
                        <DashboardStyles.MarketInsightsSection>
                        <DashboardStyles.InsightsTitle>Agricultural Market Insights for Sellers</DashboardStyles.InsightsTitle>
                        
                        {marketInsights.map(insight => (
                            <DashboardStyles.InsightCard key={insight.id} accentColor={insight.accentColor}>
                            <DashboardStyles.InsightTitle>{insight.title}</DashboardStyles.InsightTitle>
                            <DashboardStyles.InsightText>{insight.text}</DashboardStyles.InsightText>
                            </DashboardStyles.InsightCard>
                        ))}
                        </DashboardStyles.MarketInsightsSection>
                    </div>
            
                    {/* Right Column */}
                    <div className="right-column" style={{ order: 2 }}>
                        {/* Profile Section */}
                        <DashboardStyles.ProfileSection>
                        <DashboardStyles.ProfileHeader>
                            <DashboardStyles.ProfileAvatarLarge>
                            {user.avatar}
                            </DashboardStyles.ProfileAvatarLarge>
                            <DashboardStyles.ProfileName>
                            {user.firstName} {user.lastName}
                            </DashboardStyles.ProfileName>
                            <DashboardStyles.ProfileRole>Verified Seller</DashboardStyles.ProfileRole>
                        </DashboardStyles.ProfileHeader>
                        
                        <DashboardStyles.ProfileDetails>
                            <DashboardStyles.ProfileDetailItem>
                                <DashboardStyles.ProfileDetailLabel>Account ID</DashboardStyles.ProfileDetailLabel>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DashboardStyles.ProfileDetailValue>{user.accountId}</DashboardStyles.ProfileDetailValue>
                                    <SellerDashboardStyles.CopyButton 
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.accountId);
                                            alert('Account ID copied to clipboard!');
                                        }}
                                        title="Copy Account ID"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </SellerDashboardStyles.CopyButton>
                                </div>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                            <DashboardStyles.ProfileDetailLabel>Email Address</DashboardStyles.ProfileDetailLabel>
                            <DashboardStyles.ProfileDetailValue>{user.email}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                            <DashboardStyles.ProfileDetailLabel>Phone Number</DashboardStyles.ProfileDetailLabel>
                            <DashboardStyles.ProfileDetailValue>{user.phone}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                            <DashboardStyles.ProfileDetailLabel>Username</DashboardStyles.ProfileDetailLabel>
                            <DashboardStyles.ProfileDetailValue>{user.username}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                            <DashboardStyles.ProfileDetailLabel>Listing Count</DashboardStyles.ProfileDetailLabel>
                            <DashboardStyles.ProfileDetailValue>{user.listingCount}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                        </DashboardStyles.ProfileDetails>
                        
                        <DashboardStyles.ProfileActions>
                            <DashboardStyles.ProfileButton onClick={handleEditProfile}>
                            <FaUser size={14} /> Edit Profile
                            </DashboardStyles.ProfileButton>
                            <DashboardStyles.ProfileButton primary onClick={handleLogout}>
                            <FaSignOutAlt size={14} /> Logout
                            </DashboardStyles.ProfileButton>
                        </DashboardStyles.ProfileActions>
                        </DashboardStyles.ProfileSection>
                        
                        {/* Seller Tools Section */}
                        <div style={{ 
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        marginBottom: '24px'
                        }}>
                        <h3 style={{ 
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#2C3E50',
                            marginTop: '0',
                            marginBottom: '16px'
                        }}>Seller Tools</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(52, 152, 219, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleOpenTool('priceCalculator')}
                            >
                            <div style={{ 
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginRight: '12px'
                            }}>
                                <FaMoneyBillWave size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '4px' }}>Price Calculator</div>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Estimate optimal pricing for your property</div>
                            </div>
                            </div>
                            
                            <div 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(46, 204, 113, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleOpenTool('marketAnalysis')}
                            >
                            <div style={{ 
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#2ecc71',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginRight: '12px'
                            }}>
                                <FaChartLine size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '4px' }}>Market Analysis</div>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Research comparable properties and trends</div>
                            </div>
                            </div>
                            
                            <div 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(243, 156, 18, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleOpenTool('listingEnhancement')}
                            >
                            <div style={{ 
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: '#f39c12',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                marginRight: '12px'
                            }}>
                                <FaWarehouse size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '4px' }}>Listing Enhancement</div>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}>Get tips to improve your property listings</div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        {/* Recent Activity Section */}
                        <DashboardStyles.RecentActivitySection>
                        <DashboardStyles.RecentActivityTitle>Recent Activity</DashboardStyles.RecentActivityTitle>
                        
                        <DashboardStyles.ActivityList>
                            {recentActivities.map(activity => (
                            <DashboardStyles.ActivityItem key={activity.id}>
                                <DashboardStyles.ActivityIcon 
                                bgColor={activity.bgColor}
                                iconColor={activity.iconColor}
                                >
                                {activity.icon}
                                </DashboardStyles.ActivityIcon>
                                
                                <DashboardStyles.ActivityContent>
                                <DashboardStyles.ActivityTitle>{activity.title}</DashboardStyles.ActivityTitle>
                                <DashboardStyles.ActivityTime>{activity.time}</DashboardStyles.ActivityTime>
                                </DashboardStyles.ActivityContent>
                            </DashboardStyles.ActivityItem>
                            ))}
                        </DashboardStyles.ActivityList>
                        </DashboardStyles.RecentActivitySection>
                    </div>
                </DashboardStyles.GridContainer>
                
                {/* Add New Property Modal */}
                {addNewOpen && (
                    <SellerDashboardStyles.ModalOverlay>
                        <SellerDashboardStyles.ModalContainer>
                            <SellerDashboardStyles.ModalHeader>
                                <SellerDashboardStyles.ModalTitle>
                                    Add New Property Listing
                                </SellerDashboardStyles.ModalTitle>
                                <SellerDashboardStyles.ModalCloseButton onClick={() => setAddNewOpen(false)}>
                                    ×
                                </SellerDashboardStyles.ModalCloseButton>
                            </SellerDashboardStyles.ModalHeader>
                            
                            <form onSubmit={handleNewPropertySubmit}>
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Property Title*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormInput
                                        type="text"
                                        name="title"
                                        value={newProperty.title}
                                        onChange={handleNewPropertyChange}
                                        required
                                        placeholder="E.g., Prime Rice Farm with Irrigation"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Location*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormInput
                                        type="text"
                                        name="location"
                                        value={newProperty.location}
                                        onChange={handleNewPropertyChange}
                                        required
                                        placeholder="E.g., Barangay Imelda, Cabanatuan, Nueva Ecija"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormRow>
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Price (₱)*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="text"
                                            name="price"
                                            value={newProperty.price}
                                            onChange={handleNewPropertyChange}
                                            required
                                            placeholder="E.g., 8,750,000"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Size (Hectares)*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="number"
                                            step="0.1"
                                            name="acres"
                                            value={newProperty.acres}
                                            onChange={handleNewPropertyChange}
                                            required
                                            placeholder="E.g., 5.2"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                </SellerDashboardStyles.FormRow>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Water Rights*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormSelect
                                        name="waterRights"
                                        value={newProperty.waterRights}
                                        onChange={handleNewPropertyChange}
                                        required
                                    >
                                        <option value="">Select water source</option>
                                        <option value="NIA Irrigation">NIA Irrigation</option>
                                        <option value="Deep Well">Deep Well</option>
                                        <option value="Creek Access">Creek Access</option>
                                        <option value="Rain-fed Only">Rain-fed Only</option>
                                        <option value="Deep Well + Rainwater Collection">Deep Well + Rainwater Collection</option>
                                        <option value="River Access">River Access</option>
                                    </SellerDashboardStyles.FormSelect>
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Suitable Crops*</SellerDashboardStyles.FormLabel>
                                    <CropSelector
                                        name="suitableCrops"
                                        value={editProperty.suitableCrops}
                                        onChange={handleEditPropertyChange}
                                        required
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormActions>
                                    <SellerDashboardStyles.FormCancelButton
                                        type="button"
                                        onClick={() => setAddNewOpen(false)}
                                    >
                                        Cancel
                                    </SellerDashboardStyles.FormCancelButton>
                                    
                                    <SellerDashboardStyles.FormSubmitButton type="submit">
                                        Add Property
                                    </SellerDashboardStyles.FormSubmitButton>
                                </SellerDashboardStyles.FormActions>
                            </form>
                        </SellerDashboardStyles.ModalContainer>
                    </SellerDashboardStyles.ModalOverlay>
                )}

                {editPropertyOpen && (
                    <SellerDashboardStyles.ModalOverlay>
                        <SellerDashboardStyles.ModalContainer>
                            <SellerDashboardStyles.ModalHeader>
                                <SellerDashboardStyles.ModalTitle>
                                    Edit Property Listing
                                </SellerDashboardStyles.ModalTitle>
                                <SellerDashboardStyles.ModalCloseButton onClick={() => setEditPropertyOpen(false)}>
                                    ×
                                </SellerDashboardStyles.ModalCloseButton>
                            </SellerDashboardStyles.ModalHeader>
                            
                            <form onSubmit={handleEditPropertySubmit}>
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Property Title*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormInput
                                        type="text"
                                        name="title"
                                        value={editProperty.title}
                                        onChange={handleEditPropertyChange}
                                        required
                                        placeholder="E.g., Prime Rice Farm with Irrigation"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Location*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormInput
                                        type="text"
                                        name="location"
                                        value={editProperty.location}
                                        onChange={handleEditPropertyChange}
                                        required
                                        placeholder="E.g., Barangay Imelda, Cabanatuan, Nueva Ecija"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormRow>
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Price (₱)*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="text"
                                            name="price"
                                            value={editProperty.price}
                                            onChange={handleEditPropertyChange}
                                            required
                                            placeholder="E.g., 8,750,000"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Size (Hectares)*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="number"
                                            step="0.1"
                                            name="acres"
                                            value={editProperty.acres}
                                            onChange={handleEditPropertyChange}
                                            required
                                            placeholder="E.g., 5.2"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                </SellerDashboardStyles.FormRow>
                                
                                <SellerDashboardStyles.FormRow>
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Water Rights*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormSelect
                                            name="waterRights"
                                            value={editProperty.waterRights}
                                            onChange={handleEditPropertyChange}
                                            required
                                        >
                                            <option value="">Select water source</option>
                                            <option value="NIA Irrigation">NIA Irrigation</option>
                                            <option value="Deep Well">Deep Well</option>
                                            <option value="Creek Access">Creek Access</option>
                                            <option value="Rain-fed Only">Rain-fed Only</option>
                                            <option value="Deep Well + Rainwater Collection">Deep Well + Rainwater Collection</option>
                                            <option value="River Access">River Access</option>
                                        </SellerDashboardStyles.FormSelect>
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Status</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormSelect
                                            name="status"
                                            value={editProperty.status}
                                            onChange={handleEditPropertyChange}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="sold">Sold</option>
                                        </SellerDashboardStyles.FormSelect>
                                    </SellerDashboardStyles.FormGroup>
                                </SellerDashboardStyles.FormRow>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Suitable Crops*</SellerDashboardStyles.FormLabel>
                                    <CropSelector
                                        name="suitableCrops"
                                        value={editProperty.suitableCrops}
                                        onChange={handleEditPropertyChange}
                                        required
                                        placeholder="E.g., Rice, Corn, Vegetables"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormActions>
                                    <SellerDashboardStyles.FormCancelButton
                                        type="button"
                                        onClick={() => setEditPropertyOpen(false)}
                                    >
                                        Cancel
                                    </SellerDashboardStyles.FormCancelButton>
                                    
                                    <SellerDashboardStyles.FormSubmitButton type="submit">
                                        Update Property
                                    </SellerDashboardStyles.FormSubmitButton>
                                </SellerDashboardStyles.FormActions>
                            </form>
                        </SellerDashboardStyles.ModalContainer>
                    </SellerDashboardStyles.ModalOverlay>
                )}

                {editProfileOpen && (
                    <SellerDashboardStyles.ModalOverlay>
                        <SellerDashboardStyles.ModalContainer>
                            <SellerDashboardStyles.ModalHeader>
                                <SellerDashboardStyles.ModalTitle>
                                    Edit Profile
                                </SellerDashboardStyles.ModalTitle>
                                <SellerDashboardStyles.ModalCloseButton onClick={() => setEditProfileOpen(false)}>
                                    ×
                                </SellerDashboardStyles.ModalCloseButton>
                            </SellerDashboardStyles.ModalHeader>
                            
                            <SellerDashboardStyles.ProfileTabsContainer>
                                <SellerDashboardStyles.ProfileTab 
                                    active={activeProfileTab === 'personal'} 
                                    onClick={() => setActiveProfileTab('personal')}
                                >
                                    Personal Info
                                </SellerDashboardStyles.ProfileTab>
                                <SellerDashboardStyles.ProfileTab 
                                    active={activeProfileTab === 'security'} 
                                    onClick={() => setActiveProfileTab('security')}
                                >
                                    Security
                                </SellerDashboardStyles.ProfileTab>
                            </SellerDashboardStyles.ProfileTabsContainer>
                            
                            <form onSubmit={handleProfileSubmit}>
                                <SellerDashboardStyles.ProfileTabContent active={activeProfileTab === 'personal'}>
                                    <SellerDashboardStyles.AvatarUploadSection>
                                        <SellerDashboardStyles.AvatarPreview>
                                            {userProfile.avatar}
                                        </SellerDashboardStyles.AvatarPreview>
                                        <SellerDashboardStyles.AvatarUploadButton>
                                            <FaCamera size={14} /> Change Photo
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => {
                                                    // Handle file upload logic here
                                                    console.log(e.target.files[0]);
                                                    // You'd typically upload to a server and get back a URL
                                                }} 
                                            />
                                        </SellerDashboardStyles.AvatarUploadButton>
                                    </SellerDashboardStyles.AvatarUploadSection>
                                    
                                    <SellerDashboardStyles.FormRow>
                                        <SellerDashboardStyles.FormGroup>
                                            <SellerDashboardStyles.FormLabel>First Name*</SellerDashboardStyles.FormLabel>
                                            <SellerDashboardStyles.FormInput
                                                type="text"
                                                name="firstName"
                                                value={userProfile.firstName}
                                                onChange={handleProfileChange}
                                                required
                                            />
                                        </SellerDashboardStyles.FormGroup>
                                        
                                        <SellerDashboardStyles.FormGroup>
                                            <SellerDashboardStyles.FormLabel>Last Name*</SellerDashboardStyles.FormLabel>
                                            <SellerDashboardStyles.FormInput
                                                type="text"
                                                name="lastName"
                                                value={userProfile.lastName}
                                                onChange={handleProfileChange}
                                                required
                                            />
                                        </SellerDashboardStyles.FormGroup>
                                    </SellerDashboardStyles.FormRow>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Email Address*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="email"
                                            name="email"
                                            value={userProfile.email}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Phone Number*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="tel"
                                            name="phone"
                                            value={userProfile.phone}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Username*</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="text"
                                            name="username"
                                            value={userProfile.username}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                </SellerDashboardStyles.ProfileTabContent>
                                
                                <SellerDashboardStyles.ProfileTabContent active={activeProfileTab === 'security'}>
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Current Password</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="password"
                                            name="currentPassword"
                                            placeholder="Enter your current password"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>New Password</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="password"
                                            name="password"
                                            value={userProfile.password}
                                            onChange={handleProfileChange}
                                            placeholder="Enter new password"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                    
                                    <SellerDashboardStyles.FormGroup>
                                        <SellerDashboardStyles.FormLabel>Confirm New Password</SellerDashboardStyles.FormLabel>
                                        <SellerDashboardStyles.FormInput
                                            type="password"
                                            name="confirmPassword"
                                            value={userProfile.confirmPassword}
                                            onChange={handleProfileChange}
                                            placeholder="Confirm new password"
                                        />
                                    </SellerDashboardStyles.FormGroup>
                                </SellerDashboardStyles.ProfileTabContent>
                                
                                <SellerDashboardStyles.FormActions>
                                    <SellerDashboardStyles.FormCancelButton
                                        type="button"
                                        onClick={() => setEditProfileOpen(false)}
                                    >
                                        Cancel
                                    </SellerDashboardStyles.FormCancelButton>
                                    
                                    <SellerDashboardStyles.FormSubmitButton type="submit">
                                        Save Changes
                                    </SellerDashboardStyles.FormSubmitButton>
                                </SellerDashboardStyles.FormActions>
                            </form>
                        </SellerDashboardStyles.ModalContainer>
                    </SellerDashboardStyles.ModalOverlay>
                )}

                {/* Seller Tools Modal */}
                {toolModalOpen && (
                    <SellerDashboardStyles.ModalOverlay>
                        <SellerDashboardStyles.ModalContainer>
                        <SellerDashboardStyles.ModalHeader>
                            <SellerDashboardStyles.ModalTitle>
                            {activeToolModal === 'priceCalculator' && 'Property Price Calculator'}
                            {activeToolModal === 'marketAnalysis' && 'Market Analysis Tool'}
                            {activeToolModal === 'listingEnhancement' && 'Listing Enhancement Tips'}
                            </SellerDashboardStyles.ModalTitle>
                            <SellerDashboardStyles.ModalCloseButton onClick={() => setToolModalOpen(false)}>
                            ×
                            </SellerDashboardStyles.ModalCloseButton>
                        </SellerDashboardStyles.ModalHeader>
                        
                        {activeToolModal === 'priceCalculator' && (
                            <SellerDashboardStyles.ToolContainer>
                            <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Location</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.FormSelect>
                                <option>Select province</option>
                                <option>Nueva Ecija</option>
                                <option>Bulacan</option>
                                <option>Isabela</option>
                                <option>Pangasinan</option>
                                <option>Iloilo</option>
                                </SellerDashboardStyles.FormSelect>
                            </SellerDashboardStyles.FormGroup>
                            
                            <SellerDashboardStyles.FormRow>
                                <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Land Size (Hectares)</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.FormInput type="number" min="0.1" step="0.1" defaultValue="1.0" />
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Water Source</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.FormSelect>
                                    <option>Select water source</option>
                                    <option>NIA Irrigation</option>
                                    <option>Deep Well</option>
                                    <option>Creek Access</option>
                                    <option>Rain-fed Only</option>
                                </SellerDashboardStyles.FormSelect>
                                </SellerDashboardStyles.FormGroup>
                            </SellerDashboardStyles.FormRow>
                            
                            <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Property Quality</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.RangeSlider type="range" min="1" max="5" defaultValue="3" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                <small>Basic</small>
                                <small>Average</small>
                                <small>Premium</small>
                                </div>
                            </SellerDashboardStyles.FormGroup>
                            
                            <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Land Classification</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.CheckboxGroup>
                                <SellerDashboardStyles.Checkbox>
                                    <input type="checkbox" id="irrigated" defaultChecked />
                                    <label htmlFor="irrigated">Irrigated Agricultural</label>
                                </SellerDashboardStyles.Checkbox>
                                <SellerDashboardStyles.Checkbox>
                                    <input type="checkbox" id="nonirrigated" />
                                    <label htmlFor="nonirrigated">Non-Irrigated Agricultural</label>
                                </SellerDashboardStyles.Checkbox>
                                <SellerDashboardStyles.Checkbox>
                                    <input type="checkbox" id="commercial" />
                                    <label htmlFor="commercial">Commercial Potential</label>
                                </SellerDashboardStyles.Checkbox>
                                </SellerDashboardStyles.CheckboxGroup>
                            </SellerDashboardStyles.FormGroup>
                            
                            <SellerDashboardStyles.ToolResultBox>
                                <div style={{ marginBottom: '12px' }}>
                                <p style={{ fontSize: '14px', color: '#dddddd', margin: '0 0 8px 0' }}>Estimated price range based on current market conditions:</p>
                                <SellerDashboardStyles.ToolCardValue large bold color="#2980b9">₱850,000 - ₱950,000 per hectare</SellerDashboardStyles.ToolCardValue>
                                </div>
                                <p style={{ fontSize: '13px', color: '#dddddd', margin: '0' }}>
                                This estimate is based on recent sales data for similar properties in your selected region. Adjust the parameters above to refine the estimate.
                                </p>
                            </SellerDashboardStyles.ToolResultBox>
                            
                            <SellerDashboardStyles.FormActions>
                                <SellerDashboardStyles.FormCancelButton onClick={() => setToolModalOpen(false)}>
                                Close
                                </SellerDashboardStyles.FormCancelButton>
                                <SellerDashboardStyles.FormSubmitButton>
                                Save Estimate
                                </SellerDashboardStyles.FormSubmitButton>
                            </SellerDashboardStyles.FormActions>
                            </SellerDashboardStyles.ToolContainer>
                        )}
                        
                        {activeToolModal === 'marketAnalysis' && (
                            <SellerDashboardStyles.ToolContainer>
                            <SellerDashboardStyles.FormGroup>
                                <SellerDashboardStyles.FormLabel>Select Region</SellerDashboardStyles.FormLabel>
                                <SellerDashboardStyles.FormSelect>
                                <option>All Philippines</option>
                                <option>Luzon</option>
                                <option>Visayas</option>
                                <option>Mindanao</option>
                                </SellerDashboardStyles.FormSelect>
                            </SellerDashboardStyles.FormGroup>
                            
                            <SellerDashboardStyles.ToolGrid>
                                <SellerDashboardStyles.ToolCard>
                                <SellerDashboardStyles.ToolCardTitle>Avg. Price per Hectare</SellerDashboardStyles.ToolCardTitle>
                                <SellerDashboardStyles.ToolCardValue large>₱875,000</SellerDashboardStyles.ToolCardValue>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}><FaArrowUp style={{ color: '#2ecc71' }} /> 3.5% vs last quarter</div>
                                </SellerDashboardStyles.ToolCard>
                                
                                <SellerDashboardStyles.ToolCard>
                                <SellerDashboardStyles.ToolCardTitle>Avg. Time to Sell</SellerDashboardStyles.ToolCardTitle>
                                <SellerDashboardStyles.ToolCardValue large>72 days</SellerDashboardStyles.ToolCardValue>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}><FaArrowDown style={{ color: '#2ecc71' }} /> 5 days vs last quarter</div>
                                </SellerDashboardStyles.ToolCard>
                                
                                <SellerDashboardStyles.ToolCard>
                                <SellerDashboardStyles.ToolCardTitle>Active Listings</SellerDashboardStyles.ToolCardTitle>
                                <SellerDashboardStyles.ToolCardValue large>543</SellerDashboardStyles.ToolCardValue>
                                <div style={{ fontSize: '13px', color: '#7f8c8d' }}><FaArrowUp style={{ color: '#e74c3c' }} /> 12% vs last quarter</div>
                                </SellerDashboardStyles.ToolCard>
                            </SellerDashboardStyles.ToolGrid>
                            
                            <SellerDashboardStyles.ToolSection>
                                <SellerDashboardStyles.ToolSectionTitle>Market Trends</SellerDashboardStyles.ToolSectionTitle>
                                <div style={{ 
                                height: '200px', 
                                background: 'rgba(52, 152, 219, 0.1)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: '8px',
                                marginBottom: '16px'
                                }}>
                                <p>Market Trend Chart Would Appear Here</p>
                                </div>
                                <p style={{ fontSize: '14px', color: '#34495E', margin: '0' }}>
                                Current trends show increasing demand for agricultural properties with reliable irrigation systems, particularly in rice-growing regions.
                                </p>
                            </SellerDashboardStyles.ToolSection>
                            
                            <SellerDashboardStyles.ToolSection>
                                <SellerDashboardStyles.ToolSectionTitle>Comparable Properties</SellerDashboardStyles.ToolSectionTitle>
                                <div style={{ fontSize: '14px', color: '#dddddd' }}>
                                <div style={{ 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    background: 'rgba(52, 152, 219, 0.05)',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{ fontWeight: '600' }}>7.2 ha Rice Farm in Nueva Ecija</div>
                                    <div>₱6,480,000 (₱900,000/ha) • Sold 45 days ago</div>
                                </div>
                                <div style={{ 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    background: 'rgba(52, 152, 219, 0.05)',
                                    marginBottom: '8px'
                                }}>
                                    <div style={{ fontWeight: '600' }}>4.5 ha Agricultural Land in Bulacan</div>
                                    <div>₱3,825,000 (₱850,000/ha) • Sold 27 days ago</div>
                                </div>
                                <div style={{ 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    background: 'rgba(52, 152, 219, 0.05)'
                                }}>
                                    <div style={{ fontWeight: '600' }}>3.8 ha Farm in Tarlac</div>
                                    <div>₱3,230,000 (₱850,000/ha) • Sold 62 days ago</div>
                                </div>
                                </div>
                            </SellerDashboardStyles.ToolSection>
                            
                            <SellerDashboardStyles.FormActions>
                                <SellerDashboardStyles.FormCancelButton onClick={() => setToolModalOpen(false)}>
                                Close
                                </SellerDashboardStyles.FormCancelButton>
                                <SellerDashboardStyles.FormSubmitButton>
                                Download Report
                                </SellerDashboardStyles.FormSubmitButton>
                            </SellerDashboardStyles.FormActions>
                            </SellerDashboardStyles.ToolContainer>
                        )}
                        
                        {activeToolModal === 'listingEnhancement' && (
                            <SellerDashboardStyles.ToolContainer>
                            <p style={{ fontSize: '15px', color: '#34495E', lineHeight: '1.5' }}>
                                Use these expert tips to optimize your listings and attract more potential buyers.
                            </p>
                            
                            <SellerDashboardStyles.TipCard accentColor="#3498db">
                                <SellerDashboardStyles.TipTitle>
                                <FaCamera /> Quality Photography
                                </SellerDashboardStyles.TipTitle>
                                <SellerDashboardStyles.TipText>
                                Properties with professional photos receive 2x more views. Include images of:
                                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                    <li>Land boundaries and infrastructure</li>
                                    <li>Water sources and irrigation systems</li>
                                    <li>Current crops or vegetation (if any)</li>
                                    <li>Access roads and surrounding areas</li>
                                    <li>Panoramic views that show the full property</li>
                                </ul>
                                </SellerDashboardStyles.TipText>
                            </SellerDashboardStyles.TipCard>
                            
                            <SellerDashboardStyles.TipCard accentColor="#2ecc71" bgColor="rgba(46, 204, 113, 0.1)">
                                <SellerDashboardStyles.TipTitle>
                                <FaFileAlt /> Detailed Descriptions
                                </SellerDashboardStyles.TipTitle>
                                <SellerDashboardStyles.TipText>
                                Be specific about soil quality, water rights, and productive capacity. Mention:
                                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                    <li>Specific soil types and quality</li>
                                    <li>Reliable water sources and irrigation details</li>
                                    <li>Current and potential crops suitable for the land</li>
                                    <li>Recent improvements or infrastructure</li>
                                    <li>Historical yield data if available</li>
                                </ul>
                                </SellerDashboardStyles.TipText>
                            </SellerDashboardStyles.TipCard>
                            
                            <SellerDashboardStyles.TipCard accentColor="#f39c12" bgColor="rgba(243, 156, 18, 0.1)">
                                <SellerDashboardStyles.TipTitle>
                                <FaTags /> Strategic Pricing
                                </SellerDashboardStyles.TipTitle>
                                <SellerDashboardStyles.TipText>
                                Properties priced within 5% of market value sell 30% faster. Consider:
                                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                    <li>Recent sales of comparable properties in your area</li>
                                    <li>Current market trends for agricultural land</li>
                                    <li>Special features that add value (water rights, road access)</li>
                                    <li>Setting a price slightly below a round number (e.g. ₱8,975,000 instead of ₱9,000,000)</li>
                                </ul>
                                </SellerDashboardStyles.TipText>
                            </SellerDashboardStyles.TipCard>
                            
                            <SellerDashboardStyles.TipCard accentColor="#9b59b6" bgColor="rgba(155, 89, 182, 0.1)">
                                <SellerDashboardStyles.TipTitle>
                                <FaRegClock /> Response Time
                                </SellerDashboardStyles.TipTitle>
                                <SellerDashboardStyles.TipText>
                                Responding within 24 hours increases conversion by 40%. Make sure to:
                                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                    <li>Set up notifications for new inquiries</li>
                                    <li>Prepare answers to common questions in advance</li>
                                    <li>Schedule property viewings promptly</li>
                                    <li>Follow up with interested buyers within 48 hours</li>
                                </ul>
                                </SellerDashboardStyles.TipText>
                            </SellerDashboardStyles.TipCard>
                            
                            <SellerDashboardStyles.FormActions>
                                <SellerDashboardStyles.FormCancelButton onClick={() => setToolModalOpen(false)}>
                                Close
                                </SellerDashboardStyles.FormCancelButton>
                                <SellerDashboardStyles.FormSubmitButton>
                                Apply to Listings
                                </SellerDashboardStyles.FormSubmitButton>
                            </SellerDashboardStyles.FormActions>
                            </SellerDashboardStyles.ToolContainer>
                        )}
                        </SellerDashboardStyles.ModalContainer>
                    </SellerDashboardStyles.ModalOverlay>
                )}

                {previewModalOpen && previewListing && (
                    <ListingStyles.ModalOverlay>
                        <ListingStyles.ModalContent style={{ width: '90%', maxWidth: '1200px', maxHeight: '90vh', overflow: 'auto' }}>
                        <ListingStyles.ModalHeader>
                            <ListingStyles.ModalTitle>Listing Preview</ListingStyles.ModalTitle>
                            <ListingStyles.CloseButton onClick={closePreviewModal}>×</ListingStyles.CloseButton>
                        </ListingStyles.ModalHeader>
                        <div style={{ padding: '20px' }}>
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
                                        <ListingStyles.ListingPrice>₱{previewListing.price.toLocaleString()}</ListingStyles.ListingPrice>
                                        <ListingStyles.PriceUnit>PHP</ListingStyles.PriceUnit>
                                    </ListingStyles.PriceSection>
                                </ListingStyles.ListingHeader>
                                
                                <ListingStyles.ContentGrid>
                                <ListingStyles.MainContent>
                                    <ListingStyles.ImageGallery>
                                    <ListingStyles.MainImage src={previewListing.images[activeImageIndex]} alt={`Image ${activeImageIndex + 1} of agricultural property`} />
                                    <ListingStyles.GalleryControls>
                                        <ListingStyles.GalleryLeftButton onClick={handlePrevImage}>&lt;</ListingStyles.GalleryLeftButton>
                                        <ListingStyles.GalleryRightButton onClick={handleNextImage}>&gt;</ListingStyles.GalleryRightButton>
                                    </ListingStyles.GalleryControls>
                                    <ListingStyles.ImageThumbnails>
                                        {previewListing.images.map((img, index) => (
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
                                        <ListingStyles.SpecValue>{previewListing.size}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Type</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.type}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Soil Type</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.soilType}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Zoning</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.zoning}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Listed</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>
                                            {new Date(listing.listedDate).toLocaleDateString()}
                                        </ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Water Source</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.waterSource}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                    </ListingStyles.PropertySpecs>
                                    </ListingStyles.Section>
                                    
                                    <ListingStyles.Section>
                                    <ListingStyles.SectionTitle>Description</ListingStyles.SectionTitle>
                                    <ListingStyles.Description>{previewListing.description}</ListingStyles.Description>
                                    </ListingStyles.Section>
                                    
                                    <ListingStyles.Section>
                                    <ListingStyles.SectionTitle>Farm Details</ListingStyles.SectionTitle>
                                    <ListingStyles.PropertySpecs>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Previous Crops</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.previousCrops.join(', ')}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Average Yield</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.averageYield}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                        <ListingStyles.SpecItem>
                                        <ListingStyles.SpecLabel>Topography</ListingStyles.SpecLabel>
                                        <ListingStyles.SpecValue>{previewListing.topography}</ListingStyles.SpecValue>
                                        </ListingStyles.SpecItem>
                                    </ListingStyles.PropertySpecs>
                                    </ListingStyles.Section>
                                    
                                    <ListingStyles.Section>
                                    <ListingStyles.SectionTitle>Amenities</ListingStyles.SectionTitle>
                                    <ListingStyles.AmenitiesList>
                                        {previewListing.amenities.map((amenity, index) => (
                                        <ListingStyles.AmenityItem key={index}>{amenity}</ListingStyles.AmenityItem>
                                        ))}
                                    </ListingStyles.AmenitiesList>
                                    </ListingStyles.Section>
                                    
                                    <ListingStyles.Section>
                                    <ListingStyles.SectionTitle>Restrictions</ListingStyles.SectionTitle>
                                    <ListingStyles.RestrictionsList>
                                        {previewListing.restrictions.map((restriction, index) => (
                                        <ListingStyles.RestrictionItem key={index}>{restriction}</ListingStyles.RestrictionItem>
                                        ))}
                                    </ListingStyles.RestrictionsList>
                                    </ListingStyles.Section>
                                    
                                    <ListingStyles.Section>
                                    <ListingStyles.SectionTitle>Location</ListingStyles.SectionTitle>
                                    <ListingStyles.MapContainer>
                                        {/* In a real app, this would be replaced with a proper map component */}
                                        <ListingStyles.MapPlaceholder>
                                        Map showing location at {previewListing.address}
                                        </ListingStyles.MapPlaceholder>
                                    </ListingStyles.MapContainer>
                                    <ListingStyles.Address>{previewListing.address}</ListingStyles.Address>
                                    </ListingStyles.Section>
                                </ListingStyles.MainContent>
                                
                                <ListingStyles.Sidebar>
                                    <ListingStyles.SellerCard>
                                    <ListingStyles.SellerHeader>
                                        <ListingStyles.SellerAvatar src={previewListing.seller.profileImage} alt={previewListing.seller.name} />
                                        <ListingStyles.SellerInfo>
                                        <ListingStyles.SellerName>{previewListing.seller.name}</ListingStyles.SellerName>
                                        <ListingStyles.SellerRating>
                                            {'★'.repeat(Math.round(listing.seller.rating))} 
                                            <ListingStyles.RatingValue>({previewListing.seller.rating})</ListingStyles.RatingValue>
                                        </ListingStyles.SellerRating>
                                        </ListingStyles.SellerInfo>
                                    </ListingStyles.SellerHeader>
                                    <ListingStyles.SellerStats>
                                        <ListingStyles.StatItem>
                                        <ListingStyles.StatValue>{previewListing.seller.listings}</ListingStyles.StatValue>
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
                                        <ListingStyles.StatNumber>{previewListing.views}</ListingStyles.StatNumber>
                                        <ListingStyles.StatLabel>Views</ListingStyles.StatLabel>
                                        </ListingStyles.StatBox>
                                        <ListingStyles.StatBox>
                                        <ListingStyles.StatNumber>{previewListing.saved}</ListingStyles.StatNumber>
                                        <ListingStyles.StatLabel>Saved</ListingStyles.StatLabel>
                                        </ListingStyles.StatBox>
                                    </ListingStyles.StatsGrid>
                                    </ListingStyles.StatsCard>
                                </ListingStyles.Sidebar>
                                </ListingStyles.ContentGrid>
                            </ListingStyles.ListingContainer>
                        </div>
                        </ListingStyles.ModalContent>
                    </ListingStyles.ModalOverlay>
                    )}
            </DashboardStyles.DashboardContent>
        </DashboardStyles.DashboardContainer>
    );
};

export default SellerDashboard;
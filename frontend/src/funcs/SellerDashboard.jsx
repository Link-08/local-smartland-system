import React, { useState } from 'react';
import { 
  FaHome, FaUser, FaSignOutAlt, FaBell, FaHeart, 
  FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
  FaBed, FaBath, FaRulerCombined, FaRegClock,
  FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
  FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse,
  FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaChartBar,
  FaExclamationTriangle, FaCheck, FaEye
} from 'react-icons/fa';
import { DashboardStyles } from "./BuyerDashboardStyles";

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
        setSelectedListing(listing);
        setEditModalOpen(true);
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

    const AddPropertyModal = () => {
        if (!addNewOpen) return null;
        
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    padding: '24px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#2C3E50' }}>
                            Add New Property Listing
                        </h2>
                        <button 
                            onClick={() => setAddNewOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#7f8c8d'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handleNewPropertySubmit} style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                Property Title*
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newProperty.title}
                                onChange={handleNewPropertyChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '16px'
                                }}
                                placeholder="E.g., Prime Rice Farm with Irrigation"
                            />
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                Location*
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={newProperty.location}
                                onChange={handleNewPropertyChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '16px'
                                }}
                                placeholder="E.g., Barangay Imelda, Cabanatuan, Nueva Ecija"
                            />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Price (₱)*
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={newProperty.price}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px'
                                    }}
                                    placeholder="E.g., 8,750,000"
                                />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Size (Hectares)*
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="acres"
                                    value={newProperty.acres}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px'
                                    }}
                                    placeholder="E.g., 5.2"
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                Water Rights*
                            </label>
                            <select
                                name="waterRights"
                                value={newProperty.waterRights}
                                onChange={handleNewPropertyChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '16px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="">Select water source</option>
                                <option value="NIA Irrigation">NIA Irrigation</option>
                                <option value="Deep Well">Deep Well</option>
                                <option value="Creek Access">Creek Access</option>
                                <option value="Rain-fed Only">Rain-fed Only</option>
                                <option value="Deep Well + Rainwater Collection">Deep Well + Rainwater Collection</option>
                                <option value="River Access">River Access</option>
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                Suitable Crops*
                            </label>
                            <textarea
                                name="suitableCrops"
                                value={newProperty.suitableCrops}
                                onChange={handleNewPropertyChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '16px',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                placeholder="E.g., Rice, Corn, Vegetables"
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setAddNewOpen(false)}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    backgroundColor: '#f5f5f5',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            
                            <button
                                type="submit"
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#0a69a8',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Property
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <DashboardStyles.DashboardContainer>
        {/* Main Content */}
        <DashboardStyles.DashboardContent>
            {/* Welcome Section */}
            <DashboardStyles.WelcomeSection>
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
            </DashboardStyles.WelcomeSection>
            
            {/* Main Grid Content */}
            <DashboardStyles.GridContainer>
            {/* Left Column */}
            <div className="left-column" style={{ order: 1 }}>
                {/* MOVED: Performance Metrics Section - NOW AT THE TOP */}
                <div style={{ marginBottom: '24px' }}>
                <DashboardStyles.SectionTitle>
                    <FaChartBar size={20} style={{ marginRight: 8 }} /> Performance Metrics
                </DashboardStyles.SectionTitle>
                
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
                        <DashboardStyles.ActionButton small style={{ backgroundColor: "#2ecc71" }}>
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
                        <button 
                        onClick={() => {
                            navigator.clipboard.writeText(user.accountId);
                            alert('Account ID copied to clipboard!');
                        }}
                        style={{ 
                            background: '#f0f0f0',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            padding: '3px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        title="Copy Account ID"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        </button>
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
                    <DashboardStyles.ProfileButton>
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
                    <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(52, 152, 219, 0.1)',
                    cursor: 'pointer'
                    }}>
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
                    
                    <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(46, 204, 113, 0.1)',
                    cursor: 'pointer'
                    }}>
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
                    
                    <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(243, 156, 18, 0.1)',
                    cursor: 'pointer'
                    }}>
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
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '24px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#2C3E50' }}>
                                Add New Property Listing
                            </h2>
                            <button 
                                onClick={() => setAddNewOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#7f8c8d'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleNewPropertySubmit} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Property Title*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newProperty.title}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px'
                                    }}
                                    placeholder="E.g., Prime Rice Farm with Irrigation"
                                />
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Location*
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={newProperty.location}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px'
                                    }}
                                    placeholder="E.g., Barangay Imelda, Cabanatuan, Nueva Ecija"
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                        Price (₱)*
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={newProperty.price}
                                        onChange={handleNewPropertyChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '16px'
                                        }}
                                        placeholder="E.g., 8,750,000"
                                    />
                                </div>
                                
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                        Size (Hectares)*
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="acres"
                                        value={newProperty.acres}
                                        onChange={handleNewPropertyChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '16px'
                                        }}
                                        placeholder="E.g., 5.2"
                                    />
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Water Rights*
                                </label>
                                <select
                                    name="waterRights"
                                    value={newProperty.waterRights}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <option value="">Select water source</option>
                                    <option value="NIA Irrigation">NIA Irrigation</option>
                                    <option value="Deep Well">Deep Well</option>
                                    <option value="Creek Access">Creek Access</option>
                                    <option value="Rain-fed Only">Rain-fed Only</option>
                                    <option value="Deep Well + Rainwater Collection">Deep Well + Rainwater Collection</option>
                                    <option value="River Access">River Access</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Suitable Crops*
                                </label>
                                <textarea
                                    name="suitableCrops"
                                    value={newProperty.suitableCrops}
                                    onChange={handleNewPropertyChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '16px',
                                        minHeight: '100px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="E.g., Rice, Corn, Vegetables"
                                />
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setAddNewOpen(false)}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        backgroundColor: '#f5f5f5',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                
                                <button
                                    type="submit"
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#0a69a8',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardStyles.DashboardContent>
        </DashboardStyles.DashboardContainer>
    );
};

export default SellerDashboard;
import React, { useState, useEffect, useContext } from 'react';
import { 
    FaHome, FaUser, FaSignOutAlt, FaBell, FaHeart, 
    FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
    FaBed, FaBath, FaRulerCombined, FaRegClock,
    FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
    FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse
  } from 'react-icons/fa';
import { DashboardStyles } from "./BuyerDashboardStyles"
import axios from 'axios';
import AuthContext from './AuthContext';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BuyerDashboard = ({ navigateTo }) => {
    const { user: authUser, logout } = useContext(AuthContext);
    
    // State for UI interactions
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('saved');
    
    // State for user data and loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            console.log('Current token:', token); // Debug log
            
            if (!token) {
                console.log('No token found in localStorage'); // Debug log
                setError('No authentication token found. Please log in.');
                setLoading(false);
                navigateTo('/login');
                return;
            }

            try {
                console.log('Making request to /auth/me with token:', token); // Debug log
                const response = await axios.get('/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Response from /auth/me:', response.data); // Debug log
                
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    setError(null);
                } else {
                    console.log('Invalid response format:', response.data); // Debug log
                    throw new Error('Invalid response format from server');
                }
            } catch (err) {
                console.log('Error details:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                }); // Debug log
                
                let errorMessage = 'Failed to load user data. ';
                
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            errorMessage += 'Your session has expired. Please log in again.';
                            console.log('Session expired, logging out...'); // Debug log
                            logout();
                            navigateTo('/login');
                            break;
                        case 404:
                            errorMessage += 'User profile not found.';
                            break;
                        default:
                            errorMessage += 'Please try again later.';
                    }
                } else if (err.request) {
                    errorMessage += 'No response from server. Please check your connection.';
                } else {
                    errorMessage += err.message;
                }
                
                setError(errorMessage);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigateTo, logout]);

    // Mock saved properties
    const savedProperties = [
        {
        id: 1,
        title: 'Prime Rice Farm with Irrigation',
        location: 'Barangay Imelda, Cabanatuan, Nueva Ecija',
        price: '₱8,750,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 5.2, // In hectares
        waterRights: 'NIA Irrigation',
        suitableCrops: 'Rice, Corn, Vegetables'
        },
        {
        id: 2,
        title: 'Fertile Farmland for Root Crops',
        location: 'Barangay Bantug, Cabanatuan, Nueva Ecija',
        price: '₱6,800,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 3.5, // In hectares
        waterRights: 'Deep Well',
        suitableCrops: 'Onions, Garlic, Sweet Potato'
        },
        {
        id: 3,
        title: 'Orchard Land with Established Trees',
        location: 'Barangay San Josef, Cabanatuan, Nueva Ecija',
        price: '₱12,500,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 7.8, // In hectares
        waterRights: 'Deep Well + Rainwater Collection',
        suitableCrops: 'Mango, Guava, Calamansi, Banana'
        },
        {
        id: 4,
        title: 'Lowland Farm with Rich Soil',
        location: 'Barangay Pamaldan, Cabanatuan, Nueva Ecija',
        price: '₱4,950,000',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        acres: 2.3, // In hectares
        waterRights: 'Creek Access',
        suitableCrops: 'Eggplant, Okra, String Beans, Bitter Gourd'
        }
    ];
    
    // Mock recent activities
    const recentActivities = [
        {
        id: 1,
        type: 'view',
        title: 'You viewed "Productive Farmland with Irrigation"',
        time: '2 hours ago',
        icon: <FaSearch />,
        iconColor: '#3498db',
        bgColor: 'rgba(52, 152, 219, 0.1)'
        },
        {
        id: 2,
        type: 'favorite',
        title: 'You saved "Vineyard with Production Facility" to favorites',
        time: '1 day ago',
        icon: <FaHeart />,
        iconColor: '#e74c3c',
        bgColor: 'rgba(231, 76, 60, 0.1)'
        },
        {
        id: 3,
        type: 'alert',
        title: 'Price drop alert for properties in Wine Valley',
        time: '2 days ago',
        icon: <FaArrowDown />,
        iconColor: '#2ecc71',
        bgColor: 'rgba(46, 204, 113, 0.1)'
        }
    ];
    
    // Mock notifications
    const notifications = [
        {
        id: 1,
        message: 'New agricultural property matching your search criteria is available',
        time: '1 hour ago',
        icon: <FaTractor />,
        iconColor: '#3498db',
        bgColor: 'rgba(52, 152, 219, 0.1)',
        unread: true
        },
        {
        id: 2,
        message: 'Price reduced on "Productive Farmland with Irrigation"',
        time: '3 hours ago',
        icon: <FaArrowDown />,
        iconColor: '#2ecc71',
        bgColor: 'rgba(46, 204, 113, 0.1)',
        unread: true
        },
        {
        id: 3,
        message: 'Your scheduled farm viewing for tomorrow is confirmed',
        time: '1 day ago',
        icon: <FaRegClock />,
        iconColor: '#f39c12',
        bgColor: 'rgba(243, 156, 18, 0.1)',
        unread: false
        }
    ];
    
    // Mock market insights
    const marketInsights = [
        {
        id: 1,
        title: 'Rice Production Outlook',
        text: 'Nueva Ecija remains the top rice producer with yields increasing by 12% this year. Farms with reliable irrigation systems are seeing the highest return on investment.',
        accentColor: '#3498db'
        },
        {
        id: 2,
        title: 'High-Value Crop Market',
        text: 'Onion and garlic farms in Cabanatuan are experiencing increasing demand, with prices up 15% compared to last year due to export opportunities.',
        accentColor: '#2ecc71'
        },
        {
        id: 3,
        title: 'Fruit Cultivation Trend',
        text: 'Mango and calamansi orchards are becoming increasingly profitable in the region with new processing facilities opening in nearby municipalities.',
        accentColor: '#e67e22'
        }
    ];
    
    // Handle profile dropdown toggle
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        // Close notifications if open
        if (notificationsOpen) setNotificationsOpen(false);
    };
    
    // Handle notifications toggle
    const toggleNotifications = () => {
        setNotificationsOpen(!notificationsOpen);
        // Close profile dropdown if open
        if (profileDropdownOpen) setProfileDropdownOpen(false);
    };
    
    // Count unread notifications
    const unreadNotificationsCount = notifications.filter(n => n.unread).length;
    
    // Function to handle logout
    const handleLogout = () => {
        logout();
        navigateTo('/login');
    };
    
    // Function to redirect to property listings
    const goToPropertyListings = () => {
        navigateTo('listings');
    };

    if (loading) {
        return (
            <DashboardStyles.DashboardContainer>
                <DashboardStyles.DashboardContent>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Loading user data...
                    </div>
                </DashboardStyles.DashboardContent>
            </DashboardStyles.DashboardContainer>
        );
    }

    if (error) {
        return (
            <DashboardStyles.DashboardContainer>
                <DashboardStyles.DashboardContent>
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                        {error}
                    </div>
                </DashboardStyles.DashboardContent>
            </DashboardStyles.DashboardContainer>
        );
    }

    if (!user) {
        return (
            <DashboardStyles.DashboardContainer>
                <DashboardStyles.DashboardContent>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Please log in to view your dashboard.
                        <button 
                            onClick={() => navigateTo('/login')}
                            style={{
                                display: 'block',
                                margin: '1rem auto',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#0a69a8',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                </DashboardStyles.DashboardContent>
            </DashboardStyles.DashboardContainer>
        );
    }

    return (
        <DashboardStyles.DashboardContainer>
            {/* Main Content */}
            <DashboardStyles.DashboardContent>
                {/* Welcome Section */}
                <DashboardStyles.WelcomeSection>
                    <DashboardStyles.WelcomeContent>
                        <DashboardStyles.WelcomeTitle>
                        Welcome back, {user.firstName || user.username}!
                        </DashboardStyles.WelcomeTitle>
                        <DashboardStyles.WelcomeText>
                        Your ideal agricultural property is waiting in Nueva Ecija, the Rice Granary of the Philippines. Discover farms perfect for growing rice, vegetables, fruits, and other high-value crops.
                        </DashboardStyles.WelcomeText>
                        
                        <DashboardStyles.ActionButton primary onClick={goToPropertyListings} style={{ backgroundColor: "#0a69a8" }}>
                            Browse Agricultural Properties <FaArrowRight style={{ marginLeft: 8 }} />
                        </DashboardStyles.ActionButton>
                    </DashboardStyles.WelcomeContent>
                </DashboardStyles.WelcomeSection>
                
                {/* Quick Actions */}
                {/* <DashboardStyles.SectionTitle>
                    <FaChartLine size={20} style={{ marginRight: 8 }} /> Quick Actions
                </DashboardStyles.SectionTitle>
                
                <DashboardStyles.QuickActionsContainer>
                    <DashboardStyles.QuickActionCard onClick={goToPropertyListings}>
                        <DashboardStyles.QuickActionIcon bgColor="#3498db">
                        <FaSearch />
                        </DashboardStyles.QuickActionIcon>
                        <DashboardStyles.QuickActionTitle>Find Properties</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionText>
                        Search properties based on your preferences
                        </DashboardStyles.QuickActionText>
                        <DashboardStyles.ActionLink>
                        Start Searching <FaChevronRight size={12} />
                        </DashboardStyles.ActionLink>
                    </DashboardStyles.QuickActionCard>
                    
                    <DashboardStyles.QuickActionCard>
                        <DashboardStyles.QuickActionIcon bgColor="#e74c3c">
                            <FaHeart />
                            </DashboardStyles.QuickActionIcon>
                            <DashboardStyles.QuickActionTitle>Saved Properties</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionText>
                            View and manage your favorite properties
                        </DashboardStyles.QuickActionText>
                        <DashboardStyles.ActionLink>
                            View Favorites <FaChevronRight size={12} />
                        </DashboardStyles.ActionLink>
                    </DashboardStyles.QuickActionCard>
                    
                    <DashboardStyles.QuickActionCard>
                        <DashboardStyles.QuickActionIcon bgColor="#2ecc71">
                        <FaUser />
                        </DashboardStyles.QuickActionIcon>
                        <DashboardStyles.QuickActionTitle>Update Profile</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionText>
                        Manage your account and preferences
                        </DashboardStyles.QuickActionText>
                        <DashboardStyles.ActionLink>
                        Go to Profile <FaChevronRight size={12} />
                        </DashboardStyles.ActionLink>
                    </DashboardStyles.QuickActionCard>
                </DashboardStyles.QuickActionsContainer> */}
                
                {/* Main Grid Content */}
                <DashboardStyles.GridContainer>
                    {/* Right Column - Moved to the top for mobile view */}
                    <div className="right-column" style={{ order: 2 }}>
                        {/* Profile Section */}
                        <DashboardStyles.ProfileSection>
                        <DashboardStyles.ProfileHeader>
                            <DashboardStyles.ProfileAvatarLarge>
                            {user.avatar || user.username.charAt(0).toUpperCase()}
                            </DashboardStyles.ProfileAvatarLarge>
                            <DashboardStyles.ProfileName>
                            {user.firstName} {user.lastName}
                            </DashboardStyles.ProfileName>
                            <DashboardStyles.ProfileRole>Member</DashboardStyles.ProfileRole>
                        </DashboardStyles.ProfileHeader>
                        
                        <DashboardStyles.ProfileDetails>
                            <DashboardStyles.ProfileDetailItem>
                                <DashboardStyles.ProfileDetailLabel>Account ID</DashboardStyles.ProfileDetailLabel>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <DashboardStyles.ProfileDetailValue>{user.id}</DashboardStyles.ProfileDetailValue>
                                    <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(user.id);
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
                                <DashboardStyles.ProfileDetailValue>{user.phone || 'Not provided'}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                                <DashboardStyles.ProfileDetailLabel>Username</DashboardStyles.ProfileDetailLabel>
                                <DashboardStyles.ProfileDetailValue>{user.username}</DashboardStyles.ProfileDetailValue>
                            </DashboardStyles.ProfileDetailItem>
                            
                            <DashboardStyles.ProfileDetailItem>
                                <DashboardStyles.ProfileDetailLabel>Member Since</DashboardStyles.ProfileDetailLabel>
                                <DashboardStyles.ProfileDetailValue>
                                    {new Date(user.memberSince).toLocaleDateString()}
                                </DashboardStyles.ProfileDetailValue>
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

                    {/* Left Column */}
                    <div className="left-column" style={{ order: 1 }}>
                        {/* Saved Properties Section */}
                        <DashboardStyles.SavedPropertiesSection>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <DashboardStyles.SectionTitle>
                                <FaTractor size={20} style={{ marginRight: 8 }} /> Your Agricultural Properties
                            </DashboardStyles.SectionTitle>
                            <DashboardStyles.ViewAllLink>
                            View All <FaChevronRight size={12} />
                            </DashboardStyles.ViewAllLink>
                        </div>
                        
                        <DashboardStyles.TabsContainer>
                            <DashboardStyles.Tab active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
                            Saved Properties
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab active={activeTab === 'recent'} onClick={() => setActiveTab('recent')}>
                            Recently Viewed
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab active={activeTab === 'recommended'} onClick={() => setActiveTab('recommended')}>
                            Recommended Farms
                            </DashboardStyles.Tab>
                        </DashboardStyles.TabsContainer>
                        
                        {savedProperties.map(property => (
                            <DashboardStyles.PropertyCard key={property.id}>
                            <DashboardStyles.PropertyImageContainer>
                                <DashboardStyles.PropertyImage src={property.image} alt={property.title} />
                            </DashboardStyles.PropertyImageContainer>
                            
                            <DashboardStyles.PropertyContent>
                                <DashboardStyles.PropertyTitle>{property.title}</DashboardStyles.PropertyTitle>
                                <DashboardStyles.PropertyLocation>
                                <FaMapMarkerAlt size={12} /> {property.location}
                                </DashboardStyles.PropertyLocation>
                                <DashboardStyles.PropertyPrice>{property.price}</DashboardStyles.PropertyPrice>
                                
                                <DashboardStyles.PropertySpecs>
                                <DashboardStyles.PropertySpec>
                                    <FaRulerCombined size={14} /> {property.acres} Hectares
                                </DashboardStyles.PropertySpec>
                                <DashboardStyles.PropertySpec>
                                    <FaWater size={14} /> {property.waterRights}
                                </DashboardStyles.PropertySpec>
                                </DashboardStyles.PropertySpecs>
                                
                                <DashboardStyles.SuitableCrops>
                                    <FaSeedling size={14} style={{ marginRight: '5px' }} /> <strong>Ideal for:</strong>&nbsp; {property.suitableCrops}
                                </DashboardStyles.SuitableCrops>
                                
                                <DashboardStyles.PropertyActions>
                                <DashboardStyles.ActionButton small>View Details</DashboardStyles.ActionButton>
                                </DashboardStyles.PropertyActions>
                            </DashboardStyles.PropertyContent>
                            </DashboardStyles.PropertyCard>
                        ))}
                        </DashboardStyles.SavedPropertiesSection>
                        
                        {/* Market Insights Section */}
                        <DashboardStyles.MarketInsightsSection>
                        <DashboardStyles.InsightsTitle>Agricultural Market Insights</DashboardStyles.InsightsTitle>
                        
                        {marketInsights.map(insight => (
                            <DashboardStyles.InsightCard key={insight.id} accentColor={insight.accentColor}>
                            <DashboardStyles.InsightTitle>{insight.title}</DashboardStyles.InsightTitle>
                            <DashboardStyles.InsightText>{insight.text}</DashboardStyles.InsightText>
                            </DashboardStyles.InsightCard>
                        ))}
                        </DashboardStyles.MarketInsightsSection>
                    </div>
                    </DashboardStyles.GridContainer>
            </DashboardStyles.DashboardContent>
        </DashboardStyles.DashboardContainer>
    );
};

export default BuyerDashboard;
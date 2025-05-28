import React, { useState, useEffect, useContext } from 'react';
import { 
    FaHome, FaUser, FaSignOutAlt, FaBell, FaHeart, 
    FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
    FaBed, FaBath, FaRulerCombined, FaRegClock,
    FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
    FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse, FaCamera,
    FaExclamationTriangle, FaCheck
  } from 'react-icons/fa';
import { DashboardStyles } from "./BuyerDashboardStyles"
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const BuyerDashboard = ({ navigateTo }) => {
    const { user: authUser, logout, updateUser } = useAuth();
    
    // State for UI interactions
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('saved');
    
    // State for user data and loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for market insights and recent activities
    const [marketInsights, setMarketInsights] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingInsights, setLoadingInsights] = useState(true);
    const [loadingActivities, setLoadingActivities] = useState(true);
    
    // State for edit profile
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [activeProfileTab, setActiveProfileTab] = useState('personal');
    const [userProfile, setUserProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
        avatar: 'NA'
    });
    
    // State for saved properties
    const [savedProperties, setSavedProperties] = useState([]);
    const [loadingSavedProperties, setLoadingSavedProperties] = useState(true);
    
    // Update user state when authUser changes
    useEffect(() => {
        if (authUser) {
            setUser(authUser);
            setLoading(false);
            setError(null);
        } else {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            navigateTo('/login');
        }
    }, [authUser, navigateTo]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setLoadingSavedProperties(true);

                // Fetch user data
                const userResponse = await api.get(`/api/users/${authUser.id}`);
                setUser(userResponse.data);

                // Fetch saved properties
                const favoritesResponse = await api.get('/api/favorites');
                const favorites = favoritesResponse.data.map(fav => ({
                    id: fav.property.id,
                    title: fav.property.title,
                    location: fav.property.location,
                    price: fav.property.price,
                    acres: fav.property.acres,
                    waterRights: fav.property.waterRights,
                    suitableCrops: fav.property.suitableCrops,
                    image: fav.property.image || fav.property.images?.[0] || '/api/placeholder/800/500',
                    seller: fav.property.seller
                }));
                setSavedProperties(favorites);

                // Fetch market insights
                try {
                    const insightsResponse = await api.get('/api/market-insights');
                    setMarketInsights(insightsResponse.data);
                } catch (insightsError) {
                    // If the endpoint doesn't exist, use mock data
                    setMarketInsights([
                        {
                            id: 1,
                            title: 'Rice Farm Prices',
                            text: 'Average rice farm prices in Nueva Ecija have increased by 15% in the last quarter.',
                            accentColor: '#3498db'
                        },
                        {
                            id: 2,
                            title: 'Water Rights',
                            text: 'Properties with established water rights are selling 20% faster than those without.',
                            accentColor: '#2ecc71'
                        }
                    ]);
                }
                setLoadingInsights(false);

                // Fetch recent activities
                try {
                    const activitiesResponse = await api.get('/api/user-activities');
                    setRecentActivities(activitiesResponse.data);
                } catch (activityError) {
                    // If the endpoint doesn't exist, use mock data
                    setRecentActivities([
                        {
                            id: 1,
                            type: 'view',
                            message: 'Viewed property "Prime Rice Farm"',
                            timestamp: new Date().toISOString()
                        },
                        {
                            id: 2,
                            type: 'favorite',
                            message: 'Saved property "Fertile Farmland"',
                            timestamp: new Date(Date.now() - 86400000).toISOString()
                        }
                    ]);
                }
                setLoadingActivities(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoadingInsights(false);
                setLoadingActivities(false);
            } finally {
                setLoading(false);
                setLoadingSavedProperties(false);
            }
        };

        fetchData();
    }, [authUser.id]);

    // Helper function to get activity icon
    const getActivityIcon = (type) => {
        switch (type) {
            case 'view':
                return <FaSearch />;
            case 'favorite':
                return <FaHeart />;
            case 'alert':
                return <FaArrowDown />;
            case 'inquiry':
                return <FaExclamationTriangle />;
            case 'sale':
                return <FaCheck />;
            default:
                return <FaBell />;
        }
    };

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

    const handleEditProfile = () => {
        setUserProfile({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            username: user.username || '',
            password: '',
            confirmPassword: '',
            avatar: user.avatar || 'NA'
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

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const { firstName, lastName, email, phone, username, password, confirmPassword, currentPassword } = userProfile;
            
            // Handle password change if any password field is filled
            if (password || confirmPassword || currentPassword) {
                // Check if all password fields are filled
                if (!currentPassword) {
                    alert("Current password is required!");
                    return;
                }
                if (!password) {
                    alert("New password is required!");
                    return;
                }
                if (!confirmPassword) {
                    alert("Please confirm your new password!");
                    return;
                }

                // Validate password length
                if (password.length < 8) {
                    alert("Password must be at least 8 characters long!");
                    return;
                }

                // Validate password complexity
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumbers = /\d/.test(password);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

                if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                    alert("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!");
                    return;
                }

                // Validate password match
                if (password !== confirmPassword) {
                    alert("New passwords don't match!");
                    return;
                }
                
                try {
                    const response = await api.patch("/api/auth/password", {
                        currentPassword,
                        newPassword: password
                    });

                    if (response.data.success) {
                        alert("Password updated successfully! You will be logged out for security.");
                        // Log out the user after successful password change
                        if (logout) {
                            await logout();
                            if (navigateTo) {
                                navigateTo('login');
                            }
                        }
                        return;
                    }
                } catch (error) {
                    console.error('Password update error:', error);
                    alert("Failed to update password: " + (error.response?.data?.error || error.message));
                    return;
                }
            }
            
            // Handle profile update
            console.log('Submitting profile update with data:', { firstName, lastName, email, phone, username });
            
            const response = await api.patch("/api/auth/profile", {
                firstName,
                lastName,
                email,
                phone,
                username
            });
            
            console.log('Profile update response:', response.data);
            
            if (response.data && response.data.user) {
                // Update the user in AuthContext
                if (updateUser) {
                    await updateUser();
                }
                
                // Update local state with the complete user data
                setUserProfile(prev => ({
                    ...prev,
                    ...response.data.user,
                    password: '', // Clear password fields
                    confirmPassword: '',
                    currentPassword: ''
                }));
                
                setEditProfileOpen(false);
                alert("Profile updated successfully!");
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert("Failed to update profile: " + (error.response?.data?.error || error.message));
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match(/^image\/(jpg|jpeg|png|gif)$/)) {
            alert('Please select a valid image file (JPG, JPEG, PNG, or GIF)');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post('/api/auth/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.user) {
                if (updateUser) {
                    await updateUser();
                }
                setUserProfile(prev => ({
                    ...prev,
                    ...response.data.user,
                    password: '',
                    confirmPassword: '',
                    currentPassword: ''
                }));
                alert('Profile image updated successfully!');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            alert('Failed to upload profile image: ' + (error.response?.data?.error || error.message));
        }
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
                        
                        <DashboardStyles.ActionButton $primary onClick={goToPropertyListings} style={{ backgroundColor: "#0a69a8" }}>
                            Browse Agricultural Properties <FaArrowRight style={{ marginLeft: 8 }} />
                        </DashboardStyles.ActionButton>
                    </DashboardStyles.WelcomeContent>
                </DashboardStyles.WelcomeSection>
                
                {/* Quick Actions */}
                <DashboardStyles.QuickActionsContainer>
                    <DashboardStyles.QuickActionCard onClick={goToPropertyListings}>
                        <DashboardStyles.QuickActionIcon $bgColor="#3498db" $accentColor="white">
                            <FaSearch />
                        </DashboardStyles.QuickActionIcon>
                        <DashboardStyles.QuickActionTitle>Browse Properties</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionDescription>Find your perfect agricultural property</DashboardStyles.QuickActionDescription>
                    </DashboardStyles.QuickActionCard>
                    
                    <DashboardStyles.QuickActionCard onClick={() => setActiveTab('saved')}>
                        <DashboardStyles.QuickActionIcon $bgColor="#e74c3c" $accentColor="white">
                            <FaHeart />
                        </DashboardStyles.QuickActionIcon>
                        <DashboardStyles.QuickActionTitle>Saved Properties</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionDescription>View your favorite listings</DashboardStyles.QuickActionDescription>
                    </DashboardStyles.QuickActionCard>
                    
                    <DashboardStyles.QuickActionCard onClick={() => setActiveTab('alerts')}>
                        <DashboardStyles.QuickActionIcon $bgColor="#2ecc71" $accentColor="white">
                            <FaBell />
                        </DashboardStyles.QuickActionIcon>
                        <DashboardStyles.QuickActionTitle>Price Alerts</DashboardStyles.QuickActionTitle>
                        <DashboardStyles.QuickActionDescription>Get notified of price changes</DashboardStyles.QuickActionDescription>
                    </DashboardStyles.QuickActionCard>
                </DashboardStyles.QuickActionsContainer>
                
                {/* Main Grid Content */}
                <DashboardStyles.GridContainer>
                    {/* Right Column - Moved to the top for mobile view */}
                    <div className="right-column" style={{ order: 2 }}>
                        {/* Profile Section */}
                        <DashboardStyles.ProfileSection>
                        <DashboardStyles.ProfileHeader>
                            <DashboardStyles.ProfileAvatarLarge>
                                {user.avatar && user.avatar !== 'NA' ? (
                                    <img
                                        src={user.avatar.startsWith('http') ? user.avatar : `${api.defaults.baseURL}${user.avatar}`}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <>
                                        {user.firstName?.[0] || user.username?.[0]}
                                        {user.lastName?.[0]}
                                    </>
                                )}
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
                            <DashboardStyles.ProfileButton onClick={handleEditProfile}>
                                <FaUser size={14} /> Edit Profile
                            </DashboardStyles.ProfileButton>
                            <DashboardStyles.ProfileButton $primary onClick={handleLogout}>
                                <FaSignOutAlt size={14} /> Logout
                            </DashboardStyles.ProfileButton>
                        </DashboardStyles.ProfileActions>
                        </DashboardStyles.ProfileSection>
                        
                        {/* Recent Activity Section */}
                        <DashboardStyles.RecentActivitySection>
                        <DashboardStyles.RecentActivityTitle>Recent Activity</DashboardStyles.RecentActivityTitle>
                        
                        {loadingActivities ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>Loading activities...</div>
                        ) : recentActivities.length > 0 ? (
                            <DashboardStyles.ActivityList>
                                {recentActivities.map(activity => (
                                    <DashboardStyles.ActivityItem key={activity.id}>
                                        <DashboardStyles.ActivityIcon 
                                            $bgColor={activity.type === 'view' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(231, 76, 60, 0.1)'}
                                            $iconColor={activity.type === 'view' ? '#3498db' : '#e74c3c'}
                                        >
                                            {getActivityIcon(activity.type)}
                                        </DashboardStyles.ActivityIcon>
                                        
                                        <DashboardStyles.ActivityContent>
                                            <DashboardStyles.ActivityTitle>{activity.message}</DashboardStyles.ActivityTitle>
                                            <DashboardStyles.ActivityTime>
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </DashboardStyles.ActivityTime>
                                        </DashboardStyles.ActivityContent>
                                    </DashboardStyles.ActivityItem>
                                ))}
                            </DashboardStyles.ActivityList>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>No recent activities</div>
                        )}
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
                            <DashboardStyles.Tab $active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
                            Saved Properties
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab $active={activeTab === 'recent'} onClick={() => setActiveTab('recent')}>
                            Recently Viewed
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab $active={activeTab === 'recommended'} onClick={() => setActiveTab('recommended')}>
                            Recommended Farms
                            </DashboardStyles.Tab>
                        </DashboardStyles.TabsContainer>
                        
                        {loadingSavedProperties ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading saved properties...</div>
                        ) : savedProperties.length > 0 ? (
                            savedProperties.map(property => (
                                <DashboardStyles.PropertyCard key={property.id}>
                                <DashboardStyles.PropertyImageContainer>
                                    <DashboardStyles.PropertyImage src={property.image} alt={property.title} />
                                </DashboardStyles.PropertyImageContainer>
                                
                                <DashboardStyles.PropertyContent>
                                    <DashboardStyles.PropertyTitle>{property.title}</DashboardStyles.PropertyTitle>
                                    <DashboardStyles.PropertyLocation>
                                    <FaMapMarkerAlt size={12} /> {property.location}
                                    </DashboardStyles.PropertyLocation>
                                    <DashboardStyles.PropertyPrice>{formatPrice(property.price)}</DashboardStyles.PropertyPrice>
                                    
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
                                    <DashboardStyles.ActionButton $small onClick={() => navigateTo(`/listings/${property.id}`)}>
                                        View Details
                                    </DashboardStyles.ActionButton>
                                    </DashboardStyles.PropertyActions>
                                </DashboardStyles.PropertyContent>
                                </DashboardStyles.PropertyCard>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                No saved properties yet. Browse our listings to find your perfect agricultural property.
                            </div>
                        )}
                        </DashboardStyles.SavedPropertiesSection>
                        
                        {/* Market Insights Section */}
                        <DashboardStyles.MarketInsightsSection>
                        <DashboardStyles.InsightsTitle>Agricultural Market Insights</DashboardStyles.InsightsTitle>
                        
                        {loadingInsights ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>Loading market insights...</div>
                        ) : marketInsights.length > 0 ? (
                            marketInsights.map(insight => (
                                <DashboardStyles.InsightCard key={insight.id} $accentColor={insight.accentColor}>
                                    <DashboardStyles.InsightTitle>{insight.title}</DashboardStyles.InsightTitle>
                                    <DashboardStyles.InsightText>{insight.text}</DashboardStyles.InsightText>
                                </DashboardStyles.InsightCard>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>No market insights available</div>
                        )}
                        </DashboardStyles.MarketInsightsSection>
                    </div>
                    </DashboardStyles.GridContainer>
            </DashboardStyles.DashboardContent>
            {editProfileOpen && (
                <DashboardStyles.ModalOverlay>
                    <DashboardStyles.ModalContainer>
                        <DashboardStyles.ModalHeader>
                            <DashboardStyles.ModalTitle>
                                Edit Profile
                            </DashboardStyles.ModalTitle>
                            <DashboardStyles.ModalCloseButton onClick={() => setEditProfileOpen(false)}>
                                ×
                            </DashboardStyles.ModalCloseButton>
                        </DashboardStyles.ModalHeader>
                        
                        <DashboardStyles.ProfileTabsContainer>
                            <DashboardStyles.ProfileTab 
                                $active={activeProfileTab === 'personal'} 
                                onClick={() => setActiveProfileTab('personal')}
                            >
                                Personal Info
                            </DashboardStyles.ProfileTab>
                            <DashboardStyles.ProfileTab 
                                $active={activeProfileTab === 'security'} 
                                onClick={() => setActiveProfileTab('security')}
                            >
                                Security
                            </DashboardStyles.ProfileTab>
                        </DashboardStyles.ProfileTabsContainer>
                        
                        <form onSubmit={handleProfileSubmit}>
                            <DashboardStyles.ProfileTabContent $active={activeProfileTab === 'personal'}>
                                <DashboardStyles.AvatarUploadSection>
                                    <DashboardStyles.AvatarPreview>
                                        {userProfile.avatar && userProfile.avatar !== 'NA' ? (
                                            <img
                                                src={userProfile.avatar.startsWith('http') ? userProfile.avatar : `${api.defaults.baseURL}${userProfile.avatar}`}
                                                alt="Profile"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '50%',
                                                fontSize: '24px',
                                                color: '#666'
                                            }}>
                                                {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                                            </div>
                                        )}
                                    </DashboardStyles.AvatarPreview>
                                    <DashboardStyles.AvatarUploadButton>
                                        <FaCamera size={14} /> Change Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                        />
                                    </DashboardStyles.AvatarUploadButton>
                                </DashboardStyles.AvatarUploadSection>
                                <DashboardStyles.FormRow>
                                    <DashboardStyles.FormGroup>
                                        <DashboardStyles.FormLabel>First Name*</DashboardStyles.FormLabel>
                                        <DashboardStyles.FormInput
                                            type="text"
                                            name="firstName"
                                            value={userProfile.firstName}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </DashboardStyles.FormGroup>
                                    
                                    <DashboardStyles.FormGroup>
                                        <DashboardStyles.FormLabel>Last Name*</DashboardStyles.FormLabel>
                                        <DashboardStyles.FormInput
                                            type="text"
                                            name="lastName"
                                            value={userProfile.lastName}
                                            onChange={handleProfileChange}
                                            required
                                        />
                                    </DashboardStyles.FormGroup>
                                </DashboardStyles.FormRow>
                                
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>Email Address*</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="email"
                                        name="email"
                                        value={userProfile.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </DashboardStyles.FormGroup>
                                
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>Phone Number*</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="tel"
                                        name="phone"
                                        value={userProfile.phone}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </DashboardStyles.FormGroup>
                                
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>Username*</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="text"
                                        name="username"
                                        value={userProfile.username}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </DashboardStyles.FormGroup>
                            </DashboardStyles.ProfileTabContent>
                            
                            <DashboardStyles.ProfileTabContent $active={activeProfileTab === 'security'}>
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>Current Password</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="password"
                                        name="currentPassword"
                                        value={userProfile.currentPassword || ''}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your current password"
                                    />
                                </DashboardStyles.FormGroup>
                                
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>New Password</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="password"
                                        name="password"
                                        value={userProfile.password || ''}
                                        onChange={handleProfileChange}
                                        placeholder="Enter new password"
                                    />
                                </DashboardStyles.FormGroup>
                                
                                <DashboardStyles.FormGroup>
                                    <DashboardStyles.FormLabel>Confirm New Password</DashboardStyles.FormLabel>
                                    <DashboardStyles.FormInput
                                        type="password"
                                        name="confirmPassword"
                                        value={userProfile.confirmPassword || ''}
                                        onChange={handleProfileChange}
                                        placeholder="Confirm new password"
                                    />
                                </DashboardStyles.FormGroup>
                            </DashboardStyles.ProfileTabContent>
                            
                            <DashboardStyles.FormActions>
                                <DashboardStyles.FormCancelButton
                                    type="button"
                                    onClick={() => setEditProfileOpen(false)}
                                >
                                    Cancel
                                </DashboardStyles.FormCancelButton>
                                
                                <DashboardStyles.FormSubmitButton type="submit">
                                    Save Changes
                                </DashboardStyles.FormSubmitButton>
                            </DashboardStyles.FormActions>
                        </form>
                    </DashboardStyles.ModalContainer>
                </DashboardStyles.ModalOverlay>
            )}
        </DashboardStyles.DashboardContainer>
    );
};

export default BuyerDashboard;
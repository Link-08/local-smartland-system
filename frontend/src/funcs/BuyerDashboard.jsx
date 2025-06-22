import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaHome, FaUser, FaSignOutAlt, FaBell, FaHeart, 
    FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
    FaBed, FaBath, FaRulerCombined, FaRegClock,
    FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
    FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse, FaCamera,
    FaExclamationTriangle, FaCheck, FaChevronLeft, FaTimes, FaEnvelope, FaShare, FaEye, FaChartBar, FaSync, FaPlus, FaEdit, FaTrash,
    FaPhone, FaCog, FaMountain, FaCircleNotch
  } from 'react-icons/fa';
import { DashboardStyles } from "./BuyerDashboardStyles"
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from './formatUtils';
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

const BuyerDashboard = () => {
    const navigate = useNavigate();
    const { user: authUser, logout, updateUser } = useAuth();
    
    // State for UI interactions
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('saved');
    
    // Modal state
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyModalOpen, setPropertyModalOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [contactModalOpen, setContactModalOpen] = useState(false);
    
    // State for user data and loading
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for market insights and recent activities
    const [marketInsights, setMarketInsights] = useState({
        totalListings: 0,
        activeListings: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        averageAcres: 0,
        topLocations: [],
        cropDistribution: {},
        optimizationTips: []
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingInsights, setLoadingInsights] = useState(true);
    
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
        currentPassword: '',
        avatar: 'NA'
    });
    
    // State for saved properties
    const [savedProperties, setSavedProperties] = useState([]);
    const [loadingSavedProperties, setLoadingSavedProperties] = useState(true);
    
    // State for recently viewed properties
    const [recentlyViewedProperties, setRecentlyViewedProperties] = useState([]);
    const [loadingRecentlyViewed, setLoadingRecentlyViewed] = useState(true);
    
    // State for favorite status tracking
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const [checkingFavorite, setCheckingFavorite] = useState({});
    
    // Update user state when authUser changes
    useEffect(() => {
        if (authUser) {
            setUser(authUser);
            setLoading(false);
            setError(null);
        } else {
            setError('No authentication token found. Please log in.');
            setLoading(false);
            navigate('/login');
        }
    }, [authUser, navigate]);

    // Add effect to load cached saved properties on mount
    useEffect(() => {
        if (authUser && authUser.id) {
            // Load cached saved properties immediately
            const cachedData = localStorage.getItem(`savedProperties_${authUser.id}`);
            if (cachedData) {
                try {
                    const cachedProperties = JSON.parse(cachedData);
                    setSavedProperties(cachedProperties);
                    
                    // Initialize favorite status for cached properties
                    const initialFavoriteStatus = {};
                    cachedProperties.forEach(property => {
                        initialFavoriteStatus[property.id] = true;
                    });
                    setFavoriteStatus(initialFavoriteStatus);
                    
                    console.log('Loaded cached saved properties:', cachedProperties.length, 'properties');
                } catch (parseError) {
                    console.error('Error parsing cached saved properties:', parseError);
                }
            }
        }
    }, [authUser]);

    // Add effect to automatically refresh saved properties on mount and navigation
    useEffect(() => {
        if (authUser && authUser.id && !loading) {
            // Small delay to ensure user data is loaded first
            const timer = setTimeout(() => {
                refreshSavedProperties();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [authUser, loading]);

    // Add effect to handle authentication state changes
    useEffect(() => {
        const handleAuthChange = () => {
            // If user is authenticated, refresh saved properties
            if (authUser && authUser.id) {
                refreshSavedProperties();
            }
        };

        // Listen for authentication events
        window.addEventListener('auth:login', handleAuthChange);
        window.addEventListener('auth:logout', () => {
            setSavedProperties([]);
            setFavoriteStatus({});
        });

        return () => {
            window.removeEventListener('auth:login', handleAuthChange);
            window.removeEventListener('auth:logout', () => {
                setSavedProperties([]);
                setFavoriteStatus({});
            });
        };
    }, [authUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setLoadingSavedProperties(true);

                // Fetch user data
                const userResponse = await api.get('/api/auth/profile');
                setUser(userResponse.data);

                // Fetch saved properties with complete data
                const favoritesResponse = await api.get('/api/favorites');
                
                const favorites = favoritesResponse.data.map(fav => {
                    // The backend now returns the complete property object directly
                    const property = fav;
                    return {
                        id: property.id,
                        title: property.title,
                        description: property.description,
                        location: property.location,
                        price: property.price,
                        acres: property.acres,
                        waterRights: property.waterRights,
                        suitableCrops: property.suitableCrops,
                        type: property.type,
                        topography: property.topography,
                        averageYield: property.averageYield,
                        amenities: property.amenities,
                        restrictionsText: property.restrictionsText,
                        remarks: property.remarks,
                        image: property.image || property.images?.[0] || '/api/placeholder/800/500',
                        images: property.images || [],
                        barangay: property.barangay,
                        barangayData: property.barangayData,
                        seller: property.seller,
                        createdAt: property.createdAt,
                        updatedAt: property.updatedAt
                    };
                });
                setSavedProperties(favorites);
                
                // Initialize favorite status for saved properties
                const initialFavoriteStatus = {};
                favorites.forEach(property => {
                    initialFavoriteStatus[property.id] = true;
                });
                setFavoriteStatus(initialFavoriteStatus);

                // Fetch market insights
                try {
                    const insightsResponse = await api.get('/api/market-insights');
                    setMarketInsights(insightsResponse.data);
                } catch (insightsError) {
                    setMarketInsights({
                        totalListings: 0,
                        activeListings: 0,
                        averagePrice: 0,
                        priceRange: { min: 0, max: 0 },
                        averageAcres: 0,
                        topLocations: [],
                        cropDistribution: {},
                        optimizationTips: []
                    });
                }
                setLoadingInsights(false);

                // Fetch recent activities
                try {
                    const activitiesResponse = await api.get(`/api/user-activities/recent/${authUser.id}`);
                    setRecentActivities(activitiesResponse.data);
                } catch (activityError) {
                    setRecentActivities([]);
                }
                setLoadingInsights(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoadingInsights(false);
            } finally {
                setLoading(false);
                setLoadingSavedProperties(false);
            }
        };

        fetchData();
    }, [authUser.id]);

    // Add effect to refresh market insights when saved properties change
    useEffect(() => {
        if (savedProperties.length > 0) {
            fetchMarketInsights();
        }
    }, [savedProperties]);

    // Function to fetch market insights
    const fetchMarketInsights = async () => {
        try {
            const response = await api.get('/api/market-insights');
            setMarketInsights(response.data);
        } catch (error) {
            console.error('Error fetching market insights:', error);
        }
    };

    // Add effect to fetch recently viewed properties when tab changes
    useEffect(() => {
        if (activeTab === 'recent' && authUser && authUser.id) {
            fetchRecentlyViewedProperties();
        }
    }, [activeTab, authUser]);

    // Add CSS for loading animation
    React.useEffect(() => {
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

    // Add iconMap for consistency with seller dashboard
    const iconMap = {
        FaExclamationTriangle: <FaExclamationTriangle />,
        FaEye: <FaEye />,
        FaCheck: <FaCheck />,
        FaHeart: <FaHeart />,
        FaUser: <FaUser />,
        FaSearch: <FaSearch />,
        FaPlus: <FaPlus />,
        FaEdit: <FaEdit />,
        FaTrash: <FaTrash />,
        FaBell: <FaBell />
    };

    // Helper function to get activity icon
    const getActivityIcon = (type) => {
        switch (type) {
            case 'view':
            case 'property_viewed':
                return <FaEye />;
            case 'favorite':
            case 'property_favorited':
                return <FaHeart />;
            case 'alert':
                return <FaArrowDown />;
            case 'inquiry':
            case 'property_inquiry':
                return <FaExclamationTriangle />;
            case 'sale':
            case 'property_sold':
                return <FaCheck />;
            case 'property_created':
                return <FaPlus />;
            case 'property_updated':
                return <FaEdit />;
            case 'property_deleted':
                return <FaTrash />;
            case 'profile_updated':
                return <FaUser />;
            case 'search':
            case 'search_performed':
                return <FaSearch />;
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
        navigate('/login');
    };
    
    // Function to redirect to property listings
    const goToPropertyListings = () => {
        navigate('/listings');
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
            currentPassword: '',
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
            
            // Handle password change only if user actually enters a new password
            if (password && password.trim() !== '') {
                // Check if all password fields are filled
                if (!currentPassword || currentPassword.trim() === '') {
                    alert("Current password is required!");
                    return;
                }
                if (!confirmPassword || confirmPassword.trim() === '') {
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
                            if (navigate) {
                                navigate('login');
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
                await recordActivity('profile_updated', 'Profile information updated');
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

    // Modal functions
    const openPropertyModal = (property) => {
        setSelectedProperty(property);
        setPropertyModalOpen(true);
        setActiveImageIndex(0);
        // Check favorite status when modal opens
        checkFavoriteStatus(property.id);
        // Log property view activity
        recordActivity('property_viewed', `Viewed property "${property.title}"`);
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

    // Helper function to record activity and update recent activities
    const recordActivity = async (action, description) => {
        try {
            await api.post('/api/user-activities', {
                action,
                description,
                userId: authUser.id
            });
            // Update recent activities immediately
            const response = await api.get(`/api/user-activities/recent/${authUser.id}`);
            setRecentActivities(response.data);
        } catch (error) {
            console.error('Error logging activity:', error);
        }
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
                    await refreshSavedProperties();
                    await recordActivity('property_unfavorited', `Removed "${selectedProperty.title}" from favorites`);
                    alert('Property removed from favorites');
                }
            } else {
                // Add to favorites
                const response = await api.post(`/api/favorites/${propertyId}`);
                if (response.status === 201) {
                    setFavoriteStatus(prev => ({ ...prev, [propertyId]: true }));
                    await refreshSavedProperties();
                    await recordActivity('property_favorited', `Added "${selectedProperty.title}" to favorites`);
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
        if (selectedProperty) {
            recordActivity('property_contact', `Contacted seller about "${selectedProperty.title}"`);
        }
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

    // Function to refresh saved properties list
    const refreshSavedProperties = async () => {
        try {
            setLoadingSavedProperties(true);
            const favoritesResponse = await api.get('/api/favorites');
            
            const favorites = favoritesResponse.data.map(fav => {
                // The backend now returns the complete property object directly
                const property = fav;
                return {
                    id: property.id,
                    title: property.title,
                    description: property.description,
                    location: property.location,
                    price: property.price,
                    acres: property.acres,
                    waterRights: property.waterRights,
                    suitableCrops: property.suitableCrops,
                    type: property.type,
                    topography: property.topography,
                    averageYield: property.averageYield,
                    amenities: property.amenities,
                    restrictionsText: property.restrictionsText,
                    remarks: property.remarks,
                    image: property.image || property.images?.[0] || '/api/placeholder/800/500',
                    images: property.images || [],
                    barangay: property.barangay,
                    barangayData: property.barangayData,
                    seller: property.seller,
                    createdAt: property.createdAt,
                    updatedAt: property.updatedAt
                };
            });
            setSavedProperties(favorites);
            
            // Cache saved properties in localStorage for persistence
            if (authUser && authUser.id) {
                localStorage.setItem(`savedProperties_${authUser.id}`, JSON.stringify(favorites));
            }
            
            // Update favorite status for saved properties
            const updatedFavoriteStatus = { ...favoriteStatus };
            favorites.forEach(property => {
                updatedFavoriteStatus[property.id] = true;
            });
            setFavoriteStatus(updatedFavoriteStatus);
            
            console.log('Saved properties refreshed:', favorites.length, 'properties');
        } catch (error) {
            console.error('Error refreshing saved properties:', error);
            
            // Fallback to cached data if API fails
            if (authUser && authUser.id) {
                const cachedData = localStorage.getItem(`savedProperties_${authUser.id}`);
                if (cachedData) {
                    try {
                        const cachedProperties = JSON.parse(cachedData);
                        setSavedProperties(cachedProperties);
                    } catch (parseError) {
                        console.error('Error parsing cached saved properties:', parseError);
                    }
                }
            }
        } finally {
            setLoadingSavedProperties(false);
        }
    };

    // Function to fetch recently viewed properties
    const fetchRecentlyViewedProperties = async () => {
        try {
            setLoadingRecentlyViewed(true);
            const response = await api.get('/api/recently-viewed');
            
            const recentlyViewed = response.data.map(property => ({
                id: property.id,
                title: property.title,
                description: property.description,
                location: property.location,
                price: property.price,
                acres: property.acres,
                waterRights: property.waterRights,
                suitableCrops: property.suitableCrops,
                type: property.type,
                topography: property.topography,
                averageYield: property.averageYield,
                amenities: property.amenities,
                restrictionsText: property.restrictionsText,
                remarks: property.remarks,
                image: property.image || property.images?.[0] || '/api/placeholder/800/500',
                images: property.images || [],
                barangay: property.barangay,
                barangayData: property.barangayData,
                seller: property.seller,
                createdAt: property.createdAt,
                updatedAt: property.updatedAt,
                viewedAt: property.viewedAt
            }));
            
            setRecentlyViewedProperties(recentlyViewed);
            
            // Check favorite status for recently viewed properties
            const updatedFavoriteStatus = { ...favoriteStatus };
            for (const property of recentlyViewed) {
                try {
                    const favResponse = await api.get(`/api/favorites/check/${property.id}`);
                    updatedFavoriteStatus[property.id] = favResponse.data.isFavorite;
                } catch (error) {
                    updatedFavoriteStatus[property.id] = false;
                }
            }
            setFavoriteStatus(updatedFavoriteStatus);
            
            console.log('Recently viewed properties fetched:', recentlyViewed.length, 'properties');
        } catch (error) {
            console.error('Error fetching recently viewed properties:', error);
            setRecentlyViewedProperties([]);
        } finally {
            setLoadingRecentlyViewed(false);
        }
    };

    // Function to remove property from recently viewed
    const removeFromRecentlyViewed = async (propertyId) => {
        try {
            await api.delete(`/api/recently-viewed/${propertyId}`);
            setRecentlyViewedProperties(prev => prev.filter(property => property.id !== propertyId));
        } catch (error) {
            console.error('Error removing property from recently viewed:', error);
            alert('Failed to remove property from recently viewed');
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
                            onClick={() => navigate('/login')}
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
                                        onError={(e) => {
                                            console.error('Error loading profile image:', e);
                                            console.log('Failed image URL:', e.target.src);
                                            // Hide the broken image and show fallback
                                            e.target.style.display = 'none';
                                            const parent = e.target.parentNode;
                                            const fallback = document.createElement('div');
                                            fallback.style.cssText = `
                                                width: 100%;
                                                height: 100%;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                border-radius: 50%;
                                                color: white;
                                                font-weight: bold;
                                                font-size: 24px;
                                            `;
                                            const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
                                            fallback.textContent = fullName ? fullName.charAt(0).toUpperCase() : '?';
                                            parent.insertBefore(fallback, e.target);
                                        }}
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
                                    {new Date(user.createdAt).toLocaleDateString()}
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
                        
                        {recentActivities.length > 0 ? (
                            <DashboardStyles.ActivityList>
                                {recentActivities.map(activity => (
                                    <DashboardStyles.ActivityItem key={activity.id}>
                                        <DashboardStyles.ActivityIcon 
                                            $bgColor={activity.$bgColor || 'rgba(52, 152, 219, 0.1)'}
                                            $iconColor={activity.$iconColor || '#3498db'}
                                        >
                                            {iconMap[activity.icon] || getActivityIcon(activity.type || activity.action)}
                                        </DashboardStyles.ActivityIcon>
                                        
                                        <DashboardStyles.ActivityContent>
                                            <DashboardStyles.ActivityTitle>{activity.title || activity.message}</DashboardStyles.ActivityTitle>
                                            <DashboardStyles.ActivityTime>
                                                {activity.time || new Date(activity.timestamp || activity.createdAt).toLocaleDateString()}
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
                        
                        {loadingSavedProperties && activeTab === 'saved' ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid #3498db', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    Loading saved properties...
                                </div>
                            </div>
                        ) : loadingRecentlyViewed && activeTab === 'recent' ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', border: '2px solid #3498db', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    Loading recently viewed properties...
                                </div>
                            </div>
                        ) : activeTab === 'saved' && savedProperties.length > 0 ? (
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                    Found {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'}
                                </div>
                                {savedProperties.map(property => (
                                    <DashboardStyles.PropertyCard key={property.id}>
                                    <DashboardStyles.PropertyImageContainer>
                                        <DashboardStyles.PropertyImage 
                                            src={property.image} 
                                            alt={property.title}
                                            onError={(e) => {
                                                console.error('Error loading property image:', e);
                                                e.target.src = `${api.defaults.baseURL}/api/placeholder/400/300`;
                                            }}
                                        />
                                    </DashboardStyles.PropertyImageContainer>
                                    
                                    <DashboardStyles.PropertyContent>
                                        <DashboardStyles.PropertyTitle>{property.title}</DashboardStyles.PropertyTitle>
                                        <DashboardStyles.PropertyLocation>
                                        <FaMapMarkerAlt size={12} /> {property.location}
                                        </DashboardStyles.PropertyLocation>
                                        <DashboardStyles.PropertyPrice>
                                            {property.showPrice ? formatPrice(property.price) : 'Price on Request'}
                                        </DashboardStyles.PropertyPrice>
                                        
                                        <DashboardStyles.PropertySpecs>
                                        <DashboardStyles.PropertySpec>
                                            <FaRulerCombined size={14} /> {property.acres} Hectares
                                        </DashboardStyles.PropertySpec>
                                        <DashboardStyles.PropertySpec>
                                            <FaWater size={14} /> {property.waterRights}
                                        </DashboardStyles.PropertySpec>
                                        </DashboardStyles.PropertySpecs>
                                        
                                        {/* Enhanced Quick Information Section */}
                                        <div style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '12px', 
                                            borderRadius: '8px', 
                                            margin: '12px 0',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '1fr 1fr', 
                                                gap: '8px',
                                                fontSize: '13px'
                                            }}>
                                                {property.type && (
                                                    <DashboardStyles.PropertySpec>
                                                        <FaBuilding size={14} /> <strong>{property.type}</strong>
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                                {property.topography && (
                                                    <DashboardStyles.PropertySpec>
                                                        <FaTractor size={14} /> <strong>{property.topography}</strong>
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                                {property.averageYield && (
                                                    <DashboardStyles.PropertySpec style={{ gridColumn: '1 / -1' }}>
                                                        <FaChartBar size={14} /> <strong>Avg Yield:</strong> {property.averageYield}
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                            </div>
                                            
                                            {property.amenities && property.amenities.length > 0 && (
                                                <div style={{ 
                                                    marginTop: '8px', 
                                                    paddingTop: '8px', 
                                                    borderTop: '1px solid #dee2e6',
                                                    fontSize: '12px'
                                                }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#495057' }}>
                                                        <FaWarehouse size={12} style={{ marginRight: '4px' }} /> Amenities:
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        flexWrap: 'wrap', 
                                                        gap: '4px',
                                                        color: '#6c757d'
                                                    }}>
                                                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                                                            <span key={idx} style={{ 
                                                                backgroundColor: '#e9ecef', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                fontSize: '11px'
                                                            }}>
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                        {property.amenities.length > 3 && (
                                                            <span style={{ 
                                                                backgroundColor: '#e9ecef', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                color: '#6c757d'
                                                            }}>
                                                                +{property.amenities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <DashboardStyles.SuitableCrops>
                                            <FaSeedling size={14} style={{ marginRight: '5px' }} /> <strong>Ideal for:</strong>&nbsp; {property.suitableCrops}
                                        </DashboardStyles.SuitableCrops>
                                        
                                        {property.restrictionsText && (
                                            <div style={{ 
                                                marginTop: '8px',
                                                padding: '8px',
                                                backgroundColor: '#f8d7da',
                                                border: '1px solid #f5c6cb',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#721c24'
                                            }}>
                                                <strong>Restrictions:</strong> {property.restrictionsText}
                                            </div>
                                        )}
                                        
                                        {property.remarks && (
                                            <div style={{ 
                                                marginTop: '8px',
                                                padding: '8px',
                                                backgroundColor: '#fff3cd',
                                                border: '1px solid #ffeaa7',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#856404'
                                            }}>
                                                <strong>Remarks:</strong> {property.remarks}
                                            </div>
                                        )}
                                        
                                        <DashboardStyles.PropertyActions>
                                        <DashboardStyles.ActionButton $small onClick={() => openPropertyModal(property)}>
                                            View Details
                                        </DashboardStyles.ActionButton>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await api.delete(`/api/favorites/${property.id}`);
                                                    if (response.status === 200) {
                                                        await refreshSavedProperties();
                                                        alert('Property removed from favorites');
                                                    }
                                                } catch (error) {
                                                    console.error('Error removing from favorites:', error);
                                                    alert('Failed to remove property from favorites');
                                                }
                                            }}
                                            style={{
                                                background: '#95a5a6',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <FaTimes size={12} />
                                            Remove
                                        </button>
                                        </DashboardStyles.PropertyActions>
                                        
                                        {/* Seller Information */}
                                        {property.seller && (
                                            <div style={{ 
                                                marginTop: '12px',
                                                padding: '8px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #e9ecef',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                    <img
                                                        src={property.seller?.avatar ? 
                                                            (property.seller.avatar.startsWith('http') ? 
                                                                property.seller.avatar : 
                                                                `${api.defaults.baseURL}${property.seller.avatar}`
                                                            ) : 
                                                            `${api.defaults.baseURL}/api/placeholder/30/30`
                                                        }
                                                        alt={`${property.seller?.firstName || 'Seller'}`}
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            console.error('Error loading seller avatar:', e);
                                                            e.target.src = `https://ui-avatars.com/api/?name=${property.seller?.firstName || 'Seller'}+${property.seller?.lastName || ''}&background=random&size=30`;
                                                        }}
                                                    />
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        <div style={{ fontWeight: '500', color: '#495057' }}>
                                                            {property.seller.firstName} {property.seller.lastName}
                                                        </div>
                                                        <div>Property Seller</div>
                                                    </div>
                                                </div>
                                            )}
                                    </DashboardStyles.PropertyContent>
                                    </DashboardStyles.PropertyCard>
                                ))}
                            </div>
                        ) : activeTab === 'recent' && recentlyViewedProperties.length > 0 ? (
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                    Found {recentlyViewedProperties.length} recently viewed propert{recentlyViewedProperties.length === 1 ? 'y' : 'ies'}
                                </div>
                                {recentlyViewedProperties.map(property => (
                                    <DashboardStyles.PropertyCard key={property.id}>
                                    <DashboardStyles.PropertyImageContainer>
                                        <DashboardStyles.PropertyImage 
                                            src={property.image} 
                                            alt={property.title}
                                            onError={(e) => {
                                                console.error('Error loading property image:', e);
                                                e.target.src = `${api.defaults.baseURL}/api/placeholder/400/300`;
                                            }}
                                        />
                                    </DashboardStyles.PropertyImageContainer>
                                    
                                    <DashboardStyles.PropertyContent>
                                        <DashboardStyles.PropertyTitle>{property.title}</DashboardStyles.PropertyTitle>
                                        <DashboardStyles.PropertyLocation>
                                        <FaMapMarkerAlt size={12} /> {property.location}
                                        </DashboardStyles.PropertyLocation>
                                        <DashboardStyles.PropertyPrice>
                                            {property.showPrice ? formatPrice(property.price) : 'Price on Request'}
                                        </DashboardStyles.PropertyPrice>
                                        
                                        <DashboardStyles.PropertySpecs>
                                        <DashboardStyles.PropertySpec>
                                            <FaRulerCombined size={14} /> {property.acres} Hectares
                                        </DashboardStyles.PropertySpec>
                                        <DashboardStyles.PropertySpec>
                                            <FaWater size={14} /> {property.waterRights}
                                        </DashboardStyles.PropertySpec>
                                        </DashboardStyles.PropertySpecs>
                                        
                                        {/* Enhanced Quick Information Section */}
                                        <div style={{ 
                                            backgroundColor: '#f8f9fa', 
                                            padding: '12px', 
                                            borderRadius: '8px', 
                                            margin: '12px 0',
                                            border: '1px solid #e9ecef'
                                        }}>
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '1fr 1fr', 
                                                gap: '8px',
                                                fontSize: '13px'
                                            }}>
                                                {property.type && (
                                                    <DashboardStyles.PropertySpec>
                                                        <FaBuilding size={14} /> <strong>{property.type}</strong>
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                                {property.topography && (
                                                    <DashboardStyles.PropertySpec>
                                                        <FaTractor size={14} /> <strong>{property.topography}</strong>
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                                {property.averageYield && (
                                                    <DashboardStyles.PropertySpec style={{ gridColumn: '1 / -1' }}>
                                                        <FaChartBar size={14} /> <strong>Avg Yield:</strong> {property.averageYield}
                                                    </DashboardStyles.PropertySpec>
                                                )}
                                            </div>
                                            
                                            {property.amenities && property.amenities.length > 0 && (
                                                <div style={{ 
                                                    marginTop: '8px', 
                                                    paddingTop: '8px', 
                                                    borderTop: '1px solid #dee2e6',
                                                    fontSize: '12px'
                                                }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#495057' }}>
                                                        <FaWarehouse size={12} style={{ marginRight: '4px' }} /> Amenities:
                                                    </div>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        flexWrap: 'wrap', 
                                                        gap: '4px',
                                                        color: '#6c757d'
                                                    }}>
                                                        {property.amenities.slice(0, 3).map((amenity, idx) => (
                                                            <span key={idx} style={{ 
                                                                backgroundColor: '#e9ecef', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                fontSize: '11px'
                                                            }}>
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                        {property.amenities.length > 3 && (
                                                            <span style={{ 
                                                                backgroundColor: '#e9ecef', 
                                                                padding: '2px 6px', 
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                color: '#6c757d'
                                                            }}>
                                                                +{property.amenities.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <DashboardStyles.SuitableCrops>
                                            <FaSeedling size={14} style={{ marginRight: '5px' }} /> <strong>Ideal for:</strong>&nbsp; {property.suitableCrops}
                                        </DashboardStyles.SuitableCrops>
                                        
                                        {property.restrictionsText && (
                                            <div style={{ 
                                                marginTop: '8px',
                                                padding: '8px',
                                                backgroundColor: '#f8d7da',
                                                border: '1px solid #f5c6cb',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#721c24'
                                            }}>
                                                <strong>Restrictions:</strong> {property.restrictionsText}
                                            </div>
                                        )}
                                        
                                        {property.remarks && (
                                            <div style={{ 
                                                marginTop: '8px',
                                                padding: '8px',
                                                backgroundColor: '#fff3cd',
                                                border: '1px solid #ffeaa7',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#856404'
                                            }}>
                                                <strong>Remarks:</strong> {property.remarks}
                                            </div>
                                        )}
                                        
                                        <DashboardStyles.PropertyActions>
                                        <DashboardStyles.ActionButton $small onClick={() => openPropertyModal(property)}>
                                            View Details
                                        </DashboardStyles.ActionButton>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await removeFromRecentlyViewed(property.id);
                                                    alert('Property removed from recently viewed');
                                                } catch (error) {
                                                    console.error('Error removing from recently viewed:', error);
                                                    alert('Failed to remove property from recently viewed');
                                                }
                                            }}
                                            style={{
                                                background: '#95a5a6',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            <FaTimes size={12} />
                                            Remove
                                        </button>
                                        </DashboardStyles.PropertyActions>
                                        
                                        {/* Seller Information */}
                                        {property.seller && (
                                            <div style={{ 
                                                marginTop: '12px',
                                                padding: '8px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '6px',
                                                border: '1px solid #e9ecef',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                    <img
                                                        src={property.seller?.avatar ? 
                                                            (property.seller.avatar.startsWith('http') ? 
                                                                property.seller.avatar : 
                                                                `${api.defaults.baseURL}${property.seller.avatar}`
                                                            ) : 
                                                            `${api.defaults.baseURL}/api/placeholder/30/30`
                                                        }
                                                        alt={`${property.seller?.firstName || 'Seller'}`}
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                        onError={(e) => {
                                                            console.error('Error loading seller avatar:', e);
                                                            e.target.src = `https://ui-avatars.com/api/?name=${property.seller?.firstName || 'Seller'}+${property.seller?.lastName || ''}&background=random&size=30`;
                                                        }}
                                                    />
                                                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                                        <div style={{ fontWeight: '500', color: '#495057' }}>
                                                            {property.seller.firstName} {property.seller.lastName}
                                                        </div>
                                                        <div>Property Seller</div>
                                                    </div>
                                                </div>
                                            )}
                                    </DashboardStyles.PropertyContent>
                                    </DashboardStyles.PropertyCard>
                                ))}
                            </div>
                        ) : activeTab === 'recommended' ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                                    <FaChartLine size={20} style={{ marginRight: '8px' }} />
                                    Recommended Farms
                                </div>
                                <div style={{ fontSize: '14px', color: '#999' }}>
                                    Personalized recommendations coming soon! Browse our listings to get started.
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                {activeTab === 'saved' && 'No saved properties yet. Browse our listings to find your perfect agricultural property.'}
                                {activeTab === 'recent' && 'No recently viewed properties yet. Start browsing our listings to see your viewing history.'}
                            </div>
                        )}
                        </DashboardStyles.SavedPropertiesSection>
                        
                        {/* Market Insights Section */}
                        <DashboardStyles.MarketInsightsSection>
                        <DashboardStyles.InsightsTitle>Agricultural Market Insights</DashboardStyles.InsightsTitle>
                        
                        {loadingInsights ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>Loading market insights...</div>
                        ) : marketInsights?.totalListings > 0 ? (
                            <>
                                {/* Market Statistics */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                    gap: '12px', 
                                    marginBottom: '20px' 
                                }}>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2C3E50' }}>
                                            {marketInsights.totalListings}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>Total Listings</div>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>
                                            {marketInsights.activeListings}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>Active</div>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3498db' }}>
                                            ₱{(marketInsights.averagePrice / 1000000).toFixed(1)}M
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg Price</div>
                                    </div>
                                    <div style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#e67e22' }}>
                                            {marketInsights.averageAcres}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg Hectares</div>
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div style={{ 
                                    backgroundColor: '#fff3cd', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    marginBottom: '16px',
                                    border: '1px solid #ffeaa7'
                                }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: '4px' }}>
                                        Price Range
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#856404' }}>
                                        ₱{marketInsights.priceRange.min.toLocaleString()} - ₱{marketInsights.priceRange.max.toLocaleString()}
                                    </div>
                                </div>

                                {/* Optimization Tips */}
                                {marketInsights?.optimizationTips?.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#2C3E50', marginBottom: '12px' }}>
                                            Market Recommendations
                                        </div>
                                        {marketInsights.optimizationTips.map((tip, index) => (
                                            <DashboardStyles.InsightCard key={index} $accentColor="#3498db">
                                                <DashboardStyles.InsightTitle>{tip.title}</DashboardStyles.InsightTitle>
                                                <DashboardStyles.InsightText>{tip.text}</DashboardStyles.InsightText>
                                            </DashboardStyles.InsightCard>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <DashboardStyles.InsightCard $accentColor="#3498db">
                                <DashboardStyles.InsightTitle>Welcome to SmartLand</DashboardStyles.InsightTitle>
                                <DashboardStyles.InsightText>Browse available properties to receive personalized market insights and recommendations for your agricultural investment.</DashboardStyles.InsightText>
                            </DashboardStyles.InsightCard>
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
                                                onError={(e) => {
                                                    console.error('Error loading profile image:', e);
                                                    console.log('Failed image URL:', e.target.src);
                                                    // Hide the broken image and show fallback
                                                    e.target.style.display = 'none';
                                                    const parent = e.target.parentNode;
                                                    const fallback = document.createElement('div');
                                                    fallback.style.cssText = `
                                                        width: 100%;
                                                        height: 100%;
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                                                        border-radius: 50%;
                                                        color: white;
                                                        font-weight: bold;
                                                        font-size: 24px;
                                                    `;
                                                    const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
                                                    fallback.textContent = fullName ? fullName.charAt(0).toUpperCase() : '?';
                                                    parent.insertBefore(fallback, e.target);
                                                }}
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
                                        src={selectedProperty.images?.[activeImageIndex] || selectedProperty.image}
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
                                                {selectedProperty.showPrice ? `₱${selectedProperty.price.toLocaleString()}` : 'Price on Request'}
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
                                                {selectedProperty.acres} hectares
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
                                                {selectedProperty.showPrice ? `₱${Math.round(selectedProperty.price / selectedProperty.acres).toLocaleString()}` : 'N/A'}
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
                                                {new Date(selectedProperty.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {selectedProperty.type && (
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
                                                    {selectedProperty.type}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProperty.topography && (
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
                                                    {selectedProperty.topography}
                                                </div>
                                            </div>
                                        )}
                                        {selectedProperty.averageYield && (
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
                                            {selectedProperty.suitableCrops?.split(',').map((crop, index) => (
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
                                                    {crop.trim()}
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

                                    {/* Restrictions */}
                                    {selectedProperty.restrictionsText && (
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                margin: '0 0 12px 0'
                                            }}>
                                                Restrictions
                                            </h4>
                                            <div style={{
                                                background: '#f8d7da',
                                                border: '1px solid #f5c6cb',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                color: '#721c24'
                                            }}>
                                                {selectedProperty.restrictionsText}
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
                                                Remarks
                                            </h4>
                                            <div style={{
                                                background: '#fff3cd',
                                                border: '1px solid #ffeaa7',
                                                borderRadius: '8px',
                                                padding: '16px',
                                                color: '#856404'
                                            }}>
                                                {selectedProperty.remarks}
                                            </div>
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
                                            <img
                                                src={selectedProperty.seller?.avatar ? 
                                                    (selectedProperty.seller.avatar.startsWith('http') ? 
                                                        selectedProperty.seller.avatar : 
                                                        `${api.defaults.baseURL}${selectedProperty.seller.avatar}`
                                                    ) : 
                                                    `${api.defaults.baseURL}/api/placeholder/50/50`
                                                }
                                                alt={selectedProperty.seller?.firstName || 'Seller'}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    marginRight: '12px',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    console.error('Error loading seller avatar:', e);
                                                    e.target.src = `https://ui-avatars.com/api/?name=${selectedProperty.seller?.firstName || 'Seller'}+${selectedProperty.seller?.lastName || ''}&background=random&size=50`;
                                                }}
                                            />
                                            <div>
                                                <div style={{
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    color: '#2c3e50'
                                                }}>
                                                    {selectedProperty.seller?.firstName} {selectedProperty.seller?.lastName}
                                                </div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    color: '#7f8c8d'
                                                }}>
                                                    Property Seller
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
                                            {selectedProperty.waterRights?.toLowerCase().includes('irrigation') && (
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
                                Contact {selectedProperty.seller?.firstName} {selectedProperty.seller?.lastName}
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
                                <img
                                    src={selectedProperty.seller?.avatar ? 
                                        (selectedProperty.seller.avatar.startsWith('http') ? 
                                            selectedProperty.seller.avatar : 
                                            `${api.defaults.baseURL}${selectedProperty.seller.avatar}`
                                        ) : 
                                        `${api.defaults.baseURL}/api/placeholder/50/50`
                                    }
                                    alt={selectedProperty.seller?.firstName || 'Seller'}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        marginRight: '12px',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        console.error('Error loading seller avatar:', e);
                                        e.target.src = `https://ui-avatars.com/api/?name=${selectedProperty.seller?.firstName || 'Seller'}+${selectedProperty.seller?.lastName || ''}&background=random&size=50`;
                                    }}
                                />
                                <div>
                                    <div style={{
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: '#2c3e50'
                                    }}>
                                        {selectedProperty.seller?.firstName} {selectedProperty.seller?.lastName}
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
        </DashboardStyles.DashboardContainer>
    );
};

export default BuyerDashboard;
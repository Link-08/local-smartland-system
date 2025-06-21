import React, { useState, useEffect, useContext } from 'react';
import { 
  FaCamera, FaUser, FaSignOutAlt, FaFileAlt, FaTags, 
  FaSearch, FaBuilding, FaChartLine, FaMapMarkerAlt, 
  FaBed, FaBath, FaRulerCombined, FaRegClock,
  FaArrowRight, FaChevronRight, FaArrowUp, FaArrowDown,
  FaTractor, FaTree, FaWater, FaSeedling, FaWarehouse,
  FaEdit, FaTrash, FaPlus, FaMoneyBillWave, FaChartBar,
  FaExclamationTriangle, FaCheck, FaEye, FaList, FaThLarge, FaFilter, FaHome, FaStar, FaTint, FaAngleDown, FaRegCalendarAlt, FaTimes, FaChevronLeft
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DashboardStyles } from "./BuyerDashboardStyles";
import { SellerDashboardStyles } from "./SellerDashboardStyles";
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';
import PriceCalculatorTool from "./PriceCalculatorTool";
import MarketAnalysisTool from "./MarketAnalysisTool";
import { formatPrice, formatDate } from './formatUtils';
import styled from 'styled-components';
import * as PreviewModalStyles from './PreviewModalStyles';

const iconMap = {
    FaExclamationTriangle: <FaExclamationTriangle />,
    FaEye: <FaEye />,
    FaCheck: <FaCheck />,
};

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SellerDashboard = ({ navigateTo }) => {
    // Use AuthContext for the signed-in seller
    const { user, logout, fetchUser, setUser, updateUser } = useAuth();
    
    // State management
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [activeProfileTab, setActiveProfileTab] = useState('personal');
    const [metrics, setMetrics] = useState({
        totalViews: 0,
        totalInquiries: 0,
        avgTimeToSale: 0,
        trendViews: '0%',
        trendInquiries: '0%',
        trendAvgTimeToSale: '0%'
    });
    const [sellerListings, setSellerListings] = useState([]);
    const [previewListing, setPreviewListing] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [addNewOpen, setAddNewOpen] = useState(false);
    const [editProperty, setEditProperty] = useState(null);
    const [editPropertyOpen, setEditPropertyOpen] = useState(false);
    const [newProperty, setNewProperty] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        acres: '',
        waterRights: '',
        suitableCrops: [],
        image: '',
        status: 'active',
        displayPrice: true,
        type: '',
        topography: '',
        averageYield: '',
        amenities: [],
        restrictionsText: '',
        remarks: '',
        coordinates: null
    });
    const [formErrors, setFormErrors] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeToolModal, setActiveToolModal] = useState(null);
    const [toolModalOpen, setToolModalOpen] = useState(false);
    
    // State for UI interactions
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('listings');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Add state for market insights
    const [marketInsights, setMarketInsights] = useState({
        totalListings: 0,
        activeListings: 0,
        totalViews: 0,
        averagePrice: 0,
        priceTrend: 0,
        averageTimeToSale: 0,
        optimizationTips: [],
    });

    // Add state for recent activities
    const [recentActivities, setRecentActivities] = useState([]);

    // Add useEffect to initialize userProfile when user data is available
    useEffect(() => {
        if (user) {
            // Generate username based on role and name
            const rolePrefix = user.role === 'seller' ? 'seller' : 'buyer';
            const username = `${rolePrefix}_${user.firstName?.toLowerCase() || ''}_${user.lastName?.toLowerCase() || ''}`.replace(/\s+/g, '_');
            
            setUserProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                username: username,
                password: '',
                confirmPassword: '',
                avatar: user.avatar || 'NA'
            });
        }
    }, [user]);

    // Add useEffect to fetch seller listings, market insights, and recent activities
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                console.log('Fetching initial user data for ID:', user.id);
                
                // Fetch the complete user profile
                const response = await api.get(`/api/seller/profile/${user.id}`);
                console.log('Received initial user data:', response.data);
                
                // Initialize user profile with the fetched data
                setUserProfile({
                    ...response.data,
                    password: '',
                    confirmPassword: '',
                    currentPassword: ''
                });
                
                // Fetch other data...
                const [metricsResponse, propertiesResponse] = await Promise.all([
                    api.get(`/api/seller/metrics/${user.id}`),
                    api.get(`/api/seller/properties/${user.id}`)
                ]);
                
                setMetrics(metricsResponse.data);
                setSellerListings(propertiesResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                alert('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, lastUpdate]); // Add lastUpdate to dependencies to trigger refresh when profile is updated

    // Add useEffect to fetch metrics data with error handling
    useEffect(() => {
        const fetchMetrics = async () => {
            if (!user || !user.id) {
                console.warn('No user data available');
                return;
            }

            try {
                const response = await api.get(`/api/seller/metrics/${user.id}`);
                setMetrics(response.data);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchMetrics();
        // Set up polling to refresh metrics every 5 minutes
        const intervalId = setInterval(fetchMetrics, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [user]);

    // Update performance metrics to use default data
    const performanceMetrics = [
        {
            title: 'Total Views',
            value: '0',
            trend: '0%',
            isPositive: true
        },
        {
            title: 'Total Inquiries',
            value: '0',
            trend: '0%',
            isPositive: true
        },
        {
            title: 'Average Time to Sale',
            value: 'Not Available',
            trend: '0%',
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
    
    const handleEditPropertySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/api/properties/${editProperty.id}`, editProperty);
            setSellerListings(prevListings => 
                prevListings.map(listing => 
                    listing.id === editProperty.id ? response.data : listing
                )
            );
            setEditPropertyOpen(false);
        } catch (error) {
            console.error('Error updating listing:', error);
            alert('Failed to update listing. Please try again.');
        }
    };

    const handleEditProfile = async () => {
        try {
            // Always fetch the latest seller data
            const response = await api.get(`/api/seller/profile/${user.id}`);
            const sellerData = response.data;
            setUserProfile({
                firstName: sellerData.firstName || '',
                lastName: sellerData.lastName || '',
                email: sellerData.email || '',
                phone: sellerData.phone || '',
                username: sellerData.username || '', // Always use latest username
                password: '',
                confirmPassword: '',
                avatar: sellerData.avatar || 'NA'
            });
            setEditProfileOpen(true);
        } catch (error) {
            console.error('Error fetching seller profile:', error);
            alert('Failed to fetch profile data. Please try again.');
        }
    };
    
    // Add validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    };

    const validateForm = () => {
        const errors = {};
        const { firstName, lastName, email, phone, username } = userProfile;

        if (!firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (phone && !validatePhone(phone)) {
            errors.phone = 'Please enter a valid phone number';
        }

        if (!username.trim()) {
            errors.username = 'Username is required';
        } else if (username.length < 3) {
            errors.username = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Update handleProfileChange to track unsaved changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
        setHasUnsavedChanges(true);
    };
    
    // Update handleProfileSubmit to include validation
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
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
            console.log('Starting profile update with data:', { firstName, lastName, email, phone, username });
            console.log('Current user:', user);
            
            const response = await api.put(`/api/seller/profile/${user.id}`, {
                firstName,
                lastName,
                phone,
                username
            });
            
            console.log('Profile update API response:', response.data);
            
            if (response.data && response.data.profile) {
                console.log('Profile update successful, updating user state...');
                // Update the user in AuthContext
                if (updateUser) {
                    console.log('Calling updateUser function...');
                    const updatedUser = await updateUser();
                    console.log('Received updated user data:', updatedUser);
                
                // Update local state with the complete user data
                    const newProfile = {
                        ...updatedUser,
                    password: '', // Clear password fields
                    confirmPassword: '',
                    currentPassword: ''
                    };
                    console.log('Setting new user profile:', newProfile);
                    setUserProfile(newProfile);
                    
                    // Force a re-render
                    setLastUpdate(Date.now());
                } else {
                    console.error('updateUser function is not available');
                }
                
                setEditProfileOpen(false);
                alert("Profile updated successfully!");
            } else {
                console.error('Invalid response format:', response.data);
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

    // Update handleAvatarUpload to include loading state
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
            setIsUploading(true);
            const formData = new FormData();
            formData.append('avatar', file);

            console.log('Uploading file:', {
                name: file.name,
                type: file.type,
                size: file.size
            });

            const response = await api.post('/api/auth/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Upload response:', response.data);
            console.log('API base URL:', api.defaults.baseURL);

            if (response.data && response.data.user) {
                const updatedUser = response.data.user;
                console.log('Updated user data:', updatedUser);
                console.log('Avatar URL:', updatedUser.avatar);

                // Update the user profile with the new avatar URL
                setUserProfile(prev => {
                    const newProfile = {
                        ...prev,
                        ...updatedUser,
                        password: '',
                        confirmPassword: '',
                        currentPassword: ''
                    };
                    console.log('New user profile:', newProfile);
                    return newProfile;
                });

                // Force a re-render
                setLastUpdate(Date.now());
                alert('Profile image updated successfully!');
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Failed to upload profile image: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handlePreviewListing = (listing) => {
        // Record the view when a listing is previewed
        recordPropertyView(listing.id);
        
        const previewData = {
            ...listing,
            images: listing.images || [listing.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'],
            amenities: listing.amenities || [],
            restrictions: listing.restrictions || [],
            previousCrops: listing.previousCrops || [],
            // Add only the specified property details
            size: `${listing.acres} hectares`,
            type: 'Agricultural Land',
            waterRights: listing.waterRights || 'Not specified',
            listedDate: listing.datePosted || new Date().toISOString(),
            description: listing.description || 'No description available',
            address: listing.location,
            // Add farm details
            farmDetails: {
                previousCrops: listing.previousCrops || [],
                averageYield: listing.averageYield || 'Not specified',
                topography: listing.topography || 'Not specified'
            }
        };
        
        setPreviewListing(previewData);
        setPreviewModalOpen(true);
    };
      
    const closePreviewModal = () => {
        setPreviewModalOpen(false);
    };

    // Function to handle delete listing
    const handleDeleteListing = async (listingId) => {
        try {
            await api.delete(`/api/properties/${listingId}`);
            setSellerListings(prevListings => 
                prevListings.filter(listing => listing.id !== listingId)
            );
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing. Please try again.');
        }
    };

    // Function to handle adding new listing
    const handleAddNewListing = () => {
        setAddNewOpen(true);
    };

    // Function to handle logout
    const handleLogout = () => {
        logout();
        if (navigateTo) {
            navigateTo('home');
        }
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
    const handleNewPropertySubmit = async (e) => {
        e.preventDefault();
        try {
            // Check if user is authenticated
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to create a listing');
                return;
            }

            // Format the data according to the model requirements
            const formattedData = {
                ...newProperty,
                id: `PROP-${Date.now()}`, // Generate a unique ID
                sellerId: user.id, // Add the seller's ID
                price: parseFloat(newProperty.price.replace(/[^0-9.]/g, '')), // Convert price to number
                acres: parseFloat(newProperty.acres), // Convert acres to number
                status: 'active', // Set default status
                viewCount: 0,
                inquiries: 0,
                image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef' // Add default image
            };

            console.log('Sending property data:', formattedData);
            console.log('Auth token:', token);

            const response = await api.post('/api/properties', formattedData);
            console.log('Server response:', response.data);
            
            setSellerListings(prevListings => [...prevListings, response.data]);
            setAddNewOpen(false);
            setNewProperty({
                title: '',
                description: '',
                price: '',
                location: '',
                acres: '',
                waterRights: '',
                suitableCrops: [],
                image: '',
                status: 'active'
            });
        } catch (error) {
            console.error('Error creating new listing:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Failed to create new listing. Please try again.');
        }
    };

    // Function to record a property view with error handling
    const recordPropertyView = async (listingId) => {
        try {
            if (user && user.id) {
                await api.post('/api/seller/metrics/view', { listingId });
                // Refresh metrics after recording view
                const response = await api.get('/api/seller/metrics');
                if (response.ok) {
                    setMetrics(response.data);
                }
            }
        } catch (error) {
            console.error('Error recording property view:', error);
        }
    };

    // Function to record a property inquiry with error handling
    const recordPropertyInquiry = async (listingId) => {
        try {
            if (user && user.id) {
                await api.post('/api/seller/metrics/inquiry', { listingId });
                // Refresh metrics after recording inquiry
                const response = await api.get('/api/seller/metrics');
                if (response.ok) {
                    setMetrics(response.data);
                }
            }
        } catch (error) {
            console.error('Error recording property inquiry:', error);
        }
    };

    // Function to record a property sale
    const recordPropertySale = async (listingId, daysToSale) => {
        try {
            if (user && user.id) {
                await api.post('/api/seller/metrics/sale', { listingId, daysToSale });
                // Refresh metrics after recording sale
                const response = await api.get('/api/seller/metrics');
                if (response.ok) {
                    setMetrics(response.data);
                }
            }
        } catch (error) {
            console.error('Error recording property sale:', error);
        }
    };

    // Add these handlers for image navigation
    const handlePrevImage = () => {
        setActiveImageIndex(prev => (prev > 0 ? prev - 1 : previewListing.images.length - 1));
    };

    const handleNextImage = () => {
        setActiveImageIndex(prev => (prev < previewListing.images.length - 1 ? prev + 1 : 0));
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };

    // Add handlers for preview actions
    const handleContact = () => {
        if (previewListing) {
            // Record the inquiry when a user contacts the seller
            recordPropertyInquiry(previewListing.id);
            // TODO: Implement actual contact functionality
            alert('Contact form will be implemented here');
        }
    };

    const handleShare = () => {
        // Implement share functionality
        alert('Share functionality would open here');
    };

    const handleSave = () => {
        // Implement save functionality
        alert('Property saved to favorites');
    };

    const MapSection = ({ coordinates, onCoordinatesChange, isEditable = false }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [markerCoordinates, setMarkerCoordinates] = useState([15.4917, 120.9679]);
        const [tempCoordinates, setTempCoordinates] = useState([15.4917, 120.9679]);

        useEffect(() => {
            // Parse coordinates from prop if available
            if (coordinates) {
                const coords = coordinates.split(',').map(coord => parseFloat(coord.trim()));
                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                    setMarkerCoordinates(coords);
                    setTempCoordinates(coords);
                }
            }
        }, [coordinates]);

        const handleSaveCoordinates = () => {
            setMarkerCoordinates(tempCoordinates);
            if (onCoordinatesChange) {
                onCoordinatesChange(tempCoordinates);
            }
            setIsEditing(false);
        };

        return (
            <div style={{ position: 'relative' }}>
                <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                    <MapContainer 
                        center={markerCoordinates} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                        dragging={isEditing}
                        touchZoom={isEditing}
                        doubleClickZoom={isEditing}
                        scrollWheelZoom={isEditing}
                        boxZoom={isEditing}
                        keyboard={isEditing}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker 
                            position={markerCoordinates}
                            draggable={isEditing}
                            eventHandlers={{
                                dragend: (e) => {
                                    const newCoords = [e.target.getLatLng().lat, e.target.getLatLng().lng];
                                    setTempCoordinates(newCoords);
                                }
                            }}
                        >
                            <Popup>
                                {isEditing ? 'Drag to adjust location' : 'Cabanatuan, Nueva Ecija'}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                {isEditable && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        zIndex: 1000,
                        display: 'flex',
                        gap: '8px'
                    }}>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSaveCoordinates}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#2ecc71',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <FaCheck size={14} /> Save
                                </button>
                                <button
                                    onClick={() => {
                                        setTempCoordinates(markerCoordinates);
                                        setIsEditing(false);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <FaTimes size={14} /> Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <FaEdit size={14} /> Edit Location
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleCoordinatesChange = async (newCoordinates) => {
        if (!previewListing) return;
        try {
            // Format the coordinates as a string
            const coordinatesString = newCoordinates.join(',');
            // Update only the coordinates field in the database
            const response = await api.put(`/api/properties/${previewListing.id}`, {
                ...previewListing,
                coordinates: coordinatesString
            });
            if (response.data) {
                // Update the local state for the preview modal
                setPreviewListing(prev => ({
                    ...prev,
                    coordinates: coordinatesString
                }));
                // Update the listings list
                setSellerListings(prevListings => 
                    prevListings.map(listing => 
                        listing.id === previewListing.id 
                            ? { 
                                ...listing, 
                                coordinates: coordinatesString
                            }
                            : listing
                    )
                );
                alert('Map location updated successfully!');
            } else {
                throw new Error('No data received from server');
            }
        } catch (error) {
            console.error('Error updating coordinates:', error);
            let errorMessage = 'Failed to update map location. ';
            if (error.response) {
                errorMessage += `Server responded with ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
            } else if (error.request) {
                errorMessage += 'No response received from server. Please check your connection.';
            } else {
                errorMessage += error.message;
            }
            alert(errorMessage);
        }
    };

    // Add confirmation dialog for closing edit mode
    const handleCloseEditProfile = () => {
        if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
                setEditProfileOpen(false);
                setHasUnsavedChanges(false);
                setFormErrors({});
            }
        } else {
            setEditProfileOpen(false);
        }
    };

    if (loading) {
        return <div style={{ color: '#2C3E50', textAlign: 'center', marginTop: '40px' }}>Loading seller profile...</div>;
    }
    if (!user) {
        return <div style={{ color: '#e74c3c', textAlign: 'center', marginTop: '40px' }}>No seller profile found. Please log in.</div>;
    }

    return (
        <DashboardStyles.DashboardContainer>
            {/* Main Content */}
            <DashboardStyles.DashboardContent>
                <div style={{ marginBottom: '24px' }}>
                    <DashboardStyles.SectionTitle>
                        <FaChartBar size={20} style={{ marginRight: 8 }} /> Performance Metrics
                    </DashboardStyles.SectionTitle>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {performanceMetrics.map((metric, index) => (
                            <DashboardStyles.StatCard key={index}>
                                <DashboardStyles.StatCardTitle>{metric.title}</DashboardStyles.StatCardTitle>
                                <DashboardStyles.StatCardValue>{metric.value}</DashboardStyles.StatCardValue>
                                <DashboardStyles.StatCardTrend $isPositive={metric.isPositive}>
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
                            <DashboardStyles.Tab $active={activeTab === 'listings'} onClick={() => setActiveTab('listings')}>
                            All Listings ({sellerListings.length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab $active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
                            Active ({sellerListings.filter(l => l.status === 'active').length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab $active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                            Pending ({sellerListings.filter(l => l.status === 'pending').length})
                            </DashboardStyles.Tab>
                            <DashboardStyles.Tab $active={activeTab === 'sold'} onClick={() => setActiveTab('sold')}>
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
                                <DashboardStyles.PropertyPrice>
                                    {listing.displayPrice ? formatPrice(listing.price) : 'Price on Request'}
                                </DashboardStyles.PropertyPrice>
                                
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
                                <span><FaRegClock size={12} style={{ marginRight: '4px' }} /> Listed: {formatDate(listing.datePosted || listing.listedDate)}</span>
                                </div>
                                
                                <DashboardStyles.PropertyActions>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <DashboardStyles.ActionButton $small onClick={() => handleEditListing(listing)} style={{ backgroundColor: "#3498db" }}>
                                        <FaEdit size={12} style={{ marginRight: '4px' }} /> Edit
                                        </DashboardStyles.ActionButton>
                                        {listing.status !== 'sold' && (
                                        <DashboardStyles.ActionButton $small onClick={() => handleDeleteListing(listing.id)} style={{ backgroundColor: "#e74c3c" }}>
                                            <FaTrash size={12} style={{ marginRight: '4px' }} /> Delete
                                        </DashboardStyles.ActionButton>
                                        )}
                                    </div>
                                    <DashboardStyles.ActionButton $small onClick={() => handlePreviewListing(listing)} style={{ backgroundColor: "#2ecc71" }}>
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
                            
                            {marketInsights?.optimizationTips?.length > 0 ? (
                                marketInsights.optimizationTips.map((tip, index) => (
                                    <DashboardStyles.InsightCard key={index} $accentColor="#3498db">
                                        <DashboardStyles.InsightTitle>{tip.title}</DashboardStyles.InsightTitle>
                                        <DashboardStyles.InsightText>{tip.text}</DashboardStyles.InsightText>
                                    </DashboardStyles.InsightCard>
                                ))
                            ) : (
                                <DashboardStyles.InsightCard $accentColor="#3498db">
                                    <DashboardStyles.InsightTitle>Welcome to SmartLand</DashboardStyles.InsightTitle>
                                    <DashboardStyles.InsightText>Start by adding your first property listing to receive personalized market insights and recommendations.</DashboardStyles.InsightText>
                                </DashboardStyles.InsightCard>
                            )}
                        </DashboardStyles.MarketInsightsSection>
                    </div>
            
                    {/* Right Column */}
                    <div className="right-column" style={{ order: 2 }}>
                        {/* Profile Section */}
                        <DashboardStyles.ProfileSection>
                        <DashboardStyles.ProfileHeader>
                            <DashboardStyles.ProfileAvatarLarge>
                                {userProfile.avatar && userProfile.avatar !== 'NA' ? (
                                    <img
                                        src={userProfile.avatar.startsWith('http') ? userProfile.avatar : `${api.defaults.baseURL}${userProfile.avatar}`}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                        onError={(e) => {
                                            console.error('Error loading profile image:', e);
                                            console.log('Failed image URL:', e.target.src);
                                            e.target.src = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random`;
                                        }}
                                        onLoad={(e) => {
                                            console.log('Profile image loaded successfully:', e.target.src);
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
                                        fontSize: '32px',
                                        color: '#666'
                                    }}>
                                        {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                                    </div>
                                )}
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
                                    <DashboardStyles.ProfileDetailValue>{user.id}</DashboardStyles.ProfileDetailValue>
                                    <SellerDashboardStyles.CopyButton 
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.id);
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
                            <DashboardStyles.ProfileDetailValue>{sellerListings.length}</DashboardStyles.ProfileDetailValue>
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
                                            $bgColor={activity.$bgColor}
                                            $iconColor={activity.$iconColor}
                                        >
                                            {iconMap[activity.icon] || null}
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
                                    <SellerDashboardStyles.FormLabel>Property Description*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormTextarea
                                        name="description"
                                        value={newProperty.description || ''}
                                        onChange={handleNewPropertyChange}
                                        required
                                        placeholder="Provide detailed description of the property including soil quality, accessibility, infrastructure, etc."
                                        rows="4"
                                    />
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Property Type*</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormSelect
                                        name="type"
                                        value={newProperty.type || ''}
                                        onChange={handleNewPropertyChange}
                                        required
                                    >
                                        <option value="">Select property type</option>
                                        <option value="Rice Farm">Rice Farm</option>
                                        <option value="Corn Farm">Corn Farm</option>
                                        <option value="Vegetable Farm">Vegetable Farm</option>
                                        <option value="Mixed Crop Farm">Mixed Crop Farm</option>
                                        <option value="Livestock Farm">Livestock Farm</option>
                                        <option value="Orchard">Orchard</option>
                                        <option value="Raw Agricultural Land">Raw Agricultural Land</option>
                                        <option value="Other">Other</option>
                                    </SellerDashboardStyles.FormSelect>
                                </SellerDashboardStyles.FormGroup>
                                
                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Property Location (Map)</SellerDashboardStyles.FormLabel>
                                    <div style={{ 
                                        border: '1px solid #ddd', 
                                        borderRadius: '8px', 
                                        padding: '16px',
                                        backgroundColor: '#f9f9f9',
                                        minHeight: '200px'
                                    }}>
                                        <MapSection 
                                            coordinates={newProperty.coordinates} 
                                            onCoordinatesChange={(coords) => setNewProperty(prev => ({ ...prev, coordinates: coords }))}
                                            isEditable={true}
                                        />
                                    </div>
                                    <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '4px' }}>
                                        Click on the map to set the property location
                                    </small>
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Topography</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormSelect
                                        name="topography"
                                        value={newProperty.topography || ''}
                                        onChange={handleNewPropertyChange}
                                    >
                                        <option value="">Select topography</option>
                                        <option value="Flat">Flat</option>
                                        <option value="Gently Rolling">Gently Rolling</option>
                                        <option value="Rolling">Rolling</option>
                                        <option value="Hilly">Hilly</option>
                                        <option value="Mixed">Mixed</option>
                                    </SellerDashboardStyles.FormSelect>
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
                                    <SellerDashboardStyles.FormLabel>Average Yield (if applicable)</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormInput
                                        type="text"
                                        name="averageYield"
                                        value={newProperty.averageYield || ''}
                                        onChange={handleNewPropertyChange}
                                        placeholder="E.g., 120 sacks/hectare, 5 tons/hectare"
                                    />
                                </SellerDashboardStyles.FormGroup>
                                
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
                                        value={newProperty.suitableCrops}
                                        onChange={handleNewPropertyChange}
                                        required
                                    />
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Amenities</SellerDashboardStyles.FormLabel>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '8px' }}>
                                        {[
                                            'Electricity Connection', 'Water Pump House', 'Storage Facility', 'Farm House',
                                            'Tool Shed', 'Concrete Roads', 'Drainage System', 'Fence/Boundary Markers',
                                            'Vehicle Access', 'Internet/Phone Signal', 'Farm Equipment', 'Greenhouse'
                                        ].map(amenity => (
                                            <label key={amenity} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={newProperty.amenities?.includes(amenity) || false}
                                                    onChange={(e) => {
                                                        const currentAmenities = newProperty.amenities || [];
                                                        if (e.target.checked) {
                                                            setNewProperty(prev => ({ 
                                                                ...prev, 
                                                                amenities: [...currentAmenities, amenity] 
                                                            }));
                                                        } else {
                                                            setNewProperty(prev => ({ 
                                                                ...prev, 
                                                                amenities: currentAmenities.filter(a => a !== amenity) 
                                                            }));
                                                        }
                                                    }}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                {amenity}
                                            </label>
                                        ))}
                                    </div>
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Price Display Settings</SellerDashboardStyles.FormLabel>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                name="displayPrice"
                                                checked={newProperty.displayPrice || false}
                                                onChange={(e) => setNewProperty(prev => ({ ...prev, displayPrice: e.target.checked }))}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <span style={{ fontSize: '14px', color: '#2C3E50' }}>Display price publicly</span>
                                        </label>
                                    </div>
                                    <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                        Uncheck this if you prefer buyers to contact you for pricing information
                                    </small>
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Restrictions/Notes</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormTextarea
                                        name="restrictions"
                                        value={newProperty.restrictionsText || ''}
                                        onChange={(e) => setNewProperty(prev => ({ ...prev, restrictionsText: e.target.value }))}
                                        placeholder="Any restrictions, zoning limitations, or special conditions buyers should know about..."
                                        rows="3"
                                    />
                                </SellerDashboardStyles.FormGroup>

                                <SellerDashboardStyles.FormGroup>
                                    <SellerDashboardStyles.FormLabel>Additional Remarks</SellerDashboardStyles.FormLabel>
                                    <SellerDashboardStyles.FormTextarea
                                        name="remarks"
                                        value={newProperty.remarks || ''}
                                        onChange={handleNewPropertyChange}
                                        placeholder="Any additional information or special remarks about the property..."
                                        rows="3"
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
                                                        e.target.src = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random`;
                                                    }}
                                                    onLoad={(e) => {
                                                        console.log('Profile image loaded successfully:', e.target.src);
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
                                            value={userProfile.phone || ''}
                                            onChange={handleProfileChange}
                                            required
                                            placeholder="Enter your phone number"
                                        />
                                        {formErrors.phone && (
                                            <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                                                {formErrors.phone}
                                            </small>
                                        )}
                                    </DashboardStyles.FormGroup>
                                    
                                    <DashboardStyles.FormGroup>
                                        <DashboardStyles.FormLabel>Username*</DashboardStyles.FormLabel>
                                        <DashboardStyles.FormInput
                                            type="text"
                                            name="username"
                                            value={userProfile.username || ''}
                                            onChange={handleProfileChange}
                                            required
                                            placeholder="Enter your username"
                                        />
                                        <small style={{ color: '#7f8c8d', fontSize: '12px', marginTop: '4px' }}>
                                            Choose a unique username for your account
                                        </small>
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
                        {activeToolModal === 'priceCalculator' && <PriceCalculatorTool />}
                        {activeToolModal === 'marketAnalysis' && <MarketAnalysisTool />}
                        {activeToolModal === 'listingEnhancement' && (
                            <SellerDashboardStyles.ToolContainer>
                            <p style={{ fontSize: '15px', color: '#34495E', lineHeight: '1.5' }}>
                                Use these expert tips to optimize your listings and attract more potential buyers.
                            </p>
                            
                            <SellerDashboardStyles.TipCard $accentColor="#3498db">
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
                            
                            <SellerDashboardStyles.TipCard $accentColor="#2ecc71" $bgColor="rgba(46, 204, 113, 0.1)">
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
                            
                            <SellerDashboardStyles.TipCard $accentColor="#f39c12" $bgColor="rgba(243, 156, 18, 0.1)">
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
                            
                            <SellerDashboardStyles.TipCard $accentColor="#9b59b6" $bgColor="rgba(155, 89, 182, 0.1)">
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
                    <PreviewModalStyles.PreviewModal>
                        <PreviewModalStyles.PreviewContent>
                            <PreviewModalStyles.CloseButton onClick={closePreviewModal}>×</PreviewModalStyles.CloseButton>
                            
                            <PreviewModalStyles.ImageGallery>
                                <PreviewModalStyles.MainImage src={previewListing.images[activeImageIndex]} alt={previewListing.title} />
                                <PreviewModalStyles.NavButton $left onClick={handlePrevImage}>
                                    <FaChevronLeft size={24} />
                                    </PreviewModalStyles.NavButton>
                                <PreviewModalStyles.NavButton $right onClick={handleNextImage}>
                                    <FaChevronRight size={24} />
                                    </PreviewModalStyles.NavButton>
                                <PreviewModalStyles.ThumbnailsContainer>
                                    {previewListing.images.map((image, index) => (
                                        <PreviewModalStyles.Thumbnail
                                            key={index}
                                            src={image}
                                            alt={`${previewListing.title} - Image ${index + 1}`}
                                            active={index === activeImageIndex}
                                            onClick={() => handleThumbnailClick(index)}
                                            />
                                    ))}
                                </PreviewModalStyles.ThumbnailsContainer>
                            </PreviewModalStyles.ImageGallery>

                            <PreviewModalStyles.MainContent>
                                <PreviewModalStyles.ListingHeader>
                                    <PreviewModalStyles.TitleSection>
                                        <PreviewModalStyles.ListingTitle>{previewListing.title}</PreviewModalStyles.ListingTitle>
                                        <PreviewModalStyles.ListingLocation>
                                            <FaMapMarkerAlt size={14} style={{ marginRight: '5px' }} />
                                            {previewListing.address}
                                        </PreviewModalStyles.ListingLocation>
                                    </PreviewModalStyles.TitleSection>
                                </PreviewModalStyles.ListingHeader>

                                <PreviewModalStyles.ContentGrid>
                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Property Details</PreviewModalStyles.SectionTitle>
                                        <PreviewModalStyles.PropertySpecs>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Size</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{previewListing.size}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Type</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{previewListing.type}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Water Rights</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{previewListing.waterRights}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Listed Date</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{formatDate(previewListing.listedDate)}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                        </PreviewModalStyles.PropertySpecs>
                                    </PreviewModalStyles.Section>

                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Description</PreviewModalStyles.SectionTitle>
                                        <PreviewModalStyles.Description>{previewListing.description}</PreviewModalStyles.Description>
                                    </PreviewModalStyles.Section>

                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Farm Details</PreviewModalStyles.SectionTitle>
                                        <PreviewModalStyles.PropertySpecs>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Previous Crops</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>
                                                    {previewListing.farmDetails.previousCrops.length > 0 
                                                        ? previewListing.farmDetails.previousCrops.join(', ') 
                                                        : 'No previous crops recorded'}
                                                </PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Average Yield</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{previewListing.farmDetails.averageYield}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                            <PreviewModalStyles.SpecItem>
                                                <PreviewModalStyles.SpecLabel>Topography</PreviewModalStyles.SpecLabel>
                                                <PreviewModalStyles.SpecValue>{previewListing.farmDetails.topography}</PreviewModalStyles.SpecValue>
                                            </PreviewModalStyles.SpecItem>
                                        </PreviewModalStyles.PropertySpecs>
                                    </PreviewModalStyles.Section>

                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Amenities</PreviewModalStyles.SectionTitle>
                                        <PreviewModalStyles.AmenitiesList>
                                            {previewListing.amenities.length > 0 ? (
                                                previewListing.amenities.map((amenity, index) => (
                                                    <PreviewModalStyles.AmenityItem key={index}>
                                                        <FaCheck size={14} style={{ marginRight: '8px', color: '#2ecc71' }} />
                                                        {amenity}
                                                    </PreviewModalStyles.AmenityItem>
                                                ))
                                            ) : (
                                                <PreviewModalStyles.EmptyMessage>No amenities listed</PreviewModalStyles.EmptyMessage>
                                            )}
                                        </PreviewModalStyles.AmenitiesList>
                                    </PreviewModalStyles.Section>

                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Restrictions</PreviewModalStyles.SectionTitle>
                                        <PreviewModalStyles.RestrictionsList>
                                            {previewListing.restrictions.length > 0 ? (
                                                previewListing.restrictions.map((restriction, index) => (
                                                    <PreviewModalStyles.RestrictionItem key={index}>
                                                        <FaExclamationTriangle size={14} style={{ marginRight: '8px' }} />
                                                        {restriction}
                                                    </PreviewModalStyles.RestrictionItem>
                                                ))
                                            ) : (
                                                <PreviewModalStyles.EmptyMessage>No restrictions listed</PreviewModalStyles.EmptyMessage>
                                            )}
                                        </PreviewModalStyles.RestrictionsList>
                                    </PreviewModalStyles.Section>

                                    <PreviewModalStyles.Section>
                                        <PreviewModalStyles.SectionTitle>Location</PreviewModalStyles.SectionTitle>
                                        <MapSection 
                                            coordinates={previewListing.coordinates} 
                                            onCoordinatesChange={handleCoordinatesChange}
                                            isEditable={true}
                                        />
                                    </PreviewModalStyles.Section>
                                </PreviewModalStyles.ContentGrid>
                            </PreviewModalStyles.MainContent>
                        </PreviewModalStyles.PreviewContent>
                    </PreviewModalStyles.PreviewModal>
                    )}
            </DashboardStyles.DashboardContent>
        </DashboardStyles.DashboardContainer>
    );
};

export default SellerDashboard;
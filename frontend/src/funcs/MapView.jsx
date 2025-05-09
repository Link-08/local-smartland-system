import { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import axios from 'axios';
// Import styled components from MapViewStyles
import { 
    GlobalStyles,
    Container, 
    MapSection, 
    FilterSection, 
    Label,
    Select, 
    LocationOverlay, 
    LocationName, 
    DirectionsLink, 
    ViewLargerMapLink, 
    Divider, 
    FilterItem, 
    FilterGroup, 
    FilterTitle, 
    Legend, 
    LegendItem,
    FilterScrollContainer,
    FilterGrid,
    LegendContainer,
    TemperatureRangeCard,
    FilterTitleRow,
    RangeDisplay,
    SearchSortRow,
    LoadingContainer,
    ScrollableList,
    EmptyListItem,
    BarangayListItem,
    BarangayName,
    BarangayDetails,
    SelectedBarangayCard,
    BarangayCardHeader,
    ActionButtons,
    BarangayInfoGrid,
    BarangayInfoItem,
    BarangayNotes,
    barangayInfoBoxStyle, 
    infoLabelStyle, 
    infoValueStyle, 
    infoRowStyle, 
    recommendationBoxStyle, 
    fruitChipStyle 
  } from './MapViewStyles';
  
// Import MUI components
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SortIcon from '@mui/icons-material/Sort';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// Import map components
import { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup, 
    Circle, 
    LayerGroup,
    ScaleControl,
    useMapEvents,
    GeoJSON
} from 'react-leaflet';
import { getBarangaysArray, getBarangaysObject } from './loadBarangays';

// Import GeoJSON for OSM roads
import roadsData from './cabanatuan-roads.json';

const OPENWEATHERMAP_API_KEY = "c0a32e00d3c50ae032ea9efd623bcce4";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Center coordinates for Cabanatuan, Nueva Ecija
const CabanatuanLatLng = { lat: 15.4841, lng: 120.9685 };

// Define bounds to restrict the map view to only Cabanatuan
const bounds = [
    [15.4441, 120.9285], // Southwest corner
    [15.5241, 121.0085]  // Northeast corner
];

// Define soil types and fruits with their colors
const soilTypeColors = {
    'Sandy Silt': '#8BC34A',
    'Silty Sand': '#FF5722',
    'Clayey Sand': '#795548',
    'Well-Graded Sand': '#9E9E9E',
    'Sandy Lean Clay': '#4CAF50',
    'Clayey Silt': '#FFC107'
};

// Generate unique colors for each barangay (for Show All Barangays)
const generateBarangayColors = (barangays) => {
    // Use a more distinct color palette for barangays
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
        '#9B59B6', '#3498DB', '#E67E22', '#2ECC71', '#F1C40F', '#E74C3C',
        '#1ABC9C', '#F39C12', '#34495E', '#16A085', '#D35400', '#8E44AD',
        '#27AE60', '#2980B9', '#C0392B', '#7F8C8D', '#BDC3C7', '#95A5A6',
        '#7FB3D5', '#F5B041', '#EC7063', '#5DADE2', '#48C9B0', '#F1948A',
        '#52BE80', '#F5CBA7', '#D7BDE2', '#A9CCE3', '#F9E79F', '#F5B7B1',
        '#ABEBC6', '#AED6F1', '#FAD7A0', '#D5F5E3', '#D6EAF8', '#FCF3CF'
    ];
    
    const barangayColors = {};
    barangays.forEach((barangay, index) => {
        barangayColors[barangay.name] = colors[index % colors.length];
    });
    return barangayColors;
};

// --- STANDARDIZED TEMPERATURE CATEGORIES ---
const temperatureCategories = [
  {
    label: 'Cool (< 24°C)',
    min: -Infinity,
    max: 23.99,
    color: '#64B5F6', // Light blue
    hoverColor: '#42A5F5', // Slightly darker blue
    description: 'Cooler than average. Suitable for leafy greens, root crops, and some temperate fruits.',
    textColor: '#FFFFFF'
  },
  {
    label: 'Moderate (24–28°C)',
    min: 24,
    max: 28,
    color: '#81C784', // Soft green
    hoverColor: '#66BB6A', // Slightly darker green
    description: 'Ideal for most tropical fruits and vegetables. Optimal for mango, kalamansi, watermelon.',
    textColor: '#FFFFFF'
  },
  {
    label: 'Warm (> 28°C)',
    min: 28.01,
    max: Infinity,
    color: '#FF8A65', // Soft orange-red
    hoverColor: '#FF7043', // Slightly darker orange-red
    description: 'Hot conditions. Best for heat-tolerant crops, but may cause heat stress for some plants.',
    textColor: '#FFFFFF'
  }
];

// Helper function to get temperature category with hover state
const getTemperatureCategory = (temperature, isHovered = false) => {
  if (temperature === null || temperature === undefined) {
    return {
      ...temperatureCategories[1],
      color: isHovered ? temperatureCategories[1].hoverColor : temperatureCategories[1].color
    };
  }
  
  const category = temperatureCategories.find(cat => 
    temperature >= cat.min && temperature <= cat.max
  ) || temperatureCategories[1];
  
  return {
    ...category,
    color: isHovered ? category.hoverColor : category.color
  };
};

// Helper function to get color based on filter type and barangay
const getBarangayColor = (barangay, filterType, barangayColors) => {
    if (!barangay) return '#666666';

    switch (filterType) {
        case 'soilType':
            return soilTypeColors[barangay.soilType] || '#666666';
        case 'elevation':
            return getElevationCategory(barangay.elevation).color;
        case 'temperature':
            // Use stored temperature if weather data is not available
            const temp = barangayWeather[barangay.name] ?? barangay.temperature ?? 25; // Default to 25°C if no data
            const tempCat = getTemperatureCategory(temp);
            return tempCat.color;
        case 'showAll':
            return barangayColors[barangay.name] || '#666666';
        case 'selected':
            return barangayColors[barangay.name] || '#2196F3';
        default:
            return '#666666';
    }
};

// Helper function to get opacity based on filter type
const getFilterOpacity = (filterType) => {
    switch (filterType) {
        case 'soilType':
            return 0.6;
        case 'elevation':
            return 0.4;
        case 'temperature':
            return 0.5;
        case 'showAll':
            return 0.15;
        case 'selected':
            return 0.7;
        default:
            return 0.5;
    }
};

// Soil type categories for display
const soilTypeCategories = [
    {
        label: 'Sandy Soils',
        types: ['Sandy Silt', 'Silty Sand', 'Well-Graded Sand'],
        color: '#8BC34A',
        description: 'Good drainage, suitable for most crops'
    },
    {
        label: 'Clay Soils',
        types: ['Clayey Sand', 'Sandy Lean Clay', 'Clayey Silt'],
        color: '#795548',
        description: 'High water retention, good for water-intensive crops'
    }
];

const fruitColors = {
    'Mangoes': '#FF9800',
    'Kalamansi': '#FFEB3B',
    'Watermelon': '#FF4081'
};

// Fruit suitability per soil type
const soilFruitSuitability = {
    'Loamy Soil': ['Mangoes', 'Watermelon', 'Kalamansi'],
    'Sandy Soil': ['Watermelon', 'Kalamansi'],
    'Clay Soil': ['Mangoes'],
    'Silty Soil': ['Mangoes', 'Kalamansi'],
    'Peaty Soil': ['Watermelon'],
    'Chalky Soil': ['Kalamansi']
};

// Define temperature ranges for optimal fruit growth
const fruitTemperatureRanges = {
    'Mangoes': { min: 24, max: 30, optimal: 27 },
    'Kalamansi': { min: 20, max: 32, optimal: 25 },
    'Watermelon': { min: 22, max: 35, optimal: 28 }
};

// Define ideal elevation ranges for fruits (in meters)
const fruitElevationRanges = {
    'Mangoes': { min: 0, max: 600, optimal: 300 },
    'Kalamansi': { min: 100, max: 800, optimal: 400 },
    'Watermelon': { min: 0, max: 500, optimal: 200 }
};

// Pathways classification system (for UI display)
const pathwayStatusInfo = {
    'Good': {
        color: '#4CAF50',
        description: 'Well-maintained roads, accessible by vehicles year-round'
    },
    'Fair': {
        color: '#FFC107',
        description: 'Partially maintained, may have issues during rainy season'
    },
    'Poor': {
        color: '#F44336',
        description: 'Difficult access, only by foot or motorcycle in dry season'
    }
};

// --- STANDARDIZED ELEVATION CATEGORIES ---
const elevationCategories = [
  {
    label: 'Lowland (≤ 200m)',
    min: 0,
    max: 200,
    color: '#4CAF50',
    description: 'Prone to flooding. Best for rice and water-intensive crops.'
  },
  {
    label: 'Midland (201–320m)',
    min: 201,
    max: 320,
    color: '#FFC107',
    description: 'Suitable for most fruit trees and vegetables. Moderate flood risk.'
  },
  {
    label: 'Highland (> 320m)',
    min: 321,
    max: Infinity,
    color: '#2196F3',
    description: 'Cooler, less flood risk. Good for mangoes, citrus, and high-value crops.'
  }
];

// Helper function to get elevation category
const getElevationCategory = (elevation) => {
  return elevationCategories.find(cat => elevation >= cat.min && elevation <= cat.max) || elevationCategories[0];
};

const DirectionIcon = () => (
    <svg width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.3 8.3a.5.5 0 0 1 0 .4l-4 4a.5.5 0 0 1-.8-.4V10H1.5a.5.5 0 0 1 0-1h5V5.1a.5.5 0 0 1 .8-.4l4 4z"/>
    </svg>
);

// Helper to fetch weather for a barangay
async function fetchBarangayWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data.main.temp;
}

// Define simplified road categories and their properties
const roadCategories = [
    'Major Roads',
    'Secondary Roads',
    'Local Roads'
];

const roadCategoryMap = {
    'Major Roads': {
        label: 'Major Roads',
        color: '#E53935', // Deep red
        types: ['primary', 'primary_link', 'trunk', 'trunk_link'],
        description: 'Main arterial roads connecting major areas. High traffic volume, multiple lanes.'
    },
    'Secondary Roads': {
        label: 'Secondary Roads',
        color: '#43A047', // Forest green
        types: ['secondary', 'secondary_link', 'tertiary', 'tertiary_link'],
        description: 'Connector roads between major and local roads. Moderate traffic flow.'
    },
    'Local Roads': {
        label: 'Local Roads',
        color: '#1E88E5', // Bright blue
        types: ['residential', 'living_street', 'service', 'unclassified', 'road'],
        description: 'Neighborhood and service roads. Low traffic, primarily local access.'
    }
};

const MapView = () => {
    // Initialize all state values with explicit defaults
    const [selectedLocation, setSelectedLocation] = useState({
        lat: CabanatuanLatLng.lat,
        lng: CabanatuanLatLng.lng,
        name: "Cabanatuan, Nueva Ecija" 
    });

    // Initialize filters with explicit boolean values
    const [filters, setFilters] = useState({
        soilType: false,
        fruits: false,
        elevation: false,
        temperature: false,
        roads: false,
        irrigation: false,
        showAllBarangays: false,
        selectedBarangay: ''
    });

    const [highlightedAreas, setHighlightedAreas] = useState([]);
    const [barangayInfo, setBarangayInfo] = useState(null);
    const [mapType, setMapType] = useState('standard');
    const [barangays, setBarangays] = useState([]);
    const [barangayData, setBarangayData] = useState({});
    const [barangayWeather, setBarangayWeather] = useState({});
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);
    const [temperatureStats, setTemperatureStats] = useState({
        min: null,
        max: null,
        average: null,
        lastUpdated: null
    });
    const [sortField, setSortField] = useState('temperature');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSidebarBarangay, setSelectedSidebarBarangay] = useState(null);
    const [selectedRoadCategory, setSelectedRoadCategory] = useState('');
    const [lastWeatherFetch, setLastWeatherFetch] = useState(null);
    const [barangayColors] = useState(() => generateBarangayColors(getBarangaysArray()));

    // Helper function to get color based on filter type and barangay
    const getBarangayColor = (barangay, filterType, barangayColors) => {
        if (!barangay) return '#666666';

        switch (filterType) {
            case 'soilType':
                return soilTypeColors[barangay.soilType] || '#666666';
            case 'elevation':
                return getElevationCategory(barangay.elevation).color;
            case 'temperature':
                // Use stored temperature if weather data is not available
                const temp = barangayWeather[barangay.name] ?? barangay.temperature ?? 25; // Default to 25°C if no data
                const tempCat = getTemperatureCategory(temp);
                return tempCat.color;
            case 'showAll':
                return barangayColors[barangay.name] || '#666666';
            case 'selected':
                return barangayColors[barangay.name] || '#2196F3';
            default:
                return '#666666';
        }
    };

    // Initialize barangays data and fetch weather
    useEffect(() => {
        const initialBarangays = getBarangaysArray();
        const initialBarangayData = getBarangaysObject();
        setBarangays(initialBarangays);
        setBarangayData(initialBarangayData);

        // Initialize weather data with stored temperatures
        const initialWeather = {};
        initialBarangays.forEach(barangay => {
            initialWeather[barangay.name] = barangay.temperature ?? 25; // Default to 25°C if no stored temperature
        });
        setBarangayWeather(initialWeather);
    }, []);

    // Fetch live weather data
    useEffect(() => {
        async function fetchAllWeather() {
            setWeatherLoading(true);
            setWeatherError(null);
            try {
                const arr = getBarangaysArray();
                const weatherObj = { ...barangayWeather }; // Preserve existing data
                await Promise.all(arr.map(async (b) => {
                    try {
                        const temp = await fetchBarangayWeather(b.center[0], b.center[1]);
                        weatherObj[b.name] = temp;
                    } catch (err) {
                        // Keep existing temperature if fetch fails
                        weatherObj[b.name] = weatherObj[b.name] ?? b.temperature ?? 25;
                    }
                }));
                setBarangayWeather(weatherObj);
                setLastWeatherFetch(new Date());
            } catch (error) {
                setWeatherError("Failed to fetch weather data");
            } finally {
                setWeatherLoading(false);
            }
        }
        fetchAllWeather();
    }, []);

    // Helper to compute min, max, avg temperature
    const getTemperatureStats = () => {
        const temps = Object.values(barangayWeather).filter(t => typeof t === 'number');
        if (!temps.length) return null;
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        return { min, max, avg };
    };

    // Ensure consistent state updates for filters
    const handleFilterChange = (filter) => {
        // Clear all visual elements first
        setHighlightedAreas([]);
        setSelectedRoadCategory('');
        setBarangayInfo(null);

        setFilters(prev => {
            // If the clicked filter is already active, turn it off
            if (prev[filter]) {
                return {
                    ...prev,
                    [filter]: false,
                    showAllBarangays: false,
                    selectedBarangay: ''
                };
            }

            // Otherwise, turn off all filters and activate only the clicked one
            const newState = {
                ...prev,
                soilType: false,
                fruits: false,
                elevation: false,
                temperature: false,
                roads: false,
                irrigation: false,
                showAllBarangays: false,
                selectedBarangay: '',
                [filter]: true
            };

            return newState;
        });
    };

    // Ensure consistent state updates for barangay selection
    const handleBarangaySelect = (e) => {
        const selectedValue = e?.target?.value || '';
        setFilters(prev => ({
            ...prev,
            showAllBarangays: false,
            selectedBarangay: selectedValue
        }));

        if (selectedValue && barangayData[selectedValue]) {
            const barangay = barangayData[selectedValue];
            setSelectedLocation({
                lat: barangay.center[0],
                lng: barangay.center[1],
                name: selectedValue
            });
            setBarangayInfo({
                name: selectedValue,
                soilType: barangay.soilType || '',
                currentFruit: barangay.fruits || '',
                suitableFruits: soilFruitSuitability[barangay.soilType] || [],
                elevation: barangay.elevation || 0,
                temperature: barangay.temperature || 0,
                pathways: barangay.pathways || '',
                notes: barangay.notes || '',
                recommendations: generateRecommendations(selectedValue)
            });
            setHighlightedAreas([{
                name: selectedValue,
                color: barangayColors[selectedValue] || '#666666',
                opacity: 0.7
            }]);
        } else {
            setBarangayInfo(null);
            setHighlightedAreas([]);
        }
    };

    // Generate recommendations based on soil, elevation, temperature, and pathways
    const generateRecommendations = (barangayName) => {
        const barangay = barangayData[barangayName];
        const recommendations = {
            bestFruits: [],
            notes: [],
            overall: ''
        };

        // Use live weather if available
        const currentTemp = barangayWeather[barangayName] ?? barangay.temperature;
        
        // Check soil suitability
        const suitableFruits = soilFruitSuitability[barangay.soilType] || [];
        
        // Filter fruits by temperature and elevation suitability
        const optimalFruits = suitableFruits.filter(fruit => {
            const tempSuitable = currentTemp >= fruitTemperatureRanges[fruit].min && 
                                currentTemp <= fruitTemperatureRanges[fruit].max;
            
            const elevSuitable = barangay.elevation >= fruitElevationRanges[fruit].min && 
                                barangay.elevation <= fruitElevationRanges[fruit].max;
            
            return tempSuitable && elevSuitable;
        });

        recommendations.bestFruits = optimalFruits;
        
        // Add notes about pathways
        if (barangay.pathways === 'Poor') {
            recommendations.notes.push("Limited accessibility may affect transportation of produce. Consider smaller-scale farming or crops with longer shelf life.");
        } else if (barangay.pathways === 'Fair') {
            recommendations.notes.push("Moderate accessibility. Plan harvesting during dry season for easier transportation.");
        } else {
            recommendations.notes.push("Good accessibility year-round makes this area ideal for commercial farming operations.");
        }
        
        // Check if current fruit is actually optimal
        if (!optimalFruits.includes(barangay.fruits)) {
            recommendations.notes.push(`Current crop (${barangay.fruits}) is not optimal for this area's conditions. Consider switching to ${optimalFruits.join(' or ')}.`);
        } else {
            recommendations.notes.push(`${barangay.fruits} is well-suited for this area's conditions.`);
        }
        
        // Add elevation note
        recommendations.notes.push(`Elevation (${barangay.elevation}m) is ${
            barangay.elevation < 200 ? 'low' : barangay.elevation > 400 ? 'high' : 'moderate'
        }, making it suitable for ${
            barangay.elevation < 200 ? 'watermelon and certain lowland fruits' : 
            barangay.elevation > 400 ? 'highland varieties of citrus and some mango varieties' : 
            'a wide range of fruits including mangoes and citrus'
        }.`);
        
        // Add temperature note
        recommendations.notes.push(`Average temperature (${currentTemp}°C) is ${
            currentTemp < 25 ? 'relatively cool' : currentTemp > 29 ? 'warm' : 'moderate'
        } for this region.`);
        
        // Generate overall recommendation
        if (optimalFruits.length > 0) {
            recommendations.overall = `This area is ${optimalFruits.includes(barangay.fruits) ? 'already growing an optimal crop' : 'best suited for growing ' + optimalFruits.join(' or ')}. ${barangay.pathways !== 'Poor' ? 'Good accessibility supports commercial operations.' : 'Consider infrastructure improvements to enhance accessibility.'}`;
        } else {
            recommendations.overall = "Based on soil, elevation, and temperature data, we recommend evaluating alternative crops or soil amendments to improve growing conditions.";
        }
        
        return recommendations;
    };

    // Update the handleLegendClick function
    const handleLegendClick = (legendType, legendItem) => {
        // If a specific barangay is selected, highlight it
        if (filters.selectedBarangay) {
            setHighlightedAreas([{
                name: filters.selectedBarangay,
                color: legendType === 'soilType' ? 
                    soilTypeColors[barangayData[filters.selectedBarangay].soilType] : 
                    legendType === 'elevation' ?
                    getElevationCategory(barangayData[filters.selectedBarangay].elevation).color :
                    legendType === 'temperature' ?
                    getTemperatureCategory(barangayData[filters.selectedBarangay].temperature).color :
                    fruitColors[barangayData[filters.selectedBarangay].fruits],
                opacity: 0.6
            }]);
            return;
        }

        // Otherwise, find and highlight all barangays that match the selected filter
        const matchingBarangays = [];
        barangays.forEach((barangay) => {
            const name = barangay.name;
            const data = barangayData[name];
            let matches = false;
            let color = '#3388ff'; // Default color
            
            if (legendType === 'soilType' && data.soilType === legendItem) {
                matches = true;
                color = soilTypeColors[data.soilType];
            } else if (legendType === 'fruits' && data.fruits === legendItem) {
                matches = true;
                color = fruitColors[data.fruits];
            } else if (legendType === 'elevation') {
                const cat = elevationCategories.find(cat => cat.label === legendItem);
                if (cat && data.elevation >= cat.min && data.elevation <= cat.max) {
                    matches = true;
                    color = cat.color;
                }
            } else if (legendType === 'temperature') {
                const cat = temperatureCategories.find(cat => cat.label === legendItem);
                if (cat) {
                    const temp = barangayWeather[name] ?? data.temperature;
                    if (temp >= cat.min && temp <= cat.max) {
                    matches = true;
                    color = cat.color;
                    }
                }
            }
            
            if (matches) {
                matchingBarangays.push({
                    name: name,
                    color: color,
                    opacity: 0.6
                });
            }
        });
        setHighlightedAreas(matchingBarangays);
    };

    // Show all barangays when that option is selected
    useEffect(() => {
        if (filters.showAllBarangays && !filters.soilType && !filters.elevation && !filters.temperature && !filters.roads) {
            setSelectedRoadCategory('');
            const allBarangays = barangays.map(barangay => ({
                name: barangay.name,
                color: '#666666', // Neutral gray for all barangays
                opacity: 0.15
            }));
            setHighlightedAreas(allBarangays);
        } else if (!filters.selectedBarangay && 
                  !filters.soilType && 
                  !filters.fruits && 
                  !filters.elevation && 
                  !filters.temperature && 
                  !filters.roads && 
                  !filters.irrigation) {
            // Clear all visual elements if no filters are active
            setHighlightedAreas([]);
            setSelectedRoadCategory('');
            setBarangayInfo(null);
        }
    }, [filters.showAllBarangays, filters.soilType, filters.elevation, filters.temperature, filters.roads]);

    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                setSelectedLocation({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    name: "Selected Location"
                });
                
                // Check if clicked within any barangay circle
                let foundBarangay = false;
                barangays.forEach((name) => {
                    const data = barangayData[name];
                    const distance = calculateDistance(
                        e.latlng.lat, e.latlng.lng,
                        data.center[0], data.center[1]
                    );
                    
                    // If within radius, select this barangay
                    if (distance <= data.radius / 1000) { // Convert radius from meters to km
                        setFilters(prev => ({ ...prev, selectedBarangay: name }));
                        handleBarangaySelect({ target: { value: name } });
                        foundBarangay = true;
                    }
                });
                
                // Clear selection if clicked outside all barangays
                if (!foundBarangay && filters.selectedBarangay) {
                    setFilters(prev => ({ ...prev, selectedBarangay: '' }));
                    setBarangayInfo(null);
                }
            }
        });
        return null;
    };
    
    // Calculate distance between two points in km using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    };

    // Get the appropriate tile layer based on selected map type
    const getMapTileLayer = () => {
        switch(mapType) {
            case 'terrain':
                return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
            case 'satellite':
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            default:
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        }
    };

    return (
        <>
          <GlobalStyles />
          <Container>
            {/* Map Section - Left Side */}
            <MapSection>
              <MapContainer 
                center={[CabanatuanLatLng.lat, CabanatuanLatLng.lng]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }} 
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                zoomControl={true}
                zoomAnimation={true}
              >
                <TileLayer 
                  url={getMapTileLayer()} 
                  attribution={mapType === 'terrain' ? 
                    '&copy; OpenTopoMap' : 
                    mapType === 'satellite' ? 
                      '&copy; Esri' : 
                      '&copy; OpenStreetMap contributors'
                  }
                />
                <MapClickHandler />
                
                {/* Add OSM Roads GeoJSON Layer */}
                {filters.roads && selectedRoadCategory && (
                  <GeoJSON
                    key={selectedRoadCategory}
                    data={{
                      type: 'FeatureCollection',
                      features: roadsData.features.filter(f => roadCategoryMap[selectedRoadCategory].types.includes(f.properties.highway))
                    }}
                    style={{
                      color: roadCategoryMap[selectedRoadCategory].color,
                      weight: 4,
                      opacity: 0.9
                    }}
                  />
                )}
                
                {/* Render highlighted area circles */}
                <LayerGroup>
                  {/* Show All Barangays Functionality */}
                  {filters.showAllBarangays && !filters.soilType && barangays.map((barangay, index) => {
                    if (!barangay || !barangay.center || !barangay.radius) return null;
                    return (
                      <Circle
                        key={`all-${barangay.name}-${index}`}
                        center={barangay.center}
                        radius={barangay.radius}
                        pathOptions={{
                          color: getBarangayColor(barangay, 'showAll', barangayColors),
                          fillOpacity: getFilterOpacity('showAll'),
                          weight: 1,
                          dashArray: '5, 5'
                        }}
                      >
                        <Popup>
                          <div style={{ color: '#333' }}>
                            <strong>{barangay.name}</strong><br />
                            <strong>Soil Type:</strong> {barangay.soilType}<br />
                            <strong>Main Fruit:</strong> {barangay.fruits}<br />
                            <strong>Elevation:</strong> {barangay.elevation}m<br />
                            <strong>Avg. Temp:</strong> {barangay.temperature}°C<br />
                            <strong>Pathways:</strong> {barangay.pathways}
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}
      
                  {/* Highlighted/Selected Barangays */}
                  {highlightedAreas.map((area, index) => {
                    const barangay = barangayData[area.name];
                    if (!barangay || !barangay.center || !barangay.radius) return null;
                    
                    let filterType = 'selected';
                    if (filters.soilType) filterType = 'soilType';
                    else if (filters.elevation) filterType = 'elevation';
                    else if (filters.temperature) filterType = 'temperature';
                    
                    const color = getBarangayColor(barangay, filterType, barangayColors);
                    const opacity = getFilterOpacity(filterType);
                    
                    return (
                      <Circle 
                        key={`${area.name}-${index}`}
                        center={barangay.center}
                        radius={barangay.radius}
                        pathOptions={{ 
                          color: color,
                          fillOpacity: opacity,
                          weight: 2,
                          dashArray: '5, 5'
                        }}
                      >
                        <Popup>
                          <div style={{ color: '#333' }}>
                            <strong>{area.name}</strong><br />
                            <strong>Soil Type:</strong> {barangay.soilType}<br />
                            <strong>Main Fruit:</strong> {barangay.fruits}<br />
                            <strong>Elevation:</strong> {barangay.elevation}m ({getElevationCategory(barangay.elevation).label})<br />
                            <strong>Avg. Temp:</strong> {barangay.temperature}°C ({getTemperatureCategory(barangay.temperature).label})<br />
                            <strong>Pathways:</strong> {barangay.pathways}
                          </div>
                        </Popup>
                      </Circle>
                    );
                  })}
                </LayerGroup>
                
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>{selectedLocation.name}</Popup>
                </Marker>
                
                {/* Add Scale Control */}
                <ScaleControl position="bottomright" imperial={false} />
              </MapContainer>
              
              <LocationOverlay>
                <LocationName>{selectedLocation.name}</LocationName>
                <DirectionsLink>
                  <DirectionIcon />
                  Directions
                </DirectionsLink>
                <ViewLargerMapLink href="#">View larger map</ViewLargerMapLink>
              </LocationOverlay>
            </MapSection>
            
            {/* Filter Section - Right Side */}
            <FilterSection>
              <FilterScrollContainer>
                <FilterGroup>
                  <FilterTitle>Map Type:</FilterTitle>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginTop: '20px',
                      marginBottom: '15px',
                      backgroundColor: '#e57373',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setFilters({
                        soilType: false,
                        fruits: false,
                        elevation: false,
                        temperature: false,
                        irrigation: false,
                        showAllBarangays: false,
                        selectedBarangay: ''
                      });
                      setBarangayInfo(null);
                      setHighlightedAreas([]);
                      setSelectedLocation({
                        lat: CabanatuanLatLng.lat,
                        lng: CabanatuanLatLng.lng,
                        name: "Cabanatuan, Nueva Ecija"
                      });
                    }}
                  >
                    Remove Filters
                  </button>
                  <Select 
                    value={mapType || 'standard'} 
                    onChange={(e) => setMapType(e.target.value || 'standard')}
                  >
                    <option value="standard">Standard</option>
                    <option value="terrain">Terrain (Elevation)</option>
                    <option value="satellite">Satellite</option>
                  </Select>
                </FilterGroup>
                
                {/* Filter Categories */}
                <FilterGroup>
                  <FilterTitle>Filter by:</FilterTitle>
                  <FilterGrid>
                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="soil-type"
                        checked={filters.soilType} 
                        onChange={() => handleFilterChange('soilType')} 
                      />
                      <Label htmlFor="soil-type">Soil Type</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="fruits"
                        checked={filters.fruits} 
                        onChange={() => {}}
                        disabled
                      />
                      <Label htmlFor="fruits">Crops (coming soon)</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="elevation"
                        checked={filters.elevation} 
                        onChange={() => handleFilterChange('elevation')} 
                      />
                      <Label htmlFor="elevation">Elevation</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="temperature"
                        checked={filters.temperature} 
                        onChange={() => handleFilterChange('temperature')}
                      />
                      <Label htmlFor="temperature">Temperature</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="irrigation"
                        checked={filters.irrigation}
                        onChange={() => {}}
                        disabled
                      />
                      <Label htmlFor="irrigation">Irrigation (coming soon)</Label>
                    </FilterItem>

                    <FilterItem>
                      <Checkbox 
                        type="checkbox" 
                        id="roads"
                        checked={filters.roads}
                        onChange={() => handleFilterChange('roads')}
                      />
                      <Label htmlFor="roads">Roads</Label>
                    </FilterItem>
                  </FilterGrid>
                </FilterGroup>
      
                {/* Temperature Filter Section */}
                {filters.temperature && (
                    <FilterGroup>
                        <FilterTitle>Temperature Zones</FilterTitle>
                        {/* Temperature statistics section */}
                        {(() => {
                          const stats = getTemperatureStats();
                          if (!stats) return null;
                          return (
                            <div style={{
                              padding: '10px',
                              backgroundColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                              marginBottom: '12px',
                              color: '#fff',
                              fontSize: '0.97em'
                            }}>
                              <div><b>Min:</b> {stats.min.toFixed(1)}°C &nbsp; <b>Max:</b> {stats.max.toFixed(1)}°C &nbsp; <b>Avg:</b> {stats.avg.toFixed(1)}°C</div>
                              {lastWeatherFetch && (
                                <div style={{ fontSize: '0.9em', color: '#bdc3c7', marginTop: 4 }}>
                                  Last updated: {lastWeatherFetch.toLocaleString()}
                    </div>
                              )}
                            </div>
                          );
                        })()}
                        <div style={{ marginTop: '10px' }}>
                          {temperatureCategories.map((category) => (
                            <div
                              key={category.label}
                              style={{
                                padding: '10px',
                                marginBottom: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                                }
                              }}
                              onClick={() => handleLegendClick('temperature', category.label)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: category.color,
                                    marginRight: '8px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                                />
                                <span style={{ 
                                    fontWeight: 'bold',
                                    color: category.textColor
                                }}>
                                    {category.label}
                                </span>
                    </div>
                              <div style={{ 
                                  fontSize: '0.9em', 
                                  color: '#bdc3c7', 
                                  marginLeft: '28px',
                                  lineHeight: '1.4'
                              }}>
                                  {category.description}
                    </div>
                    </div>
                          ))}
                        </div>
                    </FilterGroup>
                )}

                {filters.elevation && (
                    <FilterGroup>
                        <FilterTitle>Elevation Zones</FilterTitle>
                        <div style={{ marginTop: '10px' }}>
                            {elevationCategories.map((category) => (
                                <div
                                    key={category.label}
                                    style={{
                                        padding: '10px',
                                        marginBottom: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleLegendClick('elevation', category.label)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: category.color,
                                                marginRight: '8px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <span style={{ fontWeight: 'bold' }}>{category.label}</span>
                    </div>
                                    <div style={{ fontSize: '0.9em', color: '#bdc3c7', marginLeft: '28px' }}>
                                        {category.description}
                      </div>
                    </div>
                            ))}
                    </div>
                    </FilterGroup>
                )}

                {filters.roads && (
                  <FilterGroup>
                    <FilterTitle>Road Categories</FilterTitle>
                    <div style={{ marginTop: '10px' }}>
                      {roadCategories.map(cat => (
                        <div
                          key={cat}
                          style={{
                            padding: '12px',
                            marginBottom: '10px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                          onClick={() => setSelectedRoadCategory(cat)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="road-category"
                              value={cat}
                              checked={selectedRoadCategory === cat}
                              onChange={() => setSelectedRoadCategory(cat)}
                              style={{ margin: 0 }}
                            />
                            <div style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: roadCategoryMap[cat].color,
                              borderRadius: '4px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                            <span style={{ 
                              fontWeight: 'bold',
                              color: '#fff',
                              fontSize: '1.1em'
                            }}>
                              {roadCategoryMap[cat].label}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: '0.9em', 
                            color: '#bdc3c7',
                            marginLeft: '34px',
                            lineHeight: '1.4'
                          }}>
                            {roadCategoryMap[cat].description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FilterGroup>
                )}

                {filters.soilType && (
                    <FilterGroup>
                        <FilterTitle>Soil Type Categories</FilterTitle>
                        <div style={{ marginTop: '10px' }}>
                            {soilTypeCategories.map((category) => (
                                <div
                                    key={category.label}
                                    style={{
                        padding: '10px', 
                                        marginBottom: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        // Find all barangays with soil types in this category
                                        const matchingBarangays = barangays.filter(barangay => 
                                            category.types.includes(barangay.soilType)
                                        ).map(barangay => ({
                                            name: barangay.name,
                                            color: soilTypeColors[barangay.soilType],
                                            opacity: 0.6
                                        }));
                                        setHighlightedAreas(matchingBarangays);
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: category.color,
                                                marginRight: '8px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <span style={{ fontWeight: 'bold' }}>{category.label}</span>
                      </div>
                                    <div style={{ fontSize: '0.9em', color: '#bdc3c7', marginLeft: '28px' }}>
                                        {category.description}
                    </div>
                                    <div style={{ fontSize: '0.9em', color: '#bdc3c7', marginLeft: '28px', marginTop: '4px' }}>
                                        Types: {category.types.join(', ')}
                  </div>
                                </div>
                            ))}
                        </div>
                    </FilterGroup>
                )}
      
                <FilterGroup>
                  <FilterTitle>Select Barangay:</FilterTitle>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#4CAF50',
                          color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        showAllBarangays: true, 
                        selectedBarangay: '' 
                      }));
                      setBarangayInfo(null);
                      setHighlightedAreas([]);
                    }}
                  >
                    Show All Barangays
                  </button>
                  <Select
                    value={filters.selectedBarangay}
                    onChange={handleBarangaySelect}
                  >
                    <option value="">-- Select a barangay --</option>
                    {barangays.map(barangay => (
                      <option key={barangay.name} value={barangay.name}>
                        {barangay.name}
                      </option>
                    ))}
                  </Select>
                </FilterGroup>
                <Divider />
              </FilterScrollContainer>
            </FilterSection>
          </Container>
        </>
    );
};

export default MapView;
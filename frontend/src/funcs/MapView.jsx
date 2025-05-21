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
import DirectionsIcon from '@mui/icons-material/Directions';

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

// Import GeoJSON for OSM roads and irrigation
import roadsData from './cabanatuan-roads.json';
import irrigationData from './cabanatuan-irrigations.json';

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

// Define soil type categories with colors and descriptions
const soilTypeCategories = [
    {
        label: 'Sandy Soils',
        types: ['Sandy Silt', 'Silty Sand', 'Well-Graded Sand'],
        color: '#8BC34A', // Light green
        hoverColor: '#7CB342',
        description: 'Well-draining soils suitable for root crops and vegetables'
    },
    {
        label: 'Clay Soils',
        types: ['Clayey Sand', 'Sandy Lean Clay', 'Clayey Silt'],
        color: '#795548', // Brown
        hoverColor: '#6D4C41',
        description: 'Moisture-retaining soils ideal for rice and water-loving crops'
    }
];

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

// Define elevation categories with colors and descriptions
const elevationCategories = [
    {
        label: 'Low (0-35m)',
        min: 0,
        max: 35,
        color: '#4CAF50', // Green
        hoverColor: '#43A047',
        description: 'Suitable for lowland crops and rice cultivation',
        textColor: '#FFFFFF'
    },
    {
        label: 'Moderate (36-50m)',
        min: 36,
        max: 50,
        color: '#FFC107', // Amber
        hoverColor: '#FFA000',
        description: 'Ideal for most tropical fruits and vegetables',
        textColor: '#000000'
    },
    {
        label: 'High (>50m)',
        min: 51,
        max: Infinity,
        color: '#FF5722', // Deep orange
        hoverColor: '#F4511E',
        description: 'Suitable for highland crops and certain fruit varieties',
        textColor: '#FFFFFF'
    }
];

// Helper function to get elevation category
const getElevationCategory = (elevation) => {
    if (elevation === null || elevation === undefined) {
        return elevationCategories[1]; // Default to moderate if elevation is not available
    }
    
    const category = elevationCategories.find(cat => 
        elevation >= cat.min && elevation <= cat.max
    ) || elevationCategories[1];
    
    return category;
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

// Define viability levels with more distinct colors
const viabilityLevels = {
    'High': {
        color: '#4CAF50', // Vibrant green
        hoverColor: '#43A047', // Darker green for hover
        description: 'Excellent growing conditions',
        textColor: '#FFFFFF'
    },
    'Moderate': {
        color: '#FFC107', // Amber
        hoverColor: '#FFA000', // Darker amber for hover
        description: 'Suitable growing conditions',
        textColor: '#000000'
    },
    'Low': {
        color: '#FF5722', // Deep orange
        hoverColor: '#F4511E', // Darker orange for hover
        description: 'Challenging growing conditions',
        textColor: '#FFFFFF'
    },
    'Restricted': {
        color: '#F44336', // Red
        hoverColor: '#E53935', // Darker red for hover
        description: 'Not recommended for growing',
        textColor: '#FFFFFF'
    }
};

// Update fruit colors to match viability levels
const fruitColors = {
    'Calamansi': viabilityLevels.High.color,
    'Corn': viabilityLevels.Moderate.color,
    'Eggplant': viabilityLevels.High.color,
    'Rice': viabilityLevels.High.color,
    'Onion': viabilityLevels.Moderate.color
};

// Define irrigation categories and their properties
const irrigationCategories = ['Rivers', 'Canals', 'Ditches'];

const irrigationCategoryMap = {
    'Rivers': {
        label: 'Rivers',
        types: ['river', 'stream'],
        color: '#2196F3', // Blue
        hoverColor: '#1976D2',
        weight: 4,
        opacity: 0.8,
        fillOpacity: 0.2,
        description: 'Major water bodies and natural waterways'
    },
    'Canals': {
        label: 'Canals',
        types: ['canal', 'drain'],
        color: '#4CAF50', // Green
        hoverColor: '#388E3C',
        weight: 3,
        opacity: 0.7,
        fillOpacity: 0.15,
        description: 'Man-made water channels for irrigation'
    },
    'Ditches': {
        label: 'Ditches',
        types: ['ditch'],
        color: '#FFC107', // Amber
        hoverColor: '#FFA000',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.1,
        description: 'Small water channels for drainage and irrigation'
    }
};

// Define road categories and their properties
const roadCategories = ['Primary', 'Secondary', 'Tertiary', 'Residential'];

const roadCategoryMap = {
    'Primary': {
        label: 'Primary Roads',
        types: ['primary', 'primary_link'],
        color: '#E53935', // Red
        hoverColor: '#C62828',
        description: 'Major highways and arterial roads'
    },
    'Secondary': {
        label: 'Secondary Roads',
        types: ['secondary', 'secondary_link'],
        color: '#FB8C00', // Orange
        hoverColor: '#EF6C00',
        description: 'Important connecting roads between primary roads'
    },
    'Tertiary': {
        label: 'Tertiary Roads',
        types: ['tertiary', 'tertiary_link'],
        color: '#FDD835', // Yellow
        hoverColor: '#FBC02D',
        description: 'Local connecting roads'
    },
    'Residential': {
        label: 'Residential Roads',
        types: ['residential', 'unclassified', 'living_street'],
        color: '#7CB342', // Light Green
        hoverColor: '#689F38',
        description: 'Neighborhood and local access roads'
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

// Add these data structures at the top level
const fruitTemperatureRanges = {
    'Calamansi': { min: 20, max: 30 },
    'Corn': { min: 21, max: 32 },
    'Eggplant': { min: 22, max: 35 },
    'Rice': { min: 20, max: 35 },
    'Onion': { min: 15, max: 30 }
};

const soilFruitSuitability = {
    'Sandy Silt': ['Calamansi', 'Corn', 'Eggplant'],
    'Silty Sand': ['Corn', 'Rice'],
    'Clayey Sand': ['Rice', 'Onion'],
    'Well-Graded Sand': ['Corn', 'Eggplant'],
    'Sandy Lean Clay': ['Rice', 'Onion'],
    'Clayey Silt': ['Rice', 'Onion']
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
        selectedBarangay: '',
        // Initialize all crop selection states
        selectedCrop_Calamansi: false,
        selectedCrop_Corn: false,
        selectedCrop_Eggplant: false,
        selectedCrop_Rice: false,
        selectedCrop_Onion: false
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
    const [selectedIrrigationCategory, setSelectedIrrigationCategory] = useState('');

    // Move getBarangayColor inside the component
    const getBarangayColor = (barangay, filterType, barangayColors) => {
        if (!barangay) return '#666666';

        switch (filterType) {
            case 'soilType':
                return soilTypeColors[barangay.soilType] || '#666666';
            case 'elevation':
                return getElevationCategory(barangay.elevation).color;
            case 'temperature':
                const temp = barangayWeather[barangay.name] ?? barangay.temperature ?? 25;
                const tempCat = getTemperatureCategory(temp);
                return tempCat.color;
            case 'fruits':
                // Get the selected crop
                const selectedCrop = Object.keys(filters).find(key => 
                    key.startsWith('selectedCrop_') && filters[key]
                )?.replace('selectedCrop_', '');
                
                if (selectedCrop && barangay.fruits?.[selectedCrop]) {
                    const viability = barangay.fruits[selectedCrop];
                    // Only return color if viability is valid
                    if (typeof viability === 'string' && Object.keys(viabilityLevels).includes(viability)) {
                        return viabilityLevels[viability].color;
                    }
                }
                return '#666666';
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

    // Update the handleFilterChange function to handle crop selection
    const handleFilterChange = (filter) => {
        // Clear all visual elements first
        setHighlightedAreas([]);
        setSelectedRoadCategory('');
        setSelectedIrrigationCategory('');
        setBarangayInfo(null);

        setFilters(prev => {
            // Create a new state object with all existing properties
            const newState = { ...prev };
            
            // Toggle the clicked filter
            newState[filter] = !prev[filter];
            newState.showAllBarangays = false;
            newState.selectedBarangay = '';

            // If we're turning on a filter, turn off all others
            if (newState[filter]) {
                newState.soilType = filter === 'soilType';
                newState.fruits = filter === 'fruits';
                newState.elevation = filter === 'elevation';
                newState.temperature = filter === 'temperature';
                newState.roads = filter === 'roads';
                newState.irrigation = filter === 'irrigation';
            }

            // Reset all crop selections when toggling any filter
            Object.keys(newState)
                .filter(key => key.startsWith('selectedCrop_'))
                .forEach(key => {
                    newState[key] = false;
                });

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

    // Update the handleLegendClick function to properly handle fruits
    const handleLegendClick = (filterType, category) => {
        // Clear all existing filters and indicators first
        setSelectedRoadCategory('');
        setSelectedIrrigationCategory('');
        setBarangayInfo(null);

        if (filterType === 'temperature') {
            const selectedCategory = temperatureCategories.find(cat => cat.label === category);
            if (selectedCategory) {
                const matchingBarangays = barangays.filter(barangay => {
                    const temp = barangayWeather[barangay.name] ?? barangay.temperature ?? 25;
                    return temp >= selectedCategory.min && temp <= selectedCategory.max;
                }).map(barangay => ({
                    name: barangay.name,
                    color: getTemperatureCategory(barangay.temperature).color,
                    opacity: 0.6
                }));
                setHighlightedAreas(matchingBarangays);
            }
        } else if (filterType === 'elevation') {
            const selectedCategory = elevationCategories.find(cat => cat.label === category);
            if (selectedCategory) {
                const matchingBarangays = barangays.filter(barangay => 
                    barangay.elevation >= selectedCategory.min && 
                    barangay.elevation <= selectedCategory.max
                ).map(barangay => ({
                    name: barangay.name,
                    color: getElevationCategory(barangay.elevation).color,
                    opacity: 0.6
                }));
                setHighlightedAreas(matchingBarangays);
            }
        } else if (filterType === 'fruits') {
            // Update filters state while preserving all other states
            setFilters(prev => {
                const newState = { ...prev };
                // Reset all crop selections
                Object.keys(prev)
                    .filter(key => key.startsWith('selectedCrop_'))
                    .forEach(key => {
                        newState[key] = false;
                    });
                // Set the selected crop
                newState[`selectedCrop_${category}`] = true;
                return newState;
            });

            // Find all barangays where the selected fruit has valid viability data
            const matchingBarangays = barangays
                .filter(barangay => {
                    const viability = barangay.fruits?.[category];
                    return viability && typeof viability === 'string' && 
                           Object.keys(viabilityLevels).includes(viability);
                })
                .map(barangay => {
                    const viability = barangay.fruits[category];
                    return {
                        name: barangay.name,
                        color: viabilityLevels[viability].color,
                        opacity: 0.6,
                        viability: viability
                    };
                });

            // Sort barangays by viability (High -> Moderate -> Low -> Restricted)
            const viabilityOrder = ['High', 'Moderate', 'Low', 'Restricted'];
            matchingBarangays.sort((a, b) => {
                return viabilityOrder.indexOf(a.viability) - viabilityOrder.indexOf(b.viability);
            });

            setHighlightedAreas(matchingBarangays);
        }
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

    // Add CSS for highlighted areas
    const mapStyles = `
        .highlighted-area {
            transition: all 0.3s ease-in-out;
        }
        
        .highlighted-area:hover {
            fill-opacity: 0.8 !important;
            stroke-width: 3px !important;
        }
    `;

    // Add the styles to the document
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = mapStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

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

                {/* Add Irrigation GeoJSON Layer */}
                {filters.irrigation && selectedIrrigationCategory && (
                    <GeoJSON
                        key={selectedIrrigationCategory}
                        data={{
                            type: 'FeatureCollection',
                            features: irrigationData.features.filter(f => 
                                irrigationCategoryMap[selectedIrrigationCategory].types.includes(f.properties.waterway)
                            )
                        }}
                        style={{
                            color: irrigationCategoryMap[selectedIrrigationCategory].color,
                            weight: irrigationCategoryMap[selectedIrrigationCategory].weight,
                            opacity: irrigationCategoryMap[selectedIrrigationCategory].opacity,
                            fillColor: irrigationCategoryMap[selectedIrrigationCategory].color,
                            fillOpacity: irrigationCategoryMap[selectedIrrigationCategory].fillOpacity,
                            dashArray: selectedIrrigationCategory === 'Ditches' ? '5, 5' : null, // Dashed lines for ditches
                            lineCap: 'round',
                            lineJoin: 'round'
                        }}
                        onEachFeature={(feature, layer) => {
                            layer.on({
                                mouseover: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        color: irrigationCategoryMap[selectedIrrigationCategory].hoverColor,
                                        weight: irrigationCategoryMap[selectedIrrigationCategory].weight + 1,
                                        opacity: 1,
                                        fillOpacity: irrigationCategoryMap[selectedIrrigationCategory].fillOpacity + 0.1
                                    });
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        color: irrigationCategoryMap[selectedIrrigationCategory].color,
                                        weight: irrigationCategoryMap[selectedIrrigationCategory].weight,
                                        opacity: irrigationCategoryMap[selectedIrrigationCategory].opacity,
                                        fillOpacity: irrigationCategoryMap[selectedIrrigationCategory].fillOpacity
                                    });
                                }
                            });
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
                    else if (filters.fruits) filterType = 'fruits';
                    
                    const color = getBarangayColor(barangay, filterType, barangayColors);
                    const opacity = getFilterOpacity(filterType);
                    
                    return (
                        <Circle 
                            key={`${area.name}-${index}`}
                            center={barangay.center}
                            radius={barangay.radius}
                            pathOptions={{ 
                                color: color,
                                fillColor: color,
                                fillOpacity: opacity,
                                weight: 2,
                                dashArray: '5, 5',
                                className: 'highlighted-area'
                            }}
                        >
                            <Popup>
                                <div style={{ 
                                    color: '#333',
                                    padding: '8px',
                                    maxWidth: '300px'
                                }}>
                                    <h3 style={{ 
                                        margin: '0 0 12px 0',
                                        fontSize: '1.2em',
                                        color: '#2C3E50',
                                        borderBottom: '2px solid #eee',
                                        paddingBottom: '8px'
                                    }}>
                                        {area.name}
                                    </h3>
                                    
                                    <div style={{ 
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr',
                                        gap: '8px 12px',
                                        fontSize: '0.95em'
                                    }}>
                                        <strong>Soil Type:</strong>
                                        <span>{barangay.soilType}</span>
                                        
                                        <strong>Elevation:</strong>
                                        <span>{barangay.elevation}m ({getElevationCategory(barangay.elevation).label})</span>
                                        
                                        <strong>Temperature:</strong>
                                        <span>{barangay.temperature}°C ({getTemperatureCategory(barangay.temperature).label})</span>
                                        
                                        <strong>Pathways:</strong>
                                        <span>{barangay.pathways}</span>
                                        
                                        {filters.fruits && (
                                            <>
                                                <strong>Crop Viability:</strong>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {Object.entries(barangay.fruits).map(([fruit, viability]) => (
                                                        <div key={fruit} style={{ 
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}>
                                                            <div style={{
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: viabilityLevels[viability]?.color || '#666666',
                                                                borderRadius: '2px'
                                                            }} />
                                                            <span>{fruit}: {viability}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
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
                  <DirectionsIcon />
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
                      // Reset all states while maintaining controlled components
                      setFilters({
                        soilType: false,
                        fruits: false,
                        elevation: false,
                        temperature: false,
                        irrigation: false,
                        roads: false,
                        showAllBarangays: false,
                        selectedBarangay: '',
                        // Reset all crop selection states
                        selectedCrop_Calamansi: false,
                        selectedCrop_Corn: false,
                        selectedCrop_Eggplant: false,
                        selectedCrop_Rice: false,
                        selectedCrop_Onion: false
                      });
                      setBarangayInfo(null);
                      setHighlightedAreas([]);
                      setSelectedRoadCategory('');
                      setSelectedIrrigationCategory('');
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
                        id="soil-type"
                        checked={filters.soilType} 
                        onChange={() => handleFilterChange('soilType')}
                        inputProps={{ 'aria-label': 'Soil Type filter' }}
                      />
                      <Label htmlFor="soil-type">Soil Type</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        id="fruits"
                        checked={filters.fruits} 
                        onChange={() => handleFilterChange('fruits')}
                        inputProps={{ 'aria-label': 'Crops filter' }}
                      />
                      <Label htmlFor="fruits">Crops</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        id="elevation"
                        checked={filters.elevation} 
                        onChange={() => handleFilterChange('elevation')}
                        inputProps={{ 'aria-label': 'Elevation filter' }}
                      />
                      <Label htmlFor="elevation">Elevation</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        id="temperature"
                        checked={filters.temperature} 
                        onChange={() => handleFilterChange('temperature')}
                        inputProps={{ 'aria-label': 'Temperature filter' }}
                      />
                      <Label htmlFor="temperature">Temperature</Label>
                    </FilterItem>
                    
                    <FilterItem>
                      <Checkbox 
                        id="irrigation"
                        checked={filters.irrigation}
                        onChange={() => handleFilterChange('irrigation')}
                        inputProps={{ 'aria-label': 'Irrigation filter' }}
                      />
                      <Label htmlFor="irrigation">Irrigation</Label>
                    </FilterItem>

                    <FilterItem>
                      <Checkbox 
                        id="roads"
                        checked={filters.roads}
                        onChange={() => handleFilterChange('roads')}
                        inputProps={{ 'aria-label': 'Roads filter' }}
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
                                border: highlightedAreas.some(area => 
                                  barangays.find(b => b.name === area.name)?.temperature >= category.min && 
                                  barangays.find(b => b.name === area.name)?.temperature <= category.max
                                ) ? `2px solid ${category.color}` : '2px solid transparent'
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

                {/* Irrigation Filter Section */}
                {filters.irrigation && (
                    <FilterGroup>
                        <FilterTitle>Irrigation Categories</FilterTitle>
                        <div style={{ marginTop: '10px' }}>
                            {irrigationCategories.map(cat => (
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
                                        gap: '8px',
                                        transition: 'all 0.2s ease-in-out',
                                        border: selectedIrrigationCategory === cat ? 
                                            `2px solid ${irrigationCategoryMap[cat].color}` : 
                                            '2px solid transparent'
                                    }}
                                    onClick={() => setSelectedIrrigationCategory(cat)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input
                                            type="radio"
                                            name="irrigation-category"
                                            value={cat}
                                            checked={selectedIrrigationCategory === cat}
                                            onChange={(e) => setSelectedIrrigationCategory(e.target.value)}
                                            style={{ margin: 0 }}
                                        />
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: irrigationCategoryMap[cat].color,
                                            borderRadius: '4px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            border: `2px solid ${irrigationCategoryMap[cat].hoverColor}`
                                        }} />
                                        <span style={{ 
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            fontSize: '1.1em'
                                        }}>
                                            {irrigationCategoryMap[cat].label}
                                        </span>
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.9em', 
                                        color: '#bdc3c7',
                                        marginLeft: '34px',
                                        lineHeight: '1.4'
                                    }}>
                                        {irrigationCategoryMap[cat].description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {filters.fruits && (
                    <FilterGroup>
                        <FilterTitle>Crop Types</FilterTitle>
                        <div style={{ marginTop: '10px' }}>
                            {Object.keys(fruitColors).map((fruit) => {
                                // Calculate viability counts for this fruit
                                const viabilityCounts = {
                                    High: 0,
                                    Moderate: 0,
                                    Low: 0,
                                    Restricted: 0
                                };
                                
                                barangays.forEach(barangay => {
                                    const viability = barangay.fruits?.[fruit];
                                    if (viability && typeof viability === 'string' && 
                                        Object.keys(viabilityLevels).includes(viability)) {
                                        viabilityCounts[viability]++;
                                    }
                                });

                                // Only show fruits that have at least one barangay with valid viability data
                                const hasValidData = Object.values(viabilityCounts).some(count => count > 0);
                                if (!hasValidData) return null;

                                return (
                                    <div
                                        key={fruit}
                                        style={{
                                            padding: '12px',
                                            marginBottom: '10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            border: filters[`selectedCrop_${fruit}`] ? 
                                                `2px solid ${fruitColors[fruit]}` : 
                                                '2px solid transparent'
                                        }}
                                        onClick={() => handleLegendClick('fruits', fruit)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    backgroundColor: fruitColors[fruit],
                                                    marginRight: '12px',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            />
                                            <span style={{ 
                                                fontWeight: 'bold',
                                                fontSize: '1.1em',
                                                color: '#fff'
                                            }}>{fruit}</span>
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.9em', 
                                            color: '#bdc3c7',
                                            marginLeft: '36px',
                                            lineHeight: '1.4'
                                        }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                {Object.entries(viabilityCounts).map(([level, count]) => (
                                                    count > 0 && (
                                                        <div key={level} style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center',
                                                            marginBottom: '4px'
                                                        }}>
                                                            <div style={{
                                                                width: '12px',
                                                                height: '12px',
                                                                backgroundColor: viabilityLevels[level].color,
                                                                marginRight: '8px',
                                                                borderRadius: '2px'
                                                            }} />
                                                            <span style={{ color: '#fff' }}>
                                                                {level}: {count} areas
                                                            </span>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                            <div style={{ 
                                                fontSize: '0.85em',
                                                color: '#95a5a6',
                                                fontStyle: 'italic'
                                            }}>
                                                Click to view suitable areas
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
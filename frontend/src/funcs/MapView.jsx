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
    fruitChipStyle,
	PopupContent,
	PopupHeader,
	PopupTitle,
	PopupBody,
	PopupInfoRow,
	PopupLabel,
	PopupValue,
	PopupDivider,
	SmartFarmingBox,
	SmartFarmingTitle,
	SmartFarmingSummary,
	SmartFarmingBadge,
	ClearButton
  } from './MapViewStyles';
  
// Import MUI components
import Checkbox from '@mui/material/Checkbox';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SortIcon from '@mui/icons-material/Sort';

// Import map components
import { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup, 
    Circle, 
    LayerGroup,
    ScaleControl,
    useMapEvents
} from 'react-leaflet';
import { getBarangaysArray, getBarangaysObject } from './loadBarangays';

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
    'Loamy Soil': '#8BC34A',
    'Sandy Soil': '#FF5722',
    'Clay Soil': '#795548',
    'Silty Soil': '#9E9E9E',
    'Peaty Soil': '#4CAF50',
    'Chalky Soil': '#FFC107'
};

const cropColors = {
	'Rice': '#8BC34A',
	'Corn': '#FFEB3B',
	'Vegetables': '#4CAF50',
	'Sugarcane': '#CDDC39',
	'None': '#9E9E9E'
};
  
const irrigationColors = {
	'Good': '#4CAF50',
	'Average': '#FFC107',
	'Poor': '#F44336',
	'Unknown': '#9E9E9E'
};

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

const MapView = () => {
    const [selectedLocation, setSelectedLocation] = useState({
        lat: CabanatuanLatLng.lat,
        lng: CabanatuanLatLng.lng,
        name: "Cabanatuan, Nueva Ecija" 
    });

    const [filters, setFilters] = useState({
        soilType: false,
        fruits: false,
        elevation: false,
		crops: false,
		irrigation: false,
        temperature: false,
        pathways: false,
        showAllBarangays: false,
        selectedBarangay: ''
    });

    const [highlightedAreas, setHighlightedAreas] = useState([]);
    const [barangayInfo, setBarangayInfo] = useState(null);
    const [mapType, setMapType] = useState('standard'); // 'standard', 'terrain', 'satellite'
    const [barangays, setBarangays] = useState([]);
    const [barangayData, setBarangayData] = useState({});
    const [barangayWeather, setBarangayWeather] = useState({});
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);

    // Add state for custom temperature range
    const [tempRange, setTempRange] = useState([20, 35]);
    // Add state for filtered barangays
    const [filteredBarangays, setFilteredBarangays] = useState([]);

    // Sidebar enhancements
    const [sortField, setSortField] = useState('temperature');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSidebarBarangay, setSelectedSidebarBarangay] = useState(null);

    useEffect(() => {
        setBarangays(getBarangaysArray());
        setBarangayData(getBarangaysObject());
    }, []);

    useEffect(() => {
        async function fetchAllWeather() {
            setWeatherLoading(true);
            setWeatherError(null);
            try {
                const arr = getBarangaysArray();
                const weatherObj = {};
                await Promise.all(arr.map(async (b) => {
                    try {
                        const temp = await fetchBarangayWeather(b.center[0], b.center[1]);
                        weatherObj[b.name] = temp;
                    } catch (err) {
                        weatherObj[b.name] = null;
                    }
                }));
                setBarangayWeather(weatherObj);
            } catch (error) {
                setWeatherError("Failed to fetch weather data");
            } finally {
                setWeatherLoading(false);
            }
        }
        fetchAllWeather();
    }, []);

    useEffect(() => {
        if (!filters.temperature) {
            setFilteredBarangays([]);
            return;
        }
        let matches = barangays.filter(b => {
            const temp = barangayWeather[b.name] ?? b.temperature;
            const nameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
            return temp >= tempRange[0] && temp <= tempRange[1] && nameMatch;
        });
        // Sort matches
        matches = matches.sort((a, b) => {
            let aVal, bVal;
            if (sortField === 'temperature') {
                aVal = barangayWeather[a.name] ?? a.temperature;
                bVal = barangayWeather[b.name] ?? b.temperature;
            } else if (sortField === 'elevation') {
                aVal = a.elevation;
                bVal = b.elevation;
            } else if (sortField === 'fruit') {
                aVal = a.fruits;
                bVal = b.fruits;
            } else {
                aVal = a.name;
                bVal = b.name;
            }
            if (typeof aVal === 'string') return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });
        setFilteredBarangays(matches);
    }, [filters.temperature, tempRange, barangayWeather, barangays, sortField, sortOrder, searchTerm]);

    const handleFilterChange = (filter) => {
        setFilters({ ...filters, [filter]: !filters[filter] });
    };

    const handleMapTypeChange = (e) => {
        setMapType(e.target.value);
    };

    const handleBarangaySelect = (e) => {
        const selectedBarangay = e?.target?.value || '';
        setFilters((prevState) => ({
            ...prevState,
            selectedBarangay: selectedBarangay
        }));

        if (selectedBarangay) {
            // Center the map on the selected barangay
            const center = barangayData[selectedBarangay].center;
            
            setSelectedLocation({
                lat: center[0],
                lng: center[1],
                name: selectedBarangay
            });

            // Generate barangay information
            const barangay = barangayData[selectedBarangay];
            const suitableFruits = soilFruitSuitability[barangay.soilType] || [];
            
            // Generate recommendations based on soil, elevation, and temperature
            const recommendations = generateRecommendations(selectedBarangay);
            
            setBarangayInfo({
                name: selectedBarangay,
                soilType: barangay.soilType,
                currentFruit: barangay.fruits,
                suitableFruits: suitableFruits,
                elevation: barangay.elevation,
                temperature: barangay.temperature,
                pathways: barangay.pathways,
                notes: barangay.notes,
                recommendations: recommendations
            });

            // Highlight the selected barangay
            setHighlightedAreas([{
                name: selectedBarangay,
                color: soilTypeColors[barangay.soilType],
                opacity: 0.5
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

	const handleClearAllFilters = () => {
		setFilters({
			soilType: false,
			fruits: false,
			crops: false,
			irrigation: false,
			elevation: false,
			temperature: false,
			pathways: false,
			showAllBarangays: false,
			selectedBarangay: ''
		});
		setHighlightedAreas([]);
		setTempRange([20, 38]);
		setSearchTerm('');
	};

    const handleLegendClick = (legendType, legendItem) => {
        // If a specific barangay is selected, highlight it
        if (filters.selectedBarangay) {
            setHighlightedAreas([{
                name: filters.selectedBarangay,
                color: legendType === 'soilType' ? 
                    soilTypeColors[barangayData[filters.selectedBarangay].soilType] : 
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
            } else if (legendType === 'pathways' && data.pathways === legendItem) {
                matches = true;
                color = pathwayStatusInfo[data.pathways].color;
            } else if (legendType === 'elevation') {
                // Handling elevation ranges: low, medium, high
                const elevRange = legendItem === 'Low (0-200m)' ? data.elevation <= 200 :
                                 legendItem === 'Medium (201-400m)' ? data.elevation > 200 && data.elevation <= 400 :
                                 data.elevation > 400;
                if (elevRange) {
                    matches = true;
                    color = legendItem === 'Low (0-200m)' ? '#2196F3' :
                            legendItem === 'Medium (201-400m)' ? '#673AB7' : '#E91E63';
                }
            } else if (legendType === 'temperature') {
                if (filters.temperature) {
                    const matchingBarangays = barangays.filter(name => {
                        const temp = barangayWeather[name] ?? barangayData[name].temperature;
                        return temp >= tempRange[0] && temp <= tempRange[1];
                    });
                    setHighlightedAreas(matchingBarangays.map(name => ({
                        name,
                        color: '#4CAF50',
                        opacity: 0.6
                    })));
                    return;
                }
                // Handling temperature ranges
                const temp = barangayWeather[name] ?? data.temperature;
                const tempRange = legendItem === 'Cool (< 26°C)' ? temp < 26 :
                                legendItem === 'Moderate (26-28°C)' ? temp >= 26 && temp <= 28 :
                                temp > 28;
                if (tempRange) {
                    matches = true;
                    color = legendItem === 'Cool (< 26°C)' ? '#2196F3' :
                           legendItem === 'Moderate (26-28°C)' ? '#4CAF50' : '#FF5722';
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
        if (filters.showAllBarangays) {
            const allBarangays = barangays.map(barangay => ({
                name: barangay.name,
                color: soilTypeColors[barangay.soilType],
                opacity: 0.4
            }));
            setHighlightedAreas(allBarangays);
            return;
        } else if (!filters.selectedBarangay && 
                  !filters.soilType && 
                  !filters.fruits &&
				  !filters.crops &&
				  !filters.irrigation &&
                  !filters.elevation && 
                  !filters.temperature && 
                  !filters.pathways) {
            // Clear highlighted areas if no filters are active
            setHighlightedAreas([]);
        }
    }, [filters.showAllBarangays]);

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
					
					{/* Add Scale Control */}
					<ScaleControl position="bottomright" imperial={false} />
		
					{/* Render highlighted area circles */}
					<LayerGroup>
					{/* Show All Barangays Functionality */}
					{filters.showAllBarangays && barangays
						.sort((a, b) => b.radius - a.radius) // Sort by size so smaller circles render on top
						.map((barangay, index) => {
						if (!barangay || !barangay.center || !barangay.radius) return null;
						return (
						<Circle
							key={`all-${barangay.name}-${index}`}
							center={barangay.center}
							radius={barangay.radius}
							pathOptions={{
							color: soilTypeColors[barangay.soilType],
							fillOpacity: 0.2,
							weight: 2
							}}
						>
							<Popup maxWidth={300} minWidth={250}>
							<PopupContent>
								<PopupHeader style={{ backgroundColor: soilTypeColors[barangay.soilType] }}>
								<PopupTitle>{barangay.name}</PopupTitle>
								</PopupHeader>
								<PopupBody>
								<PopupInfoRow>
									<PopupLabel>Soil Type:</PopupLabel>
									<PopupValue>{barangay.soilType}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Main Fruit:</PopupLabel>
									<PopupValue>{barangay.fruits}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Elevation:</PopupLabel>
									<PopupValue>{barangay.elevation}m</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Avg. Temp:</PopupLabel>
									<PopupValue>{barangay.temperature}°C</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Pathways:</PopupLabel>
									<PopupValue>{barangay.pathways}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Irrigation:</PopupLabel>
									<PopupValue>{barangay.irrigation || 'Unknown'}</PopupValue>
								</PopupInfoRow>
								<PopupDivider />
								<SmartFarmingBox>
									<SmartFarmingTitle>Smart Farming Analysis</SmartFarmingTitle>
									<SmartFarmingSummary>
									This area is optimal for {barangay.fruits} cultivation due to its {barangay.soilType} soil. 
									{barangay.irrigation === 'Good' ? ' Good irrigation supports year-round farming.' : 
									barangay.irrigation === 'Average' ? ' Consider supplemental irrigation during dry months.' : 
									' Irrigation improvements recommended for optimal yields.'}
									</SmartFarmingSummary>
									<SmartFarmingBadge>Recommendation</SmartFarmingBadge>
								</SmartFarmingBox>
								</PopupBody>
							</PopupContent>
							</Popup>
						</Circle>
						);
					})}
		
					{/* Highlighted/Selected Barangays */}
					{highlightedAreas
						.sort((a, b) => {
						const aBarangay = barangayData[a.name];
						const bBarangay = barangayData[b.name];
						return (bBarangay?.radius || 0) - (aBarangay?.radius || 0);
						})
						.map((area, index) => {
						const barangay = barangayData[area.name];
						if (!barangay || !barangay.center || !barangay.radius) return null;
						return (
						<Circle 
							key={`${area.name}-${index}`}
							center={barangay.center}
							radius={barangay.radius}
							pathOptions={{ 
							color: area.color, 
							fillOpacity: area.opacity || 0.5, 
							weight: 2 
							}}
						>
							<Popup maxWidth={300} minWidth={250}>
							<PopupContent>
								<PopupHeader style={{ backgroundColor: area.color }}>
								<PopupTitle>{area.name}</PopupTitle>
								</PopupHeader>
								<PopupBody>
								<PopupInfoRow>
									<PopupLabel>Soil Type:</PopupLabel>
									<PopupValue>{barangay.soilType}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Main Fruit:</PopupLabel>
									<PopupValue>{barangay.fruits}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Elevation:</PopupLabel>
									<PopupValue>{barangay.elevation}m</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Avg. Temp:</PopupLabel>
									<PopupValue>{barangay.temperature}°C</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Pathways:</PopupLabel>
									<PopupValue>{barangay.pathways}</PopupValue>
								</PopupInfoRow>
								<PopupInfoRow>
									<PopupLabel>Irrigation:</PopupLabel>
									<PopupValue>{barangay.irrigation || 'Unknown'}</PopupValue>
								</PopupInfoRow>
								<PopupDivider />
								<SmartFarmingBox>
									<SmartFarmingTitle>Smart Farming Analysis</SmartFarmingTitle>
									<SmartFarmingSummary>
									This area is optimal for {barangay.fruits} cultivation due to its {barangay.soilType} soil. 
									{barangay.irrigation === 'Good' ? ' Good irrigation supports year-round farming.' : 
									barangay.irrigation === 'Average' ? ' Consider supplemental irrigation during dry months.' : 
									' Irrigation improvements recommended for optimal yields.'}
									</SmartFarmingSummary>
									<SmartFarmingBadge>AI Recommendation</SmartFarmingBadge>
								</SmartFarmingBox>
								</PopupBody>
							</PopupContent>
							</Popup>
						</Circle>
						);
					})}
					</LayerGroup>
					
					<Marker position={[selectedLocation.lat, selectedLocation.lng]}>
					<Popup>{selectedLocation.name}</Popup>
					</Marker>
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
					{/* Clear All Filters Button */}
					<FilterTitleRow>
					<FilterTitle>Filters</FilterTitle>
					<ClearButton onClick={handleClearAllFilters}>
						Clear All <ClearIcon sx={{ fontSize: 16, marginLeft: 0.5 }} />
					</ClearButton>
					</FilterTitleRow>
					
					{/* Map Type Selection */}
					<FilterGroup>
					<FilterTitle>Map Type:</FilterTitle>
					<Select value={mapType} onChange={handleMapTypeChange}>
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
							onChange={() => handleFilterChange('fruits')} 
						/>
						<Label htmlFor="fruits">Fruits</Label>
						</FilterItem>
						
						<FilterItem>
						<Checkbox 
							type="checkbox" 
							id="crops"
							checked={filters.crops} 
							onChange={() => handleFilterChange('crops')} 
						/>
						<Label htmlFor="crops">Crops</Label>
						</FilterItem>
						
						<FilterItem>
						<Checkbox 
							type="checkbox" 
							id="irrigation"
							checked={filters.irrigation} 
							onChange={() => handleFilterChange('irrigation')} 
						/>
						<Label htmlFor="irrigation">Irrigation</Label>
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
							id="pathways"
							checked={filters.pathways} 
							onChange={() => handleFilterChange('pathways')} 
						/>
						<Label htmlFor="pathways">Pathway Accessibility</Label>
						</FilterItem>
					</FilterGrid>
					</FilterGroup>
		
					{/* Display appropriate legend based on active filters */}
					{(filters.soilType || filters.fruits || filters.crops || filters.irrigation || filters.elevation || filters.temperature || filters.pathways) && (
					<Legend>
						<FilterTitle>Legend:</FilterTitle>
						<LegendContainer>
						{filters.soilType && (
							<>
							{Object.keys(soilTypeColors).map((soilType) => (
								<LegendItem 
								key={soilType} 
								onClick={() => handleLegendClick('soilType', soilType)} 
								style={{ backgroundColor: soilTypeColors[soilType] }}
								>
								{soilType}
								</LegendItem>
							))}
							</>
						)}
						
						{filters.fruits && (
							<>
							{Object.keys(fruitColors).map((fruit) => (
								<LegendItem 
								key={fruit} 
								onClick={() => handleLegendClick('fruits', fruit)} 
								style={{ backgroundColor: fruitColors[fruit] }}
								>
								{fruit}
								</LegendItem>
							))}
							</>
						)}
						
						{filters.crops && (
							<>
							{Object.keys(cropColors).map((crop) => (
								<LegendItem 
								key={crop} 
								onClick={() => handleLegendClick('crops', crop)} 
								style={{ backgroundColor: cropColors[crop] }}
								>
								{crop}
								</LegendItem>
							))}
							</>
						)}
						
						{filters.irrigation && (
							<>
							{Object.keys(irrigationColors).map((status) => (
								<LegendItem 
								key={status} 
								onClick={() => handleLegendClick('irrigation', status)} 
								style={{ backgroundColor: irrigationColors[status] }}
								>
								{status}
								</LegendItem>
							))}
							</>
						)}
						
						{filters.elevation && (
							<>
							<LegendItem 
								onClick={() => handleLegendClick('elevation', 'Low (0-200m)')} 
								style={{ backgroundColor: '#2196F3' }}
							>
								Low (0-200m)
							</LegendItem>
							<LegendItem 
								onClick={() => handleLegendClick('elevation', 'Medium (201-400m)')} 
								style={{ backgroundColor: '#673AB7' }}
							>
								Medium (201-400m)
							</LegendItem>
							<LegendItem 
								onClick={() => handleLegendClick('elevation', 'High (>400m)')} 
								style={{ backgroundColor: '#E91E63' }}
							>
								High (&gt;400m)
							</LegendItem>
							</>
						)}
						
						{filters.temperature && (
							<>
							<LegendItem 
								onClick={() => handleLegendClick('temperature', 'Cool (< 26°C)')} 
								style={{ backgroundColor: '#2196F3' }}
							>
								Cool (&lt; 26°C)
							</LegendItem>
							<LegendItem 
								onClick={() => handleLegendClick('temperature', 'Moderate (26-28°C)')} 
								style={{ backgroundColor: '#4CAF50' }}
							>
								Moderate (26-28°C)
							</LegendItem>
							<LegendItem 
								onClick={() => handleLegendClick('temperature', 'Warm (>28°C)')} 
								style={{ backgroundColor: '#FF5722' }}
							>
								Warm (&gt;28°C)
							</LegendItem>
							</>
						)}
						
						{filters.pathways && (
							<>
							{Object.keys(pathwayStatusInfo).map((status) => (
								<LegendItem 
								key={status} 
								onClick={() => handleLegendClick('pathways', status)} 
								style={{ backgroundColor: pathwayStatusInfo[status].color }}
								>
								{status} - {pathwayStatusInfo[status].description}
								</LegendItem>
							))}
							</>
						)}
						</LegendContainer>
					</Legend>
					)}
		
					{/* Temperature Range Slider */}
					{filters.temperature && (
					<TemperatureRangeCard>
						<FilterTitleRow>
						<span>Custom Temperature Range (°C):</span>
						<Tooltip title="Filter barangays by current (live) temperature.">
							<InfoOutlinedIcon sx={{ color: '#90caf9', fontSize: 20 }} />
						</Tooltip>
						</FilterTitleRow>
						<Slider
						value={tempRange}
						onChange={(e, newVal) => setTempRange(newVal)}
						valueLabelDisplay="auto"
						min={20}
						max={38}
						step={1}
						sx={{ color: '#4CAF50', width: '100%', marginTop: 2, marginBottom: 1 }}
						/>
						<RangeDisplay>
						{tempRange[0]}°C - {tempRange[1]}°C
						</RangeDisplay>
						
						<SearchSortRow>
						<TextField
							size="small"
							variant="outlined"
							placeholder="Search barangay..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							sx={{ 
							background: '#37474F', 
							borderRadius: 1, 
							input: { color: '#fff' }, 
							flex: 1 
							}}
							InputProps={{
							style: { color: '#fff' },
							}}
						/>
						<MuiSelect
							size="small"
							value={sortField}
							onChange={e => setSortField(e.target.value)}
							sx={{ background: '#37474F', color: '#fff', height: 40, minWidth: 120 }}
						>
							<MenuItem value="temperature">Temperature</MenuItem>
							<MenuItem value="elevation">Elevation</MenuItem>
							<MenuItem value="fruit">Fruit</MenuItem>
							<MenuItem value="name">Name</MenuItem>
						</MuiSelect>
						<IconButton onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} sx={{ color: '#fff' }}>
							<SortIcon style={{ transform: sortOrder === 'desc' ? 'scaleY(-1)' : undefined }} />
						</IconButton>
						</SearchSortRow>
						
						{weatherLoading ? (
						<LoadingContainer>
							<CircularProgress size={24} sx={{ color: '#4CAF50' }} />
						</LoadingContainer>
						) : (
						<ScrollableList>
							{filteredBarangays.length === 0 ? (
							<EmptyListItem>
								No barangays in this temperature range.
							</EmptyListItem>
							) : (
							filteredBarangays.map(b => (
								<BarangayListItem
								key={b.name}
								selected={selectedSidebarBarangay && selectedSidebarBarangay.name === b.name}
								onClick={() => setSelectedSidebarBarangay(b)}
								>
								<BarangayName>{b.name}</BarangayName>
								<BarangayDetails>
									Temp: {(barangayWeather[b.name] ?? b.temperature).toFixed(1)}°C | 
									Elev: {b.elevation}m | 
									Fruit: {b.fruits}
								</BarangayDetails>
								</BarangayListItem>
							))
							)}
						</ScrollableList>
						)}
						
						{/* Detailed info card for selected barangay */}
						{selectedSidebarBarangay && (
						<SelectedBarangayCard>
							<BarangayCardHeader>
							{selectedSidebarBarangay.name}
							<ActionButtons>
								<Tooltip title="Show on map">
								<IconButton size="small" sx={{ color: '#4CAF50' }} onClick={() => setFilters(prev => ({ ...prev, selectedBarangay: selectedSidebarBarangay.name }))}>
									<InfoOutlinedIcon />
								</IconButton>
								</Tooltip>
								<Tooltip title="Close">
								<IconButton size="small" sx={{ color: '#e57373' }} onClick={() => setSelectedSidebarBarangay(null)}>
									×
								</IconButton>
								</Tooltip>
							</ActionButtons>
							</BarangayCardHeader>
							<BarangayInfoGrid>
							<BarangayInfoItem>Temperature: {(barangayWeather[selectedSidebarBarangay.name] ?? selectedSidebarBarangay.temperature).toFixed(1)}°C</BarangayInfoItem>
							<BarangayInfoItem>Elevation: {selectedSidebarBarangay.elevation} m</BarangayInfoItem>
							<BarangayInfoItem>Soil Type: {selectedSidebarBarangay.soilType}</BarangayInfoItem>
							<BarangayInfoItem>Main Fruit: {selectedSidebarBarangay.fruits}</BarangayInfoItem>
							<BarangayInfoItem>Pathways: {selectedSidebarBarangay.pathways}</BarangayInfoItem>
							<BarangayInfoItem>Irrigation: {selectedSidebarBarangay.irrigation || 'Unknown'}</BarangayInfoItem>
							</BarangayInfoGrid>
							<BarangayNotes>{selectedSidebarBarangay.notes}</BarangayNotes>
						</SelectedBarangayCard>
						)}
					</TemperatureRangeCard>
					)}
		
					<Divider />
					
					{/* Other Options Section */}
					<FilterGroup>
					<FilterTitle>Other Options:</FilterTitle>
					<FilterItem>
						<Checkbox 
						type="checkbox" 
						id="all-barangays"
						checked={filters.showAllBarangays} 
						onChange={() => handleFilterChange('showAllBarangays')} 
						/>
						<Label htmlFor="all-barangays">Show All Barangays</Label>
					</FilterItem>
					
					<Select 
						value={filters.selectedBarangay} 
						onChange={handleBarangaySelect}
					>
						<option value="">Select a barangay</option>
						{barangays.map(barangay => (
						<option key={barangay.name} value={barangay.name}>
							{barangay.name}
						</option>
						))}
					</Select>
					</FilterGroup>
		
					{/* Barangay Information Display */}
					{barangayInfo && (
					<div style={barangayInfoBoxStyle}>
						<h3 style={{ marginTop: 0, marginBottom: '15px', color: '#ecf0f1' }}>
						{barangayInfo.name} Barangay Information
						</h3>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Soil Type:</span>
						<span style={{
							...infoValueStyle,
							backgroundColor: soilTypeColors[barangayInfo.soilType],
							padding: '3px 8px',
							borderRadius: '4px',
							display: 'inline-block',
							width: 'fit-content',
							color: '#000'
						}}>
							{barangayInfo.soilType}
						</span>
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Currently Growing:</span>
						<span style={{
							...infoValueStyle,
							backgroundColor: fruitColors[barangayInfo.currentFruit],
							padding: '3px 8px',
							borderRadius: '4px',
							display: 'inline-block',
							width: 'fit-content',
							color: '#000'
						}}>
							{barangayInfo.currentFruit}
						</span>
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Elevation:</span>
						<span style={infoValueStyle}>
							{barangayInfo.elevation} meters
						</span>
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Average Temperature:</span>
						<span style={infoValueStyle}>
							{weatherLoading ? 'Loading...' : (barangayWeather[barangayInfo.name] ?? barangayInfo.temperature) + '°C'}
						</span>
						{weatherError && (
							<span style={{ color: 'red' }}>
							Error: {weatherError}
							</span>
						)}
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Irrigation Status:</span>
						<span style={{
							...infoValueStyle,
							backgroundColor: irrigationColors[barangayInfo.irrigation || 'Unknown'],
							padding: '3px 8px',
							borderRadius: '4px',
							display: 'inline-block',
							width: 'fit-content',
							color: '#000'
						}}>
							{barangayInfo.irrigation || 'Unknown'}
						</span>
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Pathway Accessibility:</span>
						<span style={{
							...infoValueStyle,
							backgroundColor: pathwayStatusInfo[barangayInfo.pathways].color,
							padding: '3px 8px',
							borderRadius: '4px',
							display: 'inline-block',
							width: 'fit-content',
							color: '#000'
						}}>
							{barangayInfo.pathways}
						</span>
						<span style={{...infoValueStyle, fontSize: '0.85rem', marginTop: '4px'}}>
							{pathwayStatusInfo[barangayInfo.pathways].description}
						</span>
						</div>
						
						<div style={infoRowStyle}>
						<span style={infoLabelStyle}>Suitable Fruits for this Soil:</span>
						<div>
							{barangayInfo.suitableFruits.map(fruit => (
							<span key={fruit} style={fruitChipStyle}>
								{fruit}
							</span>
							))}
						</div>
						</div>
						
						<div style={{...infoRowStyle, marginTop: '10px'}}>
						<span style={infoLabelStyle}>Area Notes:</span>
						<span style={infoValueStyle}>
							{barangayInfo.notes}
						</span>
						</div>
						
						{/* Advanced Recommendation System */}
						<div style={recommendationBoxStyle}>
						<h4 style={{margin: '0 0 10px 0', color: '#ecf0f1'}}>
							Smart Farming Recommendations
						</h4>
						<div style={{marginBottom: '10px'}}>
							<strong style={{color: '#3498db'}}>Optimal Crops:</strong>
							<div style={{marginTop: '5px'}}>
							{barangayInfo.recommendations.bestFruits.length > 0 ? 
								barangayInfo.recommendations.bestFruits.map(fruit => (
								<span key={fruit} style={{
									...fruitChipStyle,
									backgroundColor: fruit === barangayInfo.currentFruit ? 
									'#27ae60' : '#2C3E50'
								}}>
									{fruit} {fruit === barangayInfo.currentFruit && '✓'}
								</span>
								)) :
								<span style={infoValueStyle}>
								No optimal crops identified. Consider soil amendments.
								</span>
							}
							</div>
						</div>
						
						<div style={{marginBottom: '10px'}}>
							<strong style={{color: '#3498db'}}>Analysis:</strong>
							<ul style={{margin: '5px 0', paddingLeft: '20px'}}>
							{barangayInfo.recommendations.notes.map((note, index) => (
								<li key={index} style={{...infoValueStyle, marginBottom: '5px'}}>
								{note}
								</li>
							))}
							</ul>
						</div>
						
						<div style={{
							padding: '10px', 
							backgroundColor: '#1A2530', 
							borderRadius: '4px',
							marginTop: '10px'
						}}>
							<strong style={{color: '#e74c3c'}}>Overall Recommendation:</strong>
							<p style={{...infoValueStyle, margin: '5px 0 0 0'}}>
							{barangayInfo.recommendations.overall}
							</p>
						</div>
						</div>
					</div>
					)}
				</FilterScrollContainer>
				</FilterSection>
			</Container>
        </>
    );
};

export default MapView;
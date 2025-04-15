import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, LayerGroup, ScaleControl } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Container, MapSection, FilterSection, Label, Checkbox, Select, LocationOverlay, LocationName, DirectionsLink, ViewLargerMapLink, Divider, FilterItem, FilterGroup, FilterTitle, GlobalStyles, Legend, LegendItem, barangayInfoBoxStyle, infoLabelStyle, infoValueStyle, infoRowStyle, recommendationBoxStyle, fruitChipStyle } from './MapViewStyles';

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

// Define barangays in Cabanatuan with circle coordinates and additional data
const barangayData = {
    'Aduas': {
        center: [15.492, 120.962],
        radius: 500,
        soilType: 'Loamy Soil',
        fruits: 'Mangoes',
        elevation: 320,
        temperature: 27,
        pathways: 'Good',
        notes: 'Well-drained soil suitable for mango cultivation'
    },
    'Bantug': {
        center: [15.475, 120.958],
        radius: 450,
        soilType: 'Sandy Soil',
        fruits: 'Kalamansi',
        elevation: 250,
        temperature: 26,
        pathways: 'Fair',
        notes: 'Sandy soil with adequate drainage'
    },
    'Caridad': {
        center: [15.483, 120.975],
        radius: 480,
        soilType: 'Clay Soil',
        fruits: 'Watermelon',
        elevation: 180,
        temperature: 29,
        pathways: 'Poor',
        notes: 'Heavy clay soil that retains moisture well'
    },
    'Dalampang': {
        center: [15.498, 120.952],
        radius: 520,
        soilType: 'Silty Soil',
        fruits: 'Mangoes',
        elevation: 410,
        temperature: 25,
        pathways: 'Good',
        notes: 'Silty soil with good nutrient content'
    },
    'Hermogenes C. Concepcion Sr.': {
        center: [15.466, 120.975],
        radius: 470,
        soilType: 'Peaty Soil',
        fruits: 'Kalamansi',
        elevation: 290,
        temperature: 28,
        pathways: 'Fair',
        notes: 'Rich in organic matter, good for citrus trees'
    },
    'Imelda': {
        center: [15.488, 120.948],
        radius: 460,
        soilType: 'Chalky Soil',
        fruits: 'Watermelon',
        elevation: 150,
        temperature: 30,
        pathways: 'Good',
        notes: 'Alkaline soil with good drainage'
    },
    'Kapitan Pepe': {
        center: [15.480, 120.980],
        radius: 500,
        soilType: 'Loamy Soil',
        fruits: 'Mangoes',
        elevation: 380,
        temperature: 26,
        pathways: 'Good',
        notes: 'Balanced soil composition ideal for fruit trees'
    },
    'MS Garcia': {
        center: [15.474, 120.988],
        radius: 430,
        soilType: 'Sandy Soil',
        fruits: 'Kalamansi',
        elevation: 220,
        temperature: 27,
        pathways: 'Fair',
        notes: 'Light soil with good water infiltration'
    },
    'Palagay': {
        center: [15.456, 120.968],
        radius: 490,
        soilType: 'Clay Soil',
        fruits: 'Watermelon',
        elevation: 170,
        temperature: 31,
        pathways: 'Poor',
        notes: 'Rich in minerals but prone to waterlogging during rainy season'
    },
    'Sangitan': {
        center: [15.493, 120.982],
        radius: 510,
        soilType: 'Silty Soil',
        fruits: 'Mangoes',
        elevation: 450,
        temperature: 24,
        pathways: 'Good',
        notes: 'Good moisture retention properties'
    },
    'San Isidro': {
        center: [15.478, 120.940],
        radius: 440,
        soilType: 'Peaty Soil',
        fruits: 'Kalamansi',
        elevation: 330,
        temperature: 25,
        pathways: 'Fair',
        notes: 'Rich in organic material, good for citrus'
    },
    'San Jose': {
        center: [15.487, 120.955],
        radius: 470,
        soilType: 'Chalky Soil',
        fruits: 'Watermelon',
        elevation: 140,
        temperature: 32,
        pathways: 'Fair',
        notes: 'Calcium-rich soil good for pH-loving crops'
    },
    'San Roque': {
        center: [15.472, 120.950],
        radius: 480,
        soilType: 'Loamy Soil',
        fruits: 'Mangoes',
        elevation: 360,
        temperature: 26,
        pathways: 'Good',
        notes: 'Balanced soil with good air and water flow'
    },
    'Santo Cristo': {
        center: [15.460, 120.940],
        radius: 460,
        soilType: 'Sandy Soil',
        fruits: 'Kalamansi',
        elevation: 280,
        temperature: 27,
        pathways: 'Fair',
        notes: 'Well-drained soil suitable for citrus trees'
    },
    'Santo Domingo': {
        center: [15.490, 120.930],
        radius: 490,
        soilType: 'Clay Soil',
        fruits: 'Watermelon',
        elevation: 160,
        temperature: 30,
        pathways: 'Poor',
        notes: 'Retains water well during dry season'
    }
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
        temperature: false,
        pathways: false,
        showAllBarangays: false,
        selectedBarangay: ''
    });

    const [highlightedAreas, setHighlightedAreas] = useState([]);
    const [barangayInfo, setBarangayInfo] = useState(null);
    const [mapType, setMapType] = useState('standard'); // 'standard', 'terrain', 'satellite'

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

        // Check soil suitability
        const suitableFruits = soilFruitSuitability[barangay.soilType] || [];
        
        // Filter fruits by temperature and elevation suitability
        const optimalFruits = suitableFruits.filter(fruit => {
            const tempSuitable = barangay.temperature >= fruitTemperatureRanges[fruit].min && 
                                barangay.temperature <= fruitTemperatureRanges[fruit].max;
            
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
        recommendations.notes.push(`Average temperature (${barangay.temperature}°C) is ${
            barangay.temperature < 25 ? 'relatively cool' : barangay.temperature > 29 ? 'warm' : 'moderate'
        } for this region.`);
        
        // Generate overall recommendation
        if (optimalFruits.length > 0) {
            recommendations.overall = `This area is ${optimalFruits.includes(barangay.fruits) ? 'already growing an optimal crop' : 'best suited for growing ' + optimalFruits.join(' or ')}. ${barangay.pathways !== 'Poor' ? 'Good accessibility supports commercial operations.' : 'Consider infrastructure improvements to enhance accessibility.'}`;
        } else {
            recommendations.overall = "Based on soil, elevation, and temperature data, we recommend evaluating alternative crops or soil amendments to improve growing conditions.";
        }
        
        return recommendations;
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
        for (const [name, data] of Object.entries(barangayData)) {
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
                // Handling temperature ranges
                const tempRange = legendItem === 'Cool (< 26°C)' ? data.temperature < 26 :
                                legendItem === 'Moderate (26-28°C)' ? data.temperature >= 26 && data.temperature <= 28 :
                                data.temperature > 28;
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
        }
        setHighlightedAreas(matchingBarangays);
    };

    // Show all barangays when that option is selected
    useEffect(() => {
        if (filters.showAllBarangays) {
            const allBarangays = Object.keys(barangayData).map(name => ({
                name,
                color: '#3388ff', // Default blue color for all barangays
                opacity: 0.4
            }));
            setHighlightedAreas(allBarangays);
        } else if (!filters.selectedBarangay && 
                  !filters.soilType && 
                  !filters.fruits && 
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
                for (const [name, data] of Object.entries(barangayData)) {
                    const distance = calculateDistance(
                        e.latlng.lat, e.latlng.lng,
                        data.center[0], data.center[1]
                    );
                    
                    // If within radius, select this barangay
                    if (distance <= data.radius / 1000) { // Convert radius from meters to km
                        setFilters(prev => ({ ...prev, selectedBarangay: name }));
                        handleBarangaySelect({ target: { value: name } });
                        foundBarangay = true;
                        break;
                    }
                }
                
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
            <Container style={{ marginTop: '80px' }}> {/* Increased top margin to avoid navbar overlap */}
                <MapSection>
                    <MapContainer 
                        center={[CabanatuanLatLng.lat, CabanatuanLatLng.lng]} 
                        zoom={13} 
                        style={{ height: 'calc(100vh - 80px)' }} 
                        maxBounds={bounds}
                        maxBoundsViscosity={1.0} // Prevent dragging outside bounds
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
                            {highlightedAreas.map((area, index) => (
                                <Circle 
                                    key={`${area.name}-${index}`}
                                    center={barangayData[area.name].center}
                                    radius={barangayData[area.name].radius}
                                    pathOptions={{ 
                                        color: area.color, 
                                        fillOpacity: area.opacity || 0.5, 
                                        weight: 2 
                                    }}
                                >
                                    <Popup>
                                        <div style={{ color: '#333' }}>
                                            <strong>{area.name}</strong><br />
                                            <strong>Soil Type:</strong> {barangayData[area.name].soilType}<br />
                                            <strong>Main Fruit:</strong> {barangayData[area.name].fruits}<br />
                                            <strong>Elevation:</strong> {barangayData[area.name].elevation}m<br />
                                            <strong>Avg. Temp:</strong> {barangayData[area.name].temperature}°C<br />
                                            <strong>Pathways:</strong> {barangayData[area.name].pathways}
                                        </div>
                                    </Popup>
                                </Circle>
                            ))}
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
                
                <FilterSection>
                    <FilterGroup>
                        <FilterTitle>Map Type:</FilterTitle>
                        <Select value={mapType} onChange={handleMapTypeChange}>
                            <option value="standard">Standard</option>
                            <option value="terrain">Terrain (Elevation)</option>
                            <option value="satellite">Satellite</option>
                        </Select>
                    </FilterGroup>
                    
                    <FilterGroup>
                        <FilterTitle>Filter by:</FilterTitle>
                        <FilterItem>
                            <Checkbox type="checkbox" 
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
                    </FilterGroup>

                    {/* Display appropriate legend based on active filters */}
                    {(filters.soilType || filters.fruits || filters.elevation || filters.temperature || filters.pathways) && (
                        <Legend>
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
                        </Legend>
                    )}

                    <Divider />
                    
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
                            {Object.keys(barangayData).map((barangay) => (
                                <option key={barangay} value={barangay}>{barangay}</option>
                            ))}
                        </Select>
                    </FilterGroup>

                    {/* Barangay Information Display with Enhanced Data */}
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
                                    {barangayInfo.temperature}°C
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
                </FilterSection>
            </Container>
        </>
    );
};

export default MapView;
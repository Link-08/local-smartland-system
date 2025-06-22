import styled, { createGlobalStyle } from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';

// Global styles
export const GlobalStyles = createGlobalStyle`
	body {
		margin: 0;
		padding: 0;
		font-family: 'Arial', sans-serif;
		background-color: #2C3E50;
		color: #ecf0f1;
		overflow-x: hidden;
		box-sizing: border-box;
	}
	*, *:before, *:after {
		box-sizing: inherit;
	}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: stretch;
	height: 100vh;
	width: 100vw;
	margin: 0;
	padding: 0;
	margin-top: 80px;

	@media (max-width: 768px) {
		flex-direction: column;
		height: auto;
		min-height: 100vh;
		width: 100vw;
	}
`;

export const MapSection = styled.div`
	width: 70vw;
	height: 100vh;
	position: relative;
	margin: 0;
	padding: 0;

	@media (max-width: 768px) {
		width: 100vw;
		height: 60vh;
	}
`;

export const FilterSection = styled.div`
	width: 30vw;
	height: 100vh;
	background-color: #34495E;
	color: #ecf0f1;
	margin: 0;
	padding: 0;
	overflow-y: auto;

	@media (max-width: 768px) {
		width: 100vw;
		height: 40vh;
	}
`;

export const FilterScrollContainer = styled.div`
	height: 100%;
	overflow-y: auto;
	padding-left: 20px;
	padding-right: 20px;
`;

export const Label = styled.label`
	font-size: 16px;
	margin-left: 5px;
	color: #ecf0f1;
`;

export const Select = styled.select`
	width: 100%;
	padding: 10px;
	background-color: #2C3E50;
	color: #ecf0f1;
	border: 1px solid #7f8c8d;
	margin-top: 10px;
	border-radius: 5px;
	font-size: 16px;
`;

export const FilterGroup = styled.div`
	margin-bottom: 20px;
`;

export const FilterTitle = styled.h4`
	font-size: 18px;
	margin-bottom: 10px;
	color: #ecf0f1;
`;

export const FilterItem = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 15px;
`;

export const FilterGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 8px;
`;

export const Divider = styled.hr`
	margin: 20px 0;
	border: 0;
	border-top: 1px solid #7f8c8d;
`;

export const LocationOverlay = styled.div`
	position: absolute;
	bottom: 20px;
	left: 20px;
	background-color: rgba(0, 0, 0, 0.5);
	padding: 10px;
	border-radius: 5px;
`;

export const LocationName = styled.h3`
	color: #ecf0f1;
	font-size: 18px;
	margin: 0;
`;

export const DirectionsLink = styled.a`
	display: flex;
	align-items: center;
	color: #3498db;
	text-decoration: none;
	font-size: 16px;
	margin-top: 5px;
`;

export const ViewLargerMapLink = styled.a`
	color: #3498db;
	text-decoration: none;
	font-size: 16px;
	margin-top: 5px;
`;

export const Legend = styled.div`
	margin-top: 20px;
	padding: 10px;
	background-color: #34495E;
	border-radius: 5px;
`;

export const LegendContainer = styled.div`
	max-height: 200px;
	overflow-y: auto;
`;

export const LegendItem = styled.div`
	padding: 10px;
	margin: 5px 0;
	cursor: pointer;
	color: #ecf0f1;
	font-size: 16px;
	border-radius: 5px;

	&:hover {
		background-color: #16a085;
	}
`;

export const TemperatureRangeCard = styled.div`
	margin: 20px 0;
	background: #263238;
	padding: 16px;
	border-radius: 8px;
`;

export const FilterTitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #ecf0f1;
	font-weight: bold;
	justify-content: space-between;
	margin-bottom: 10px;
`;

export const RangeDisplay = styled.span`
	color: #ecf0f1;
	margin-left: 4px;
`;

export const SearchSortRow = styled.div`
	margin-top: 16px;
	display: flex;
	gap: 8px;
	align-items: center;
`;

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	padding: 20px 0;
`;

export const ScrollableList = styled.div`
	background: #37474F;
	border-radius: 8px;
	max-height: 220px;
	overflow-y: auto;
	margin-top: 12px;
`;

export const EmptyListItem = styled.div`
	padding: 12px;
	color: #fff;
	text-align: center;
`;

export const BarangayListItem = styled.div`
	padding: 10px 12px;
	border-bottom: 1px solid #263238;
	cursor: pointer;
	background-color: ${props => props.selected ? '#455A64' : 'transparent'};

	&:hover {
		background-color: '#455A64';
	}
`;

export const BarangayName = styled.div`
	color: #fff;
	font-weight: bold;
`;

export const BarangayDetails = styled.div`
	color: #b0bec5;
	font-size: 0.85rem;
	margin-top: 4px;
`;

export const SelectedBarangayCard = styled.div`
	margin-top: 16px;
	background: #37474F;
	border-radius: 8px;
	padding: 16px;
	color: #fff;
`;

export const BarangayCardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	font-size: 18px;
	margin-bottom: 12px;
`;

export const ActionButtons = styled.div`
	display: flex;
	gap: 4px;
`;

export const BarangayInfoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 8px;
`;

export const BarangayInfoItem = styled.div`
	color: #ecf0f1;
`;

export const BarangayNotes = styled.div`
	margin-top: 12px;
	font-style: italic;
	color: #b0bec5;
`;

// Style objects
export const barangayInfoBoxStyle = {
	padding: '15px',
	backgroundColor: '#2C3E50',
	borderRadius: '8px',
	marginTop: '15px',
	boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
	border: '1px solid #1A2530'
};

export const infoLabelStyle = {
	fontWeight: 'bold',
	marginRight: '5px',
	color: '#ecf0f1'
};

export const infoValueStyle = {
  	color: '#bdc3c7'
};

export const infoRowStyle = {
	marginBottom: '12px',
	display: 'flex',
	flexDirection: 'column'
};

export const recommendationBoxStyle = {
	backgroundColor: '#34495E',
	padding: '10px',
	borderRadius: '5px',
	marginTop: '15px'
};

export const fruitChipStyle = {
	display: 'inline-block',
	padding: '3px 8px',
	margin: '3px',
	backgroundColor: '#2C3E50',
	borderRadius: '16px',
	fontSize: '0.85rem',
	color: '#ecf0f1'
};

export const PopupContent = styled.div`
	width: 100%;
	max-width: 300px;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	font-family: 'Roboto', sans-serif;
`;

export const PopupHeader = styled.div`
	padding: 10px 15px;
	color: #000;
	font-weight: 600;
`;

export const PopupTitle = styled.h3`
	margin: 0;
	font-size: 16px;
	font-weight: bold;
`;

export const PopupBody = styled.div`
	padding: 15px;
	background-color: #fff;
	color: #333;
`;

export const PopupInfoRow = styled.div`
	display: flex;
	margin-bottom: 8px;
	font-size: 14px;
	align-items: baseline;
`;

export const PopupLabel = styled.span`
	font-weight: 600;
	width: 120px;
	color: #555;
`;

export const PopupValue = styled.span`
	flex: 1;
`;

export const PopupDivider = styled.hr`
	border: none;
	border-top: 1px solid #eee;
	margin: 12px 0;
`;

export const SmartFarmingBox = styled.div`
	background-color: #f8f9fa;
	border-radius: 6px;
	padding: 12px;
	position: relative;
	border-left: 4px solid #4CAF50;
`;

export const SmartFarmingTitle = styled.h4`
	margin: 0 0 8px 0;
	font-size: 14px;
	color: #2c3e50;
`;

export const SmartFarmingSummary = styled.p`
	margin: 0;
	font-size: 13px;
	line-height: 1.4;
	color: #333;
`;

export const SmartFarmingBadge = styled.span`
	position: absolute;
	top: -10px;
	right: 10px;
	background-color: #4CAF50;
	color: white;
	font-size: 10px;
	padding: 3px 8px;
	border-radius: 10px;
	font-weight: 600;
`;

// Add Clear Button styles
export const ClearButton = muiStyled('button')(({ theme }) => ({
	background: 'transparent',
	border: '1px solid #90CAF9',
	color: '#90CAF9',
	borderRadius: '4px',
	padding: '4px 8px',
	fontSize: '12px',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	transition: '0.3s',
	'&:hover': {
		background: 'rgba(144, 202, 249, 0.1)',
	}
}));

export const LandsSection = styled.div`
	background: rgba(30, 42, 54, 0.95);
	backdrop-filter: blur(8px);
	color: #fff;
	padding: 0;
	border-radius: 8px;
    width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LandsHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LandsTitle = styled.h3`
	margin: 0;
	font-size: 1.2rem;
	font-weight: 600;
`;

export const LandsCount = styled.span`
	font-size: 0.9rem;
	font-weight: 400;
	color: #bdc3c7;
	margin-left: 8px;
`;

export const CloseButton = styled.button`
	background: none;
	border: none;
	color: #fff;
	font-size: 1.5rem;
	cursor: pointer;
	padding: 0;
	line-height: 1;

	&:hover {
		color: #e74c3c;
	}
`;

export const LandsScrollContainer = styled.div`
	flex-grow: 1;
	overflow-y: auto;
	padding: 16px;
	max-height: 60vh;
`;

export const LandCard = styled.div`
	background: rgba(255, 255, 255, 0.08);
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 16px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: all 0.2s ease;
	
	&:hover {
		background: rgba(255, 255, 255, 0.12);
		transform: translateY(-2px);
	}
`;

export const LandHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

export const LandTitle = styled.h4`
    color: #fff;
    margin: 0;
    font-size: 1.1em;
    font-weight: 500;
    flex: 1;
`;

export const LandType = styled.span`
    background: ${props => props.type === 'Agricultural' ? '#27ae60' : '#3498db'};
    color: #fff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: 500;
`;

export const LandDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
    margin-bottom: 12px;
`;

export const LandInfo = styled.div`
    color: #ecf0f1;
    font-size: 0.9em;
`;

export const LandDescription = styled.p`
    color: #bdc3c7;
    font-size: 0.9em;
    margin: 0 0 12px 0;
    line-height: 1.4;
`;

export const LandFeatures = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
`;

export const FeatureTag = styled.span`
    background: rgba(52, 152, 219, 0.2);
    color: #3498db;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    border: 1px solid rgba(52, 152, 219, 0.3);
`;

export const LandContact = styled.div`
    display: flex;
    gap: 8px;
`;

export const ContactButton = styled.a`
    background: #27ae60;
    color: #fff;
    padding: 8px 12px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.9em;
    font-weight: 500;
    flex: 1;
    text-align: center;
    transition: background-color 0.2s;
    
    &:hover {
        background: #229954;
    }
`;

export const InquireButton = styled.button`
    background: #3498db;
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    flex: 1;
    transition: background-color 0.2s;
    
    &:hover {
        background: #2980b9;
    }
`;

export const LoadingMessage = styled.div`
    color: #bdc3c7;
    text-align: center;
    padding: 40px 20px;
    font-style: italic;
`;

export const NoLandsMessage = styled.div`
    color: #bdc3c7;
    text-align: center;
    padding: 40px 20px;
    font-style: italic;
    line-height: 1.5;
`;
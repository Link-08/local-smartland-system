import styled, { createGlobalStyle } from 'styled-components';

// Global styles
export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #2C3E50;
    color: #ecf0f1;
    overflow-x: hidden;
  }
`;

// Layout containers
export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100vh;
  margin-top: 80px; // For navbar
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MapSection = styled.div`
  width: 70vw;
  height: calc(100vh - 80px);
  position: relative;
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 60vh;
  }
`;

export const FilterSection = styled.div`
  width: 30vw;
  height: calc(100vh - 80px);
  background-color: #34495E;
  color: #ecf0f1;
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 40vh;
  }
`;

export const FilterScrollContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

// Form elements
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

// Map overlay elements
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

// Legend components
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

// Temperature range components
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
  margin-bottom: 8px;
  color: #ecf0f1;
  font-weight: bold;
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

// Barangay list components
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

// Selected barangay card components
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
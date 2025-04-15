import styled, { createGlobalStyle } from 'styled-components';

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

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100vh;
`;

export const MapSection = styled.div`
  width: 70vw; // Map takes up 70% of the viewport width
  height: calc(100vh - 80px); // Subtract navbar height
  position: relative;
`;

export const FilterSection = styled.div`
  height: calc(100vh - 80px); // Subtract navbar height
  padding: 20px;
  background-color: #34495E;
  color: #ecf0f1;
  overflow-y: auto;
`;

export const Label = styled.label`
  font-size: 16px;
  margin-left: 5px;
  color: #ecf0f1;
`;

export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
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

export const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #7f8c8d;
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

export const Legend = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #34495E;
  border-radius: 5px;
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

export const MapContainerStyled = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #34495E;
`;

export const MapContainerLegend = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 5px;
  color: #fff;
`;

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
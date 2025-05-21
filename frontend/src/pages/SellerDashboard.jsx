import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

// Styled components with proper prop handling
const DashboardContainer = styled.div`
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.$bgColor || '#fff'};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  color: ${props => props.$iconColor || '#666'};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.$accentColor || '#333'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 1rem;
  background: #f8d7da;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  color: #666;
  padding: 1rem;
  text-align: center;
`;

const PropertyList = styled.div`
  margin-top: 2rem;
`;

const PropertyCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1.5rem;
`;

const PropertyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PropertyTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const PropertyLocation = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PropertyPrice = styled.div`
  font-weight: bold;
  color: #2e7d32;
`;

const PropertyDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const SellerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch properties
        const propertiesResponse = await api.get(`/api/seller/${user.accountId}/listings`);
        setProperties(propertiesResponse.data);

        // Fetch metrics
        const metricsResponse = await api.get(`/api/seller/metrics/${user.accountId}`);
        setMetrics(metricsResponse.data);

      } catch (err) {
        console.error('Error fetching seller data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.accountId) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <LoadingMessage>Loading dashboard data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const totalViews = properties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
  const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0);

  return (
    <DashboardContainer>
      <h1>Seller Dashboard</h1>
      
      <StatsGrid>
        <StatCard $bgColor="#e3f2fd">
          <StatIcon $iconColor="#1976d2">
            <i className="fas fa-list"></i>
          </StatIcon>
          <StatValue $accentColor="#1976d2">
            {properties.length}
          </StatValue>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>

        <StatCard $bgColor="#e8f5e9">
          <StatIcon $iconColor="#2e7d32">
            <i className="fas fa-eye"></i>
          </StatIcon>
          <StatValue $accentColor="#2e7d32">
            {totalViews}
          </StatValue>
          <StatLabel>Total Views</StatLabel>
        </StatCard>

        <StatCard $bgColor="#fff3e0">
          <StatIcon $iconColor="#f57c00">
            <i className="fas fa-comments"></i>
          </StatIcon>
          <StatValue $accentColor="#f57c00">
            {totalInquiries}
          </StatValue>
          <StatLabel>Total Inquiries</StatLabel>
        </StatCard>
      </StatsGrid>

      <PropertyList>
        <h2>Your Properties</h2>
        {properties.map(property => (
          <PropertyCard key={property.id}>
            <PropertyImage src={property.image} alt={property.title} />
            <PropertyInfo>
              <PropertyTitle>{property.title}</PropertyTitle>
              <PropertyLocation>{property.location}</PropertyLocation>
              <PropertyPrice>₱{property.price.toLocaleString()}</PropertyPrice>
              <PropertyDetails>
                <span>{property.acres} acres</span>
                <span>•</span>
                <span>{property.waterRights}</span>
                <span>•</span>
                <span>{property.suitableCrops}</span>
              </PropertyDetails>
            </PropertyInfo>
          </PropertyCard>
        ))}
      </PropertyList>
    </DashboardContainer>
  );
};

export default SellerDashboard; 
import styled from 'styled-components';

export const PreviewModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
`;

export const PreviewContent = styled.div`
    background: #ffffff;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-size: 24px;
    color: #2c3e50;
    transition: all 0.2s ease;
    
    &:hover {
        background: white;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

export const ImageGallery = styled.div`
    width: 50%;
    position: relative;
    background: #f8f9fa;
    overflow: hidden;
`;

export const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    left: ${props => props.$left ? '20px' : 'auto'};
    right: ${props => props.$right ? '20px' : 'auto'};
    
    &:hover {
        background: white;
        transform: translateY(-50%) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;

export const ThumbnailsContainer = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Thumbnail = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid ${props => props.$active ? '#2ecc71' : 'transparent'};
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #27ae60;
        transform: scale(1.05);
    }
`;

export const MainContent = styled.div`
    width: 50%;
    padding: 40px;
    overflow-y: auto;
    background: #ffffff;
`;

export const ListingHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
`;

export const TitleSection = styled.div`
    flex: 1;
`;

export const ListingTitle = styled.h1`
    font-size: 28px;
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-weight: 600;
`;

export const ListingLocation = styled.div`
    color: #7f8c8d;
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export const PricingSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
`;

export const Price = styled.div`
    font-size: 28px;
    font-weight: 600;
    color: #2ecc71;
    display: flex;
    align-items: center;
`;

export const StatusBadge = styled.div`
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const PriceVisibility = styled.span`
    font-size: 14px;
    color: #27ae60;
    font-weight: normal;
    margin-left: 8px;
`;

export const PriceHidden = styled.span`
    font-size: 14px;
    color: #e74c3c;
    font-weight: normal;
    margin-left: 8px;
`;

export const PriceSection = styled.div`
    text-align: right;
`;

export const ListingPrice = styled.div`
    font-size: 32px;
    font-weight: 600;
    color: #2ecc71;
`;

export const PriceUnit = styled.span`
    font-size: 16px;
    color: #7f8c8d;
    margin-left: 4px;
`;

export const PricePerUnit = styled.div`
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 4px;
`;

export const ContentGrid = styled.div`
    display: grid;
    gap: 30px;
`;

export const Section = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
    font-size: 20px;
    color: #2c3e50;
    margin: 0 0 20px 0;
    font-weight: 600;
`;

export const PropertySpecs = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
`;

export const SpecItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const SpecLabel = styled.div`
    font-size: 14px;
    color: #7f8c8d;
    text-transform: capitalize;
`;

export const SpecValue = styled.div`
    font-size: 16px;
    color: #2c3e50;
    font-weight: 500;
`;

export const Description = styled.p`
    font-size: 16px;
    line-height: 1.6;
    color: #34495e;
    margin: 0;
`;

export const AmenitiesList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
`;

export const AmenityItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #2c3e50;
`;

export const RestrictionsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
`;

export const RestrictionItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #e74c3c;
`;

export const EmptyMessage = styled.div`
    color: #95a5a6;
    font-style: italic;
    font-size: 14px;
`;

export const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`;

export const MetricItem = styled.div`
    text-align: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
`;

export const MetricLabel = styled.div`
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 8px;
`;

export const MetricValue = styled.div`
    font-size: 24px;
    font-weight: 600;
    color: ${props => {
        if (props.$status === 'active') return '#2ecc71';
        if (props.$status === 'pending') return '#f39c12';
        if (props.$status === 'sold') return '#3498db';
        return '#2c3e50';
    }};
`;

export const MapContainer = styled.div`
    height: 300px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 12px;
    border: 1px solid #e0e0e0;
    
    .leaflet-container {
        height: 100%;
        width: 100%;
    }
    
    .leaflet-popup-content-wrapper {
        border-radius: 8px;
        padding: 8px;
    }
    
    .leaflet-popup-content {
        margin: 8px;
        font-size: 14px;
        color: #2C3E50;
    }
`;

export const PerformanceMetrics = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
`;

export const MetricCard = styled.div`
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid #e9ecef;
`;

export const PerformanceMetricValue = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
`;

export const PerformanceMetricLabel = styled.div`
    font-size: 12px;
    color: #7f8c8d;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`; 
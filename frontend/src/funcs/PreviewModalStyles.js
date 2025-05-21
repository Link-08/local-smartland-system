import styled from 'styled-components';

export const PreviewModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const PreviewContent = styled.div`
    background: white;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
`;

export const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0;
    &:hover {
        background: white;
    }
`;

export const ImageGallery = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    background: #f5f5f5;
`;

export const MainImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const ImageNavigation = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    pointer-events: none;
`;

export const NavButton = styled.button`
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0;
    pointer-events: auto;
    &:hover {
        background: white;
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
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
`;

export const Thumbnail = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid ${props => props.active ? '#2ecc71' : 'transparent'};
    &:hover {
        border-color: #27ae60;
    }
`;

export const MainContent = styled.div`
    padding: 30px;
    overflow-y: auto;
`;

export const ListingHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
`;

export const TitleSection = styled.div`
    flex: 1;
`;

export const ListingTitle = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
`;

export const ListingLocation = styled.div`
    color: #7f8c8d;
    font-size: 16px;
    display: flex;
    align-items: center;
`;

export const PriceSection = styled.div`
    text-align: right;
`;

export const ListingPrice = styled.div`
    font-size: 28px;
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
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
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
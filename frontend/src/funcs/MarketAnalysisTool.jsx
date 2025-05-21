import React, { useState } from "react";
import api from "../api";
import { SellerDashboardStyles as S } from "./SellerDashboardStyles";
import { FaChartLine, FaClock, FaEye, FaComments, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MarketAnalysisTool = () => {
  const [location, setLocation] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const { data } = await api.get("/market/analysis", { params: { location } });
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <S.FormGroup>
        <S.FormLabel>Location</S.FormLabel>
        <S.FormInput 
          value={location} 
          onChange={e => setLocation(e.target.value)} 
          placeholder="E.g. Barangay Imelda" 
        />
      </S.FormGroup>
      <S.FormActions>
        <S.FormSubmitButton onClick={handleFetch} disabled={loading || !location}>
          Analyze Market
        </S.FormSubmitButton>
      </S.FormActions>
      
      {loading && <p style={{ color: "#7f8c8d" }}>Loading market analysis...</p>}
      {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
      
      {analysis && (
        <div>
          {/* Market Overview */}
          <S.ToolGrid>
            <S.ToolCard>
              <S.ToolCardTitle>Average Price per Hectare</S.ToolCardTitle>
              <S.ToolCardValue large>₱{analysis.overview.avgPrice.toLocaleString()}</S.ToolCardValue>
              <div style={{ fontSize: "13px", color: "#7f8c8d" }}>
                Range: ₱{analysis.overview.minPrice.toLocaleString()} - ₱{analysis.overview.maxPrice.toLocaleString()}
              </div>
            </S.ToolCard>
            
            <S.ToolCard>
              <S.ToolCardTitle>Market Activity</S.ToolCardTitle>
              <S.ToolCardValue large>{analysis.overview.activeListings}</S.ToolCardValue>
              <div style={{ fontSize: "13px", color: "#7f8c8d" }}>
                {analysis.overview.soldListings} properties sold recently
              </div>
            </S.ToolCard>
          </S.ToolGrid>

          {/* Market Insights */}
          <S.ToolSection>
            <S.ToolSectionTitle>Market Insights</S.ToolSectionTitle>
            {analysis.insights.map((insight, idx) => (
              <S.InsightCard key={idx} $accentColor={insight.accentColor}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  {insight.type === 'price_trend' && (
                    <FaChartLine style={{ marginRight: '8px', color: insight.accentColor }} />
                  )}
                  {insight.type === 'time_to_sale' && (
                    <FaClock style={{ marginRight: '8px', color: insight.accentColor }} />
                  )}
                  {insight.type === 'demand' && (
                    <FaEye style={{ marginRight: '8px', color: insight.accentColor }} />
                  )}
                  <S.ToolCardTitle style={{ margin: 0 }}>{insight.title}</S.ToolCardTitle>
                </div>
                <div style={{ fontSize: "14px", color: "#7f8c8d" }}>{insight.text}</div>
              </S.InsightCard>
            ))}
          </S.ToolSection>

          {/* Recent Listings */}
          <S.ToolSection>
            <S.ToolSectionTitle>Recent Listings in {location}</S.ToolSectionTitle>
            <div style={{ fontSize: "14px", color: "#dddddd" }}>
              {analysis.recent.map((p, idx) => (
                <div key={idx} style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(52, 152, 219, 0.05)",
                  marginBottom: "12px"
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: "600" }}>{p.title}</div>
                    <div style={{ 
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: p.status === 'active' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                      color: p.status === 'active' ? '#2ecc71' : '#3498db'
                    }}>
                      {p.status}
                    </div>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    ₱{p.price.toLocaleString()} ({p.acres} ha) • {new Date(p.datePosted).toLocaleDateString()}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Water: {p.waterRights}, Crops: {p.suitableCrops}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '16px',
                    fontSize: '13px',
                    color: '#7f8c8d'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaEye size={14} /> {p.viewCount} views
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaComments size={14} /> {p.inquiryCount} inquiries
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </S.ToolSection>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisTool; 
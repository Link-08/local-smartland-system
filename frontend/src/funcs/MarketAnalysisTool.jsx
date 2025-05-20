import React, { useState } from "react";
import api from "../api";
import { SellerDashboardStyles as S } from "./SellerDashboardStyles";

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
        <S.FormInput value={location} onChange={e => setLocation(e.target.value)} placeholder="E.g. Barangay Imelda" />
      </S.FormGroup>
      <S.FormActions>
        <S.FormSubmitButton onClick={handleFetch} disabled={loading || !location}>Analyze</S.FormSubmitButton>
      </S.FormActions>
      {loading && <p style={{ color: "#7f8c8d" }}>Loading...</p>}
      {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
      {analysis && (
        <div>
          <S.ToolGrid>
            <S.ToolCard>
              <S.ToolCardTitle>Avg. Price per Hectare</S.ToolCardTitle>
              <S.ToolCardValue large>₱{analysis.avgPrice.toLocaleString()}</S.ToolCardValue>
              <div style={{ fontSize: "13px", color: "#7f8c8d" }}>{analysis.count} recent listings</div>
            </S.ToolCard>
          </S.ToolGrid>
          <S.ToolSection>
            <S.ToolSectionTitle>Comparable Properties</S.ToolSectionTitle>
            <div style={{ fontSize: "14px", color: "#dddddd" }}>
              {analysis.recent.map((p, idx) => (
                <div key={idx} style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(52, 152, 219, 0.05)",
                  marginBottom: "8px"
                }}>
                  <div style={{ fontWeight: "600" }}>{p.title}</div>
                  <div>
                    ₱{p.price.toLocaleString()} ({p.acres} ha) • {new Date(p.datePosted).toLocaleDateString()}
                  </div>
                  <div>Water: {p.waterRights}, Crops: {p.suitableCrops}</div>
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
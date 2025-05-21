import React, { useState } from "react";
import api from "../api";
import { SellerDashboardStyles as S } from "./SellerDashboardStyles";

const PriceCalculatorTool = () => {
  const [form, setForm] = useState({
    location: "",
    size: "",
    waterSource: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.get("/market/price-estimate", { params: form });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch estimate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCalculate}>
      <S.FormGroup>
        <S.FormLabel>Location</S.FormLabel>
        <S.FormInput name="location" value={form.location} onChange={handleChange} required placeholder="E.g. Barangay Imelda" />
      </S.FormGroup>
      <S.FormRow>
        <S.FormGroup>
          <S.FormLabel>Land Size (hectares)</S.FormLabel>
          <S.FormInput name="size" type="number" min="0.1" step="0.1" value={form.size} onChange={handleChange} required placeholder="E.g. 5.2" />
        </S.FormGroup>
        <S.FormGroup>
          <S.FormLabel>Water Source</S.FormLabel>
          <S.FormSelect name="waterSource" value={form.waterSource} onChange={handleChange}>
            <option value="">Any</option>
            <option value="NIA Irrigation">NIA Irrigation</option>
            <option value="Deep Well">Deep Well</option>
            <option value="Creek Access">Creek Access</option>
            <option value="Rain-fed Only">Rain-fed Only</option>
          </S.FormSelect>
        </S.FormGroup>
      </S.FormRow>
      <S.FormActions>
        <S.FormSubmitButton type="submit" disabled={loading}>Calculate</S.FormSubmitButton>
      </S.FormActions>
      {loading && <p style={{ color: "#7f8c8d" }}>Loading...</p>}
      {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
      {result && (
        <S.ToolResultBox>
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "14px", color: "#dddddd", margin: "0 0 8px 0" }}>
              {result.message}
            </p>
            {result.count > 0 ? (
              <>
                <S.ToolCardValue large bold color="#2980b9" style={{ marginBottom: "8px" }}>
                  ₱{result.min.toLocaleString()} - ₱{result.max.toLocaleString()} per hectare
                </S.ToolCardValue>
                <div style={{ 
                  fontSize: "14px", 
                  color: "#7f8c8d",
                  marginBottom: "12px"
                }}>
                  Weighted average: ₱{result.weightedAverage.toLocaleString()} per hectare
                </div>
                <div style={{ 
                  fontSize: "13px", 
                  color: "#95a5a6",
                  fontStyle: "italic"
                }}>
                  Price range excludes outliers and is weighted towards recent sales
                </div>
              </>
            ) : (
              <S.ToolCardValue large bold color="#e74c3c">
                No comparable data found
              </S.ToolCardValue>
            )}
          </div>
        </S.ToolResultBox>
      )}
    </form>
  );
};

export default PriceCalculatorTool; 
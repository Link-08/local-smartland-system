const express = require("express");
const router = express.Router();

// Elevation data (meters)
const elevations = {
  "Aduas Centro": 36.0,
  "Aduas Norte": 35.8,
  "Aduas Sur": 35.9,
  "Bagong Buhay": 62.9,
  "Bagong Sikat": 43.3,
  "Bakero": 44.6,
  "Bakod Bayan": 47.8,
  "Balite": 40.7,
  "Bangad": 43.6,
  "Bantug Bulalo": 37.0,
  "Bantug Norte": 36.6,
  "Barlis": 40.9,
  "Barrera District": 34.8,
  "Bernardo District": 35.0,
  "Bitas": 38.0,
  "Bonifacio District": 35.6,
  "Buliran": 40.9,
  "Caalibangbangan": 36.7,
  "Cabu": 51.3,
  "Calawagan": 45.5,
  "Campo Tinio": 48.7,
  "Caridad": 35.2,
  "Caudillo": 34.5,
  "Cinco-Cinco": 34.3,
  "City Supermarket": 39.0,
  "Communal": 44.6,
  "Cruz Roja": 38.2,
  "Daang Sarile": 36.3,
  "Dalampang": 40.4,
  "Dicarma": 36.2,
  "Dimasalang": 36.9,
  "Dionisio S. Garcia": 34.5,
  "Fatima": 38.9,
  "General Luna": 36.6,
  "Hermogenes C. Concepcion, Sr.": 33.0,
  "Ibabao Bana": 35.1,
  "Imelda District": 35.0,
  "Isla": 34.4,
  "Kalikid Norte": 64.4,
  "Kalikid Sur": 68.5,
  "Kapitan Pepe": 34.0,
  "Lagare": 42.1,
  "Lourdes": 39.9,
  "M.S. Garcia": 34.3,
  "Mabini Extension": 34.1,
  "Mabini Homesite": 33.7,
  "Macatbong": 69.7,
  "Magsaysay District": 34.3,
  "Magsaysay South": 36.0,
  "Maria Theresa": 35.8,
  "Matadero": 37.9,
  "Mayapyap Norte": 40.6,
  "Mayapyap Sur": 38.5,
  "Melojavilla": 40.0,
  "Nabao": 36.3,
  "Obrero": 40.7,
  "Padre Burgos": 38.8,
  "Padre Crisostomo": 33.7,
  "Pagas": 36.3,
  "Palagay": 31.7,
  "Pamaldan": 36.5,
  "Pangatian": 47.7,
  "Patalac": 89.9,
  "Polilio": 89.9,
  "Pula": 44.1,
  "Quezon District": 36.7,
  "Rizdelis": 37.7,
  "Samon": 34.9,
  "San Isidro": 38.1,
  "San Josef Norte": 36.3,
  "San Josef Sur": 31.4,
  "San Juan Población": 32.6,
  "San Roque Norte": 36.2,
  "San Roque Sur": 32.1,
  "Sanbermicristi": 36.6,
  "Sangitan": 36.5,
  "Sangitan East": 37.7,
  "Santa Arcadia": 33.0,
  "Santo Niño": 31.3,
  "Sapang": 40.0,
  "Sumacab Este": 29.1,
  "Sumacab Norte": 32.6,
  "Sumacab South": 31.0,
  "Talipapa": 35.8,
  "Valdefuente": 38.6,
  "Valle Cruz": 34.2,
  "Vijandre District": 36.5,
  "Villa Ofelia-Caridad": 35.0,
  "Zulueta District": 34.4
};

// Get all elevations or a specific barangay
router.get("/", (req, res) => {
  const { barangay } = req.query;
  if (barangay) {
    const elevation = elevations[barangay];
    if (elevation === undefined) {
      return res.status(404).json({ error: "Barangay not found" });
    }
    return res.json({ barangay, elevation });
  }
  res.json(elevations);
});

module.exports = router;

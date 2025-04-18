// Utility to load barangays from local JSON file (simulating API)
import barangaysJson from './barangays.json';

export function getBarangaysArray() {
  return barangaysJson;
}

export function getBarangaysObject() {
  const obj = {};
  barangaysJson.forEach(b => {
    obj[b.name] = b;
  });
  return obj;
}

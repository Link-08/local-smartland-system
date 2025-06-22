// Utility functions for formatting price and date fields

/**
 * Format a number as PHP currency (₱1,234,567)
 * @param {number|string} value
 * @returns {string}
 */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return 'Price on Request';
  const num = typeof value === 'string' ? parseFloat(value.toString().replace(/[^0-9.]/g, '')) : value;
  if (isNaN(num)) return 'Price on Request';
  return `₱${num.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`;
}

/**
 * Format a date string or Date object to a user-friendly format (e.g., May 21, 2025)
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
} 
// This is a mock service to simulate a real estate data API like Zillow or Rentometer.
// In a real application, this would make an actual API call.

/**
 * Gets mock market data for a property.
 * @param {string} address - The property address.
 * @returns {Promise<{estimated_arv: number, market_rent: number}>}
 */
exports.getMarketData = async (address) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate mock data based on a hash of the address to make it somewhat deterministic
  const hash = address.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  const baseArv = 250000;
  const baseRent = 2000;

  const estimated_arv = baseArv + (hash % 50000);
  const market_rent = baseRent + (hash % 500);

  return { estimated_arv, market_rent };
};

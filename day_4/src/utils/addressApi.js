import axios from "axios";


/**
 * Get latitude and longitude coordinates for a given address using Google Maps Geocoding API.
 * @param {string} apiKey - Google Maps API Key.
 * @param {string} address - Address to geocode.
 * @returns {Object} - Object with latitude and longitude properties.
 */
async function getLatitudeLongitude(apiKey, address) {
    const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const params = {
      address: address,
      key: apiKey,
    };
  
    try {
      const response = await axios.get(baseUrl, { params });
      const data = response.data;
  
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        return { latitude, longitude };
      } else {
        return { latitude: null, longitude: null };
      }
    } catch (error) {
      console.error("Error in getLatitudeLongitude:", error.message);
      return { latitude: null, longitude: null };
    }
  }
  
  /**
   * Get the driving distance between two sets of latitude and longitude coordinates using OSRM API.
   * @param {number} lat1 - Latitude of the starting point.
   * @param {number} long1 - Longitude of the starting point.
   * @param {number} lat2 - Latitude of the destination.
   * @param {number} long2 - Longitude of the destination.
   * @returns {number} - Driving distance in kilometers.
   */
  async function getVehicleDistance(lat1, long1, lat2, long2) {
    try {
      const response = await axios.get(
        `http://router.project-osrm.org/route/v1/car/${long1},${lat1};${long2},${lat2}?overview=false`
      );
      const route = response.data.routes[0];
      const vehicleDistance = route.distance;
  
      return vehicleDistance / 1000; // Convert to kilometers
    } catch (error) {
      console.error("Error in getVehicleDistance:", error.message);
      return Infinity; // Return a large value to indicate an error or unreachable location
    }
  }
  
  /**
   * Find the closest address with a sufficient item value based on the starting address.
   * @param {string} apiKey - Google Maps API Key.
   * @param {string} startingAddress - Starting address for which to find the closest item.
   * @param {number} requiredItemValue - Required item value or quantity.
   * @param {Array<Object>} itemAddressList - List of items with associated addresses and values.
   * @returns {Object | null} - Closest item address object or null if no suitable item is found.
   */
  
  async function findClosestItemAddress(
    apiKey,
    startingAddress,
    requiredItemValue,
    itemAddressList
  ) {
    try {
      const startingCoordinates = await getLatitudeLongitude(
        apiKey,
        startingAddress
      );
      const startingLatitude = startingCoordinates.latitude;
      const startingLongitude = startingCoordinates.longitude;
  
      let closestDistance = Infinity;
      let closestItemAddress = null;
  
      for (const itemAddress of itemAddressList) {
        const { latitude, longitude } = await getLatitudeLongitude(
          apiKey,
          itemAddress.address
        );
        const itemValue = itemAddress.itemValue; // Assuming itemValue represents the value or quantity
  
        if (itemValue >= requiredItemValue) {
          const distance = await getDrivingDistance(
            startingLatitude,
            startingLongitude,
            latitude,
            longitude
          );
  
          if (distance < closestDistance) {
            closestDistance = distance;
            closestItemAddress = itemAddress;
          }
        }
      }
  
      return closestItemAddress;
    } catch (error) {
      console.error("Error in findClosestItemAddress:", error.message);
      return null;
    }
  }
  export { findClosestItemAddress,getVehicleDistance ,getLatitudeLongitude };
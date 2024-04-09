
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLatitudeLongitude, getVehicleDistance } from "../utils/addressApi.js";


const getAddressCoordinates = asyncHandler(async (req, res) => {
  const { address } = req.params;
  const apiKey = process.env.LOCATION_API_KEY;

  // Validate input parameters
  if (!address) {
    throw new ApiError(400, "Address parameter is required 🫠");
  }
  if (!apiKey) {
    throw new ApiError(400, "API Key is required 🫠");
  }

  try {
    const coordinates = await getLatitudeLongitude(apiKey, address);
    if (!coordinates) {
      throw new ApiError(404, "Coordinates not found for the provided address 🫠");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, coordinates, "Coordinates fetched successfully ✅")
      );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new ApiError(404, "Address not found 🫠");
    }
    throw new ApiError(500, "Failed to fetch coordinates 🫠");
  }
});

const calculateDrivingDistance = asyncHandler(async (req, res) => {
  const { origin, destination } = req.query;
  const apiKey = process.env.LOCATION_API_KEY;

  // Validate input parameters
  if (!origin || !destination) {
    throw new ApiError(400, "Origin and destination parameters are required 🫠");
  }
  if (!apiKey) {
    throw new ApiError(400, "API Key is required 🫠");
  }

  try {
    const originCoordinates = await getLatitudeLongitude(apiKey, origin);
    const destCoordinates = await getLatitudeLongitude(apiKey, destination);

    if (!originCoordinates || !destCoordinates) {
      throw new ApiError(
        404,
        "Coordinates not found for origin or destination address 🫠"
      );
    }

    const distance = await getVehicleDistance(
      originCoordinates.latitude,
      originCoordinates.longitude,
      destCoordinates.latitude,
      destCoordinates.longitude
    );

    if (distance === Infinity) {
      throw new ApiError(500, "Failed to calculate driving distance 🫠");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { distanceKm: distance },
          "Driving distance calculated successfully ✅"
        )
      );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new ApiError(404, "Address not found 🫠");
    }
    throw new ApiError(500, "Failed to calculate driving distance 🫠");
  }
});

export {
  getAddressCoordinates,
  calculateDrivingDistance,
};

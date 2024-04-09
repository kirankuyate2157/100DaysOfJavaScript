import { Router } from 'express';
import {
  calculateDrivingDistance,
  getAddressCoordinates,
} from '../controllers/location.controller.js';

const router = Router();

// Route to get coordinates for a specific address
router.get('/coordinates/:address', getAddressCoordinates);

// Route to calculate driving distance between two addresses:query: origin, destination 
router.get('/distance', calculateDrivingDistance);

export default router;

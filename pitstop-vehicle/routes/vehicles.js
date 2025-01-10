var express = require('express');
var router = express.Router();

let {
  pingPong,
  allVehicles,
  registerVehicle,
  deleteVehicle,
  allCustomers
} = require("../controllers/vehiclesController");

// Add error handling to routes
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/ping', asyncHandler(pingPong));

// Move customer routes to customer service
// router.get('/customers/all', allCustomers);  // Remove this

router.get("/all", asyncHandler(allVehicles));
router.post("/add", asyncHandler(registerVehicle));
router.delete("/:license", asyncHandler(deleteVehicle));

module.exports = router;
var express = require('express');
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');
var router = express.Router();

/* Locations Pages. */
router.get('/', ctrlLocations.homeList);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/* Other Pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationID', ctrlLocations.locationsReadOne);
router.put('/locations/:locationID', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationID', ctrlLocations.locationsDeleteOne);

router.post('/locations/:locationID/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationID/reviews/:reviewID', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationID/reviews/:reviewID', ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationID/reviews/:reviewID', ctrlReviews.reviewsDeleteOne);

module.exports = router;
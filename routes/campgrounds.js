const express = require('express');
const catchAsync = require('../utils/catch-async');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const router = express.Router();

/* ==========================================================================
   Campground Routes
   ========================================================================== */

router.route('/')
  // displays ALL campgrounds
  .get(catchAsync(campgrounds.index))
  // receive POST from NEW form
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
  
// displays create NEW campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  // displays SHOW specific campground info
  .get(catchAsync(campgrounds.showCampground))
  // receive PUT from EDIT form
  .put(validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground))
  // receive DELETE from SHOW
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
  
// displays EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;
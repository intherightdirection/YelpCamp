const express = require('express');
const catchAsync = require('../utils/catch-async');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const router = express.Router();

/* ==========================================================================
   Campground Routes
   ========================================================================== */

/* GET Routes
   ========================================================================== */

// displays ALL campgrounds
router.get('/', catchAsync(campgrounds.index));
// displays create NEW campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// displays SHOW specific campground info
router.get('/:id', catchAsync(campgrounds.showCampground));
// displays EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

/* POST Routes
  ========================================================================== */

// receive POST from NEW form
router.post('/', validateCampground, isLoggedIn, catchAsync(campgrounds.createCampground));


/* PUT Routes
  ========================================================================== */
  
// receive PUT from EDIT form
router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampground));

/* DELETE Routes
  ========================================================================== */

// receive DELETE from SHOW
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
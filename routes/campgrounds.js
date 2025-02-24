const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catch-async');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { storage } = require('../cloudinary');
const router = express.Router();
const upload = multer({ storage });

/* ==========================================================================
   Campground Routes
   ========================================================================== */

router.route('/')
  // displays ALL campgrounds
  .get(catchAsync(campgrounds.index))
  // receive POST from NEW form
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// displays create NEW campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  // displays SHOW specific campground info
  .get(catchAsync(campgrounds.showCampground))
  // receive PUT from EDIT form
  .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
  // receive DELETE from SHOW
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
  
// displays EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;
const express = require('express');
const multer = require('multer');
const catchAsync = require('../utils/catch-async');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const router = express.Router();
const upload = multer({ dest: 'uploads/'});

/* ==========================================================================
   Campground Routes
   ========================================================================== */

router.route('/')
  // displays ALL campgrounds
  .get(catchAsync(campgrounds.index))
  // receive POST from NEW form
  // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send("IT WORKED")
  })
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
const express = require('express');
const catchAsync = require('../utils/catch-async');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const router = express.Router();

/* ==========================================================================
   Campground Routes
   ========================================================================== */

/* GET Routes
   ========================================================================== */

// displays ALL campgrounds
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));
// displays create NEW campground form
router.get('/new', isLoggedIn, (req, res) => {
 res.render('campgrounds/new');
});
// displays SHOW specific campground info
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground })
}));
// displays EDIT form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}));

/* POST Routes
  ========================================================================== */

// receive POST from NEW form
router.post('/', validateCampground, isLoggedIn, catchAsync(async (req, res, next) => {
  
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));


/* PUT Routes
  ========================================================================== */
  
// receive PUT from EDIT form
router.put('/:id', validateCampground, isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

/* DELETE Routes
  ========================================================================== */

// receive DELETE from SHOW
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}));

module.exports = router;
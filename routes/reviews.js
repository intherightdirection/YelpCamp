const express = require('express');
const catchAsync = require('../utils/catch-async');
const Campground = require('../models/campground');
const Review = require('../models/review');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isAuthor } = require('../middleware');
/* ==========================================================================
   Review Routes
   ========================================================================== */

/* POST Routes
   ========================================================================== */

// receive POST for Reviews from SHOW view
router.post('/', isLoggedIn, validateReview, catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Created New Review!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

/* DELETE Routes
  ========================================================================== */

// Delete reviews
router.delete('/:reviewId', catchAsync( async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
 }));

 module.exports = router;
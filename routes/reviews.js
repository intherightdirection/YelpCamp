const express = require('express');
const catchAsync = require('../utils/catch-async');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const router = express.Router({ mergeParams: true });
/* ==========================================================================
   Review Routes
   ========================================================================== */

/* POST Routes
   ========================================================================== */

// receive POST for Reviews from SHOW view
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

/* DELETE Routes
  ========================================================================== */

// Delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

 module.exports = router;
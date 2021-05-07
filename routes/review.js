const express = require('express');
const router = express.Router({ mergeParams: true });
const handleAsync = require('../helpers/handleAsync');
const Review = require('../models/review');
const { reviewSchema } = require('../Schema_Joi');
const ExpressError = require('../helpers/ExpressError');
const Campground = require('../models/campground');
const methodOverride = require('method-override');
const { isLoggedIn , validateReview , isReviewAuthor} = require('../helpers/middleware');
const reviews = require('../controllers/review');



router.post('/' , isLoggedIn, validateReview ,handleAsync(reviews.createReviews));

router.delete('/:reviewId' , isLoggedIn, isReviewAuthor ,handleAsync(reviews.deleteReviews))




module.exports = router;
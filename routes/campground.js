const express = require('express');
const router = express.Router();
const handleAsync = require('../helpers/handleAsync');
const Campground = require('../models/campground');
const ExpressError = require('../helpers/ExpressError');
const methodOverride = require('method-override');
const { isLoggedIn , isAuthor , validateCampground} = require('../helpers/middleware');
const ejsLint = require('ejs-lint');
const { findById } = require('../models/campground');
const campgrounds = require('../controllers/campground');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


router.route('/')
    .get(handleAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, handleAsync(campgrounds.createNewCamp));


router.get('/new' , isLoggedIn ,handleAsync(campgrounds.renderNewForm));


router.route('/:id')
    .get(handleAsync(campgrounds.renderShowPage))
    .put(isLoggedIn , isAuthor , upload.array('image') ,validateCampground , handleAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor ,handleAsync(campgrounds.deleteCamp));

router.get('/:id/edit' , isLoggedIn, isAuthor ,handleAsync(campgrounds.renderEditForm));



module.exports = router;
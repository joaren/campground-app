const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer  = require('multer') //shows files in req.body
const { storage } = require('../cloudinary');
const upload = multer({ storage }); //store in cloudinary

const Campground = require('../models/campground'); //from campground.js in the models folder. contains schema


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;
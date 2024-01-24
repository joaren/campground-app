const { campgroundSchema, reviewSchema} = require('./schemas.js'); //joi schemas
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash');
const Campground = require('./models/campground');
const Review = require('./models/reviews.js');

module.exports.isLoggedIn = (req, res, next) => {
    console.log('req,user...', req.user);
    if(!req.isAuthenticated()){ //from passport
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first!'); //need to be logged in before accessing new campgrounds page
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => { //joi as middleware
    const {error} = campgroundSchema.validate(req.body); //passes data thru to the schema
    if(error){
        const msg = error.details.map(el => el.message)
        const result = messages.join(',') //map and join all the error messages
        throw new ExpressError(result, 400) //print the above out
    } else {
        next(); //we all good
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id); //find campground
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!'); //cannot update if not the user 
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview =(req, res, next) => { //server side -- make sure ppl cant bypass the error with POSTMAN and add to app.post
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message)
        const result = messages.join(',') //map and join all the error messages
        throw new ExpressError(result, 400) //print the above out
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params; //reviewId is from /:reviewId
    const review = await Review.findById(reviewId); //find campground
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!'); //cannot update if not the user 
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
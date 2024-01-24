const Campground = require('../models/campground'); //from campground.js in the models folder. contains schema
const {cloudinary} = require("../cloudinary");


//index page
module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({}); //takes time to 'find'
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) => { //isLoggedIn from middleware.js. need to be logged in before accessing new campgrounds page
    res.render('campgrounds/new')
}

//1. create - clicking the add campgrounds button goes here and saves the user input
module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground); //note that var is newCampground, the body is the entire object w user input
    newCampground.images = req.files.map( f => ({url: f.path, filename: f.filename})) //f = foreach
    newCampground.author = req.user._id //associate post to author 
    await newCampground.save(); //takes time to 'save'
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}

//show and find 
module.exports.showCampground = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: { //populate an author in each review
            path: 'author'
        }
    }).populate('author'); //populate the campground w author
    console.log(campground) //takes time to 'find'
    if(!campground) {
        req.flash('error', 'cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}

//2. edit form
module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id); //takes time to 'find'
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground})
}

//2. upd8 -- button goes to here to save users input. 
module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); //takes time to 'find'
    const imgs = req.files.map( f => ({url: f.path, filename: f.filename})); //f = foreach
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await  campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params
    const deletedCampground = await Campground.findByIdAndDelete(id); //takes time to 'find'
    //note that var is deletedCampground
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds');
}
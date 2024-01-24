const Joi = require('joi');
module.exports.campgroundSchema = Joi.object({ //joi schema, for server-side validations
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})



// You will use the below syntax
// module.exports = x

// in such files, from where you are just exporting a single thing, like in asyncWrapper and expressError file.
// So, while importing such files, the syntax is going to be like
// const ExpressError = require('./utils/ExpressError');

// Now, coming to the second syntax
// module.exports.campgroundSchema = campgroundSchema; ********
// You will use this syntax, when you want to export multiple things from a file, like in this file we will export campgroundSchema and reviewScheme (at a later point).

// So, while importing it you will have to use
// const { campgroundSchema } = require('./schemas.js'); ******

// In case if you went for the below syntax
// module.exports = campgroundSchema; *******
// then the import line should be
// const campgroundSchema = require('./schemas.js'); ****
// but that means that you are just going to export a **single thing** from that file.
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [ //array bc one-to-many relationship (reviews are in an array)
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema) //need to export for it to be used in other docs
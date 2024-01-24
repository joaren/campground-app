//separate from app.js, starter data that we can add to or delete from

const mongoose = require('mongoose');
const cities = require('./cities'); //starter data, make sure 'required' things have the exported code
const { places, descriptors } = require('./seedHelpers') //
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true }) //use yelpcamp in mongosh
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CXN ERROR!!!!")
        console.log(err)
    });

const sample = array => array[Math.floor(Math.random() * array.length)]; //pick random element from an array

const seedDB = async() => {
    await Campground.deleteMany({}); //delete user inputted data and revert to the starter code after exiting out of site
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({ //'new': create new object
            author: '6564f5242275d6eb77f23574',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            //'cities' is from importing -- we call call it to extract the contents 
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'lorem ipsum dolor',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dnzao3oac/image/upload/v1701290348/YelpCamp/f0jv5ekkjkd27dkoxa8w.jpg',
                  filename: 'YelpCamp/f0jv5ekkjkd27dkoxa8w',
                },
                {
                    url: 'https://res.cloudinary.com/dnzao3oac/image/upload/v1701290351/YelpCamp/q0ggwidvtxstakpcjg1r.jpg',
                    filename: 'YelpCamp/q0ggwidvtxstakpcjg1r',
                }
            ]
        });     
        await camp.save();
    }
}
    

seedDB().then(() => { //if seedDB runs successfully and the starter data is there, close out the connection to allow app.js to run
    mongoose.connection.close(); //prevents conflicting databases
})
    
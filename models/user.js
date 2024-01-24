const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose); //adds username and pass, no need to add it in to the model ourselves

module.exports = mongoose.model('User', UserSchema);
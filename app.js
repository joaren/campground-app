if (process.env.NODE_ENV !== "production") { //if were running in development mode (normal), require the below package
    require('dotenv').config();
}

console.log(process.env.SECRET) //so ppl know theres a .env 
console.log(process.env.API_KEY)


const express = require('express'); //npm i express
const path = require('path'); //views directory, associated with ejs
const mongoose = require('mongoose'); //npm i mongoose
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./Routes/user');
const campgrounds = require('./Routes/campgrounds');
const reviews = require('./Routes/reviews');

const methodOverride = require('method-override') //upd8 part of crud, need to npm install method-override


mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true }) 
//yelpcamp: name of db we're gonna use (in mongosh : 'use yelpcamp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!") //confirms mongo is working
    })
    .catch(err => {
        console.log("OH NO MONGO CXN ERROR!!!!")
        console.log(err)
    })


const app = express(); //express

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views')); //ejs, connects with path
app.set('view engine', 'ejs') //ejs

app.use(express.urlencoded({extended: true})) //express
app.use(methodOverride('_method')) //method override
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //serialize: storing a user in a session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { //have access to currentUser, success, error,,
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser')

app.use('/', userRoutes);
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req,res) => { //home page
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404)) //use this in app.use
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err; //err is ExpressError
    if(!err.message) err.message = 'oh no, something went wrong'
    res.status(statusCode).render('error', {err}) //outputs message and code - need this or else the code above it wont be able to output
})

app.listen(3000, () => { 
    console.log("app is listening on port 3000!") //confirms node is working
})

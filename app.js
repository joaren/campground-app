if (process.env.NODE_ENV !== "production") { 
    require('dotenv').config();
}

console.log(process.env.SECRET) 
console.log(process.env.API_KEY)


const express = require('express'); 
const path = require('path'); 
const mongoose = require('mongoose'); 
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

const methodOverride = require('method-override') 

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true }) 
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!") 
    })
    .catch(err => {
        console.log("OH NO MONGO CXN ERROR!!!!")
        console.log(err)
    })


const app = express(); 

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs') 

app.use(express.urlencoded({extended: true})) 
app.use(methodOverride('_method')) 
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    //secret: ' ',
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

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser')

app.use('/', userRoutes);
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req,res) => { 
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404)) 
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err; 
    if(!err.message) err.message = 'oh no, something went wrong'
    res.status(statusCode).render('error', {err}) 
})

app.listen(3000, () => { 
    console.log("app is listening on port 3000!") 
})

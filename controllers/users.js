const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password); //store and make salts and hashs. This .register() method is provided by the passport-local-mongoose module that we use to implement authentication in our app. 
        req.login(registeredUser, err => { //users will stay logged in after registering
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch(e){ //flash error msg on top rather than on next page, from passport
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => { //if correct user/pw, show code below
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; //redirect to prev page or home 
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}


//req.body is this: {"username":"sdfgsdfgds","email":"sdfgsdfgdsfg@asdfadsf","password":"asdfasdfasdf"}
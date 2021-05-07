const User = require('../models/user');


module.exports.renderSignupForm = (req , res) => {
    res.render('users/register');
}

module.exports.SignUp = async (req , res) => {
    try{
    const { username , email , password } = req.body;
    const user = new User({email , username});
    const registerUser = await User.register(user , password);
    req.login(registerUser, (err) => {
        if(err) {
            return next(err)
        } else {
            req.flash( 'success', 'Welcome To Yelp Camp!!');
            res.redirect('/campgrounds')
        }
    })

    }catch (e) {
        req.flash('error' , e.message);
        res.redirect('/register');
    }

}

module.exports.renderSigninForm = (req , res) => {
    res.render('users/login');
}

module.exports.login = (req , res) => {
    const { username } = req.body;
    req.flash('success',`Welcome Back ${username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req , res) => {
    req.logout();
    req.flash('success' , 'You Logged Out');
    res.redirect('/campgrounds');
}


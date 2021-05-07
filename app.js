if(process.env.NODE_ENV !== "production") {
    require('dotenv').config(); 
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./helpers/ExpressError');
const handleAsync = require('./helpers/handleAsync');
const { db } = require('./models/campground');
const { validateCampground, validateReview } = require('./helpers/middleware')
// const validateCampground = require('./helpers/validateCampground');
// const validateReview = require('./helpers/validateReview');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');

mongoose.connect('mongodb://localhost:27017/camp',
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
db.on("error" , console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("Database Connected");
});



app.engine('ejs' , ejsMate);
app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));


const sessionConfig = {
    secret: 'mostafafayyad1',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req , res , next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds' , campgroundRoutes);
app.use('/campgrounds/:id/reviews' , reviewRoutes);
app.use('/' , userRoutes);

/*---------------access to public in any file-------------------*/

app.use(express.static(path.join(__dirname , 'public')));//

/*-----------------------------X-------------------------------------*/




app.get('/' , (req , res , next ) => {
    res.render('home');
});


































// app.all('*' , (req , res , next) => {
//     next(new ExpressError('Page Not Found, 404 ' , 404))
// })

app.use( (err , req , res , next) => {
    const {statusCode=500 , message = 'Somthing Went Wrong :( '} = err;
    if(!err.message) err.message = 'Oh NO, Somthing Went Wrong :('
    res.status(statusCode).render('error' , { err });
})


app.listen(3005 , () => {
    console.log("Server Active :) ");
});
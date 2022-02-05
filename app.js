const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const session = require('express-session');

const path = require('path');
const ExpressError = require('./utils/express-error');

const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


/* ==========================================================================
   Mongoose Connection
   ========================================================================== */
mongoose.connect('mongodb://localhost:27017/yelp-camp');
  
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected")
});

/* ==========================================================================
   Express
   ========================================================================== */
const app = express();

/* Engine
   ========================================================================== */

app.engine('ejs', ejsMate);

/* Set
   ========================================================================== */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/* Use
   ========================================================================== */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Express session
const sessionConfig = {
   secret: 'thisshouldbeabettersecret!',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// displays homepage
app.get('/', (req, res) => {
  res.render('home');
});

/* Error Handling
   ========================================================================== */

app.all('*', (req, res, next) => {
   next(new ExpressError('Page Not Found', 404));

});

app.use((err, req, res, next) => {
   const { statusCode = 500} = err;
   if (!err.message) err.message = 'Oh No, Something Went Wrong!';
   res.status(statusCode).render('error', { err });
});

/* Listen On Port
   ========================================================================== */
app.listen(3000, () => console.log('APP IS LISTENING ON PORT 3000'));
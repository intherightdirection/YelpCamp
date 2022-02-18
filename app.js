if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const path = require('path');

const ExpressError = require('./utils/express-error');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/yelp-camp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

/* ==========================================================================
   Mongoose Connection
   ========================================================================== */
// mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl);
  
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
const store = MongoStore.create({
   mongoUrl: dbUrl,   
   touchAfter: 24* 60 * 60,
   crypto: {
      secret
   }
});

store.on('error', function (e) {
   console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
   store,
   name: 'session',
   secret,
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
// app.use(helmet());
// Helmet SecPol URLs
const scriptSrcUrls = [
   "https://stackpath.bootstrapcdn.com/",
   "https://api.tiles.mapbox.com/",
   "https://api.mapbox.com/",
   "https://kit.fontawesome.com/",
   "https://cdnjs.cloudflare.com/",
   "https://cdn.jsdelivr.net"
];

const styleSrcUrls = [
   "https://kit-free.fontawesome.com/",
   "https://cdn.jsdelivr.net",
   "https://api.mapbox.com/",
   "https://api.tiles.mapbox.com/",
   "https://fonts.googleapis.com/",   
   "https://use.fontawesome.com/"
];

const connectSrcUrls = [
   "https://api.mapbox.com/",
   "https://a.tiles.mapbox.com/",
   "https://b.tiles.mapbox.com/",
   "https://events.mapbox.com/"
];

const fontSrcUrls = [];

app.use(
   helmet.contentSecurityPolicy({
       directives: {
           defaultSrc: [],
           connectSrc: ["'self'", ...connectSrcUrls],
           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
           workerSrc: ["'self'", "blob:"],
           objectSrc: ["'self'"],
           imgSrc: [
               "'self'",
               "blob:",
               "data:",
               "https://res.cloudinary.com/dpiarylw7/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!                
               "https://source.unsplash.com/",
               "https://images.unsplash.com/"
           ],
           fontSrc: ["'self'", ...fontSrcUrls],           
       },
   })
);

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
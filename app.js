const express = require('express');
const campgrounds = require('./routes/campgrounds');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const ExpressError = require('./utils/express-error');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');


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

app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

// Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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
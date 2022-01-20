const express = require('express');
const app = express();
const ejsmate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

/* ==========================================================================
   Mongoose
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

/* Engine
   ========================================================================== */

app.engine('ejs', ejsmate);

/* Set
   ========================================================================== */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/* Use
   ========================================================================== */

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

/* GET Routes
   ========================================================================== */

// displays homepage
app.get('/', (req, res) => {
  res.render('home');
});
// displays ALL campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});
// displays create NEW campground form
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
// displays EDIT form
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground })
});
// displays SHOW specific campground info
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground })
});

/* POST Routes
   ========================================================================== */

// receive POST from NEW form
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

/* PUT Routes
   ========================================================================== */

// receive PUT from EDIT form
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
});

/* DELETE Routes
   ========================================================================== */

// receive DELETE from SHOW
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

/* Listen On Port
   ========================================================================== */
app.listen(3000, () => console.log('APP IS LISTENING ON PORT 3000'));
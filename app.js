const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

//////////////////////
// mongoose connection
//////////////////////
mongoose.connect('mongodb://localhost:27017/yelp-camp');
  
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected")
});

/////////////////////
// express routing //
/////////////////////

// --- set --- // 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// --- use --- //
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
// --- GET routes --- //

// display homepage
app.get('/', (req, res) => {
  res.render('home');
});
// display ALL campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});
// display create NEW campground form
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});
// display EDIT form
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground })
});
// display SHOW specific campground info
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground })
});

// --- POST routes --- //

// receive POST from NEW form
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// --- PUT routes --- //

// receive PUT from EDIT form
app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
});

// --- DELETE routes --- //

// receive DELETE from SHOW
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

// --- listen --- //
app.listen(3000, () => console.log('APP IS LISTENING ON PORT 3000'));
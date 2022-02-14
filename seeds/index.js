const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
  
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected")
});

const randId = Math.floor(Math.random() * 10000);

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;    
    const camp = new Campground({
      author: '61ff188510cac9b6bac55e39',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Amet pariatur enim occaecat minim laborum. Nulla adipisicing sit laboris magna culpa nostrud consequat. Dolore ad culpa ut mollit irure cupidatat qui dolor duis aliquip amet voluptate. Enim cupidatat velit amet aliqua excepteur pariatur excepteur. Ut Lorem nostrud nostrud reprehenderit et minim occaecat do dolore id fugiat ut. Ut est laborum aute ex incididunt ullamco ad eiusmod. Non veniam tempor dolor laboris tempor.',
      price,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202]
      },
      images: [{
        url: 'https://source.unsplash.com/collection/483251',
        filename: undefined
      }]
    });
    await camp.save();
  }
}

seedDB().then( () => {
  mongoose.connection.close();
});
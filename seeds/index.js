const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places , descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/camp',
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error"));
db.once("open" , () => {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 1 ; i <= 100 ; i++){
        const random100 = Math.floor(Math.random() * 50);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6079af9abb12911a96cf4788',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random100].city}, ${cities[random100].state}`,
            description: ' oluptatem, recusandae harum! Aspernatur itaque nobis ex modi numquam autem sed. Minus optio doloremque iure vero!',
            price: price,
            images: [{    
            url: 'https://res.cloudinary.com/al-fayyad/image/upload/v1618863846/YelpCamp/w2ygrepnki3henldpest.jpg',
            filename: 'YelpCamp/w2ygrepnki3henldpest'
        },
        {
            url: 'https://res.cloudinary.com/al-fayyad/image/upload/v1618863846/YelpCamp/nlm9xmqstbqneujumrq3.jpg',
            filename: 'YelpCamp/nlm9xmqstbqneujumrq3'
      }]
        })
        
        await camp.save();
    }
}

seedDB()
.then( () => {
    mongoose.connection.close()
})

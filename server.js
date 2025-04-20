const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.connect("mongodb://localhost:27017/user", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (HTML, CSS, JS, images) from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// Booking Schema (Only one definition)
const bookingSchema = new mongoose.Schema({
    slotId: Number,
    bookingTime: String,
    bookedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// API endpoint to handle slot booking
app.post('/api/book-slot', (req, res) => {
    const { slotId, bookingTime } = req.body;
    
    const newBooking = new Booking({ slotId, bookingTime });

    newBooking.save()
        .then(() => res.status(200).json({ message: 'Slot booked successfully' }))
        .catch(err => res.status(500).json({ message: 'Error booking slot', error: err }));
});

// API endpoint to get recent bookings
app.get('/api/recent-bookings', (req, res) => {
    Booking.find().sort({ bookedAt: -1 }) // Sort by most recent
        .then(bookings => res.status(200).json(bookings))
        .catch(err => res.status(500).json({ message: 'Error fetching bookings', error: err }));
});

// ROUTES
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registerform.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loginform.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

app.get('/unbook', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'unbook.html'));
});

app.get('/recent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recent.html'));
});

// Register user
app.post('/register', async (req, res) => {
    const data = new User(req.body);
    const result = await data.save();
    res.send(`User registered successfully <a href="/login">Login</a>`);
});

// Login user
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        res.redirect('/dashboard');
    } else {
        res.send(`Enter correct details <a href='/login'>Login</a>`);
    }
});

// Book Slot (Another method for handling booking, but redundant now with '/api/book-slot')
app.post('/book-slot', async (req, res) => {
    const { date, time, slotNumber, state, city } = req.body;
    const booking = new Booking({ date, time, slotNumber, state, city });
    await booking.save();
    res.json({ message: 'Booking saved successfully!' });
});

// Get Bookings
app.get('/get-bookings', async (req, res) => {
    const bookings = await Booking.find();
    res.json(bookings);
});
app.post('/api/book-slot', (req, res) => {
    const { slotId, bookingTime } = req.body;
  
    const newBooking = new Booking({ slotId, bookingTime });
  
    newBooking.save()
      .then(() => res.status(200).json({ message: 'Slot booked successfully' }))
      .catch(err => res.status(500).json({ message: 'Error booking slot', error: err }));
  });
  
  // API endpoint to fetch recent bookings
  app.get('/api/recent-bookings', (req, res) => {
    Booking.find().sort({ bookedAt: -1 }) // Sort by most recent booking
      .then(bookings => res.status(200).json(bookings))
      .catch(err => res.status(500).json({ message: 'Error fetching bookings', error: err }));
  });

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

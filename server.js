const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/user")
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

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

// Booking Schema
const bookingSchema = new mongoose.Schema({
    slotId: Number,
    bookingTime: String,
    bookedAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// API endpoint to handle slot booking
app.post('/api/book-slot', async (req, res) => {
    const { slotId, bookingTime } = req.body;

    try {
        // Check if slot is already booked for the same bookingTime
        const existingBooking = await Booking.findOne({ slotId: slotId, bookingTime: bookingTime });
        if (existingBooking) {
            return res.status(400).json({ message: 'Slot already booked for the selected date and time' });
        }

        const newBooking = new Booking({ slotId, bookingTime });
        await newBooking.save();
        res.status(200).json({ message: 'Slot booked successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error booking slot', error: err });
    }
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

// Removed redundant '/book-slot' POST endpoint that used inconsistent fields

// Get Bookings
app.get('/get-bookings', async (req, res) => {
    const { date, time } = req.query;
    let filter = {};
    if (date && time) {
        const bookingTime = `${date} ${time}`;
        filter.bookingTime = bookingTime;
    }
    try {
        const bookings = await Booking.find(filter);
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings', error: err });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// app.js
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connection = require("./connect");
const User = require('./models/users');
const path = require('path');
const Country = require("./models/Countries");
const State = require("./models/State");
const City = require("./models/City");

// Database
connection.Connect();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "500mb" }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Fetch data for dropdowns
app.use(async (req, res, next) => {
    let countries = await Country.find({});
    res.locals.countries = countries.map(country => country.name);
    next();
});

app.use(async (req, res, next) => {
    let states = await State.find({});
    res.locals.states = states.map(state => state.name);
    next();
});

app.use(async (req, res, next) => {
    let cities = await City.find({});
    res.locals.cities = cities.map(city => city.name);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Fetch states based on the selected country
app.get('/states/:country', async (req, res) => {
    try {
        const country = await Country.findOne({ name: req.params.country });
        const states = await State.find({ country: country?._id });
        res.json({ states: states.map(state => state.name) });
    } catch (err) {
        console.error('Error fetching states:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch cities based on the selected state
app.get('/cities/:state', async (req, res) => {
    try {
        const state = await State.findOne({ name: req.params.state });
        const cities = await City.find({ state: state?._id });
        res.json({ cities: cities.map(city => city.name) });
    } catch (err) {
        console.error('Error fetching cities:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, dob, country, state, city, gender } = req.body;
        const nameRegex = /^[A-Za-z]+$/;
        // Input validation
        if (!firstName || !lastName || !nameRegex.test(firstName) || !nameRegex.test(lastName) || !email || !dob || !country || !state || !city || !gender || !validateEmail(email)) {
            return res.status(400).send('Invalid input data');
        }

        // Calculate age
        const birthDate = new Date(dob);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();

        // Handle user registration and save to MongoDB
        const newUser = new User({
            firstName, lastName, email, dob, country,
            state,
            city,
            gender, age
        });

        await newUser.save();

        return res.redirect('/users');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error saving user');
    }
});

app.get('/users', async (req, res) => {
    try {
        // Retrieve users from MongoDB and render the 'users' view
        const users = await User.find({});
        return res.render('users', { users });
    } catch (error) {
        return res.redirect('/');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

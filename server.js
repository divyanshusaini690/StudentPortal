const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files like HTML, CSS
app.use(express.static('public'));

// Connect to MongoDB (corrected connection string with encoded password)
mongoose.connect('mongodb+srv://divyanshusaini690:Divyanshu%40123@studentportal.rrxkb.mongodb.net/studentportal?retryWrites=true&w=majority&appName=studentPortal')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define Mongoose User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String
});

// Create Mongoose Model for User
const User = mongoose.model('User', userSchema);

// 1. Registration Route (POST /register)
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('User already exists!');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to MongoDB
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.send('User registered successfully!');
});

// 2. Login Route (POST /login)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user in MongoDB
    const user = await User.findOne({ username });

    // Check if the user exists and credentials match
    if (user && await bcrypt.compare(password, user.password)) {
        // Successful login, serve the homepage
        res.sendFile(__dirname + '/public/home.html'); // Assuming home.html is in 'public' folder
    } else {
        res.status(400).send('Invalid username or password!');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Clear session or token here if using any authentication mechanism
    res.redirect('/'); // Redirects to the login page
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 1818;

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'loginpage')));
app.use(express.static(path.join(__dirname, 'signup')));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Mongodb Connection Successful');
});

// Define the user schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  name: { type: String, required: true },
});

const Users = mongoose.model('Users', userSchema);

// Routes

// Root URL redirects to login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginpage', 'login.html'));
});

// Get the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginpage', 'login.html'));
});

// Post request for login
app.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Find user by email and password
    const user = await Users.findOne({ email, pass });
    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    console.log('User logged in:', user);
    res.send(`Welcome, ${user.name}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

// Get the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup', 'signup.html'));
});

// Post request for signup
app.post('/signup', async (req, res) => {
  try {
    const { email, pass, name } = req.body;

    // Check if the email is already registered
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    // Save new user
    const user = new Users({ email, pass, name });
    await user.save();
    console.log('User registered:', user);
    res.send('Signup successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during signup');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

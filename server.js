const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = 1818;

// Session middleware configuration
app.use(
  session({
    secret: 'nnaammppaallyyhhaarriisshh',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60000,
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'loginpage')));
app.use(express.static(path.join(__dirname, 'signup')));
app.use(express.static(path.join(__dirname, 'home')));
app.use('/Management', express.static(path.join(__dirname, 'Management')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
);

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parser middleware

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Mongodb Connection Successful 😁');
});

// Define the user schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
});

const Users = mongoose.model('Users', userSchema);

// Redirect to home1.html on opening localhost
app.get('/', (req, res) => {
  res.redirect('/home1.html');
});

// Get the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup', 'signup.html'));
});

// Serve home.html
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home', 'home.html'));
});

// Route for sign-out (GET request)
app.get('/signout', (req, res) => {
  console.log('Sign-out request received');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destruction', err);
      return res.status(500).send('Error during sign out');
    }
    console.log('Session destroyed');
    res.redirect('/home1.html');
  });
});

// Route for sign-out (POST request)
app.post('/signout', (req, res) => {
  console.log('Sign-out request received');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destruction', err);
      return res.status(500).send('Error during sign out');
    }
    console.log('Session destroyed');
    res.redirect('/home1.html');
  });
});

// Route for Login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'loginpage', 'login.html'));
});

// Post request for signup
app.post('/signup', async (req, res) => {
  try {
    const { email, pass, name } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).send(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          </head>
          <body>
            <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Registration Failed</h5>
                  </div>
                  <div class="modal-body">
                    <p>Email <strong>${email}</strong> is already registered. Please try with a different email.</p>
                  </div>
                  <div class="modal-footer">
                    <a href="/signup" class="btn btn-primary">Back to Signup</a>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const user = new Users({ email, pass: hashedPassword, name });
    await user.save();
    console.log('User registered:', user);

    res.send(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <body>
          <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Registration Successful</h5>
                </div>
                <div class="modal-body">
                  <p>Your account has been successfully created! You will be redirected to the home page shortly.</p>
                </div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(function() {
              window.location.href = '/home';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body>
          <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Error</h5>
                </div>
                <div class="modal-body">
                  <p>Something went wrong during registration. Please try again later.</p>
                </div>
                <div class="modal-footer">
                  <a href="/signup" class="btn btn-primary">Back to Signup</a>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});
// route for hom1
app.post('/home1', (req, res) => {
  res.sendFile(path.join(__dirname, 'home', 'home1.html'));
});

// Post request for login
app.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).send(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          </head>
          <body>
            <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Login Failed</h5>
                  </div>
                  <div class="modal-body">
                    <p>Invalid credentials. Please try again.</p>
                  </div>
                  <div class="modal-footer">
                    <a href="/login" class="btn btn-primary">Back to Login</a>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(401).send(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          </head>
          <body>
            <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Login Failed</h5>
                  </div>
                  <div class="modal-body">
                    <p>Invalid credentials. Please try again.</p>
                  </div>
                  <div class="modal-footer">
                    <a href="/login" class="btn btn-primary">Back to Login</a>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    }

    console.log('User logged in:', user);

    res.send(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        </head>
        <body>
          <div class="modal fade show" style="display:block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Login Successful</h5>
                </div>
                <div class="modal-body">
                  <p>Welcome, ${user.name}! You will be redirected to the home page shortly.</p>
                </div>
              </div>
            </div>
          </div>
          <script>
            setTimeout(function() {
              window.location.href = '/home';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login');
  }
});

// Route for orders page
app.post('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'Management', 'list.html'));
});

// Route for home page
app.post('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home', 'home.html'));
});
// Start the server
app.listen(port, () => {
  console.log(`Server started on ✅ http://localhost:${port}`);
});

// Serve static files (should come after route declarations)
app.use(express.static(path.join(__dirname, 'home')));
app.use('/Management', express.static(path.join(__dirname, 'Management')));

// Import required packages
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/auth')
const verifyRoute = require('./Routes/verification')
// const {Middleware} = require('./middleware/authMiddleWare')

// Initialize environment variables
dotenv.config();

// Initialize the express app
const app = express();

app.use(cookieParser())


app.use(cors({ 
    origin: 'http://localhost:3000', // Replace with the exact origin of your frontend
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true,
  
}));

app.use(bodyParser.json()); // To parse JSON data from incoming requests


// Set up session middleware

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      secure: process.env.SESSION_SECRET === 'production', // Set to true in production with HTTPS
      sameSite: 'None',
  }
}));

app.use('/auth', authRoutes);
app.use('/verify',verifyRoute)

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



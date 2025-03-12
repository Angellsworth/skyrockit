const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const authController = require('./controllers/auth.js')
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
//passUserToview after session middleware but before homepage
app.use(passUserToView);



app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

//contains all routes to sign up and sign in
app.use('/auth', authController);

//user has to sign in first before they can qualify as signedIn
app.use(isSignedIn)
//isSignIn runs AFTER auth routes

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')

const authController = require('./controllers/auth.js') // ✅ Keep this one
const applicationsController = require('./controllers/applications.js') // ✅ No duplicate

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
// passUserToView middleware must come after session middleware
app.use(passUserToView);

app.get('/', (req, res) => {
  //check if the user is signed in
  if(req.session.user) {
    //rediret signed-in users to their applications index
    res.redirect(`/users/${req.session.user_id}/applications`)
  } else {
    res.render('index.ejs')
  }
});

// Contains all routes for sign-up and sign-in
app.use('/auth', authController);

// User must be signed in before accessing these routes
app.use(isSignedIn);
// isSignedIn runs AFTER auth routes
app.use('/users/:userId/applications', applicationsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
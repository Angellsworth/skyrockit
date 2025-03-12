// controllers/applications.js
const express = require('express')
const router = express.Router()
const User = require('../models/user.js')

//you already at
//GET/users/:userId/applications
router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);


      res.render('applications/index.ejs', {
        applications: currentUser.applications
      });
      //pass the current user's applications to the index page
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

//GET /users/:userId/application/new
router.get('/new', async (req, res) => {
    res.render('applications/new.ejs')
})

router.post('/', async (req,res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    currentUser.applications.push(req.body)//changes the applications list in memory only
    await currentUser.save();//makes the changes permanent in the database
    res.redirect(`/users/${currentUser._id}/applications`)
  }catch(error){
    console.log(error)
    res.redirect('/')
  }
})
module.exports = router;
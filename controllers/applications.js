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

//GET /users/:userId/applications/:applicationId
router.get('/:applicationId', async (req,res) => {
  try {
    //look up the user that is currently logged in
    const currentUser = await User.findById(req.session.user._id)
    //find the subdocument in the currently logged in users applications list
    const application = currentUser.applications.id(req.params.applicationId)
    //render a show template with the subdocument details
    res.render('applications/show.ejs', {
      application//property shorthand syntax - it is convenient when a property and a value name are the same you can put it in once to not be redundant
    })
  } catch (error){
    console.log(error)
    res.redirect('/')
  }
  
  
})

module.exports = router;
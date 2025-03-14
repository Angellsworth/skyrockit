// controllers/applications.js
const express = require('express')
const router = express.Router()
const User = require('../models/user.js');
const session = require('express-session');

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
      application, //property shorthand syntax - it is convenient when a property and a value name are the same you can put it in once to not be redundant
    })
  } catch (error){
    console.log(error)
    res.redirect('/')
  }
})
//DELETE /users/:userId/applications/:applicationsId
router.delete('/:applicationId', async (req,res) => {
  try {
    //look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);

    currentUser.applications.id(req.params.applicationId).deleteOne()//makes change in memory

    await currentUser.save()//saves delete change to database

    res.redirect(`/users/${currentUser._id}/applications`)
    
  } catch(error){
    console.log(error)
    res.redirect('/')
  }
})

//EDIT /user/:userId/applications/:applicationId/edit
router.get('/:applicationId/edit', async (req,res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    const application = currentUser.applications.id(req.params.applicationId)
    res.render('applications/edit.ejs', {
      application
    })
  } catch(error) {
    console.log(error)
    res.redirect('/')
  }
})

//PUT
router.put('/:applicationId', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current application from the id supplied by req.params
    const application = currentUser.applications.id(req.params.applicationId);
    // Use the Mongoose .set() method
    // this method updates the current application to reflect the new form
    // saved in memory
    application.set(req.body);
    // Save the current user to database
    await currentUser.save();
    // Redirect back to the show view of the current application
    res.redirect(
      `/users/${currentUser._id}/applications/${req.params.applicationId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;
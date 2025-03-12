const isSignedIn = (req, res, next) => {
    if (req.session.user) return next()
    //if a user is signed in; call the next middleware function
    res.redirect('/auth/sign-in')
}

module.exports = isSignedIn


//will be added to server.js before all our routes, including homepage, just in case we want to inclue conditional rendering with a user's details.
const passUserToView = (req, res, next) => {
    res.locals.user = req.session.user ? req.session.user : null
    //is a user here? if yes lets track them :otherwise null
    next()
    //anything we need to access in our templates GLOBALLY
    //can be added as a property to res.locals
    //res is short for response
    //generating templates is part of the response
}

module.exports = passUserToView;
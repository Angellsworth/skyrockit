const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
//we require because the application is embedded in the model/user.js

module.exports = router;
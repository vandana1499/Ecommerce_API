const express = require('express')
const router = new express.Router()
const { signup ,signin,signout,requireSignin} = require('../controllers/auth')
const User = require('../models/users')
const {userSignUpValidator}=require('../validator/validator')


router.post("/signup",userSignUpValidator, signup)
router.post('/signin',signin)
router.get('/signout',signout)

module.exports = router
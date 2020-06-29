const express = require('express')
const router = new express.Router()
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')
const {userById,read,update} =require('../controllers/user')
const User = require('../models/users')


router.get("/secret/:userId",requireSignin,isAuth,isAdmin,(req,res)=>{
    res.send({
        user:req.profile
    })
})
router.get('/user/:userId',requireSignin,isAuth,read)
router.patch('/user/:userId',requireSignin,isAuth,update)


router.param("userId",userById)

module.exports = router
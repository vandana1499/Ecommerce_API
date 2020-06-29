const express = require('express')
const router = new express.Router()
const {  requireSignin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')
const {createOrder,readOrder}=require("../controllers/order")

router.post("/order/:userId", requireSignin, isAuth, createOrder)
router.get('/orders/:userId',requireSignin,isAuth,readOrder)

router.param("userId",userById)
module.exports =router
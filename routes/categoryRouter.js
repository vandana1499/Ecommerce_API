const express = require('express')
const router = new express.Router()
const { create,categoryById,read,update,deleteCategory,categoryList} = require('../controllers/category')
const { isAdmin,requireSignin,isAuth} = require('../controllers/auth')
const {userById} =require('../controllers/user')

router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create)
router.get("/category/:categoryId",read)
router.patch("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,update)
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,deleteCategory)
router.get("/categories",categoryList)

router.param("categoryId",categoryById)
router.param("userId",userById)
module.exports = router
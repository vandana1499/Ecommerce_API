const express = require('express')
const router = new express.Router()
const { create, productById, read, deleteProduct, update, productList,listSearch, listRelatedProducts ,productCategories,listBySearch,image} = require('../controllers/product')
const { isAdmin, requireSignin, isAuth } = require('../controllers/auth')
const { userById } = require('../controllers/user')

// const {productValidator}=require('../validator/productValidator')

router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create)
router.get("/product/:productId", read)
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, deleteProduct)
router.patch("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update)
router.get('/products', productList)
router.get("/products/search", listSearch);
router.get('/products/realtedProduct/:productId', listRelatedProducts)
router.get("/ products/categories",productCategories)
router.post("/products/by/search", listBySearch);
router.get('/product/image/:productId',image)

router.param("userId", userById)
router.param("productId", productById)

module.exports = router
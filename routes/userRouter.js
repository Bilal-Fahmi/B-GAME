const express = require('express')
const { addToCart, updateCart, deleteItem } = require('../controller/cart')
const { createOrder, checkCoupon, verifyPayment, } = require('../controller/order')
const { singleproduct } = require('../controller/product-management')
const router = express.Router()
const userController = require('../controller/userController')
const { requireSignin } = require('../middleware/common')





  



// router.get('/category',getallcategory,userController.category)
router.get('/product/:id', singleproduct, userController.productpage)
router.get('/cart', requireSignin, userController.cart)
router.get('/confirmation', requireSignin, userController.confirmation)
router.get('/checkout', requireSignin, userController.checkout)

router.get('/profile', requireSignin, userController.profile)
router.get('/edituser', requireSignin, userController.loadEdituser)
// router.get('/editAddress', requireSignin, userController.editAddress)
router.post('/addAddress', requireSignin, userController.addAddress)
router.post('/userDetails',requireSignin,userController.userDetails)


router.get('/orders', requireSignin, userController.loadOrderhistory)
router.get('/cancelorder/:id', requireSignin, userController.cancelOrder)


router.get('/addToCart/:id', requireSignin, singleproduct, addToCart)
router.post('/cart/update/:id', requireSignin, singleproduct, updateCart)
router.post('/deletecart/:id', requireSignin, deleteItem)

router.post('/newOrder', requireSignin, createOrder)
router.post('/coupon', requireSignin, checkCoupon)

router.post('/verify-payment', requireSignin, verifyPayment)





module.exports = router
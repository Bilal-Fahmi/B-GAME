const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const { getallcategory } = require('../controller/category-management')
const { getallproduct } = require('../controller/product-management')
 
const userController = require('../controller/userController')
const { requireSignin } = require('../middleware/common')









router.get('/', authController.index)
router.get('/userHome',userController.userHome)
router.get('/login',authController.userLogin)
router.get('/signup', authController.userSignup)
router.get('/otp', authController.loaduserOtp)
router.get('/logout', authController.logout)
router.get('/ResendOtp',authController.resendOtp)
router.get('/category',getallcategory,getallproduct,userController.category)
router.get('/forgotpass',authController.forgotpass)



router.post('/creatacc',authController.doSignup)
router.post('/logged' ,authController.loggedIn)
router.post('/otpverification', authController.otpVerification)
router.post('/forgotpassword',authController.forgotpassword)
router.post('/ForgotPassOtp',authController.verifyOtpAndUpdatePassword)

 




module.exports = router



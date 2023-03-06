const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const usermangement = require('../controller/user-management') 
const couponmanagement = require('../controller/coupon-management')
const category = require('../controller/category-management')
const CategoryImage = require('../validator/imageValidation')
const product=require('../controller/product-management')
const ProductImage = require('../validator/imageValidation')
const Banner = require('../validator/imageValidation')

const { getallcategory } = require('../controller/test')
const { requireSignin, adminMiddleware } = require('../middleware/common')


router.get('/dashboard',requireSignin,adminMiddleware, adminController.dashboard)
router.get('/', adminController.adminLogin)
router.get('/adlogout', adminController.adlogout)
router.post('/adlogged', adminController.adloggedIn)


//USER
router.get('/usertable',requireSignin,adminMiddleware,adminController.usertable)
router.post('/unblockUser/:id',requireSignin,adminMiddleware,usermangement.unblockUser)
router.post('/blockUser/:id',requireSignin,adminMiddleware,usermangement.blockUser)

//CATEGORY
router.get('/categorytable',requireSignin,adminMiddleware,adminController.categorymanagement)
router.get('/addCategory',requireSignin,adminMiddleware,adminController.addCategoryForm)
router.get('/editCategory',requireSignin,adminMiddleware,adminController.editCategoryForm)
router.post('/listcategory/:id',requireSignin,adminMiddleware,category.listcategory)
router.post('/unlistcategory/:id',requireSignin,adminMiddleware,category.unlistcategory)
router.post('/addincategory',requireSignin,adminMiddleware,CategoryImage.uploadCategoryImage.single('categoryimage'),category.addcategory)
router.post('/edtincategory',requireSignin,adminMiddleware,category.updatecategory)
// router.post('/deletecategory/:name',requireSignin,adminMiddleware,category.deletecategory)

//PRODUCT
router.get('/productTable',requireSignin,adminMiddleware,adminController.productmanagement)
router.get('/addProduct',getallcategory,adminController.addProductForm)
router.get('/editProduct/:id ',product.singleproduct,adminController.editProductForm)
router.post('/listproduct/:id',product.listproduct)
router.post('/unlistproduct/:id',product.unlistproduct)
router.post('/addinproduct',ProductImage.uploadProductImage.single('productImage'),product.addproduct)
router.post('/edtinproduct',product.updateproduct)
// router.post('/deleteproduct/:id',product.deleteproduct)

//COUPON
router.get('/coupontable',requireSignin,adminMiddleware,adminController.couponmanagement) 
router.get('/addCoupon',requireSignin,adminMiddleware,adminController.addCouponForm) 
router.get('/editCoupon',requireSignin,adminMiddleware,adminController.editCouponForm)
router.post('/listcoupon/:id',requireSignin,adminMiddleware,couponmanagement.listcoupon)
router.post('/unlistcoupon/:id',requireSignin,adminMiddleware,couponmanagement.unlistcoupon)
router.post('/addincoupon',requireSignin,adminMiddleware,couponmanagement.addcoupon)
router.post('/editincoupon',requireSignin,adminMiddleware,couponmanagement.updatecoupon)
// router.post('/deletecoupon/:code',requireSignin,adminMiddleware,couponmanagement.deletecoupon)


//ORDER
router.get('/ordertable',requireSignin,adminMiddleware,adminController.ordermanagement)
router.get('/placebtn/:id',requireSignin,adminMiddleware,adminController.placeOrder)
router.get('/graph',requireSignin,adminMiddleware,adminController.graph)
router.get('/graphTwo',requireSignin,adminMiddleware,adminController.graphtwo)
//BANNER
router.get('/bannertable',requireSignin,adminMiddleware,adminController.bannermanagement)
router.get('/addBannerpage',requireSignin,adminMiddleware,adminController.addBannerPage)
router.post('/addBanner',Banner.uploadBanner.single('banner'),adminController.addBanner)
router.post('/deleteBanner/:id',requireSignin,adminMiddleware,adminController.deletebanner)

router.get('/btn_one',requireSignin,adminMiddleware,adminController.btn_one)
router.get('/btn_two',requireSignin,adminMiddleware,adminController.btn_two)


module.exports = router



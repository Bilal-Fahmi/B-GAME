
const userhelpers = require('../helpers/userhelpers')
const otp = require('../utils/otp')
const Banner = require('../models/bannerSchema');
const Product = require('../models/productSchema');


const errorpage = (req, res) => {
    res.render('404page')
  };

const index = async(req, res) => {
    try {
        console.log('index');
        const banner= await Banner.find({});
        const product = await Product.find({}).limit(5)
        if(!banner||!product){
            return res.redirect('/404')
        }
        res.render('index',{banner:banner,product:product})
        
        
    } catch (error) {
        console.log(error);
    }
}



const userLogin = (req, res) => {
    try {
        console.log(req.cookies);
        if (req.cookies.Authorization) {
            // console.log(req.session.adminId)
            res.redirect('/')
        }
        else {
            let error = req.session.loginError
            req.session.loginError = false
            res.render('auth/login', { loginError: error })
        }
    } catch (error) {
        console.log('page not found');

    }
}

const userSignup = (req, res) => {
    try {
        if (req.session.loggedIn) {
            res.redirect('/userHome')
        } res.render('auth/signup')
    } catch (error) {
        console.log('404 not found', error);
    }
}

const userOtp = (req, res) => {
    try {
        res.render('auth/otp')
    } catch (error) {
        console.log('page not found');
    }
}

const doSignup = (req, res) => {
    console.log(req.body)
    userhelpers.doSignup(req.body, res, (user) => {
        console.log(user);
        req.session.loggedIn = true
        console.log('signup success');

        res.redirect('/otp')
    })
}

const loggedIn = (req, res) => {
    console.log(req.body);
    console.log('jiji');
    userhelpers.doLogin(req, res)
}

const otpVerification = (req, res) => {
    userhelpers.userOtp(req.body.otp, res, (user) => {
        req.session.loggedIn = true
        console.log('data saved');
        res.redirect('/userHome')
    })
}

const logout = (req, res) => {
    res.clearCookie('Authorization')
    //                                                                                                                                                                                                                                                                                                                                                      );
    res.redirect('/')
}

const resendOtp = (req, res) => {
    // otp.sendOtp(res,req=>{
    //     res.render('/otp')
    // })

}




module.exports = {
    index,

    userLogin,
    userSignup,
    userOtp,
    doSignup,
    loggedIn,
    otpVerification,
    logout,
    resendOtp,
    errorpage


}


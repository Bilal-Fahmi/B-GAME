
const otpHelper = require('../utils/otp')
const bcrypt = require('bcrypt')
const userData = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

// // const catchAsync = require('../utils/catchAsync')

let signup

const doSignup = (data, res, callback) => {
    console.log("received");
    const mobileno = data.phone;
    signup = data;
    otpHelper.sendOtp(mobileno);
    callback(true);
}

// const doSignup = (data, res, callback) => {
//     console.log("received");
//     const mobileno = data.phone;
//     signup = data;
//     otpHelper.sendOtp(mobileno);
//     callback(true);
// }


const userOtp = async (otp, res, callback) => {
    console.log(otp);

    let { username, email, phone, password, confirmpassword } = signup;
    await otpHelper.verifyOtp(phone, otp).then(async (verification) => {
        if (verification.status == 'approved') {
            console.log("succcccesssss?");
            password = await bcrypt.hash(password, 10);
            confirmpassword = await bcrypt.hash(password, 10);
            const user = new userData({
                username: username,
                email: email,
                phone: phone,
                password: password,
                confirmpassword: confirmpassword
            })
            user.save().then((doc) => {
                callback(doc);
            })
                .catch((error) =>
                    console.log('error', error))

        }
        else if (verification.status == 'pending') {
            console.log('OTP not matched');
        }
    })

}

const doLogin = async (req, res) => {
    let userlogin = req.body;
    console.log('i amd ');
    let user = await userData.findOne({ $and: [{ email: req.body.email }, { status: 'Unblocked' }] });
    console.log('user signed', user);
    if (user) {
        bcrypt.compare(userlogin.password, user.password).then((status) => {
            if (status == true) {


                console.log('Great success');

                let token = createToken(user)
                res.cookie('Authorization', `Bearer ${token}`)

                res.redirect('/userHome')

            } else {
                console.log('login failed');
                req.session.loggedIn = false;
                req.session.error = 'login failed';
                res.render('auth/login')
            }
        })

    } else {
        console.log('login fail');
        req.session.loggedIn = false;
        req.session.error = 'login failed';
        res.render('auth/login')

    }
}

let createToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            role: user.role,
            active: user.active,
        },
        process.env.JWT_KEY,
        {
            expiresIn: '1d',
        }
    );
    return token;
};

module.exports = { doSignup, userOtp, doLogin, createToken }

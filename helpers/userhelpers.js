
const bcrypt = require('bcrypt')
const userData = require('../models/usermodel')
const jwt = require('jsonwebtoken')




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






module.exports = { doLogin, createToken }












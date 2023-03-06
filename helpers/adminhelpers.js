const User = require("../models/usermodel")
const { createToken } = require("./userhelpers")


const adEmail = process.env.adEmail
const adPassword = process.env.adPassword
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')





const doadLogin = async (req, res) => {


    User.findOne({ email: req.body.email }).exec((error, user) => {
        if (error) {
            res.redirect('/admin')
        }
        if (user) {
            console.log(user);
            if (user.authenticate(req.body.password)) {
                let token = createToken(user)
                res.cookie('Authorization', `Bearer ${token}`)
                console.log('ad success');
                res.redirect('/admin/dashboard')

            }
          
        }
    })

}
    //     else {
    //         req.session.adminloginErr='Invalid username or password'
    //         res.render('admin/login')
    //     }
    // }



module.exports={
    doadLogin
}

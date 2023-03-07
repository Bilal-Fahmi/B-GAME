const User = require("../models/usermodel")
const { createToken } = require("./userhelpers")


const adEmail = process.env.adEmail
const adPassword = process.env.adPassword
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')





const doadLogin = async (req, res) => {
    console.log(req.body,"hhhhjjh")
    // console.log(' jerjsdfj');
    try {
         console.log(req.body,"one") 
         console.log(req.body.email);
    User.findOne({email:req.body.email})
    .exec((error, user) => {
        console.log(error,user);
        if (error) {
            console.log(error);
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
        
    } catch (error) {
        console.log(error);
    }
    finally{
        console.log('jandslo');
    }


  

}
    //     else {
    //         req.session.adminloginErr='Invalid username or password'
    //         res.render('admin/login')
    //     }
    // }



module.exports={
    doadLogin
}

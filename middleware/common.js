const jwt = require('jsonwebtoken')
const User = require('../models/usermodel')

const requireSignin = async(req,res,next)=>{
     if (req.cookies.Authorization){
        const token = req.cookies.Authorization.split(" ")[1]
        const user = jwt.verify(token,process.env.JWT_KEY)
          
        try {
            User.findOne({_id: user.    _id}).exec((err, data)=>{
                if(data){
                    if(data.status == 'Unblocked'){
                        req.user = user
                        next()
                    }else{
                        res.render('banned')
                    }
                }
                if(err){
                    res.redirect('/err')
                }
            })
        } catch (error) {
            res.redirect('/err')
        }

    }
    else { res.redirect('/') }
     }


     const adminMiddleware = async (req, res, next) => {
        // await getImage(req)
        if (req.user.role != 'admin') return res.status(403).redirect('/')
        next();
    }


    module.exports={
        requireSignin,
        adminMiddleware
    }
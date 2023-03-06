const User = require('../models/usermodel')


const isBlocked = async(req,res,next)=>{
    if(req.session.user){
        let userId = req.session.user
        let dbUser = await User.findOne({_id:userId})
        console.log(dbUser.status);
        if(dbUser.status==true){
            res.render('/auth/login',{err:'Your account is blocked'})
        }else{
            next()
        }

    
    }else{
        next() 
    }
}



module.exports={
    isBlocked
}
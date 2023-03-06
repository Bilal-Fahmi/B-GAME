const Category = require("../models/categorySchema");

exports.getallcategory = async(req, res,next) => {
    console.log('adfasdtgert');
    Category.find({}).exec((error, category)=>{
        if (error) {
        res.send('Something went wrong')
    } if(category) {
        console.log(category );
       
        req.categorylist=category
     next( )
    }})
        
    }
  
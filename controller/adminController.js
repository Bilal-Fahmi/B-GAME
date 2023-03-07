
const adminhelpers = require('../helpers/adminhelpers') 
const User = require('../models/usermodel')
const Coupon = require('../models/couponSchema')
const Category = require('../models/categorySchema')
const Product = require('../models/productSchema')
const Order = require('../models/orderSchema')
const Banner = require('../models/bannerSchema')
const jwt = require('jsonwebtoken')
const ExcelJS = require('exceljs')




 
const dashboard = (req ,res)=>
{
    console.log('dashboard');
    res.render('admin/dashboard')
}



const adminLogin = (req, res) => {
    try {
        console.log(req.cookies);
        if (req.cookies.Authorization) {
            // console.log(req.session.adminId)
            res.redirect('/admin/dashboard')
        }
        else {
            let error = req.session.loginError
            req.session.loginError = false
            res.render('admin/login', { loginError: error })
        }
    } catch (error) {
        console.log('page not found');

    }
}

const adloggedIn = (req, res) => {
    console.log(req.body,"gggggggggggtttttttggvytfytfyutfytfytfitfit");
    adminhelpers.doadLogin(req,res)
    
}

const adlogout = (req,res) =>
{
    res.clearCookie('Authorization').redirect('/admin')

}

const usertable = (req,res) =>
{
    User.find({})
    .then(data=>res.render('admin/usertable',{users:data}))
    // .then(data=>console.log(data))
    
    .catch(err=>res.status(400).console.log(err))
}

const couponmanagement = (req,res)=>
{
    Coupon.find({})
    .then(data=>res.render('admin/couponmanagement',{coupons:data}))

    .catch(err=>res.status(400).console.log(err))
}

const categorymanagement = (req,res)=>
{
    Category.find({})
    .then(data=>res.render('admin/categorymanagement',{category:data}))
    .catch(err=>res.status(400).console.log(err))
}

const productmanagement = (req,res)=>
{
    Product.find({})
    .then(data=>res.render('admin/productmanagement',{product:data}))

    .catch(err=>res.status(400).console.log(err))
}


const addCouponForm = (req,res) =>
{
    res.render('admin/addCoupon-Form')
}

const addCategoryForm = (req,res) =>
{
    res.render('admin/addCategory-Form')
}

const addProductForm = (req,res) =>
{
    console.log(req.categorylist);
    console.log('jiijh');
    res.render('admin/addProduct-Form',{categorylist:req.categorylist})
}

const editCouponForm = (req,res) =>
{
    res.render('admin/editCoupon-Form')
}

const editCategoryForm = (req,res) =>
{
    res.render('admin/editCategory-Form')
}

const editProductForm = (req,res) =>
{
    console.log(req.product);
    res.render('admin/editProduct-Form',{product:req.product})
}


const ordermanagement =(req,res)=>
{
    try {
        Order.find({}).populate({
            path:'products.product',
            model:'Product'
        })
       
        .then(data=>res.render('admin/ordermanagement',{order:data}))
        .catch(error=>res.send(error))

    } catch (error) {
        console.log(error);
    }
}

const bannermanagement = (req,res)=>
{
    try {
        Banner.find({})
        .then(data=>res.render('admin/bannermanagement',{banner:data}))
        .catch(error=>res.send(error))
    } catch (error) {
        console.log(error);
    }
}

const addBannerPage = (req,res) =>
{
    try {
        res.render('admin/addBanner')
    } catch (error) {
        console.log(error);
    }
}

const addBanner = (req,res)=>
{
    try {
        console.log(req.body);
        const newBanner = new Banner({
            bannerName:req.body.bannerName,
            description:req.body.description,
            action:req.body.action,
            image:req.file.filename,

        })
        newBanner.save((error)=>{
            if(error){
            res.send(error)
            }
            else{
                res.redirect('/admin/bannertable')
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const deletebanner = async(req,res)=> 
{
    try {
        const id = req.params.id
        await Banner.deleteOne({_id:id})
        .then(()=>{
            res.redirect('/admin/bannertable')
            console.log('Banner deleted');
        })
        
    } catch (error) {
        console.log(error);
    }
}

const placeOrder = async(req,res)=>
{
    try {
        const id=req.params.id
       const order = await Order.updateOne({_id:id},{$set:{status:'Placed'}},{new:true})
       console.log(order);
        res.json({message:'placed'})
    } catch (error) {
        res.json({error})
      
    }
}

const graph= async(req,res)=>{
    try {
        
        const data = await Order.aggregate([
            {$match:{status:'Placed'}},
            {$group:{
                _id:{
                    $dateToString:{
                        format:'%Y-%m-%d',
                        date:"$orderdate"
                    }
                },
                total_bill:{$sum:"$billamount"}

            }} 
        ])
       
        res.json({data})
       
    } catch (error) {
       console.log(error); 
       res.json(error)
    }
}
const graphtwo = async(req,res)=>{
    try {
        const x = await User.find({status:'Blocked'},)
        const y = await User.find({status:'Unblocked'})
        blockedcount = x.length;
        udblockedcount = y.length;
        
        res.json({blockedcount,udblockedcount})
    } catch (error) {
     res.json(error)   
    }
}

const btn_one= async(req,res)=>{
    try {
        
        const data = await Order.aggregate([
            {$match:{status:'Placed'}},
            {$group:{
                _id:{
                    $dateToString:{
                        format:'%Y-%m-%d',
                        date:"$orderdate"
                    }
                },
                total_bill:{$sum:"$billamount"}

            }} 
        ])
       

    // Generate Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Order Data');
    sheet.addRow(['Date', 'Total Bill']);
    data.forEach(item => {
      sheet.addRow([item._id, item.total_bill]);
    });
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=order_data.xlsx'
    );
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
       
    } catch (error) {
       console.log(error); 
       res.json(error)
    }
}

const btn_two = async(req,res) =>{
    try {
        const x = await User.find({status:'Blocked'},);
        const y = await User.find({status:'Unblocked'});
        blockedcount = x.length;
        udblockedcount = y.length;
    
        // create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Status Counts');
    
        // add headers to the worksheet
        worksheet.columns = [
          { header: 'Status', key: 'status', width: 20 },
          { header: 'Count', key: 'count', width: 10 }
        ];
    
        // add data to the worksheet
        worksheet.addRow({ status: 'Blocked', count: blockedcount });
        worksheet.addRow({ status: 'Unblocked', count: udblockedcount });
    
        // save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        res.set('Content-Disposition', 'attachment; filename=user_status_counts.xlsx');
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    catch(error){
        console.log(error);
    }
    
}





module.exports={
   dashboard,
   adminLogin,
   adloggedIn,
   adlogout,
   usertable,
   
   couponmanagement,
   addCouponForm,
   editCouponForm,

   categorymanagement,
   addCategoryForm,
   editCategoryForm,

  productmanagement,
  addProductForm,
  editProductForm,
   
    ordermanagement,
    placeOrder,

    bannermanagement,
    addBanner,
    deletebanner,
    addBannerPage,
    graph,
    graphtwo,
    
    btn_one,
    btn_two
   
  
   


}
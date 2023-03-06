const path = require('path');
const multer = require('multer');
const fs = require('fs');

const profileDestination = path.join(__dirname, '../public/uploads/profiles');
const categoryDestination = path.join(__dirname, '../public/uploads/product');
const bannerDestination = path.join(__dirname,'../public/uploads/banner')
let productDestination = path.join(__dirname, '../public/uploads/product');

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDestination);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${file.originalname}`);
  },
});

const categoryImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryDestination);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const name = req.body.name.replace(/ /g, "-")
    cb(null, `${name}-${file.originalname}`);
  },
});

const bannerStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
    console.log(req.body);
    cb(null,bannerDestination);
  },
  filename:(req,file,cb)=>{
    const name = req.body.bannerName.replace(/ /g, "-")
    cb(null,`${name}-${file.originalname}`)
  }
})

const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => { 
    console.log(req.body); 
    const productPath = path.join(productDestination, req.body.category);
    console.log(productPath);
    cb(null, productPath);
    
  },
  filename: (req, file, cb) => {
    const name = req.body.name.replace(/ /g, "-");
    const fileName = `${name}-${file.originalname}`;
    cb(null, fileName);
  },
});

const poductImageUpadate = multer.diskStorage({
  destination: (req, file, cb)=>{
    const productPath = path.join(productDestination, req.body.category);
    cb(null, productPath);
  },
  filename: (req, file, cb)=>{
    console.log(req.body);
    console.log(file.originalname);
  }
})










const uploadProfileImage = multer({ storage: profileImageStorage });
const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadProductImage = multer({ storage: productImageStorage });
const uploadBanner = multer({storage:bannerStorage});

module.exports = {
  uploadProfileImage,
  uploadCategoryImage,
  uploadProductImage,
  uploadBanner
};
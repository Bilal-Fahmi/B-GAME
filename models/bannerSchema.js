const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    image: {
        type: [String],
        required:true
    },
    action:{
        type:String,
        default:'#',
        trim:true
    },
  
})

module.exports = BannerModel = mongoose.model('BannerData',bannerSchema)
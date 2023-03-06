const fs = require('fs')
const path = require('path')
const Category = require('../models/categorySchema')

const categoryCheck = async (name) => {
    try {
        const coupon = await Category.findOne({ name })
        return coupon ? true : false
    } catch (error) {
        console.error(error)
    }
}



const addcategory = (req, res) => {
    console.log(req.file);
    const newCategory = new Category({
        name: req.body.name,
        description: req.body.description,

        categoryimage: req.file.filename

    })
    newCategory.save((error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        if (data) {
            // let try = requie()
            console.log(data,"ghvjfvyfdatafkedddd");
            let folderPath = path.join(__dirname, `../public/uploads/product/${data.name}`)

            fs.mkdir(folderPath, { recursive: true }, (err) => {
                console.log(err);
            })

            res.redirect('/admin/categorytable')
        }
    })

}



const getallcategory = async (req, res, next) => {
    Category.find({}).exec((error, categorylist) => {
        if (categorylist) { 
            // console.log(categorylist);
            req.categorylist = categorylist 
            next()}
        
        if (error) {
            console.log(error);
        }
    })
}



const singlecategory = (req, res) => {
    Category.findOne({ coupon_id }, (error, product) => {
        if (error) {
            res.send('Something went wrong')
        } else {
            res.send(product)
        }
    })
}

const updatecategory = (req, res) => {
    Category.findOneandUpdate({ name }, { description }, { categoryimage }, (error) => {
        if (error) {
            res.send('Something went wrong')
        } else {
            res.send('Category updated successfully')
        }
    })
}

const listcategory = async (req, res) => {
    try {
        const id = req.params.id
        await Category.findOneAndUpdate({ _id: id }, { $set: { status: 'Listed' } })
            .then(() => {
                res.redirect('/admin/categorytable')
            })
    } catch (err) {
        next(err)
    }
}

const unlistcategory = async (req, res) => {

    const id = req.params.id
    await Category.findOneAndUpdate({ _id: id }, { $set: { status: 'Unlisted' } })
        .then(() => {
            res.redirect('/admin/categorytable')
        })
        .catch(err => {
            next(err)
        })
}


const deletecategory = async (req, res) => {

    const name = req.params.name
    await Category.deleteOne({ name: name })
        .then(() => {
            res.redirect('/admin/categorytable')
            console.log('category deleted');
        })
        .catch(err => {
            next(err)
        })
}


module.exports = {
    categoryCheck,
    addcategory,

    singlecategory,
    updatecategory,
    deletecategory,
    listcategory,
    unlistcategory,

    getallcategory

}
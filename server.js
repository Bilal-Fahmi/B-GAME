if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const expressSession = require('express-session')
const authRouter = require('./routes/authRouter')
const adminRouter = require('./routes/adminRouter')
const userRouter = require('./routes/userRouter')
const database = require('./config/connnection')
const nocache = require('nocache')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')


app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(nocache())
app.use(cookieParser())
//where our  public will be
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(expressSession({
    secret:"Key",
    cookie:{maxAge:590000},
    resave:false,
    saveUninitialized:true
  }))
//Routes
app.use('/', authRouter)
app.use('/admin', adminRouter)
app.use('/user',userRouter)

database.db.on('error', error => console.error(error))
database.db.once('open', () => console.log('Connected to mongoose'))




app.listen(process.env.PORT || 3000)


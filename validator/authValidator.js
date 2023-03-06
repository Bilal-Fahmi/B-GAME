const { check, validationResult } = require('express-validator')

const validateSignupRequest = [
    check('username')
    .isEmpty()
    .withMessage('Username is requrired'),
    check('email')
    .isEmail()
    .withMessage('Email is requrired'),
    check('phone')
    .isNumeric()
    .withMessage('Phone no, is requrired'),
    check('password')
    .isEmpty()
    .withMessage('Password is requrired'),
    check('confirmpassword')
    .isEmpty()
    .withMessage('Confirm password is requrired')
]
const validateLoginRequest = [
    check('email')
    .isEmail()
    .withMessage('Email is requrired'),
    check('password')
    .isEmpty()
    .withMessage('Password is requrired'),

]

const isRequestValidated = (req,res,next) => {
    const errors = validationResult(req)
    if(errors.array().length > 0){ //length > 0 means there is error
        return req.message={error:errors.array()[0].msg}
    }
    next()

}


module.exports = {
    validateSignupRequest, 
    isRequestValidated,
    validateLoginRequest


}
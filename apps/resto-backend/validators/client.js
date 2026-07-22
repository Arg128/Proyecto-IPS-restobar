const { check } = require('express-validator')

exports.clientRegisterValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a String'),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid format'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    check('address')
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a String'),
    check('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isString()
        .withMessage('Phone must be a String'),
    check('dni')
        .notEmpty()
        .withMessage('DNI is required')
        .isString()
        .withMessage('DNI must be a String'),
]

exports.clientSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
]

exports.clientCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a String'),
    check('address')
        .notEmpty()
        .withMessage('Address is required')
        .isString()
        .withMessage('Address must be a String'),
    check('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isString()
        .withMessage('Phone must be a String'),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid format'),
    check('dni')
        .notEmpty()
        .withMessage('DNI is required')
        .isString()
        .withMessage('DNI must be a String'),
]

require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

//  Middleware to verify the jwt token
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer', '');
//     if (!token) return res.status(401).send('Access Denied');

//     try {
//         const verified = jwt.verify(token, process.env.TOKEN_SECRET);
//         req.user = verified;
//         next()
//     } catch (err) {
//         res.status(400).send('Invalid Token');
//     }
// }

// const verifyToken = passport.authenticate('jwt', { session: false });

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
        req.user = decoded;
        console.log("Decoded User: ", decoded)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Access Denied. Invalid token.' });
    }
};

const checkAdmin = (req, res, next) => {

    if (!req.user || !req.user.is_admin) {
        return res.status(403).send('Admin access required');
    }
    next();
};



// Middleware to check if the user is the account owner or an admin
const checkAdminOrSelf = (req, res, next) => {
    if (!req.user.is_admin && req.user.id !== req.params.id) {
        return res.status(403).send('Access denied');
    }
    next();
}


module.exports = { verifyToken, checkAdmin, checkAdminOrSelf }
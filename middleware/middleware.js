const express = require('express');
const jwt = require('jsonwebtoken');

//  Middleware to verify the jwt token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next()
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}

//  Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (!req.user.is_admin) {
        return res.status(403).send('Admin access required');
        next();
    }
}

module.exports = { verifyToken, checkAdmin }
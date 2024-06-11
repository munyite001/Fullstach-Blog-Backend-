require('dotenv').config()

const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.users_list = asyncHandler(async (req, res, next) => {
    const users = await User.find({}).exec()
    res.json(users)
})

exports.user_detail = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
})


//  Registering a new user
exports.user_registration = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    //  Check if the user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400).json({message: 'User already exists'})
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create a new user
    const user = new User({
        username,
        email,
        password: hashedPassword
    })

    //  Save the user to the database
    await user.save()
    res.status(201).json({message: 'User created sucessfully'})
})

//  User Login
exports.user_login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    //  Check if the user exists
    const user = await User.findOne({ username });

    if (!user) {
        res.status(400).json({message: 'Invalid credentials'})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(400).json({message: 'Invalid credentials'})
    }

    const token = jwt.sign({id: user._id, is_admin: user.is_admin}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.json({
        token    
    })
})

//  User Logout
exports.user_logout = asyncHandler((req, res, next) => {
    // For stateless JWT, logout typically means deleting the token on the client side
    res.json({ message: 'User logged out successfully' });
});


// User Update
exports.user_update = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    // Find the user by ID
    const user = await User.findById(req.params.id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    // Save the updated user
    await user.save();
    res.json({ message: 'User updated successfully' });
});

//  User Delete
exports.user_delete = asyncHandler(async (req, res, next) => {
    // Find the user by ID and delete
    await User.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'User deleted successfully' });
});


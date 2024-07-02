const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { verifyToken, checkAdmin, checkAdminOrSelf } = require('../middleware/middleware')

// Require controller modules.
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const userController = require('../controllers/userController')


/// POST ROUTES ///

// GET request for list of all posts.
router.get('/posts', verifyToken, checkAdmin, postController.all_posts)

// GET request for list of all published posts.
router.get('/posts/published', postController.all_posts_published)

// GET request for one post.
router.get('/posts/:id', postController.post_detail)

//  POST request to create a post.
router.post('/posts', verifyToken, checkAdmin, postController.post_create)

//  PUT request to update a post.
router.put('/posts/:id', verifyToken, checkAdmin, postController.post_update)

//  DELETE request to delete a post.
router.delete('/posts/:id', verifyToken, checkAdmin, postController.post_delete)

//  POST request to create a comment.
router.post('/posts/:id/comment', verifyToken, postController.add_comment)

//  Fetch stats about the database
router.get('/stats', verifyToken, checkAdmin, postController.get_stats)

//  Fetch all tags
router.get('/tags', verifyToken, checkAdmin, postController.get_tags)


/// COMMENT ROUTES ///

//  PUT request to update a comment.
router.put('/posts/:postId/comment/:commentId', verifyToken, commentController.update_comment)

//  DELETE request to delete a comment.
router.delete('/posts/:postId/comment/:commentId', verifyToken, commentController.delete_comment)

//  Fetch all Comments
router.get("/comments", verifyToken, checkAdmin, commentController.get_all_comments)


/// USER ROUTES ///

//  GET request for list of all users.
router.get('/users', verifyToken, checkAdmin, userController.users_list)

//  GET request for one user.
router.get('/users/:id', verifyToken, userController.user_detail)


//  POST request to register a new user.
router.post('/users/register', userController.user_registration)

//  POST request to login a user.
router.post('/users/login', userController.user_login)

//  POST request for admin login
router.post('/admin/login', userController.admin_login)

// PUT request to update a user.
router.put('/users/:id', verifyToken, checkAdminOrSelf, userController.user_update)

//  DELETE request to delete a user.
router.delete('/users/:id', verifyToken, checkAdminOrSelf, userController.user_delete)


module.exports = router
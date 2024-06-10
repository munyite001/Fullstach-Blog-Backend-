const express = require('express')
const router = express.Router()

const { verifyToken, checkAdmin } = require('../middleware/middleware')

// Require controller modules.
const postController = require('../controllers/postController')
const commentController = require('../controllers/commentController')
const userController = require('../controllers/userController')


/// POST ROUTES ///

// GET request for list of all posts.
router.get('/posts', checkAdmin, verifyToken, postController.all_posts)

// GET request for list of all published posts.
router.get('/posts/published', postController.all_posts_published)

// GET request for one post.
router.get('/posts/:id', postController.post_detail)

//  POST request to create a post.
router.post('/posts', checkAdmin, verifyToken, postController.post_create)

//  PUT request to update a post.
router.put('/posts/:id', checkAdmin, verifyToken, postController.post_update)

//  DELETE request to delete a post.
router.delete('/posts/:id', checkAdmin, verifyToken, postController.post_delete)

//  POST request to create a comment.
router.post('/posts/:id/comment', verifyToken, commentController.comment_create)

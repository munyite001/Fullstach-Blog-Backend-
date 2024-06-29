const asyncHandler = require('express-async-handler');
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')

//  Middleware
const { verifyToken, checkAdmin } = require('../middleware/middleware')

/// POST ROUTES ///


//  Get all posts //
exports.all_posts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find({}).populate('comments').exec()
    res.json(allPosts)
})

//  Geta only published posts //
exports.all_posts_published = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find({published: true}).populate('comments').exec()
    res.json(allPosts)
})
//  Get one post //
exports.post_detail = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('comments').exec()

    if (!post) {
        res.status(404).json({message: 'Post not found' });
    }

    res.json(post)
})
//  Create a post //
exports.post_create = asyncHandler(async (req, res, next) => {
    console.log('Received request to create post:', req.body);
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        banner_image: req.body.banner_image,
    })

    try {
        const savedPost = await post.save()
        console.log('Post saved:', savedPost);
        res.status(201).json({message: 'Post created successfully', post: savedPost})
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({message: 'Error creating post', error: error.message})
    }
})

//  Update a post //
exports.post_update = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec()

    if (!post) {
        res.status(404).json({message: 'Post not found' });
    }

    post.title = req.body.title;
    post.content = req.body.content;
    post.tags = req.body.tags;
    post.banner_image = req.body.banner_image;
    post.updated_at = Date.now();

    await post.save()

    res.json({message: 'Post updated successfully'})
})

//  Delete a apost  //
exports.post_delete = asyncHandler(async (req, res, next) => {
    await Post.findByIdAndDelete(req.params.id).exec()

    // if (!post) {
    //     res.status(404).json({message: 'Post not found' });
    // }

    res.json({message: 'Post deleted successfully'})
})

//  Add a comment to a post //
exports.add_comment = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
        res.status(404).json({message: 'Post not found' });
    }

    const comment = new Comment({
        content: req.body.content,
        post: post._id,
        user: req.user._id
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    res.json({message: 'Comment added successfully'});
});


// Stats about the database
exports.get_stats = asyncHandler(async (req, res, next) => {
    try {
        const stats = {
            totalPosts: await Post.countDocuments({}).exec(),
            totalUsers: await User.countDocuments({}).exec(),
            totalComments: await Comment.countDocuments({}).exec()
        };
        
        res.json(stats);
    } catch (error) {
        console.log('Error fetching stats(backend):', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

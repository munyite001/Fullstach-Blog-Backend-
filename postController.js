const asyncHandler = require('express-async-handler');
const Post = require('./models/post')
const User = require('./models/user')
const Comment = require('./models/comment')

//  Middleware
const { verifyToken, checkAdmin } = require('./middleware/middleware')

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
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        banner_image: req.body.banner_image,
    })

    await post.save()
    res.json({message: 'Post created successfully'})
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

    if (!post) {
        res.status(404).json({message: 'Post not found' });
    }

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


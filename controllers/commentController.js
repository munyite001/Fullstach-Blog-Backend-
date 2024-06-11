const asyncHandler = require('express-async-handler')
const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/post')



//  Update comment
exports.update_comment = asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const { postId, commentId } = req.params;

    // Find the post and check if it exists
    const [post, comment] = await Promise.all([
        Post.findById(postId),
        Comment.findById(commentId)
    ]);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }

    // Update the comment
    comment.content = content;
    comment.updated_at = Date.now();

    await post.save();
    await comment.save();

    res.json({ message: 'Comment updated successfully', comment });
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
    const { postId, commentId } = req.params;

    //  Find the post and check if it exists
    const [post, comment] = await Promise.all([
        Post.findById(postId),
        Comment.findById(commentId)
    ]);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }

    //  Check if the user is the author of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    //  Delete the comment
    await Comment.findByIdAndDelete(commentId);
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
})

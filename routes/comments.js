const express = require('express');
const router = express.Router();

const Users = require("../models/User")
const Comment = require("../models/Comment")

const tokenVerify = require("../middlewares/auth");


/*
    '/' - POST
    EndPoint that adds a new comment into the database
    Requires 'content' in the body
    Leaves the 'replies' field empty
*/
router.post('/', tokenVerify, async (req, res) => {
    var comment = req.body;

    if (!comment.content) {
        res.send("Requires content of comment")
    }

    var comment = Comment({
        content: comment.content,
        userId: req.User
    })
    await comment.save();
    res.send("Comment posted Succesfully");
})


/*
    '/reply' - POST
    EndPoint that adds a new comment into the database
    Requires 'content' and 'commentId' in the body
    commentId - refers to the comment for which the reply is for
    Leaves the 'replies' field empty
*/
router.post('/reply', tokenVerify, async (req, res) => {
    console.log("kjn")
    var reply = Comment({
        content: req.body.content,
        userId: req.User
    })
    await reply.save();
    await Comment.updateOne(
        { _id: req.body.commentId },
        {
            $push: {
                replies: reply._id
            }
        }
    )
    res.send("Reply added successfully")
})


/*
    '/:id' - GET
    Fetches the comment and it's replies
    Comment Id in params
*/
router.get('/:id', tokenVerify, async (req, res) => {
    var comment = await Comment.findOne({
        _id: req.params.id
    }).populate('replies');
    res.send("Ksldkvn")
})



/*
    '/:id' - DELETE
    Deletes a comment and it's replies
    Requires Comment Id as part of request in params
*/
router.delete('/:id', tokenVerify, async (req, res) => {
    var comment = await Comment.findById(id = req.params.id);
    comment["replies"].forEach(async (element) => {
        await Comment.deleteOne({ _id: element })
    });
    await Comment.deleteOne({ _id: comment._id })
    res.send("Comment and assoicated replies deleted successfully")
})


module.exports = router
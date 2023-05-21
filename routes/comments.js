const express = require('express');
const router = express.Router();

const Users = require("../models/User")
const Comment = require("../models/Comment")

const tokenVerify = require("../middlewares/auth");



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


router.post('/', tokenVerify, async (req, res) => {
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
})


router.get('/', tokenVerify, (req, res) => {

})


module.exports = router
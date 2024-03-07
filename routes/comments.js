const express = require('express');
const router = express.Router();

const Users = require("../models/User")
const Comment = require("../models/Comment")

const tokenVerify = require("../middlewares/auth");
const Post = require("../models/Post")

const { default: mongoose } = require('mongoose');

/*
    '/' - POST
    EndPoint that adds a new comment into the database
    Requires 'content' in the body
    Leaves the 'replies' field empty
*/
router.post('/', tokenVerify, async (req, res) => {
    if (req.body !== "") {

        // Starting session to avoid data inconsistency
        const session = await mongoose.startSession()
        session.startTransaction()


        try {

            // Creating and Saving new Comment doc with data in body
            var comment = new Comment({
                content: req.body.content,
                userId: req.User,
                postId: req.body.postId,
                datetime: new Date()
            })
            await comment.save();


            // Adding comment Id to "replies" array of main comment
            await Post.findOneAndUpdate(
                { _id: req.body.postId },
                { $push: { comments: comment._id } }
            )

            res.send({ err: "OK" })
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "CommentErr-02" })
        } finally {
            session.endSession()
        }

        ;
    } else {
        res.send({ err: "CommentErr-01" })
    }

})


/*
    '/reply' - POST
    EndPoint that adds a new comment into the database
    Requires 'content' and 'commentId' in the body
    commentId - refers to the comment for which the reply is for
    Leaves the 'replies' field empty
*/
router.post('/reply', tokenVerify, async (req, res) => {
    if (req.body !== "") {

        // Starting Transaction to avoid data inconsistency
        const session = await mongoose.startSession()
        session.startTransaction()
        try {

            // Creating and Saving new doc of Comment with data in body
            var comment = new Comment({
                content: req.body.content,
                userId: req.User,
                replyOf: req.body.replyOf,
                parentId: req.body.parentId,
                datetime: new Date()
            })
            await comment.save();


            // Adding id to "replies" array of main Comment
            await Comment.findOneAndUpdate(
                { _id: req.body.parentId },
                { $push: { replies: comment._id } }
            )

            // Adding id to "replies" array of immediate parent Comment
            await Comment.findOneAndUpdate(
                { _id: req.body.replyOf },
                { $push: { replies: comment._id } }
            )
            res.send({ err: "OK" })
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "CommentErr-03" })
        } finally {
            session.endSession()
        }

        ;
    } else {
        res.send({ err: "CommentErr-01" })
    }
})


/*
    '/:id' - GET
    Fetches the comment and it's replies
    Comment Id in params
*/
router.get('/:id', tokenVerify, async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const commentData = await Comment.findById({ _id: req.params.id }).populate({
            path: "userId",
            select: "_id fname lname profileURL"
        })
        res.send({
            err: "OK",
            data: commentData
        })
    } catch (err) {
        session.abortTransaction()
        console.log(err)
        res.send({ err: "CommentErr-04" })
    }
    session.endSession()
})



/*
    '/:id' - DELETE
    Deletes a comment and it's replies
    Requires Comment Id as part of request in params
*/
router.delete('/:id', tokenVerify, async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        var comment = await Comment.findById(id = req.params.id);
        comment["replies"].forEach(async (element) => {
            await Comment.deleteOne({ _id: element })
        });
        await Comment.deleteOne({ _id: comment._id })
        res.send({ err: "OK" })
    } catch (err) {
        session.abortTransaction()
        console.log(err)
        res.send({ err: "CommentErr-05" })
    }
    session.endSession()

})


module.exports = router
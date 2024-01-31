const mongoose = require("mongoose")

const Comment = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    view: {
        type: Boolean,
        default: false
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    replyOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    datetime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Comment", Comment)

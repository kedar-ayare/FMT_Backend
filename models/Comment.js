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
    }
})

module.exports = mongoose.model("Comment", Comment)

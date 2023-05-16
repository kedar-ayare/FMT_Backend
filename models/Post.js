const mongoose = require("mongoose")

const Post = mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    commets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    datetime: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Post", Post)

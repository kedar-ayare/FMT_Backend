const mongoose = require("mongoose")

const User = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    edu: {
        type: String,
        required: true,
    },
    empStatus: {
        type: String,
        required: true,
    },
    parents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    siblings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    legacy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    pendingReqs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Requests"
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    searched: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ]

})

module.exports = mongoose.model("User", User)

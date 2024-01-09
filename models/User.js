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
    followReqs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FollowReqs"
        }
    ],
    connectReqs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ConnectReqs"
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
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
        }
    ],
    profileURL: {
        type: String,
    },
    accountStat: {
        type: String,
        enum: ["Private", "Public"]
    },
    wife: {
        type: mongoose.Schema.Types.ObjectId,
        default: undefined
    },
    husband: {
        type: mongoose.Schema.Types.ObjectId,
        default: undefined
    }

})

module.exports = mongoose.model("User", User)

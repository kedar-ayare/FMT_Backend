const mongoose = require("mongoose")

const Request = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    relType: {
        type: String,
        enum: ['Father', 'Mother', 'Husband', 'Wife', 'Son', 'Daughter', 'Brother', 'Sister'],
        required: true
    },
    status: {
        type: String,
        enum: ['Accepted', 'Declined', 'Pending'],
        required: true,
        default: "Pending"
    },
    view: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model("Request", Request)

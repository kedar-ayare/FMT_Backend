const mongoose = require("mongoose")

const ConnectReqs = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
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
    },
    timestamp: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model("ConnectReqs", ConnectReqs)

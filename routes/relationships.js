const { request } = require('express');
const express = require('express');

const tokenVerify = require("../middlewares/auth");
const router = express.Router()

const Request = require("../models/Requests")
const User = require("../models/User")

var relations = {
    "Brother": "siblings",
    "Sister": "siblings",
    "Father": "parents",
    "Mother": "parents",
    "Son": "children",
    "Daughter": "children"
}

router.post('/', tokenVerify, async (req, res) => {
    var requestData = req.body;
    console.log(requestData)
    var newReq = Request({
        senderId: req.User,
        receiverId: requestData.receiverId,
        relType: requestData.relType,
        status: "Pending",
        view: false
    })

    await newReq.save();
    await User.updateOne(
        { _id: requestData.receiverId },
        {
            $push: {
                pendingReqs: newReq._id
            }
        }
    );
    res.send("Request sent")
})



router.get('/', tokenVerify, async (req, res) => {
    var user = await User.findById(req.User).populate("pendingReqs");
    var requests = user.pendingReqs;
    res.json(requests);
})

router.get('/:id', (req, res) => {
    res.send("Get a relationship by Id")
})

router.put('/:id', tokenVerify, async (req, res) => {
    var status = req.body.status;
    var reqId = req.params.id;
    await Request.updateOne(
        { _id: reqId },
        { status: status }
    )

    const updateObj = {
        $pull: {
            pendingReqs: reqId
        },
        $push: {}
    };


    updateObj.$push[relations[req.body.relType]] = req.body.senderId;
    if (status == "Accepted") {
        await User.updateOne(
            { _id: req.User },
            updateObj
        );

    }
    res.send("Updated")
})

router.delete('/:id', tokenVerify, async (req, res) => {
    var reqId = req.params.id;
    var requestData = await Request.findById(id = reqId);

    await User.updateOne(
        { _id: requestData.receiverId },
        {
            $pull: {
                pendingReqs: reqId
            }
        }
    )

    await Request.deleteOne({
        _id: reqId,
    })

    res.send("dwlvkn")
})





module.exports = router
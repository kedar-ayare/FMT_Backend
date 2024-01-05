const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User");
const ConnectReq = require("../models/ConnectReq");

const tokenVerify = require("../middlewares/auth");
const { default: mongoose } = require('mongoose');


router.post('/add/:id', tokenVerify, async (req, res) => {
    console.log("relation", req.body.relation)
    console.log("Id:", req.params.id)
    res.send({ err: "dfkjbkdfj" })
});

router.post('/remove/:id', tokenVerify, async (req, res) => {
    res.send({ err: "romove" })
});



router.post('/request/:id', tokenVerify, async (req, res) => {
    if (req.params.id !== "") {
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const request = new ConnectReq({
                senderId: req.User,
                receiverId: req.params.id,
                relType: req.body.relation,
                timestamp: new Date()
            })
            await request.save()

            // await Users.findOneAndUpdate(
            //     {_id: req.params.id},
            //     {$push,}
            // )
        } catch (err) {
            session.abortTransaction()
            res.send({ err: "ConnectErr-02" })
        }

    } else {
        res.send({ err: "ConnectErr-01" })
    }
})
module.exports = router;
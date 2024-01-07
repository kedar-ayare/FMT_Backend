const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User");
const ConnectReq = require("../models/ConnectReq");

const tokenVerify = require("../middlewares/auth");
const { default: mongoose } = require('mongoose');
const { error } = require('winston');


/*
POST - /request/:id

Creating new Connect Request and adding ReqId to Receiver User's connectReqs Array
Requires Receiver User's Id in params
Requires the relation type in request body
*/
router.post('/request/:id', tokenVerify, async (req, res) => {
    if (req.params.id !== "") {
        const session = await mongoose.startSession();
        session.startTransaction()

        let success = 0;
        try {
            const request = new ConnectReq({
                senderId: req.User,
                receiverId: req.params.id,
                relType: req.body.relation,
                timestamp: new Date()
            })
            await request.save()

            await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { connectReqs: request._id } }
            )
            success = 1
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ConnectErr-02" })
        } finally {
            session.endSession()
        }
        if (success) {
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "ConnectErr-01" })
    }
})


router.post('/accept/:reqId', tokenVerify, async (req, res) => {
    if (req.params.id !== "" || req.body.relation !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()

        let success = 0
        try {



            const request = await ConnectReq.findOne({ _id: req.params.reqId })
            request.status = "Accepted"
            request.save()

            if (request.relType == "Brother" || request.relType == "Sister") {
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { siblings: request.receiverId } }
                )


                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    {
                        $push: { siblings: request.senderId },
                        $pull: { connectReqs: request._id }
                    }
                )



            }

            if (request.relType == "Mother" || request.relType == "Father") {
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { parents: request.receiverId } }
                );

                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    { $push: { children: request.senderId } }
                );
            }

            if (request.relType == "Son" || request.relType == "Daughter") {
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { children: request.receiverId } }
                )

                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    { $push: { parents: request.senderId } }
                )
            }

            if (request.relType == "Wife") {

                const user1 = await Users.findOne({ _id: request.senderId })
                user1.wife = request.receiverId
                await user1.save()

                const user2 = await Users.findOne({ _id: request.receiverId })
                user2.husband = request.senderId
                await user2.save()

            }

            if (request.relType == "Husband") {


                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { husband: request.receiverId },
                )

                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    { wife: request.senderId }
                )
            }

            success = 1
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ConnectErr-04" })
        } finally {
            session.endSession()
        }

        if (success) {
            res.send({ err: "OK" })
        }
    } else {
        res.send({ err: "ConnectErr-01" })
    }
});



/* 
POST - /decline/:id

When User Declines a connection request
Requires the Request Id in the params
*/
router.post('/decline/:reqId', tokenVerify, async (req, res) => {

    if (req.params.reqId !== "") {

        //Starting Session to avoid inconsistancy
        const session = await mongoose.startSession()
        session.startTransaction()

        let success = 0;

        try {
            const request = await ConnectReq.findOne({ _id: req.params.reqId })
            request.status = "Declined"
            await request.save()

            await Users.findOneAndUpdate(
                { _id: request.receiverId },
                { $pull: { connectReqs: request._id } }
            )

            success = 1
        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ConnectErr-03" })
        } finally {

            session.endSession()
        }
        if (success) {
            res.send({ err: "OK" })
        }
    } else {
        res.send({ err: "ConnectErr-01" })
    }
});



/*
POST - /unConnect/:id

When user wants to unConnect with someone
Requires id of the user
*/

router.post('/unConnect/:id', tokenVerify, async (req, res) => {
    if (req.params.id !== "") {
        const session = await mongoose.startSession()
        session.startTransaction()

        let success = 0
        try {

            const user1 = await Users.findOne({ _id: req.User })

            if (user1.husband != undefined && user1.husband == req.params.id) {
                await Users.findOneAndUpdate(
                    { _id: req.params.id },
                    { $unset: { wife: 1 } }
                )

                await Users.findOneAndUpdate(
                    { _id: req.User },
                    { $unset: { husband: 1 } }
                )

            } else if (user1.wife != undefined && user1.wife == req.params.id) {
                await Users.findOneAndUpdate(
                    { _id: req.params.id },
                    { $unset: { husband: 1 } }
                )

                await Users.findOneAndUpdate(
                    { _id: req.User },
                    { $unset: { wife: 1 } }
                )

            } else {
                await Users.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $pull: {
                            siblings: req.User,
                            parents: req.User,
                            children: req.User,
                        }
                    }
                )

                await Users.findOneAndUpdate(
                    { _id: req.User },
                    {
                        $pull: {
                            siblings: req.params.id,
                            parents: req.params.id,
                            children: req.params.id
                        }
                    }
                )
            }

            success = 1

        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ConnectErr-05" })
        } finally {
            session.endSession()
        }

        if (success) {
            res.send({ err: "OK" })
        }
    } else {
        res.send({ err: "ConnectErr-01" })
    }
})



module.exports = router;
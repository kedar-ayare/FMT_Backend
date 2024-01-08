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

        //Session to avoid data Inconsistancy
        const session = await mongoose.startSession();
        session.startTransaction()

        let success = 0;
        try {

            //New Request Creation
            const request = new ConnectReq({
                senderId: req.User,
                receiverId: req.params.id,
                relType: req.body.relation,
                timestamp: new Date()
            })
            await request.save()

            //Adding ReqId to Receiver's ConnectReqs
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


/*
POST - /accept/:id
When User accepts a connection request
Requires the request Id in the params
*/
router.post('/accept/:reqId', tokenVerify, async (req, res) => {
    if (req.params.id !== "" || req.body.relation !== "") {

        //Session to avoid Data Inconsistancy
        const session = await mongoose.startSession()
        session.startTransaction()

        let success = 0
        try {


            // Changing the Request Status To Accepted
            const request = await ConnectReq.findOne({ _id: req.params.reqId })
            request.status = "Accepted"
            request.save()


            if (request.relType == "Brother" || request.relType == "Sister") {


                //Adding Receiver to Sender's Siblings Array
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { siblings: request.receiverId } }
                )

                //Adding Sender to Receiver's Siblings Array
                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    {
                        $push: { siblings: request.senderId },
                        $pull: { connectReqs: request._id }
                    }
                )

            } else if (request.relType == "Mother" || request.relType == "Father") {


                // Adding Receiver to Sender's Parents Array
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { parents: request.receiverId } }
                );

                // Adding Sender to Receiver's Children Array
                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    { $push: { children: request.senderId } }
                );
            } else if (request.relType == "Son" || request.relType == "Daughter") {

                // Adding Receiver to Sender's Children Array 
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { $push: { children: request.receiverId } }
                )

                //Adding Sender to Receiver's Parents Array
                await Users.findOneAndUpdate(
                    { _id: request.receiverId },
                    { $push: { parents: request.senderId } }
                )
            } else if (request.relType == "Wife") {

                // Adding Receiver as Sender's Wife
                const user1 = await Users.findOne({ _id: request.senderId })
                user1.wife = request.receiverId
                await user1.save()

                //Adding Sender as Receiver's Husband
                const user2 = await Users.findOne({ _id: request.receiverId })
                user2.husband = request.senderId
                await user2.save()

            } else if (request.relType == "Husband") {


                //Adding Receiver as Sender's Husband
                await Users.findOneAndUpdate(
                    { _id: request.senderId },
                    { husband: request.receiverId },
                )

                // Adding Sender as Receiver's Husband
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

            //Changing Status of Request to Declined
            const request = await ConnectReq.findOne({ _id: req.params.reqId })
            request.status = "Declined"
            await request.save()


            //Removing ReqId from Receiver's ConnectREqs Array
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
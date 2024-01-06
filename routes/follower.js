const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")
const FollowReq = require("../models/FollowReq")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt");
const { default: mongoose, Mongoose } = require('mongoose');

/* 
POST - /request/:id

Creating new Request and adding ReqId to the user's pending req's list.
Requires the user ID of the user to whom request is to be sent in the params
*/
router.post('/request/:id', tokenVerify, async (req, res) => {

    // Checking if id present in param
    if (req.params.id !== "") {

        // Starting Transaction to avoid Inconsistancy
        const session = await mongoose.startSession();
        session.startTransaction();

        // Creating new Request Object
        const request = new FollowReq({
            senderId: req.User,
            receiverId: req.params.id,
            timestamp: new Date()
        })

        try {

            //Saving the newly created Request
            const newReq = await request.save();

            //Adding new Req's Id in receiver user's followReqs array
            const user = await Users.findOne({ _id: req.params.id })
            user.followReqs.push(newReq._id)
            await user.save();

        } catch (err) {
            session.abortTransaction()
            console.log(err)
            res.send({ err: "ErrorVal-02" })
        } finally {
            session.endSession();
            res.send({ err: "OK" })
        }
    } else {
        res.send({ err: "FollowErr-01" })
    }
})


/*
POST - /accept/:reqId

When user accepts a follow request.
Requires the request Id to be sent in the params
*/
router.post('/accept/:reqId', tokenVerify, async (req, res) => {



    // Checking if Request Id present in params
    if (req.params.id !== "") {

        //Stating Session to avoind inconsistancy
        const session = await mongoose.startSession()
        session.startTransaction();

        try {

            //Updating Request Status to Accepted
            const request = await FollowReq.findOne({ _id: req.params.reqId })
            request.status = "Accepted"
            request.save()

            //Adding Receiver User's Id to Sender User Following Array 
            await Users.findOneAndUpdate(
                { _id: request.senderId },
                { $push: { following: request.receiverId } },
                { new: true }
            )

            //Adding Sender User's Id to Receiver User's Follower Array 
            await Users.findOneAndUpdate(
                { _id: request.receiverId },
                {
                    $push: { followers: request.senderId },
                    $pull: { followReqs: req.params.reqId }
                },
                { new: true }
            )

        } catch (err) {
            console.log(err)
            session.abortTransaction()
            res.send({ err: "FollowErr-03" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }

})


/*
POST - /decline/:reqId

When user declines a follow request
Requires the request Id to be sent in the params
*/
router.post('/decline/:reqId', tokenVerify, async (req, res) => {

    // Checking if Request Id is present in params
    if (req.params.reqId !== "") {

        //Starting Session to avoid inconsistancy
        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            //Updating Request Status Field to Declined
            const request = await FollowReq.findOneAndUpdate(
                { _id: req.params.reqId },
                { status: "Declined" },
                { new: true }
            )


            //Removing Request Id from Receiver User's followReq Array
            await Users.findOneAndUpdate(
                { _id: request.receiverId },
                {
                    $pull: { followReqs: request._id }
                }
            )
        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-04" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})


/*
POST - /follow/:id

When user follow's a user with public account (no request creation)
Requires the User Id of the user whom to be followed
*/
router.post('/follow/:id', tokenVerify, async (req, res) => {

    //Checking if User Id present in params
    if (req.params.id !== "") {

        //Starting Session to avoid Inconsistancy
        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            //Adding Receiver User's Id to Sender User's Following Array
            await Users.findOneAndUpdate(
                { _id: req.User },
                { $push: { following: req.params.id } }
            )

            //Adding Sender User's Id to Receiver User's Followers Array
            await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { followers: req.User } }
            )

        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-05" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})


/*
POST - /unfollow/:id

When user unfollow's other user, public or private
Requires the User Id of the user whom to be unfollowed
*/
router.post('/unfollow/:id', tokenVerify, async (req, res) => {

    //Checking if User Id present in params
    if (req.params.id !== "") {

        //Starting session to avoid Inconsistancy
        const session = await mongoose.startSession()
        session.startTransaction()

        try {

            //Removing Receiver User's Id from Sender User's Following Array
            await Users.findOneAndUpdate(
                { _id: req.User },
                { $pull: { following: req.params.id } },
                { new: true }
            )

            //Removing Sender User's Id from Reveiver User's Followers Array
            await Users.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { followers: req.User } },
                { new: true }
            )

        } catch (err) {
            session.abortTransaction()
            res.send({ err: "FollowErr-06" })
        } finally {
            session.endSession()
            res.send({ err: "OK" })
        }

    } else {
        res.send({ err: "FollowErr-01" })
    }
})


module.exports = router;
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");


/*
    '/' - POST
    Route to get Search Results
    Takes string in body, and uses it for pattern matching
    for first and last name fields.
*/
router.get('/:name', tokenVerify, async (req, res) => {
    var searchQuery = req.params.name.split(" ");
    var users = await Users.aggregate([
        {
            $addFields: {
                fullName: { $concat: ["$fname", " ", "$lname"] }
            }
        },
        {
            $addFields: {
                matchCount: {
                    $size: {
                        $setIntersection: [
                            {
                                $split: [
                                    { $toLower: "$fullName" },
                                    " "
                                ]
                            },
                            { $map: { input: searchQuery, as: "query", in: { $toLower: "$$query" } } }
                        ]
                    }
                }
            }
        },
        {
            $match: {
                $or: [
                    { fname: { $regex: new RegExp(searchQuery.join('|')), $options: 'i' } },
                    { lname: { $regex: new RegExp(searchQuery.join('|')), $options: 'i' } },
                ]
            }
        },
        { $sort: { matchCount: -1 } }
    ]);
    res.json(users);
});




/* 
    '/add' - POST
    Route to add a new user Id to the current user's searched list
    Requires Id of User who needs to be added in body of request

*/
router.post('/add', tokenVerify, async (req, res) => {
    console.log(req.User);
    try {
        await Users.updateOne(
            { _id: req.User },
            {
                $addToSet: {
                    searched: {
                        $each: [req.body.profId],
                        $slice: -10
                    }
                }
            },
        );
        console.log("Added successfully")
    } catch (err) {
        console.log(err)
    }

    res.send("Add a profile to current User's Searched List");
})


/*
    '/delete' - POST
    Route to remove a user Id from current user's searched list
    Rewuires Id of User who needs to be added in body of request
*/
router.post('/delete', tokenVerify, async (req, res) => {
    console.log(req.User);
    try {
        await Users.updateOne(
            { _id: req.User },
            { $pull: { searched: req.body.profId } },
        );
        console.log("Removed successfully")
    } catch (err) {
        console.log(err)
    }
    res.send("Remove a profile to current User's Searched List");
})



// /*
//     '/' - GET
//     Route to get details of all users in the current user's searched list
// */
// router.get('/', tokenVerify, async (req, res) => {
//     var searchedUSers = [];
//     var user = await Users.findOne({
//         _id: req.User
//     })

//     for (var user of user["searched"]) {
//         const userDets = await Users.findOne({ _id: user })
//         searchedUSers.push(userDets);
//     }
//     res.send(searchedUSers)
// })

module.exports = router
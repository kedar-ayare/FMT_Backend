const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt")




/* ALL ROUTES BEGIN WITH /api/users/ */

/*
    '/' - POST
    Route to create new user.
    Requires all user required fields in body.
    Sends user token as response.
*/
router.post('/', async (req, res) => {

    const existingUser = await Users.findOne({email: req.body.email})
    if(existingUser){
        return res.status(409).json({msg: "User already exists"})
    }

    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Invalid email format" });
    }

    try{
        var dob = new Date();
        const newUser = Users({
            fname: req.body.fname,
            lname: req.body.lname,
            gender: req.body.gender,
            dob: req.body.dob,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            edu: req.body.edu,
            empStatus: req.body.empStatus,
            profileURL: req.body.profileURL

        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id, email: 'kedarayareilr@gmail.com' }, process.env.JWT_SECRETE, { expiresIn: '90d' });

        res.json({ token });
    }catch(error){
        res.status(400).json({msg: error})
    }
    
})



/*
    '/login/' - POST
    Route for user to log in.
    Requires email and password of the user.
    Send an error code if either field invalid or sends a jwt token.
*/
router.post('/login/', async (req, res) => {
    try {
        // 🔹 Validate presence
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ err: "LogErr - 01" });
        }

        // 🔹 Decrypt
        const userEmail = await decrypt(req.body.email);
        const userPassword = await decrypt(req.body.password);

        if (!userEmail || !userPassword) {
            return res.status(400).json({ err: "LogErr - 01" });
        }

        // 🔹 Find user
        const user = await Users.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).json({ err: "LogErr - 02" });
        }

        // 🔹 Check password
        if (user.password !== userPassword) {
            return res.status(400).json({ err: "LogErr - 03" });
        }

        // 🔹 Generate token
        const _token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRETE,
            { expiresIn: '90d' }
        );

        const eToken = await encrypt(_token);
        const eUserId = await encrypt(user._id.toString());

        return res.status(200).json({
            token: eToken,
            userID: eUserId
        });

    } catch (error) {
        return res.status(500).json({ err: "Internal Server Error" });
    }
});


/*
    '/' - GET
    Route to get data of the loggedIn user
    Used for the user's profile page
*/
router.get('/', tokenVerify, async (req, res) => {


    try {
        const user = await Users.findOne({ "_id": req.User });
        if (!user) {
            return res.status(404).send({ err: "User not found" });
        }
        res.status(200).send({user});
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
});



/*
    '/:id' - GET
    Route to get data of the user 
    the loggedIn user visits
*/
router.get('/:id', tokenVerify, async (req, res) => {
    try {
        const user = await Users.findOne({ "_id": req.params.id }).select("fname lname _id accountStat children connectReqs followReqs followerCount followingCount parents posts profileURL siblings followers")
            .populate('followReqs')
            .populate('connectReqs')
            .populate('posts');
        if (!user) {
            return res.status(404).send({ err: "User not found" });
        }
        fieldsToRemove = [
            "password",
            "legacy",
            "pendingReqs",
            "searched",
            "__v",
        ]
        let userObj = user.toObject()
        fieldsToRemove.forEach(element => {
            userObj[element] = undefined
        });
        res.send({userObj});
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
});


router.get('/commentData/:id', tokenVerify, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.params.id }).select("_id fname lname profileURL")
        res.send({ userData })
    } catch (err) {
        res.send({ err: "Something wrong" })
    }
})





router.put('/', (req, res) => {
    res.send("Update a user")
})

router.delete('/:id', async (req, res) => {
    try{
        await Users.findByIdAndDelete({_id: req.params.id})
        res.status(200).send({msg:"Delete a user"})
    }catch(err){
        res.status(400).json(err)
    }
    
})


//Router to get info of loggedin User
// router.get('/', tokenVerify, async (req, res) => {
//     const user = await Users.findOne({ email: "kedarayareilr@gmail.com" })
//     // res.send({ "name": "Kedar" })




// })

module.exports = router
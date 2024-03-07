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
    var dob = new Date();
    const newUser = Users({
        fname: 'Revati',
        lname: 'Ayare',
        gender: 'Female',
        dob: Date(),
        email: 'Revatiayare@gmail.com',
        password: 'Revatiayare',
        phone: '8692056130',
        edu: 'High School',
        empStatus: 'unemployed',
        profileURL: "https://myfamtree.000webhostapp.com/appImages/revati.jpg"

    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email: 'kedarayareilr@gmail.com' }, process.env.JWT_SECRETE, { expiresIn: '90d' });

    res.json({ token });
})



/*
    '/login/' - POST
    Route for user to log in.
    Requires email and password of the user.
    Send an error code if either field invalid or sends a jwt token.
*/
router.post('/login/', async (req, res) => {

    var userEmail = await decrypt(req.body.email);
    console.log(userEmail)

    var err = ""

    if (userEmail === "" || userEmail == undefined || userEmail == null) {
        res.send({ err: "LogErr - 01" })
        console.log("LogErr - 01")
    } else {
        var userPassword = await decrypt(req.body.password)
        try {
            console.log("Incoming:", userEmail)
            var user = await Users.findOne({ email: "kedarayareilr@gmail.com" });
        } catch (error) {
            console.log(error)
        }

        if (user == null) {
            res.send({ err: "LogErr - 02" })
            console.log("LogErr - 02")
        }
        else if (user.password == userPassword) {
            const _token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' })
            // console.log(_token)
            console.log("Login Success")
            const eToken = await encrypt(_token)
            const eUSerId = await encrypt(user._id.toString())

            res.send({ token: eToken, userID: eUSerId })
        } else {
            res.send({ err: "LogErr - 03" })
            console.log("LogErr - 03")
        }
    }


    // res.send("Something")

})


/*
    '/' - GET
    Route to get data of the loggedIn user
    Used for the user's profile page
*/
router.get('/', tokenVerify, async (req, res) => {

    try {
        const user = await Users.findOne({ "_id": req.User });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        console.log(user);
        res.send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
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
        const user = await Users.findOne({ "_id": req.params.id })
            .populate('followReqs')
            .populate('connectReqs')
            .populate('posts');
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        fieldsToRemove = [
            "password",
            "legacy",
            "pendingReqs",
            "searched",
            "__v",
        ]

        fieldsToRemove.forEach(element => {
            user[element] = undefined
        });
        res.send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});


router.get('/commentData/:id', tokenVerify, async (req, res) => {
    try {
        const userData = await Users.findOne({ _id: req.params.id }).select("_id fname lname profileURL")
        res.send({ userData })
    } catch (err) {
        console.log(err)
        res.send({ err: "Something wrong" })
    }
})





router.put('/', (req, res) => {
    res.send("Update a user")
})

router.delete('/:id', (req, res) => {
    res.send("Delete a user")
})


//Router to get info of loggedin User
// router.get('/', tokenVerify, async (req, res) => {
//     // console.log(req.User)
//     const user = await Users.findOne({ email: "kedarayareilr@gmail.com" })
//     console.log(user)
//     // res.send({ "name": "Kedar" })




// })

module.exports = router
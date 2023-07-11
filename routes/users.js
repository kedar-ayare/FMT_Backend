const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');
const decrypt = require("../utilities.js/decrpyt")




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
            var user = await Users.findOne({ email: userEmail });
        } catch (error) {
            console.log(error)
        }

        if (user == null) {
            res.send({ err: "LogErr - 02" })
            console.log("LogErr - 02")
        }
        else if (user.password == userPassword) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' });
            res.json({ token })
        } else {
            res.send({ err: "LogErr - 03" })
            console.log("LogErr - 03")
        }
    }


    // res.send("Something")

})





router.put('/', (req, res) => {
    res.send("Update a user")
})


// router.put('/:id', (req, res) => {
//     res.send("Update a user")
// })

router.delete('/:id', (req, res) => {
    res.send("Delete a user")
})


module.exports = router
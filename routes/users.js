const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");
const { config } = require('dotenv');



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
        fname: 'Shrawani',
        lname: 'Ayare',
        gender: 'Female',
        dob: Date(),
        email: 'shrawaniayareilr@gmail.com',
        password: 'shrawaniayare',
        phone: '8692056125',
        edu: 'High School',
        empStatus: 'unemployed',

    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, email: 'kedarayareilr@gmail.com' }, process.env.JWT_SECRETE, { expiresIn: '90d' });

    res.json({ token });
})



/*
    '/' - GET
    Route for user to log in.
    Requires email and password of the user.
    Send an error code if either field invalid or sends a jwt token.
*/
router.get('/', async (req, res) => {
    var userEmail = req.email;
    var user = Users.findOne({ email: userEmail });
    if (user.password == req.password) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE, { expiresIn: '90d' });
        res.json({ token })
    } else {
        res.send("Invalid email or password")
    }

})







router.put('/:id', (req, res) => {
    res.send("Update a user")
})

router.delete('/:id', (req, res) => {
    res.send("Delete a user")
})


module.exports = router
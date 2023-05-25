const express = require('express');
const router = express.Router();

const Users = require("../models/User")

const tokenVerify = require("../middlewares/auth");



router.post('/', tokenVerify, async (req, res) => {
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
})
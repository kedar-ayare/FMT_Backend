const express = require('express');

const router = express.Router();

const tokenVerify = require("../middlewares/auth");

router.get('/', tokenVerify, async (req, res) => {
    res.json({ err: "Code-01" })
})

module.exports = router

const express = require('express');
const multer = require('multer')

const Posts = require("../models/Post")



const upload = multer({ dest: 'uploads' })

const router = express.Router()

router.post('/', upload.array('image', 10), (req, res) => {
    const imagePaths = req.files.map(file => file.path);
    console.log(imagePaths);
    res.send("Create a new post")
})

router.get('/', async (req, res) => {
    res.send("Get all posts")
})

router.get('/:id', (req, res) => {
    res.send("Get a post by Id")
})

router.put('/:id', (req, res) => {
    res.send("Update a post")
})

router.delete('/:id', (req, res) => {
    res.send("Delete a post")
})





module.exports = router
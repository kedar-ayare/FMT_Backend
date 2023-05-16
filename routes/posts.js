const { request } = require('express');
const express = require('express');

const router = express.Router()

router.post('/', (req, res) => {
    res.send("Create a new post")
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
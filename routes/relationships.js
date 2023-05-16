const { request } = require('express');
const express = require('express');

const router = express.Router()

router.post('/', (req, res) => {
    res.send("Create a new relationship")
})

router.get('/:id', (req, res) => {
    res.send("Get a relationship by Id")
})

router.put('/:id', (req, res) => {
    res.send("Update a relationship")
})

router.delete('/:id', (req, res) => {
    res.send("Delete a relation")
})





module.exports = router
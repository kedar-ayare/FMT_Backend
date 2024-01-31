
const express = require('express');
const multer = require('multer')

const Posts = require("../models/Post")
const tokenVerify = require("../middlewares/auth");

const upload = multer({ dest: 'uploads' })

const router = express.Router()

router.post('/newPost/', upload.array('files', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
    }

    const uploadPromises = req.files.map(file => {

        // upload params for the S3 bucket
        const uploadParams = {
            Bucket: "myfamilytree2000",
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        return new Promise((resolve, reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error("Error:", err);
                    reject(err);
                } else {
                    console.log("Upload Success:", data.Location);
                    resolve(data.Location);
                }
            });
        });
    });

    try {
        const imageLinks = await Promise.all(uploadPromises);

        const newPost = Posts({
            caption: req.body.caption,
            images: imageLinks,
            likes: [],
            comments: [],
            datetime: new Date(),
            author: req.body.author
        });

        await newPost.save();
        res.send({ "id": newPost._id });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).send("Error uploading images.");
    }
});

router.get('/', async (req, res) => {
    res.send("Get all posts")
})

router.get('/:id', tokenVerify, async (req, res) => {
    try {
        const post = await Posts.findOne({ _id: req.params.id }).populate('comments').populate('likes')
        res.send({ post })
    } catch (err) {
        console.log(err)
        res.send({ err: "PostErr-01" })
    }


})

router.put('/:id', (req, res) => {
    res.send("Update a post")
})

router.delete('/:id', (req, res) => {
    res.send("Delete a post")
})





module.exports = router
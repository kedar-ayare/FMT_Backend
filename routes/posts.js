
const express = require('express');
const multer = require('multer')

const Posts = require("../models/Post")
const tokenVerify = require("../middlewares/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

router.post('/newPost/', upload.array('files', 10), tokenVerify, async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({err: "PostErr-02"});
    }

    let newPost;
    
    try {

        newPost = new Posts({
            caption: req.body.caption,
            images: [],
            likes: [],
            comments: [],
            datetime: new Date(),
            author: req.User
        });

        await newPost.save();

        const uploadPromises = req.files.map((file, index) => {
            const uploadParams = {
                Bucket: "myfamilytree2000",
                Key: `${newPost._id}-${index}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read'
            };

            return new Promise((resolve, reject) => {
                s3.upload(uploadParams, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Location);
                    }
                });
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        newPost.images = uploadedImages;
        await newPost.save();
        res.send({ id: newPost._id });

    } catch (error) {
        if (newPost?.images.length > 0) {
            const deletePromises = newPost.images.map((imageUrl) => {
                const key = imageUrl.split('/').pop(); // Extract filename from URL
                return s3.deleteObject({ Bucket: "myfamilytree2000", Key: key }).promise();
            });

            await Promise.all(deletePromises);
        }

        if (newPost) {
            await Posts.findByIdAndDelete(newPost._id);
        }

        res.status(500).send({err: "PostErr-03"});
    }
});



router.get('/', async (req, res) => {
    res.send("Get all posts")
})

router.get('/:id', tokenVerify, async (req, res) => {
    try {
        const post = await Posts.findOne({ _id: req.params.id }).populate({
            path: 'comments',
            populate: {
                path: "userId",
                select: "_id fname lname profileURL"
            }
        }).populate('likes')
        console.log(post)
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
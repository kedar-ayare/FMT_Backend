const express = require('express');

const router = express.Router();

const tokenVerify = require("../middlewares/auth");
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt")
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

const Posts = require("../models/Post")
const Users = require("../models/User")

const jwt = require("jsonwebtoken")

const aws = require("aws-sdk")

aws.config.update({ region: "ap-south-1" })

s3 = new aws.S3()

router.get('/serverCheck/', async (req, res) =>{
    res.send({msg:"working"})
})

router.post('/newPost/', upload.array('files', 10), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
    }

    const uploadPromises = req.files.map(file => {
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
    var email = await encrypt(req.body.email)
    var password = await encrypt(req.body.password)
    res.json({
        email,
        password
    })
})

router.get('/checkToken/', async (req, res) => {
    const token = "U2FsdGVkX1/2Wp39xfQFmjtS3bQVV36ekWyCr/SuOx1jI3++8qKwuNB55SXzuvTbfsmmHV7O/txRiv2dtswD9K27eutSo/LXhDpkIDvZ1Kf+7Rg+ggEGCO+AHtp4xcQ4HinU7StFJmwfpGbYoQJHlFQYsoHEBnjdDDH49hnvdJllKru3gKAUgdonnQG5+j5IFTjInaGZgvqjLJYyLq8P/FFnJF+enwSR4UXr1KprLTQzTZVcjx/OPR+WbmKZGA8w"
    console.log(process.env.JWT_SECRETE)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE);
        console.log(decoded)
        res.send(decoded.id)
    } catch (err) {
        console.log(err)
    }



})

router.post('/addPost/', async (req, res) => {
    const newPost = Posts({
        caption: req.body.caption,
        images: [req.body.image],
        likes: [],
        comments: [],
        datetime: new Date(),
        author: req.body.author
    })
    await newPost.save()
    res.send({ "id": newPost._id })
})


router.post('/follow/', async (req, res) => {
    const ids = [
        "6460f80082a63e8eef2ca825",
        "6462534d04184a090fa0ebef",
        "64871017127db05df55bb447",
        "64871043f60d324e16e7a669",

        "6487108418a538e3eb2b7352",
        "67c5f2d6b927aefe8ab7034d",
        "67c5f33cb927aefe8ab7034f",
        "6696c0522ab30fe76140cbda",
        "67c5f386b927aefe8ab70351"
    ]

    for(let i = 1; i < ids.length-1; i ++){
        var temp = ids.filter((id) => id !=ids[i] )
        const user = await Users.findOneAndUpdate(
            {_id: ids[i]},
            {$set:{followers:temp}},
            {returnDocument: "after"}
        )
        console.log(user)
    }
    res.send({err:"OK"})
})

module.exports = router
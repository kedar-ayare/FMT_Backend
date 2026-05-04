const request = require('supertest')
const app = require("../app")
require('dotenv').config();
const mongoose = require('mongoose');
jest.setTimeout(20000);
const decrypt = require("../utilities.js/decrpyt")
const encrypt = require("../utilities.js/encrypt")
const Users = require("../models/User")






describe('Users - Fetch User', () => {
    beforeAll(async () => {
        if (!process.env.DB_URL_TEST) {
            throw new Error("DB_URL_TEST missing");
        }
        await mongoose.connect(process.env.DB_URL_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('should fetch user from the token', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }
        
        const signupRes = await request(app).post('/api/users').send(userData)
        const token = await encrypt(signupRes.body.token)


        const res = await request(app).get('/api/users').set('token', token)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user')
        
    })

    it('token missing hence fail', async () => {
        const res = await request(app).get('/api/users')
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe('ValError-01')
    })

    it('invalid token hence fails', async () => {
        const res = await request(app).get('/api/users').set('token',"InvalidString")
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe('ValError-03')
    })

    it('valid token but user deleted', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }
        
        const signupRes = await request(app).post('/api/users').send(userData)
        const token = await encrypt(signupRes.body.token)



        const getUserRes = await request(app).get('/api/users').set('token', token)
        const userID = getUserRes.body.user._id


        const deleteRes = await request(app).delete(`/api/users/${userID}`)


        const res = await request(app).get('/api/users').set('token', token)
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe("User not found")
        
    })


})


describe('Users - Fetch Other User', () => {
    beforeAll(async () => {
        if (!process.env.DB_URL_TEST) {
            throw new Error("DB_URL_TEST missing");
        }
        await mongoose.connect(process.env.DB_URL_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });

    it('should fetch details of other user', async () => {

        // requesting user
        const user1 = {
            fname: "Test1",
            lname: "User1",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }


        // User to be used as parent
        const user2 = {
            fname: "Test2",
            lname: "User2",
            dob: Date(),
            email: `testemail3000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }


        const signupUser1 = await request(app).post('/api/users').send(user1)
        const signupUser2 = await request(app).post('/api/users').send(user2)

        const userToken1 = await encrypt(signupUser1.body.token)
        const userToken2 = await encrypt(signupUser2.body.token)

        const user2Data = await request(app).get('/api/users').set('token', userToken2)
        const user2Id = user2Data.body.user._id

        // User to be fetched
        const user3 = {
            fname: "Test2 ka parent",
            lname: "User2 ka parent",
            dob: Date(),
            email: `testemail4000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella",
            parents: [`${user2Id}`]
        }

        const signupUser3 = await request(app).post('/api/users').send(user3)
        const checkUser3 = await Users.findOne({ email: user3.email });

        const userToken3 = await encrypt(signupUser3.body.token)
        const user3Data = await request(app).get('/api/users').set('token', userToken3)
        const user3Id = user3Data.body.user._id


        const res = await request(app).get(`/api/users/${user3Id}`).set('token', userToken1)

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('userObj')
        expect(res.body.userObj).toHaveProperty('_id')
        expect(res.body.userObj._id).toBe(user3Id)
    })

    it('should fail without token', async () => {

        // requesting user
        const user1 = {
            fname: "Test1",
            lname: "User1",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }


        // User to be used as parent
        const user2 = {
            fname: "Test2",
            lname: "User2",
            dob: Date(),
            email: `testemail3000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        const signupUser1 = await request(app).post('/api/users').send(user1)
        const signupUser2 = await request(app).post('/api/users').send(user2)

        const userToken1 = await encrypt(signupUser1.body.token)
        const userToken2 = await encrypt(signupUser2.body.token)

        const user2Data = await request(app).get('/api/users').set('token', userToken2)
        const user2Id = user2Data.body.user._id

        const res = await request(app).get(`/api/users/${user2Id}`)

        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe("ValError-01")
    })

    it('should fail with invalid token', async () => {

        // requesting user
        const user1 = {
            fname: "Test1",
            lname: "User1",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }


        // User to be used as parent
        const user2 = {
            fname: "Test2",
            lname: "User2",
            dob: Date(),
            email: `testemail3000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        const signupUser1 = await request(app).post('/api/users').send(user1)
        const signupUser2 = await request(app).post('/api/users').send(user2)

        const userToken1 = await encrypt(signupUser1.body.token)
        const userToken2 = await encrypt(signupUser2.body.token)

        const user2Data = await request(app).get('/api/users').set('token', userToken2)
        const user2Id = user2Data.body.user._id

        const res = await request(app).get(`/api/users/${user2Id}`).set('token', "invalidToken")

        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe("ValError-03")
    })

    it('should fail when searching for deleted user', async () => {

        // requesting user
        const user1 = {
            fname: "Test1",
            lname: "User1",
            dob: Date(),
            email: `testemail2000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }


        // User to be used as parent
        const user2 = {
            fname: "Test2",
            lname: "User2",
            dob: Date(),
            email: `testemail3000@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        const signupUser1 = await request(app).post('/api/users').send(user1)
        const signupUser2 = await request(app).post('/api/users').send(user2)

        const userToken1 = await encrypt(signupUser1.body.token)
        const userToken2 = await encrypt(signupUser2.body.token)

        const user2Data = await request(app).get('/api/users').set('token', userToken2)
        const user2Id = user2Data.body.user._id

        const DeleteRes = await request(app).delete(`/api/users/${user2Id}`)

        const res = await request(app).get(`/api/users/${user2Id}`).set('token', userToken1)

        expect(res.statusCode).toBe(404)
        expect(res.body).toHaveProperty('err')
        expect(res.body.err).toBe("User not found")
    })

    
})
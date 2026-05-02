const request = require('supertest')
const app = require("../app")
require('dotenv').config();
const mongoose = require('mongoose');
jest.setTimeout(20000);


describe('POST /api/users/', () => {
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


    it('should create a new user and return a token', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }
        
        const res = await request(app).post('/api/users/').send(userData)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string')
    })

    it('should not create duplicate users', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        //First request - should work out
        await request(app).post('/api/users/').send(userData);

        //Second request - should fail
        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(409)
        expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without email', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }
        delete userData.email

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without phone', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.phone

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without fname', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.fname

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without lname', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.lname

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without dob', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.dob

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without password', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.password

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without edu', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.edu

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user without empStatus', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}@gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.empStatus

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })

    it('should not create user with invalid email id format', async () => {
        const userData = {
            fname: "Test",
            lname: "User",
            dob: Date(),
            email: `duplicate${Date.now()}gmail.com`,
            password: "1234",
            phone: "1000",
            edu: "B.Tech",
            empStatus: "Vella"
        }

        delete userData.empStatus

        const res = await request (app).post('/api/users/').send(userData);

        expect(res.statusCode).toBe(400)
        console.log(res.msg)
        // expect(res.body.msg).toBe("User already exists")
    })


})




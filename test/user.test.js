const request = require('supertest')
const app = require("../index")


describe('PUT /api/users/', () => {
    it('should return related', async () => {
        const res = await request(app).put('/api/users/');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Hello World');
    })
})
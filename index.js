require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const comments = require('./routes/comments');
const app = express()



app.use(express.json())
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

// CONNECTION WITH DATABASE
const mongoString = process.env.DATABASE_URL
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})



app.use('/api/users', userRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/comments', comments)





// Kedar
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjBmODAwODJhNjNlOGVlZjJjYTgyNSIsImVtYWlsIjoia2VkYXJheWFyZWlsckBnbWFpbC5jb20iLCJpYXQiOjE2ODQwNzY1NDQsImV4cCI6MTY5MTg1MjU0NH0.qtzye4Y8P0mZxHJf4RxYXbSpaVaKDIA21pLEJg25Qx0


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjI1MzRkMDQxODRhMDkwZmEwZWJlZiIsImVtYWlsIjoia2VkYXJheWFyZWlsckBnbWFpbC5jb20iLCJpYXQiOjE2ODQxNjU0NTMsImV4cCI6MTY5MTk0MTQ1M30.Tn_xn8NYNVEN_ugGNAzwi8ILjxH8e1yifCK2nqneit0
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const comments = require('./routes/comments');
const request = require('./routes/relationships');
const validation = require('./routes/validation');

const winston = require('winston');
const tokenVerify = require('./middlewares/auth');

const app = express()

const logger = winston.createLogger({
    level: 'info', // Set the logging level (e.g., 'info', 'debug', 'error')
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamps to log entries
        winston.format.json() // Specify the log format (e.g., JSON)
    ),
    transports: [
        new winston.transports.Console(), // Output logs to the console
        new winston.transports.File({ filename: 'server.log' }) // Output logs to a file
    ]
});
logger.info('Server started'); // Log an informational message
logger.debug('Debugging information'); // Log a debug message
logger.error('An error occurred'); // Log an error message




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

// app.use(tokenVerify, (req, res, next) => {
//     // Extract and log the user's IP address
//     const userIP = req.ip;

//     // Extract and log the API endpoint the user is requesting
//     const apiEndpoint = req.originalUrl;

//     // Extract and log the user ID from the request headers
//     const userID = req.User;

//     // Log the request details along with the additional information
//     logger.info(`Request - IP: ${userIP}, Endpoint: ${apiEndpoint}, User ID: ${userID}`);

//     next();
// });


app.use('/api/users', userRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/comments', comments)
app.use('/api/request', request)
app.use('/api/validation', validation)





// Kedar
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjBmODAwODJhNjNlOGVlZjJjYTgyNSIsImVtYWlsIjoia2VkYXJheWFyZWlsckBnbWFpbC5jb20iLCJpYXQiOjE2ODQwNzY1NDQsImV4cCI6MTY5MTg1MjU0NH0.qtzye4Y8P0mZxHJf4RxYXbSpaVaKDIA21pLEJg25Qx0


// Shrawani
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjI1MzRkMDQxODRhMDkwZmEwZWJlZiIsImVtYWlsIjoia2VkYXJheWFyZWlsckBnbWFpbC5jb20iLCJpYXQiOjE2ODQxNjU0NTMsImV4cCI6MTY5MTk0MTQ1M30.Tn_xn8NYNVEN_ugGNAzwi8ILjxH8e1yifCK2nqneit0
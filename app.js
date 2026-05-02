const express = require('express');

const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const comments = require('./routes/comments');
const request = require('./routes/relationships');
const validation = require('./routes/validation');
const test = require('./routes/localtest');
const posts = require('./routes/posts');
const follow = require('./routes/follower');
const connect = require('./routes/connect');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', posts);
app.use('/api/search', searchRoutes);
app.use('/api/comments', comments);
app.use('/api/request', request);
app.use('/api/validation', validation);
app.use('/api/localtest', test);
app.use('/api/follow', follow);
app.use('/api/connect', connect);

module.exports = app;
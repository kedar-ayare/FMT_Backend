require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3000;

// DB connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.set("strictQuery", false);

  mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true });

  mongoose.connection.on('error', (err) => {
    console.log(err);
  });

  mongoose.connection.once('connected', () => {
    console.log('Database Connected');
  });
}

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
  });
}
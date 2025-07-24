// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
let PORT = parseInt(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', require('./routes/taskRoutes'));

app.all('*', (req, res) => {
  res.status(404).json({ msg: `No route matched ${req.method} ${req.originalUrl}` });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is in use. Trying port ${PORT + 1}...`);
      PORT += 1;
      app.listen(PORT, () => {
        console.log(` Server started on port ${PORT}`);
      });
    } else {
      throw err;
    }
  });
}


module.exports = app;

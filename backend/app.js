const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Only the React app (CLIENT_URL in .env) is allowed to call this API from a browser.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new AppError('This origin is not allowed by CORS', 403));
    },
  })
);

app.use(express.json({ limit: '1mb' })); // lets us read JSON request bodies
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev')); // logs every request

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ServiceHub API is running', data: { time: new Date().toISOString() } });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

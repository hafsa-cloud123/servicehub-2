require('dotenv').config({ quiet: true }); // loads variables from the .env file
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Could not start the server:', err.message);
    process.exit(1);
  });

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
console.log('$----------------------server Started----------------------$');

console.log('$----------------------TEEEST----------------------$');

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.json({ message: 'Server is running ✅' }));

// ------- routes start ---------
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// ------- routes end ---------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

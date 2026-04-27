const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(cors());
console.log('$----------------------server Started----------------------$');


console.log('$----------------------TEEEST----------------------$');

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Server is running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// ------- routes start ---------
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// ------- routes end ---------

















const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const app = express();

console.log('$----------------------server Started----------------------$');


// -------------  start server -------------

app.listen(5000, () => {
  console.log('$----------------------Server running on port 5000');
});
// -------------  end server -------------


// ------- middleware start ---------
app.use(express.json());
// ------- middleware end ---------



// ------- routes start ---------
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
// ------- routes end ---------




// ---------------- connect DB start ----------------

const mongoURI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI_PROD 
  : process.env.MONGO_URI_LOCAL;

console.log('$----------------------MongoDB URI - ', mongoURI,' ----------------------$');

mongoose.connect(mongoURI)
  .then(() => console.log('$----------------------MongoDB connected'))
  .catch(err => console.log('XXXXXXX-------Error connecting to MongoDB------XXXXXXXX', err));

// ---------------- connect DB end ----------------








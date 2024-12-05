const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

//Routes
const fridgeRoutes = require('./routes/fridgeRoutes');
//const calendarRoutes = require('./routes/calendarRoutes')

const app = express();

connectDB();

const corsOptions = {
  origin: function (origin, callback){
    const whitelist = [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://210.117.211.26:3000",
      "http://210.117.211.26:5000"
    ];
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin);  
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
  };


app.use(cors(corsOptions));
app.use(express.json());



// Routes
app.use('/api/fridge', fridgeRoutes);
//app.use('/api/calendar'. calendarRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
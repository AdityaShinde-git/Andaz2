const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
;

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config()

// to hash the db's name and password for security using  dotenv
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
// Connect to MongoDB
mongoose.connect(`mongodb://${USERNAME}:${PASSWORD}@dafca-application-shard-00-00.twwi0.mongodb.net:27017,dafca-application-shard-00-01.twwi0.mongodb.net:27017,dafca-application-shard-00-02.twwi0.mongodb.net:27017/?ssl=true&replicaSet=atlas-odyoku-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Dafca-application`, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  location: String,
  experience: Number,
  rating: Number,
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// API to add a doctor
app.post('https://doctorsassignment-backend.onrender.com/add-doctor', async (req, res) => {
    try {
      const { name, specialty, location, experience, rating } = req.body;
      const newDoctor = new Doctor({ name, specialty, location, experience, rating });
      await newDoctor.save();
      res.status(201).json(newDoctor);  
    } catch (err) {
      console.error('Error saving doctor:', err);
      res.status(500).json({ error: 'Server error while adding doctor' });  
    }
  });

// API to list doctors with filters and pagination
app.get('https://doctorsassignment-backend.onrender.com/list-doctor-with-filter', async (req, res) => {
    const { specialty, location, page = 1, limit = 10 } = req.query;
    const query = {};
    if (specialty) query.specialty = specialty;
    if (location) query.location = location;
  
    const doctors = await Doctor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const total = await Doctor.countDocuments(query);
  
    res.status(200).send({ doctors, total });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ravi:ravi@cluster0.rxahatw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


const checkedInUserSchema = new mongoose.Schema({
  regNo: String,
});

const CheckedInUser = mongoose.model('CheckedInUser', checkedInUserSchema);


const userSchema = new mongoose.Schema({
  regNo: String,
});

const User = mongoose.model('User', userSchema);


app.post('/admin/add-user', async (req, res) => {
    try {
      let { regNo } = req.body;
      regNo = regNo.toUpperCase();

      
      const existingUser = await User.findOne({ regNo });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      
      const user = new User({ regNo });
      await user.save();
      res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  


app.post('/verify-user', async (req, res) => {
  try {
    let { regNo } = req.body;
    regNo = regNo.toUpperCase(); 
    const user = await User.findOne({ regNo });
    if (user) {
      res.status(200).json({ message: 'User found' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/checkin/add-user', async (req, res) => {
  try {
    let { regNo } = req.body;
    regNo = regNo.toUpperCase();

    
    const existingUser = await CheckedInUser.findOne({ regNo });
    if (existingUser) {
      return res.status(400).json({ error: 'User already checked in' });
    }

   
    const checkedInUser = new CheckedInUser({ regNo });
    await checkedInUser.save();
    res.status(201).json({ message: 'User checked in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

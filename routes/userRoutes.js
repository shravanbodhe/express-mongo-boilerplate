const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// मुख्य घटना:
// 1) /register - नवीन वापरकर्ता नोंदणी
// 2) /login - विद्यमान वापरकर्ता प्रमाणीकरण
// 3) /me - सुरक्षित रूट, JWT टोकन वापरून current user माहिती परत करते

// JWT टोकन तयार करण्यासाठी सहाय्यक फंक्शन
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// नोंदणी रूट: नवीन user तयार करते आणि JWT टोकन परत करते
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // नोंदणीची सुरुवात: क्लाएंटकडून नाव, ईमेल, पासवर्ड आवश्यक आहेत
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ईमेल आधीच अस्तित्वात आहे का तपासा
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // नवीन वापरकर्ता तयार करा // hashed password स्वयंचलितपणे User मॉडेलमधील pre-save hook मध्ये तयार होईल
    const user = await User.create({ name, email, password });

    // यशस्वी नोंदणी: टोकन आणि user माहिती परत करा
    res.status(201).json({
      message: 'User registered successfully',
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// लॉगिन रूट: ईमेल व पासवर्ड तपासून टोकन परत करते
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // लॉगिनची सुरुवात: ईमेल व पासवर्ड आवश्यक आहेत
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // उपयोगकर्ता शोधा आणि पासवर्डसहित मिळवा
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // पासवर्ड जुळतो का तपासा
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // यशस्वी लॉगिन: JWT टोकन परत करा
    res.json({
      message: 'Login successful',
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// सुरक्षित रूट: वापरकर्त्याची माहिती परत करते, auth middleware वापरते
// auth middleware JWT टोकन सत्यापित करते आणि req.user मध्ये user सेट करते
// Major Event: current user profile fetch
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;

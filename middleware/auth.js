const jwt = require('jsonwebtoken');
const User = require('../models/User');

// या middleware चे काम: API रिक्वेस्ट कडून JWT टोकन तपासणे आणि
// त्यानुसार authenticated user शोधणे.
//
// वापरण्याची पद्धत:
// - क्लायंटने `Authorization: Bearer <token>` हे हेडर पाठवले पाहिजे.
// - टोकन वैध असल्यास, `req.user` मध्ये User ऑब्जेक्ट सेट केले जाते.
// - नंतरचा रूट हँडलर `req.user` वापरू शकतो.
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // वेध घेणे: Authorization हेडर नसेल किंवा Bearer टोकन स्वरूपात नसेल.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // हेडरमधून टोकन काढा.
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // टोकनमधील user id वापरून डेटाबेसमधून user शोधा.
    // What -password means:
    //    - means exclude

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // authenticated user पर्यंतच्या पुढील middleware/route handler कडे पोहचवा.
    req.user = user;
    next();
  } catch (error) {
    // टोकन अमान्य किंवा एखादी इतर चूक झाल्यास 401 परत करा.
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const { Users } = require('../models'); // Assuming your user model is exported from here

// It's highly recommended to store your client ID in an environment variable
const GOOGLE_CLIENT_ID = '1006918822791-8u7l0v8mlkv5im9ogh0acefffhpmfila.apps.googleusercontent.com';
const ADMIN_EMAILS = ['hvsram@gmail.com', 'admin@example.com']; // Add your admin emails here

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/google-login
router.post('/google-login', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Authentication token is missing.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const isAdmin = ADMIN_EMAILS.includes(email);

    // Check if user already exists in your database
    let user = await Users.findOne({ where: { googleId } });

    if (!user) {
      // If user doesn't exist, create a new one
      user = await Users.create({
        googleId,
        email,
        username: name, // Or however you want to handle usernames
        isAdmin,
        // You might want to add other fields like 'picture' to your model
      });
    } else {
      // If user exists, update their admin status if necessary
      if (user.isAdmin !== isAdmin) {
        user.isAdmin = isAdmin;
        await user.save();
      }
    }

    // Here, you would typically create a session or issue a JWT for your application
    // For now, we'll just send back the user information
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid authentication token.' });
  }
});

module.exports = router;

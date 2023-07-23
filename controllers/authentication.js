const { MongoDB } = require('../database/mongo');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authentication');
const bcrypt = require('bcrypt');


class AuthenticationController {

  static async logout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  static async login(req, res) {   
    const { email, password } = req.body;

    // Check email and password are present
    if (!email || !password){
      return res.status(400).json({error: 'Missing email or password.'})
    }

    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');

      // Check if user exists
      const exists = await usersCollection.findOne({ email });
      if (exists) {
        // Check password hash against stored hash
        const isValidPwd = await bcrypt.compare(password, exists.hashPwd);
        if (isValidPwd) {
          const {_id, orgid, permissions} =  exists;
          const user = { userid: _id, orgid, permissions}

          // Create signed bscypt object with user data
          const token = jwt.sign(user, SECRET_KEY, { expiresIn: '24h' });
          
          // Set cookie token
          res.cookie('token', token, { httpOnly: true });
          
          res.status(200).json({ success: true, token });
          MongoDB.closedb();
        } else {
          res.status(403).json({ error: 'Invalid password.' })
        }
      } else {
        res.status(404).json({ error: 'User not registered.' });
        MongoDB.closedb()
      }
    } catch (error) {
      res.status(500).json({error: 'Server error.'});
    }
  }
}

module.exports = {
  AuthenticationController
}
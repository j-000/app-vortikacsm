const { MongoDB } = require('../database/mongo');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authentication');


class UsersController {

  static async register(req, res){
    const { name, surname, email, password } = req.body;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');

      // Check if email exists
      const exists = await usersCollection.findOne({email});
      if (exists) {
        MongoDB.closedb()
        res.status(409).json({error: 'Already registered.'});
      }

      // Create new user and save
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      const orgid = await usersCollection.countDocuments() + 1;
      const newUser = new User(name, surname, email, hashPwd, orgid).toJSON();
      const result = await usersCollection.insertOne(newUser);
      res.status(201).json({success: true});

    } catch (error) {
      res.status(500).json({error});
    }
  }

  static async addNewUser(req, res) {
    const orgid = req.user.orgid;
    const { name, surname, email, password } = req.body;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');

      // Check if email exists
      const exists = await usersCollection.findOne({email});
      if (exists) {
        MongoDB.closedb()
        res.status(409).json({error: 'Already registered.'});
      }

      // Create new user and save
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      const newUser = new User(name, surname, email, hashPwd, orgid).toJSON();
      const result = await usersCollection.insertOne(newUser);
      res.status(201).json({success: true});
    } catch (error) {
      res.status(500).json({error});
    }
  }

  static async update(req, res) {

  }

  static async getById(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');
      const _id = new ObjectId(req.params.userid);
      const user = await usersCollection.findOne({ orgid, _id });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({error});
    }
  }

  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');
      const users = await usersCollection.find({ orgid }).toArray();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({error});
    }
  }

  static async delete(req, res) {
    const orgid = req.user.orgid;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');
      const _id = new ObjectId(req.params.userid);
      const user = await usersCollection.findOneAndDelete({ orgid, _id });
      res.status(200).json({success: true});
    } catch (error) {
      res.status(500).json({error});
    }
  }

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
          
          res.status(200).json({ success: true, token, user });
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
  UsersController
}
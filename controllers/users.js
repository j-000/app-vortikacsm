const { MongoDB } = require('../services/mongo');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authentication');
const bcrypt = require('bcrypt');


class UsersController {
  static async getUsers(req, res){
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');
      const users = await usersCollection.find().toArray();

      res.status(200).json(users)
      
      MongoDB.closedb()
    } catch (error) {
      console.error(`Error: ${error}`);
      res.status(500).json({ error });
    }
  } 
  
  static async createUser(req, res){
    const { name, surname, email, password } = req.body;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');

      const exists = await usersCollection.findOne({email});
      if (exists) {
        res.status(409).json({error: 'Already registered.'});
        MongoDB.closedb()
        return
      }
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      const result = await usersCollection.insertOne({ name, surname, email, hashPwd });

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({error})
    }
  }

  static async logoutUser(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const db = await MongoDB.getdb();
      const usersCollection = db.collection('users');
      const exists = await usersCollection.findOne({email});
      if (exists) {
        // Check password hash against stored hash
        const isValidPwd = await bcrypt.compare(password, exists.hashPwd);
        if(isValidPwd){

          const token = jwt.sign({userid: exists._id }, SECRET_KEY, {expiresIn: '24h'});
          res.cookie('token', token, {httpOnly: true});
          res.status(200).json({success: true});
          MongoDB.closedb();
          return

        } else {
          res.status(403).json({error: 'Invalid password.'})
          return
        }

      } else {
        res.status(404).json({error: 'User not registered.'});
        MongoDB.closedb()
        return
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({error});
      return
    }
  }
  
}


module.exports = {
  UsersController
}
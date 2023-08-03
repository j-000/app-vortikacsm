const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authentication');
const UserService = require('../database/services/user');


class UsersController {

  static async register(req, res){
    const { name, surname, email, password } = req.body;
    try {
      const newUser = await UserService.create(name, surname, email, password)
      res.status(201).json({success: true});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  static async addNewUser(req, res) {
    await this.register(req, res);
  }

  static async update(req, res) {

  }

  static async getById(req, res) {
    const orgid = req.user.orgid;
    try {
      const _id = new ObjectId(req.params.userid);
      const user = UserService.getOne({ orgid, _id }, {hashPwd: 0});
      if (user){
        res.status(200).json({ user });
      } else {
        res.status(404).json({error: 'User not found.'});
      }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      const users = await UserService.getMany({ orgid }, {hashPwd: 0});
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  static async delete(req, res) {
    const orgid = req.user.orgid;
    try {
      const _id = new ObjectId(req.params.userid);
      const user = await UserService.remove({ orgid, _id });
      res.status(200).json({success: true});
    } catch (error) {
      res.status(500).json({error: error.message});
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
      // Check if user exists
      const user = await UserService.getOne({ email });
      if (user) {
        // Check password hash against stored hash
        const isValidPwd = await bcrypt.compare(password, user.hashPwd);
                  
        if (isValidPwd) {
          // Create signed bscypt object with user data
          const userData = { userid: user._id, name: user.name, orgid: user.orgid, permissions: user.permissions}
          const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '24h' });
          // Set last login
          UserService.update({_id: user._id}, {lastLogin: Date.now()})
          // Set cookie token
          res.cookie('token', token, { httpOnly: true });
          
          // Obtain the user obj again but remove sensitive props
          const u = await UserService.getOne({ email }, { hashPwd: 0, __v: 0 })
          res.status(200).json({ success: true, token, user: u, domains: {live: process.env.LIVE_DOMAIN, preview: process.env.PREVIEW_DOMAIN} });

        } else {
          res.status(403).json({ error: 'Invalid password.' })
        }
      } else {
        res.status(404).json({ error: 'User not registered.' });
      }
    } catch (error) {
      res.status(500).json({error: 'Server error.'});
    }
  }

}


module.exports = {
  UsersController
}
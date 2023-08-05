const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../middlewares/authentication');
const UserService = require('./user.service');
const RoleServive = require('../roles/role.service');
const passwordValidator = require('password-validator');


function checkPasswordStrength(password){
  var passwordSchema = new passwordValidator();
  passwordSchema
    .is().min(10, 'Password must have 10 characters.')
    .has().uppercase(1, 'Password must include uppercase characters.')
    .has().lowercase(1, 'Password must include lowercase characters.')
    .has().digits(2, 'Password must include at least 2 digits.')
    .has().not().spaces(1, 'Password must not have spaces.')
  return passwordSchema.validate(password, { details : true});
}

class UsersController {

  static async register(req, res){
    const { name, surname, email, password } = req.body;
    try {
      const passwordValidationErrors = checkPasswordStrength(password)      
      if (passwordValidationErrors.length > 0) {
        return res.status(422).json({error: passwordValidationErrors.map(({message}) => { return message }).join(' ')});
      }
      const newUser = await UserService.create(name, surname, email, password)
      res.status(201).json({success: true});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  }

  static async addNewUser(req, res) {
    const { name, surname, email, password, role } = req.body;
    try {
      const passwordValidationErrors = checkPasswordStrength(password)      
      if (passwordValidationErrors.length > 0) {
        return res.status(422).json({error: passwordValidationErrors.map(({message}) => { return message }).join(' ')});
      }
      const _role = await RoleServive.getOne({ name: role });
      if (_role) {
        // Create new user.
        // Set orgid and role as requested.
        const newUser = await UserService.create(name, surname, email, password);
        await UserService.update({ email }, { orgid: req.user.orgid, role });
        res.status(201).json({success: true, message: 'User added.'});
      } else {
        res.status(422).json({success: true, message: 'Invalid role.'});
      }
    } catch (error) {
      res.status(500).json({error: error.message});
    }
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
          const role = await RoleServive.getOne({ name: user.role });
          const userData = { userid: user._id, name: user.name, orgid: user.orgid, role: user.role, permissions: role.permissions}
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
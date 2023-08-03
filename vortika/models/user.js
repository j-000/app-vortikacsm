const { default: mongoose } = require("mongoose");


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  surname: {
    type: String
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    },
    required: [true, 'Email is required'],
    unique: true, 
  },
  hashPwd: {
    type: String,
    required: [true, 'Password is required']
  },
  orgid: {
    type: Number,
    required: [true, 'Orgid is required']
  },
  permissions: {
    type: [String]
  },
  lastLogin: {
    type: Date,
  }
},{timestamps: true});


const UserModel = mongoose.model('users', UserSchema)


module.exports = {
  UserModel
}
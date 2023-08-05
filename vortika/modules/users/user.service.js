const { UserModel } = require("./user.model");
const bcrypt = require('bcrypt');


async function create(name, surname, email, password) {
  try {
  const orgid = await UserModel.countDocuments() + 1; //#TODO - change this to use appsettings doc
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  // Default role
  const role = 'editor';
  const exists = await this.getOne({ email });  
  if (exists) {
    console.log(exists)
    throw new Error('User already exists.');
  } else {
    const newUser = await UserModel.create({ name, surname, email, orgid, hashPwd, role });
    return newUser
  }
} catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await UserModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await UserModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function update(obj, newData) {
  try {
    const result = await UserModel.updateOne(obj, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await UserModel.findByIdAndDelete(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}

module.exports = {
  create,
  getOne,
  getMany,
  update,
  remove
}
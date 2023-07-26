const { UserModel } = require("../../models/user");
const bcrypt = require('bcrypt');
const { BASIC_PERIMISSIONS } = require("../../middlewares/permissions");


async function create(name, surname, email, password) {
  try {
  const orgid = await UserModel.countDocuments() + 1;
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);
  const permissions = BASIC_PERIMISSIONS;
  
  const exists = await this.getOne({ email });
  if (exists) {
    throw new Error('User already exists.') 
  }

  const newUser = await UserModel.create({ name, surname, email, orgid, hashPwd, permissions });
  return newUser

} catch (error) {
    throw error;
  }
}

async function getOne(obj) {
  try {
    const result = await UserModel.findOne(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj) {
  try {
    const result = await UserModel.find(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function update(id, newData) {
  try {
    const result = await UserModel.findByIdAndUpdate(id, newData).exec();
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
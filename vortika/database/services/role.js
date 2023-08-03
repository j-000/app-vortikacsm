const { RoleModel } = require("../../models/role");


async function getOne(obj, proj) {
  try {
    const result = await RoleModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getAll(obj, proj) {
  try {
    const result = await RoleModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}


async function update(obj, newData) {
  try {
    const result = await RoleModel.updateOne(obj, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
  getOne,
  update,
  getAll
}
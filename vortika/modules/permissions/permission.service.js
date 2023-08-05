const { PermissionsModel } = require("./permission.model");


async function getAll(obj, proj) {
  try {
    const result = await PermissionsModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
    getAll
}
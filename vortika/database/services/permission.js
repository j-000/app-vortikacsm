const { PermissionsModel } = require("../../models/permission");


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
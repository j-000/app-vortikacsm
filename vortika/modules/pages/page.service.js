const { PageModel } = require("./page.model");


async function create({orgid, filepath, name, status, createdUser, fileType, urlslug}) {
  try {
    const result = await PageModel.create({ orgid, filepath, name, status, createdUser, fileType, urlslug});
    return result;    
  } catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await PageModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function updateOne(obj, newData) {
  try {
    const result = await PageModel.findOneAndUpdate(obj, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await PageModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await PageModel.findByIdAndDelete(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
  create,
  getMany,
  getOne,
  updateOne,
  remove
}
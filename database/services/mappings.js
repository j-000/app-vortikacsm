const { MappingsModel } = require("../../models/mappings");



async function create(feedid, orgid) {
  try {
    const result = await MappingsModel.create({feedid, orgid});
    return result;    
  } catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await MappingsModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await MappingsModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function update(id, newData) {
  try {
    const result = await MappingsModel.findOneAndUpdate(id, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await MappingsModel.findByIdAndDelete(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
  create,
  getMany,
  getOne,
  remove,
  update
}
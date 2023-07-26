const { FeedModel } = require("../../models/feed");


async function create(name, url, type, firstElementKey, dataType, orgid) {
  try {
    const result = await FeedModel.create({name, url, type, firstElementKey, dataType, orgid});
    
    // TODO: Need to do this on the Mapping Servive
    // create a new mapping
    // Insert mapping object tagged with new feed id.
    
  } catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await FeedModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await FeedModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function update(id, newData) {
  try {
    const result = await FeedModel.findByIdAndUpdate(id, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await FeedModel.findByIdAndDelete(obj).exec();
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
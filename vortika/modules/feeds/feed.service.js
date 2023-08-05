const { FeedModel } = require("./feed.model");


async function create(name, url, type, firstElementKey, dataType, orgid) {
  try {
    const result = await FeedModel.create({name, url, type, firstElementKey, dataType, orgid});
    return result;    
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

async function update(obj, newData) {
  try {
    const result = await FeedModel.findOneAndUpdate(obj, newData).exec();
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
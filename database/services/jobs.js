const { JobModel } = require("../../models/jobs");


async function create(feedid, orgid, props) {
  try {
    const result = await JobModel.create({ feedid, orgid, props });
    return result;    
  } catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await JobModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await JobModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getManyPaginated(obj, proj, skip, limit) {
  try {
    const result = await JobModel.find(obj, proj).skip(skip).limit(limit).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function update(id, newData) {
  try {
    const result = await JobModel.findByIdAndUpdate(id, newData).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await JobModel.findByIdAndDelete(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
  create,
  getMany,
  getManyPaginated,
  getOne,
  remove,
  update
}
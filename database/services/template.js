const { TemplateModel } = require("../../models/template");


async function create(orgid, filepath, name, type) {
  try {
    const result = await TemplateModel.create({ orgid, filepath, name, type});
    return result;    
  } catch (error) {
    throw error;
  }
}

async function getOne(obj, proj) {
  try {
    const result = await TemplateModel.findOne(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function getMany(obj, proj) {
  try {
    const result = await TemplateModel.find(obj, proj).exec();
    return result
  } catch (error) {
    throw error
  }
}

async function remove(obj) {
  try {
    const result = await TemplateModel.findByIdAndDelete(obj).exec();
    return result
  } catch (error) {
    throw error
  }
}


module.exports = {
  create,
  getMany,
  getOne,
  remove
}
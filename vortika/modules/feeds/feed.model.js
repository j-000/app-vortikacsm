const { default: mongoose } = require("mongoose");


const feedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Feed name is required']
  },
  url: {
    type: String,
    required: [true, 'Feed URL is required']
  },
  type: {
    type: String,
    required: [true, 'Feed type is required']
  },
  orgid: {
    type: Number,
    required: [true, 'Feed orgid is required']
  },
  firstElementKey: {
    type: String,
    required: [true, 'First element key is required']
  },
  lastImport: {
    type: Date,
  },
  dataType: {
    type: String,
    required: [true, 'Data type is required']
  },
  sourceFields: {
    type: [String]
  },
  cron: {
    type: String
  },
  repeatableJobId: {
    type: String
  }
})


const FeedModel = mongoose.model('feeds', feedSchema);

module.exports = {
  FeedModel
}

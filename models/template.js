const { default: mongoose } = require("mongoose");

const templateSchema = new mongoose.Schema({
  orgid: {
    type: Number,
    required: [true, 'orgid required']
  },
  type: {
    type: String,
    required: [true, 'template type required']
  },
  filepath: {
    type: String,
    required: [true, 'Filepath required']
  },
  name: {
    type: String,
    required: [true, 'Name required']
  },
  status: {
    type: String,
    default: 'new'
  },
  lastEdited: {
    type: Object,
    default: {
      timestamp: '',
      byUser: ''
    }
  },
  lastPublished: {
    type: Object,
    default: {
      timestamp: '',
      to: '',
      byUser: ''
    }
  } 
}, {timestamps: true})

const TemplateModel = mongoose.model('templates', templateSchema);

module.exports = {
  TemplateModel
}
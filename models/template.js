const { default: mongoose } = require("mongoose");

const pageSchema = new mongoose.Schema({
  orgid: {
    type: Number,
    required: [true, 'orgid required']
  },
  fileLocked: {
    type: Boolean,
    default: false
  },
  fileLockedBy: {
    type: String,
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
  },
  createdUser: {
    type: String,
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

const TemplateModel = mongoose.model('templates', pageSchema);

module.exports = {
  TemplateModel
}
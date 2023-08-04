const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const pageSchema = new mongoose.Schema({
  orgid: {
    type: Number,
    required: [true, 'orgid required']
  },
  themeId: {
    type: ObjectId,
  },
  fileType: {
    type: String,
    required: [true, 'File type required']
  },
  styles: {
    type: String
  },
  javascript: {
    type: String
  },
  pages: {
    type: [ObjectId]
  },
  urlslug: {
    type: String
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

const PageModel = mongoose.model('pages', pageSchema);

module.exports = {
  PageModel
}
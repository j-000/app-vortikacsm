const { default: mongoose, ObjectId } = require("mongoose");


const jobSchema = new mongoose.Schema({
  feedid: {
    type: ObjectId,
    required: true
  },
  orgid: {
    type: Number, 
    required: true
  },
  // This is going to be the context object used in the templates.
  props: {
    type: Object
  }
});

const JobModel = mongoose.model('jobs', jobSchema);

module.exports = {
    JobModel
}
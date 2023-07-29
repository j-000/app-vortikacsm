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
  props: {
    type: Object
  }
});

const JobModel = mongoose.model('jobs', jobSchema);

module.exports = {
    JobModel
}
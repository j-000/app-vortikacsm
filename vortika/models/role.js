const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    permissions: {
        type: [String]
    }
});


const RoleModel = mongoose.model('roles', roleSchema);

module.exports = {
    RoleModel
}
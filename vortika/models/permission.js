const PERMISSIONS = {
    // Feeds
    CREATE_FEED: 'create-feed',
    READ_FEED: 'read-feed',
    UPDATE_FEED: 'update-feed',
    DELETE_FEED: 'de;ete-feed'
}

const {default: mongoose } = require('mongoose');

const permissionsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const PermissionsModel = mongoose.model('permissions', permissionsSchema)

module.exports = {
    PermissionsModel,
    PERMISSIONS
}
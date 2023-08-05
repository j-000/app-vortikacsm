const PERMISSIONS = {
    // Feeds
    CREATE_FEED: 'create-feed',
    READ_FEED:   'read-feed',
    UPDATE_FEED: 'update-feed',
    DELETE_FEED: 'delete-feed',

    // Users
    CREATE_USER: 'create-user',
    READ_USER:   'read-user',
    UPDATE_USER: 'update-user',
    DELETE_USER: 'delete-user',

    // Page
    CREATE_PAGE: 'create-page',
    READ_PAGE:   'read-page',
    UPDATE_PAGE: 'update-page',
    DELETE_PAGE: 'delete-page',
    PUBLISH_PAGE: 'publish-page',
    PREVIEW_PAGE: 'preview-page',

    // Role
    CREATE_ROLE: 'create-role',
    READ_ROLE:   'read-role',
    UPDATE_ROLE: 'update-role',
    DELETE_ROLE: 'delete-role'
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
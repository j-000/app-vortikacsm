const { PermissionsModel } = require('../../models/permission');
const { RoleModel } = require('../../models/role');

async function addPermissions(){
    const exist = await PermissionsModel.countDocuments();
    if (exist > 0) {
        return
    } else {
        console.log('Added permissions');
        await PermissionsModel.insertMany([
            { name: 'create-feed'},
            { name: 'read-feed'},
            { name: 'update-feed'},
            { name: 'delete-feed'},
        ])
    };
    
}
addPermissions();

async function createRoles() {
    const exist = await RoleModel.countDocuments();
    if (exist > 0) {
        return
    } else {
        RoleModel.insertMany([
            {name: 'admin', permissions: ['create-feed', 'read-feed', 'update-feed', 'delete-feed']},
            {name: 'publisher', permissions: ['read-feed']},
            {name: 'editor', permissions: ['read-feed']},
        ])
    }
}
createRoles();

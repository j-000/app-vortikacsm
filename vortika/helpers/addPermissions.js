const { PermissionsModel } = require('../modules/permissions/permission.model');
const { RoleModel } = require('../modules/roles/role.model');

async function addPermissions() {
  const exist = await PermissionsModel.countDocuments();
  if (exist == 18) {
    return
  } else {
    await PermissionsModel.insertMany([
      { name: 'create-feed' },
      { name: 'read-feed' },
      { name: 'update-feed' },
      { name: 'delete-feed' },

      { name: 'create-user' },
      { name: 'read-user' },
      { name: 'update-user' },
      { name: 'delete-user' },

      { name: 'create-page' },
      { name: 'read-page' },
      { name: 'update-page' },
      { name: 'delete-page' },
      { name: 'preview-page' },
      { name: 'publish-page' },

      { name: 'create-role' },
      { name: 'read-role' },
      { name: 'update-role' },
      { name: 'delete-role' },



    ])
  };

}
addPermissions();

async function createRoles() {
  const exist = await RoleModel.countDocuments();
  if (exist == 3) {
    return
  } else {
    RoleModel.insertMany([
      {
        name: 'admin',
        permissions: [
          'create-feed', 'read-feed', 'update-feed', 'delete-feed',
          'create-user', 'read-user', 'update-user', 'delete-user',
          'create-page', 'read-page', 'update-page', 'delete-page', 'preview-page', 'publish-page',
          'create-role', 'read-role', 'update-role', 'delete-role'
        ]
      },
      { 
        name: 'publisher', 
        permissions: [
          'read-feed', 
          'create-page', 'read-page', 'update-page', 'preview-page', 'publish-page',
        ] 
      },
      { 
        name: 'editor', 
        permissions: [
          'read-feed',
          'create-page', 'read-page', 'update-page'
        ] 
      },
    ])
  }
}
createRoles();

module.exports = {
  createRoles
}
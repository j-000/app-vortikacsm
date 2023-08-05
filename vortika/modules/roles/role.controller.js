const RoleService = require('./role.service');
const PermissionService = require('../permissions/permission.service');

class RolesController {
  static async getAll(req, res) {
    try {
      const roles = await RoleService.getAll();
      res.json({ success: true, roles })
    } catch (error) {
      res.json({ error: 'Error getting roles.' })
    }
  }

  static async update(req, res) {
    try {
      // Get all valid permissions name list. This will help validate new permissions.
      const allValidPermissions = (await PermissionService.getAll()).map(p => p.name);
      // Loop through all the roles in the request payload
      Object.entries(req.body).forEach(async ([roleName, newPermissions]) => {
        // Find it in the Roles collection
        const role = await RoleService.getOne({ name: roleName });
        if (role) {
          // Validate each new permission first
          let update = true;
          newPermissions.forEach(p => {
            if (!allValidPermissions.includes(p)) {
              // set update to false if invalid permissions name sent.
              update = false;
            }
          })
          if (update) {
            // Valid data provided to update this role. Proceed to update
            await RoleService.update({ name: roleName }, { permissions: newPermissions });
          }
        }
      })
      res.json({ success: true, message: 'Roles updated.' })
    } catch (error) {
      res.json({ error: 'Error updating roles.' })
    }
  }
}

module.exports = {
  RolesController
}
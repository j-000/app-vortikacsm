const PermissionsService = require('../database/services/permission');

class PermissionsController {
    static async getAll(req, res){
        try{
            const permissions = await PermissionsService.getAll();
            res.json({success: true, permissions});
        } catch (error) {
            res.json({ error: 'Error getting permissions. '});
        }
    }
}

module.exports = {
    PermissionsController
}
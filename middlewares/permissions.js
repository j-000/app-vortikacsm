const PERMISSIONS = {

  // User 
  VIEWUSER: 'view-user',
  CREATEUSER: 'create-user',
  UPDATEUSER: 'update-user',
  DELETEUSER: 'delete-user',
  
  // Feed 
  VIEWFEED: 'view-feed',
  CREATEFEED: 'create-feed',
  UPDATEFEED: 'update-feed',
  DELETEFEED: 'delete-feed',

}


function CheckPermissions(permission){
  return (req, res, next) => {
    if (req.user.permissions.includes(permission)) return next();
    return res.status(403).json({error: 'Invalid Permissions Level.'})
  }
}


module.exports = {
  PERMISSIONS,
  CheckPermissions
}

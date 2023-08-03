function HasPermissions(permission){
  return (req, res, next) => {
    // req.user = obj from signin JWT token
    if (req.user.permissions.includes(permission)) return next();
    return res.status(403).json({error: 'Invalid permissions level.'})
  }
}

module.exports = {
  HasPermissions
}

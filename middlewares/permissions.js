const PERMISSIONS = {

  // User 
  VIEW_USER: 'view-user',
  CREATE_USER: 'create-user',
  UPDATE_USER: 'update-user',
  DELETE_USER: 'delete-user',
  
  // Feed 
  VIEW_FEED: 'view-feed',
  CREATE_FEED: 'create-feed',
  UPDATE_FEED: 'update-feed',
  DELETE_FEED: 'delete-feed',

  // CMS
  // Templates
  VIEW_BASIC_TEMPLATE: 'view-basic-template',
  CREATE_BASIC_TEMPLATE: 'create-basic-template',
  UPDATE_BASIC_TEMPLATE: 'update-basic-template',
  DELETE_BASIC_TEMPLATE: 'delete-basic-template',

  VIEW_ADVANCED_TEMPLATE: 'view-advanced-template',
  CREATE_ADVANCED_TEMPLATE: 'create-advanced-template',
  UPDATE_ADVANCED_TEMPLATE: 'update-advanced-template',
  DELETE_ADVANCED_TEMPLATE: 'delete-advanced-template',

  VIEW_SEARCH_RESULTS_TEMPLATE: 'view-search-results-template',
  CREATE_SEARC_HRESULTS_TEMPLATE: 'create-search-results-template',
  UPDATE_SEARCH_RESULTS_TEMPLATE: 'update-search-results-template',
  DELETE_SEARCHR_ESULTS_TEMPLATE: 'delete-search-results-template',
  
  // Publishing
  VIEW_PUBLISH_PREVIEW: 'view-publish-preview',
  UPDATE_PUBLISH_PREVIEW: 'update-publish-preview',
  ALLOW_PULISH_PREVIEW: 'allow-publish-preview',

  VIEW_PUBLISH_LIVE: 'view-publish-live',
  UPDATE_PUBLISH_LIVE: 'view-publish-live',
  ALLOW_PUBLISH_LIVE: 'view-publish-live',

  
  // JOBS
  

}


function CheckPermissions(permission){
  return (req, res, next) => {
    if (req.user.permissions.includes(permission)) return next();
    return res.status(403).json({error: 'Invalid Permissions Level.'})
  }
}

const BASIC_PERIMISSIONS = [
  PERMISSIONS.VIEW_FEED,
  PERMISSIONS.UPDATE_FEED,
  PERMISSIONS.CREATE_FEED,
  PERMISSIONS.DELETE_FEED,

  PERMISSIONS.VIEW_USER,
  PERMISSIONS.UPDATE_USER

]

module.exports = {
  PERMISSIONS,
  BASIC_PERIMISSIONS,
  CheckPermissions
}

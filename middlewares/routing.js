function setsubdomain(req, res, next) { 
    const liveSiteUrl = process.env.LIVE_DOMAIN;
  
    // Set flag to 'public' so it always goes to live site by default
    // This should match the same name as the public/ templates folder
    req._subdomain = 'public';
  
    // check if a subdomain is being accessed
    if (req.hostname.includes('.')){

      // Only "preview" subdomain is allowed.
      if (process.env.PREVIEW_DOMAIN.includes(req.hostname)){
        // Set flag to 'preview'
        // This should match the same name as the preview/ templates folder
        req._subdomain = 'preview';
      } else {
        // If it's anything else other than preview, redirect to main site (public);
        res.redirect(liveSiteUrl);
        return
      }
    }
    // Continue with route
    next();
}

module.exports = {
    setsubdomain
}
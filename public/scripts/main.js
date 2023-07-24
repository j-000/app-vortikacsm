// Store the original fetch function for later use
const originalFetch = window.fetch;

// Override the fetch function with your guarded version
window.fetch = function(url, options) {
  // Call the guard function
  return httpGuard(url, options);
};

// Your guard function
function httpGuard(url, options) {
  if (!sessionStorage.getItem('token')) {
    window.location = '/logout';
    return
  }
  // Call the original fetch function, not the overridden one!
  return originalFetch(url, options);
}

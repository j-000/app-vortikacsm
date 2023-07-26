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


// Run Importer 
function runImporter(feedId){
  fetch(`/api/feeds/${feedId}/run-import`, {
    method: 'post',
    headers: {
      authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
  .then(data => data.json())
  .then(json => {
    if(json.success){
      showToast('<i class="fas fa-gears text-success"></i> Importer started.')
    } else {
      showToast(`<i class="fas fa-triangle-exclamation text-warning"></i> ${json.error}`)
    }
  })
}


// Toast function
function showToast(message){
  document.querySelector('#toastTime').textContent = moment(Date.now()).fromNow();
  document.querySelector('.toast-body').innerHTML = message;
  bootstrap.Toast.getOrCreateInstance(document.querySelector('#liveToast')).show();
}

// Navigate function
function navigateTo(url){
  const orgid = JSON.parse(sessionStorage.getItem('user')).orgid;
  window.location = url.replace('#ORGID#', orgid);
}

// Show toast on _t query param set
const _t = new URLSearchParams(window.location.search).get('_t');
if (_t) { 
  showToast(`<span class="text-danger"><i class="fa-solid fa-ban me-2"></i><span>${_t.toUpperCase()}</span></span>`); 
}
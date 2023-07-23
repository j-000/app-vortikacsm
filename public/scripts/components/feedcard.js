class FeedCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get observedProperties(){
    return ['feed'];
  }

  connectedCallback() {
    const feedid = this.getAttribute('feed');    
    fetch(`/api/feeds/${feedid}`, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(data => data.json())
    .then( ({feed}) => {
       this.shadowRoot.innerHTML = `
      <script src="http://localhost:3001/scripts/dependencies/moment.js"></script>
       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
      crossorigin="anonymous" referrerpolicy="no-referrer" />
       <style>@import "styles/dependencies/bootstrap5.css"; 
       a {
        text-decoration: none;
       }
       .border-left-primary {
        border-left: .25rem solid #4e73df!important}
       </style>
        <a href="/feeds/${feed._id}" class="card border-left-primary shadow mb-3">
          <div class="card-body py-2">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="d-flex justify-content-between">
                  <h5 class="mb-1 card-title">${feed.name}</h5>
                  <small class="text-muted">${feed._id} | <span class="badge text-bg-info">orgid: ${feed.orgid}</span></small>
                </div>
              </div>
            </div>
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <p class="card-title">${feed.url}</p>
              </div>
              <div class="col-auto">
                <i class="fas fa-rss fa-2x text-success"></i>
              </div>
            </div>
            <div class="row no-gutters align-items-center">
              <div class="col mr-2 d-flex justify-content-around">
                <span><i class="fas fa-briefcase"></i> ${feed.jobs ? feed.jobs.length : '0'} Jobs</span> 
                <span class="text-success"><i class="fas fa-triangle-exclamation"></i> 0 Failures</span> 
                <small class="text-muted"><i class="fas fa-file-import"></i> Last import ${moment(feed.lastImport).fromNow()}</small>
              </div>
            </div>
          </div>
        </a>`
    })
  }
}

export default FeedCard;
import global from '../stores/global';


const root_api_url = 'http://localhost:3001'


function headers(){
  const store = global();
  return {
    headers: {
      authorization: `Bearer ${store.user.token}`,
      'Content-Type': 'application/json'
    }
  }
}


class Api {
  // Static class. Don't use constructor

  static async getFeeds() {
    const response = await fetch(`${root_api_url}/api/feeds`, { ...headers() });
    const json = await response.json();
    return json;
  };

  static async getFeedById(feedid) {
    const response = await fetch(`${root_api_url}/api/feeds/${feedid}`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async updateFeed(feedid, bodyData){
    const response = await fetch(`${root_api_url}/api/feeds/${feedid}`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async addNewFeed(bodyData){
    const response = await fetch(`${root_api_url}/api/feeds`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async getMappings() {
    const response = await fetch(`${root_api_url}/api/mappings`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async getMappingsByFeedId(feedid){
    const response = await fetch(`${root_api_url}/api/mappings/feed/${feedid}`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async updateMappingsByFeedId(feedid, bodyData) {
    const response = await fetch(`${root_api_url}/api/mappings/feed/${feedid}`, {
        method: 'post',
        ...headers(),
        body: JSON.stringify(bodyData)
      });
      const json = await response.json();
      return json;
  }

  static async getJobs(page) {
    const response = await fetch(`${root_api_url}/api/jobs?page=${page}`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async getJobsByFeedId(feedid, page) {
    const response = await fetch(`${root_api_url}/api/jobs/feed/${feedid}?page=${page}`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async getUsers() {
    const response = await fetch(`${root_api_url}/api/users`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async addUser(bodyData){
    const response = await fetch(`${root_api_url}/api/users`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async getRoles() {
    const response = await fetch(`${root_api_url}/api/roles`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async register(bodyData) {
    const response = await fetch(`${root_api_url}/api/register`, { 
      method: 'post', 
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async login(bodyData) {
    const response = await fetch(`${root_api_url}/api/login`,{ 
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async getPermissions() {
    const response = await fetch(`${root_api_url}/api/permissions`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async updateRolePermissions(bodyData){
    const response = await fetch(`${root_api_url}/api/roles`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async runImporter(feedid) {
    const response = await fetch(`${root_api_url}/api/feeds/${feedid}/run-import`, { 
      method: 'post',
      ...headers()
    });
    const json = await response.json();
    return json;
  }

  static async getDashboardInfo() {
    const response = await fetch(`${root_api_url}/api/dashboard-info`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async getPagesByStatus(pagetype) {
    const response = await fetch(`${root_api_url}/api/cms/pages?status=${pagetype}`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async addNewPage(bodyData){
    const response = await fetch(`${root_api_url}/api/cms/pages`, {
      method: 'post', 
      ...headers(), 
      body: JSON.stringify(bodyData)});
    const json = await response.json();
    return json;
  }

  static async getPageById(pageid) {
    const response = await fetch(`${root_api_url}/api/cms/pages/${pageid}`, { ...headers() });
    const json = await response.json();
    return json;  
  }

  static async updatePageById(pageid, bodyData) {
    const response = await fetch(`${root_api_url}/api/cms/pages/${pageid}`, {
      method: 'put',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async publishPage(templateid, bodyData){
    const response = await fetch(`${root_api_url}/api/cms/pages/${templateid}`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

  static async getThemes() {
    const response = await fetch(`${root_api_url}/api/cms/themes`, { ...headers() });
    const json = await response.json();
    return json;
  }

  static async addNewTheme(bodyData) {
    const response = await fetch(`${root_api_url}/api/cms/themes`, {
      method: 'post',
      ...headers(),
      body: JSON.stringify(bodyData)
    });
    const json = await response.json();
    return json;
  }

}

export default Api;
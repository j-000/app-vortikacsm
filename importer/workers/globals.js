const xml2js = require('xml2js');
require('dotenv').config()
const root_api_url = process.env.API_URL;


function findRootNode(key, obj) {
  for (const k in obj) {
    if (k === key) {
      return obj[key];
    }
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const nestedResult = findRootNode(key, obj[k]);
      if (nestedResult !== undefined) {
        return nestedResult
      }
    }
  }
  return undefined
}

async function httpXML2Json(url) {
  try {
    const data = await fetch(url);
    const text = await data.text();
    const json = await xml2js.parseStringPromise(text);
    return json
  } catch (error) {
    throw error
  }
}

async function httpGet(url, token) {
  try {
    const data = await fetch(url, {
      method: 'get',
      headers: {
        'user-agent': 'Importer',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
    });
    const json = await data.json();
    return json
  } catch (error) {
    throw error
  }
}
async function httpPost(url, bodyData, token) {
  try {
    const data = await fetch(url, {
      method: 'post',
      headers: {
        'user-agent': 'Importer',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });
    const json = await data.json();
    return json
  } catch (error) {
    throw error
  }
}
async function httpDelete(url, token) {
  try {
    const data = await fetch(url, {
      method: 'delete',
      headers: {
        'user-agent': 'Importer',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    });
    const json = await data.json();
    return json
  } catch (error) {
    throw error
  }
}

async function getAccessToken() {
  const login = await fetch(`${root_api_url}/api/login`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.EMAIL,
      password: process.env.PASSWORD
    })
  })
  const json = await login.json();
  return json.token
}

module.exports = {
  httpDelete,
  httpGet,
  httpPost,
  httpXML2Json,
  findRootNode,
  getAccessToken
}
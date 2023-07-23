class Feed {
  constructor(name, url, type, orgid){
    this.name = name;
    this.url = url;
    this.type = type;
    this.orgid = orgid;
  }

  toJSON(){
    return {...this };
  }
}


module.exports = {
  Feed
}
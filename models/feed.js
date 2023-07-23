class Feed {
  constructor(name, url, type, orgid, firstElementKey){
    this.name = name;
    this.url = url;
    this.type = type;
    this.orgid = orgid;
    this.firstElementKey = firstElementKey
    // importedjobs
    // history
  }

  toJSON(){
    return {...this };
  }

}


module.exports = {
  Feed
}
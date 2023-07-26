class Feed {
  constructor(name, url, type, orgid, firstElementKey, dataType){
    this.name = name;
    this.url = url;
    this.type = type;
    this.orgid = orgid;
    this.firstElementKey = firstElementKey
    this.dataType = dataType
  }

  toJSON(){
    return {...this };
  }

}


module.exports = {
  Feed
}
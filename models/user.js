const { PERMISSIONS } = require("../middlewares/permissions");
const { VIEWFEED, CREATEFEED } = PERMISSIONS;


class User {
  constructor(name, surname, email, hashPwd, orgid){
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.hashPwd = hashPwd;
    this.orgid = orgid;
    this.permissions = [VIEWFEED, CREATEFEED]
  }

  toJSON(){
    return { ...this };
  }
}


module.exports = {
  User
}
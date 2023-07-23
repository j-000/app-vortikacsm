const { MongoClient } = require('mongodb');


class MongoDB {

  constructor(){
    this.client = null;
  }

  static async getdb(){
    try{
      const client = await MongoClient.connect('mongodb://localhost:27017');
      const db = client.db('database1');
      return db;
    } catch (err) {
      throw err;
    }
  }

  static closedb(){
    if(this.client){
      this.client.close();
    }
  }

}


module.exports = {
  MongoDB
}
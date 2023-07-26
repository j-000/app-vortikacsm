const { ObjectId } = require("mongodb");
const { MongoDB } = require("../database/mongo");


class MappingController {
  static async getMappings(req, res) {
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    try {
      const db = await MongoDB.getdb();
      const mappings = await db.collection('mappings').findOne({ feedid }, { projection: { _id: 0, feedid: 0 } });
      let requiredMappingComplete = true

      Object.entries(mappings).forEach(([k, v]) => {
        if (typeof v === 'object'){
          if (v.required) {
            if (!v.mappedTo.sourceField && !v.mappedTo.function) {
              requiredMappingComplete = false
              return
            }
          }
        }
      })

      res.json({ mappings, requiredMappingComplete })
    } catch (error) {
      res.json(error);
    }
  }
}

module.exports = {
  MappingController
}
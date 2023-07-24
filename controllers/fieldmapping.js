const { ObjectId } = require("mongodb");
const { MongoDB } = require("../database/mongo");


class FieldMappingController {
    static async getFieldsAndMappings(req, res) {
        const orgid = req.user.orgid;
        const feedid = new ObjectId(req.params.feedid);
        try {
          const db = await MongoDB.getdb();
          const anyjob = await db.collection('jobs')
            // exclude importer added keys (_id, orgid, feedid)
            .find({ orgid, feedid }, {projection: {_id: 0, orgid: 0, feedid: 0}})
            .limit(1)
            .toArray();
    
          if (anyjob.length > 0) {
            // Don't send _id, feedid
            const mappings = await db.collection('mappings').findOne({ feedid }, {projection: {_id: 0, feedid: 0}});
            const sourceFields = Object.keys(anyjob[0]);
            res.json({ mappings, sourceFields })
          } else {
            res.json({error: 'No jobs have yet been imported.'})
          }
    
        } catch (error) {
          res.json(error);
        }
      }
}

module.exports = {
    FieldMappingController
}
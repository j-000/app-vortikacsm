const { ObjectId } = require("mongodb");
const MappingsService = require('./mapping.service');

class MappingController {
  static async getAll(req, res) {
    const orgid = req.user.orgid;
    try {
      const mappings = await MappingsService.getMany({ orgid }, { __v: 0 });
      let allMappings = [];
      
      mappings.forEach( mappingDoc => {
        let temp = {}
        let requiredMappingComplete = true;
        
        Object.entries(mappingDoc.props).forEach(([k, v]) => {
          if (typeof v === 'object'){
            if (v.isRequired) {
              if (v.mappedTo.sourceField === null && v.mappedTo.function === null) {
                requiredMappingComplete = false
                return
              }
            }
          }
        });
        temp = { requiredMappingComplete, ...mappingDoc.toJSON() }
        allMappings.push(temp);
      })
      res.json({ success: true, allMappings })
    } catch (error) {
      res.json(error);
    }
  }

  static async getByFeedid(req, res) {
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    try {
      const mappings = await MappingsService.getOne({ feedid }, { __v: 0 });
      let requiredMappingComplete = true

      Object.entries(mappings.props).forEach(([k, v]) => {
        if (typeof v === 'object'){
          if (v.isRequired) {
            if (v.mappedTo.sourceField === null && v.mappedTo.function === null) {
              requiredMappingComplete = false
              return
            }
          }
        }
      })

      res.json({ success: true, mappings, requiredMappingComplete })
    } catch (error) {
      res.json(error);
    }
  }

  static async update(req, res){
    const orgid = req.user.orgid;
    const feedid = new ObjectId(req.params.feedid);
    const props = req.body.props;
    try {
      const mappings = await MappingsService.update({ feedid }, { props });
      res.json({success: true})
    } catch(error){
      res.json(error);
    }
  }
}

module.exports = {
  MappingController
}
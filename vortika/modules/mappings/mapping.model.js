const { default: mongoose, ObjectId } = require("mongoose");


const mappingsSchema = new mongoose.Schema({
  feedid: {
    type: ObjectId,
    required: [true, 'feedid is required']
  },
  orgid: {
    type: Number, 
    required: [true, 'orgid is required']
  },
  props: {
    type: Object,
    default: {
      id: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      title: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      description: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      apply_url: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      country: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      city: {
        isRequired: true,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      categories: {
        isRequired: true,
        enforcedType: 'list[string]',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      latitude: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      longitude: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      posted_date: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      expiry_date: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      compensation: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      work_setting: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      employment_status: {
        isRequired: false,
        enforcedType: 'string',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      array_one: {
        isRequired: false,
        enforcedType: 'list[object|string]',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      array_two: {
        isRequired: false,
        enforcedType: 'list[object|string]',
        mappedTo: { 
          sourceField: null, function: null 
        }
      },
      array_three: {
        isRequired: false,
        enforcedType: 'list[object|string]',
        mappedTo: { 
          sourceField: null, function: null 
        }
      }
    }
  }
})

const MappingsModel = mongoose.model('mappings', mappingsSchema);

module.exports = {
  MappingsModel
}
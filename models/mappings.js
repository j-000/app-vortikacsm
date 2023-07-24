function getMappingsTemplateObject(){
  const mappings = {
    id: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    title: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    description: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    apply_url: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    country: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    city: {
      required: true,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    categories: {
      required: true,
      enforcedType: 'list[string]',
      mappedTo: { sourceField: null, function: null }
    },
    latitude: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    longitude: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    posted_date: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    expiry_date: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    compensation: {
      required: false,
      enforcedType: 'integer',
      mappedTo: { sourceField: null, function: null }
    },
    work_setting: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    employment_status: {
      required: false,
      enforcedType: 'string',
      mappedTo: { sourceField: null, function: null }
    },
    arrayOne: {
      required: false,
      enforcedType: 'list[string|objects|integer]',
      mappedTo: { sourceField: null, function: null }
    },
    arrayTwo: {
      required: false,
      enforcedType: 'list[string|objects|integer]',
      mappedTo: { sourceField: null, function: null }
    },
    arrayThree: {
      required: false,
      enforcedType: 'list[string|objects|integer]',
      mappedTo: { sourceField: null, function: null }
    }
  }

  return mappings

}

module.exports = {
  getMappingsTemplateObject
}
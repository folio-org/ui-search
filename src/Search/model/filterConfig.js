import { filterNames } from '../../Filters';

const {
  SOURCE,
  RESOURCE_TYPE,
  LOCATION,
  HOLDING_STATUS,
  LANGUAGE,
} = filterNames;

export default [
  {
    name: SOURCE,
    cql: 'source',
    values: [],
    restrictWhenAllSelected: true,
  },
  {
    name: RESOURCE_TYPE,
    cql: 'resourceType',
    values: [],
  },
  {
    name: LOCATION,
    cql: 'location',
    values: [],
  },
  {
    name: HOLDING_STATUS,
    cql: 'ext.selected',
    values: [],
  },
  {
    name: LANGUAGE,
    cql: 'ext.available',
    values: [],
  },
];

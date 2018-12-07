import get from 'lodash/get';
import { filterState } from '@folio/stripes/components';

// 'filters' is a comma-separated list of 'FILTER.VALUE'
//  e.g. 'available.Available online,source.Local,type.Books,type.eBooks'
//
// 'mapping' is an object specifying how to map filters:
//  keys are 'name' elements of objects in filterConfig
//  values may be:
//   null (when the filter has no equivalent in the destination app and should be discarded)
//   otherwise an object with keys:
//    name: the name of the filter in the destination app
//    values: may be either
//     null (when the values are the same in the destination app)
//     or a map of values in Codex search to corresponding values in destination app
//
function mapFilters(filters, mapping) {
  const filterKeys = filterState(filters);
  const acc = [];

  Object.keys(filterKeys).forEach((fullName) => {
    const [groupName, fieldName] = fullName.split('.');
    const group = mapping[groupName];
    if (group) {
      if (!group.values) {
        // The values do not need mapping
        const mapped = `${group.name}.${fieldName}`;
        acc.push(mapped);
      } else {
        const mappedVal = group.values[fieldName];
        if (mappedVal) {
          const mapped = `${group.name}.${mappedVal}`;
          acc.push(mapped);
        }
      }
    }
  });

  const res = acc.join(',');
  // console.log(`mapped '${filters}' -> '${res}'`);
  return res;
}


function redirectParamsKB(record, resources) {
  const obj = {
    _path: `/eholdings/titles/${record.id}`,
    qindex: null,
    searchType: 'titles',
    q: get(resources, ['query', 'query']),
    query: null,
    filters: mapFilters(get(resources, ['query', 'filters']), {
      // We would like to add a configuration for this, but it turns
      // out that the eHoldings app represents its filters in a
      // radically different way from mainstream Stripes apps, and in
      // particular has no state representation in the URL. So there
      // is nothing for us to map to.
    }),
  };

  return obj;
}


function redirectParamsLocal(record, resources) {
  const obj = {
    _path: `/inventory/view/${record.id}`,
    qindex: null,
    // The 'query' parameter takes the same value in inventory as here
    filters: mapFilters(get(resources, ['query', 'filters']), {
      source: null,
      type: {
        name: 'resource',
        values: {
          /* eslint-disable quote-props */
          'Audio': 'Music (Audio)',
          'Audiobooks': null,
          'Books': 'Books',
          'Bookseries': null,
          'Databases': null,
          'eBooks': 'eBooks',
          'Kits': 'Kits',
          'Maps': 'Maps',
          'Music': 'Music (Scores)',
          'Newspapers': null,
          'Newsletters': null,
          'Periodicals': 'Serials',
          'Posters': 'Charts Posters',
          'Reports': null,
          'Proceedings': null,
          'Thesis and Dissertation': 'Theses',
          'Unspecified': null,
          'Video': 'Videorecording',
          'Web Resources': 'Web Resources',
        },
      },
      location: {
        name: 'location',
        values: null,
      },
      available: null,
      lang: {
        name: 'language',
        values: null,
      },
    }),
  };

  return obj;
}


function redirectParams(record, resources) {
  if (record.source === 'kb') {
    return redirectParamsKB(record, resources);
  } else if (record.source === 'local') {
    return redirectParamsLocal(record, resources);
  } else {
    return null;
  }
}


export default redirectParams;

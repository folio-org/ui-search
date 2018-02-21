import _ from 'lodash';

function redirectParamsKB(record, resources) {
  const obj = {
    _path: `/eholdings/titles/${record.id}`,
    searchType: 'titles',
    q: _.get(resources, ['query', 'query']),
    query: null,
  };

  // TODO: reseting filters is a temp solution until
  // https://issues.folio.org/browse/UISE-67 is fixed
  obj.filters = '';

  return obj;
}

function redirectParamsLocal(record, _resources) {
  const obj = {
    _path: `/inventory/view/${record.id}`,
    searchType: null,
    q: null,
    // The 'query' parameter takes the same value in inventory as here
  };

  // TODO: reseting filters is a temp solution until
  // https://issues.folio.org/browse/UISE-67 is fixed
  obj.filters = '';

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

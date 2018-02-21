import _ from 'lodash';

function redirectParamsKB(record, resources) {
  const obj = {};
  obj._path = `/eholdings/titles/${record.id}`;
  obj.searchType = 'titles';
  obj.q = _.get(resources, ['query', 'query']);
  obj.query = null;
  // TODO: reseting filters is a temp solution until
  // https://issues.folio.org/browse/UISE-67 is fixed
  obj.filters = '';
  return obj;
}

function redirectParamsLocal(record, _resources) {
  const obj = {};
  obj._path = `/inventory/view/${record.id}`;
  obj.searchType = null;
  obj.q = null;
  // The 'query' parameter should already be correct
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
  }
  return null;
}

export default redirectParams;

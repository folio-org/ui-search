import _ from 'lodash';

function redirectParams(record, resources) {
  if (record.source === 'kb') {
    const obj = {};
    obj._path = `/eholdings/titles/${record.id}`;
    obj.searchType = 'titles';
    obj.q = _.get(resources, ['query', 'query']);
    obj.query = null;
    // TODO: reseting filters is a temp solution until
    // https://issues.folio.org/browse/UISE-67 is fixed
    obj.filters = '';
    return obj;
  } else if (record.source === 'local') {
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
  return null;
}

export default redirectParams;

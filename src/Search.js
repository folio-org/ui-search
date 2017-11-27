import _ from 'lodash';
import React from 'react';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import ViewRecord from './ViewRecord';
import packageInfo from '../package';

const filterConfig = [
  {
    label: 'Material Types',
    name: 'item',
    cql: 'materialType.id',
    values: [
      { name: 'Book', cql: 'book' },
      { name: 'DVD', cql: 'dvd' },
    ],
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class Search extends React.Component {
  static manifest = Object.freeze({
    resultCount: { initialValue: 30 },
    query: { initialValue: {} },
    records: {
      type: 'okapi',
      records: 'items',
      path: 'inventory/items',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            'materialType.name="$QUERY" or barcode="$QUERY*" or title="$QUERY*"',
            { 'Material Type': 'materialType.name' },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  render() {
    const props = this.props;

    const resultsFormatter = {
      'Material Type': x => _.get(x, ['materialType', 'name']),
      status: x => _.get(x, ['status', 'name']) || '--',
    };

    return (<SearchAndSort
      moduleName={packageInfo.name.replace(/.*\//, '')}
      moduleTitle={packageInfo.stripes.displayName}
      objectName="record"
      baseRoute={packageInfo.stripes.route}
      initialPath={(_.get(packageInfo, ['stripes', 'home']) ||
                    _.get(packageInfo, ['stripes', 'route']))}
      filterConfig={filterConfig}
      initialResultCount={30}
      resultCountIncrement={30}
      viewRecordComponent={ViewRecord}
      visibleColumns={['Material Type', 'barcode', 'title', 'status']}
      resultsFormatter={resultsFormatter}
      viewRecordPerms="users.item.get"
      disableRecordCreation
      parentResources={props.resources}
      parentMutator={props.mutator}
    />);
  }
}

export default Search;

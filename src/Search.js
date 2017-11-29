import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import ViewRecord from './ViewRecord';
import packageInfo from '../package';

const filterConfig = [
  {
    label: 'Material Types',
    name: 'item',
    cql: 'materialType.id',
    values: [], // will be filled in by componentWillUpdate
  },
];

class Search extends React.Component {
  static propTypes = {
    resources: PropTypes.shape({
      materialTypes: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    mutator: PropTypes.shape({}),
  }

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
    materialTypes: {
      type: 'okapi',
      path: 'material-types',
      records: 'mtypes',
    },
  });

  componentWillUpdate() {
    const mt = (this.props.resources.materialTypes || {}).records || [];
    if (mt && mt.length) {
      filterConfig[0].values = mt.map(rec => ({ name: rec.name, cql: rec.id }));
    }
  }

  render() {
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
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
    />);
  }
}

export default Search;

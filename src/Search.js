import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import ViewRecord from './ViewRecord';
import packageInfo from '../package';

const filterConfig = [
  {
    label: 'Source',
    name: 'source',
    cql: 'source',
    values: [
      { name: 'Local', cql: 'local' },
      { name: 'Knowledge Base', cql: 'kb' },
    ],
  },
];

class Search extends React.Component {
  static propTypes = {
    resources: PropTypes.shape({}),
    mutator: PropTypes.shape({}),
  }

  static manifest = Object.freeze({
    resultCount: { initialValue: 30 },
    query: { initialValue: {} },
    records: {
      type: 'okapi',
      records: 'instances',
      path: 'codex-instances',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            'title="$QUERY*" or contributor.name="$QUERY*"',
            { Title: 'title' },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  render() {
    const resultsFormatter = {
      contributor: x => (x.contributor || []).map(y => `'${y.name}'`).join(', '),
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
      visibleColumns={['id', 'source', 'title', 'contributor']}
      resultsFormatter={resultsFormatter}
      viewRecordPerms="users.item.get"
      disableRecordCreation
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
    />);
  }
}

export default Search;

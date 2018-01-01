import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import makeQueryFunction from '@folio/stripes-components/util/makeQueryFunction';
import SearchAndSort from '@folio/stripes-smart-components/lib/SearchAndSort';
import ViewRecord from './ViewRecord';
import packageInfo from '../package';
import localIcon from '../icons/local-source.svg';
import kbIcon from '../icons/generic.svg';

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
    mutator: PropTypes.shape({
      query: PropTypes.shape({
        update: PropTypes.func.isRequired,
      }),
    }),
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
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
            'title="$QUERY*" or altTitle="$QUERY*" or contributor.name="$QUERY*" or publisher="$QUERY*"',
            { Title: 'title', Contributor: 'contributor.name' },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  onChangeField = (e) => {
    const qfield = e.target.value;
    const logger = this.props.stripes.logger;
    logger.log('action', `changed query-field to '${qfield}'`);
    this.props.mutator.query.update({ qfield });
  }

  render() {
    const resultsFormatter = {
      source: x => (<img
        src={x.source === 'local' ? localIcon : kbIcon}
        alt={x.source}
        height="18"
        width="18"
      />),
      contributor: x => (x.contributor || []).map(y => `'${y.name}'`).join(', '),
    };

    const filters = _.get(this.props.resources, ['query', 'filters']);
    // possible values:
    //  undefined
    //  'source.Local'
    //  'source.Local,source.Knowledge Base'
    //  'source.Knowledge Base'
    //  ''

    let searchableFields;
    if (filters === undefined ||
        filters === '' ||
        filters === 'source.Local,source.Knowledge Base' ||
        filters === 'source.Knowledge Base,source.Local') {
      searchableFields = [
        { label: 'ID', value: 'id' }, // not in query profile
        { label: 'Title', value: 'title' },
        { label: 'ISBN', value: 'unimplemented.isbn' },
        { label: 'ISSN', value: 'unimplemented.issn' },
        { label: 'Publisher', value: 'publisher' },
      ];
    } else if (filters === 'source.Local') {
      searchableFields = [
        { label: '---', value: '' },
        { label: 'ID', value: 'id' }, // not in query profile
        { label: 'Title', value: 'title' },
        { label: 'Identifier', value: 'identifier' },
        { label: 'ISBN', value: 'unimplemented.isbn' },
        { label: 'ISSN', value: 'unimplemented.issn' },
        { label: 'Contributor', value: 'contributor' }, // not in query profile
        { label: 'Subject', value: 'subject' },
        { label: 'Classification', value: 'unimplemented.classification' }, // not in query profile
        { label: 'Publisher', value: 'publisher' },
      ];
    } else if (filters === 'source.Knowledge Base') {
      searchableFields = [
        { label: 'ID', value: 'id' }, // not in query profile
        { label: 'Title', value: 'title' },
        { label: 'ISBN', value: 'unimplemented.isbn' },
        { label: 'ISSN', value: 'unimplemented.issn' },
        { label: 'Publisher', value: 'publisher' },
      ];
    } else {
      console.log(`unexpected filters value '${filters}'`);
    }

    return (<SearchAndSort
      moduleName={packageInfo.name.replace(/.*\//, '')}
      moduleTitle={packageInfo.stripes.displayName}
      objectName="record"
      baseRoute={packageInfo.stripes.route}
      initialPath={(_.get(packageInfo, ['stripes', 'home']) ||
                    _.get(packageInfo, ['stripes', 'route']))}
      searchableFields={searchableFields}
      onChangeField={this.onChangeField}
      filterConfig={filterConfig}
      initialResultCount={30}
      resultCountIncrement={30}
      viewRecordComponent={ViewRecord}
      visibleColumns={['source', 'title', 'contributor']}
      columnWidths={{ source: '10%', title: '40%', contributor: '50%' }}
      resultsFormatter={resultsFormatter}
      viewRecordPerms="users.item.get"
      disableRecordCreation
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
    />);
  }
}

export default Search;

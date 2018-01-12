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
  {
    label: 'Resource Type',
    name: 'type',
    cql: 'resourceType',
    values: [
      { name: 'Audio', cql: 'audio' },
      { name: 'Audiobooks', cql: 'audiobooks' },
      { name: 'Books', cql: 'books' },
      { name: 'Bookseries', cql: 'bookseries' },
      { name: 'Databases', cql: 'databases' },
      { name: 'eBooks', cql: 'ebooks' },
      { name: 'Kits', cql: 'kits' },
      { name: 'Maps', cql: 'maps' },
      { name: 'Music', cql: 'music' },
      { name: 'Newspapers', cql: 'newspapers' },
      { name: 'Newsletters', cql: 'newsletters' },
      { name: 'Periodicals', cql: 'periodicals' },
      { name: 'Posters', cql: 'posters' },
      { name: 'Reports', cql: 'reports' },
      { name: 'Proceedings', cql: 'proceedings' },
      { name: 'Thesis and Dissertation', cql: 'thesisanddissertation' },
      { name: 'Unspecified', cql: 'unspecified' },
      { name: 'Video', cql: 'video' },
      { name: 'Web Resources', cql: 'webresources' },
    ],
  },
  {
    label: 'Location',
    name: 'location',
    cql: 'location',
    values: [
      { name: 'Annex', cql: '1' },
      { name: 'Main Library', cql: '2' },
      { name: 'ORWIG ETHNO CD', cql: '3' },
      { name: 'Popular Reading Collection', cql: '4' },
      { name: 'SECOND FLOOR', cql: '5' },
    ],
  },
  {
    label: 'Holding Status',
    name: 'available',
    cql: 'ext.available',
    values: [
      { name: 'Available online', cql: 'true' },
      { name: 'Not Available', cql: 'false' },
    ],
  },
  {
    label: 'Language',
    name: 'lang',
    cql: 'ext.available',
    values: [
      { name: 'English', cql: 'en' },
      { name: 'Spanish', cql: 'es' },
      { name: 'French', cql: 'fr' },
      { name: 'German', cql: 'de' },
      { name: 'Mandarin', cql: 'zh' },
      { name: 'Russian', cql: 'ru' },
      { name: 'Arabic', cql: 'ar' },
    ],
  },
];

class Search extends React.Component {
  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.stripes,
      }),
    }),
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
            'title="$QUERY*" or identifier="$QUERY*" or contributor="$QUERY*" or publisher="$QUERY*"',
            { Title: 'title', Contributor: 'contributor.name' },
            filterConfig,
            true,
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    const logger = this.props.stripes.logger;
    logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
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

    const searchableIndexes = Object.assign([], [
      { label: '---', value: '' },
      { label: 'ID', value: 'id' },
      { label: 'Title', value: 'title' },
      { label: 'Identifier', value: 'identifier' },
      { label: 'ISBN', value: 'identifier/type=isbn' },
      { label: 'ISSN', value: 'identifier/type=issn' },
      { label: 'Contributor', value: 'contributor' },
      { label: 'Subject', value: 'subject' },
      { label: 'Classification', value: 'classification' },
      { label: 'Publisher', value: 'publisher' },
    ]);

    if (filters === undefined || filters === '' ||
        filters.match('source.Knowledge Base')) {
      for (const i of [0, 1, 6, 7, 8]) {
        searchableIndexes[i].disabled = true;
      }
    }

    const disableFilters = {};
    if (filters === 'source.Local') {
      disableFilters.available = true;
    } else if (filters === 'source.Knowledge Base') {
      disableFilters.location = true;
      disableFilters.lang = true;
    } else {
      disableFilters.lang = true;
    }

    return (<SearchAndSort
      moduleName={packageInfo.name.replace(/.*\//, '')}
      moduleTitle={packageInfo.stripes.displayName}
      objectName="record"
      baseRoute={packageInfo.stripes.route}
      initialPath={(_.get(packageInfo, ['stripes', 'home']) ||
                    _.get(packageInfo, ['stripes', 'route']))}
      searchableIndexes={searchableIndexes}
      selectedIndex={_.get(this.props.resources.query, 'qindex')}
      onChangeIndex={this.onChangeIndex}
      maxSortKeys={1}
      filterConfig={filterConfig}
      disableFilters={disableFilters}
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

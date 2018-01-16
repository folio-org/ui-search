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


const availableIndexes = [
  { label: '---', value: '', localOnly: true },
  { label: 'ID', value: 'id' },
  { label: 'Title', value: 'title' },
  { label: 'Identifier', value: 'identifier', localOnly: true },
  { label: 'ISBN', value: 'identifier/type=isbn' },
  { label: 'ISSN', value: 'identifier/type=issn' },
  { label: 'Contributor', value: 'contributor', localOnly: true },
  { label: 'Subject', value: 'subject', localOnly: true },
  { label: 'Classification', value: 'classification', localOnly: true },
  { label: 'Publisher', value: 'publisher' },
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

  componentWillMount() {
    // XXX Hardwired knowledge here of the default filters. Should parse it out of initialPath
    this.filtersHaveChanged({});
    // The change to the anointed resource in filtersHaveChanged()
    // does not, for some reason, get reflected in the URL: perhaps
    // thish happens too early in the lifecycle, before the
    // anointedness has been established. But this doesn't matter,
    // because no search is executed until a query is entered, and at
    // that moment the relevant qindex change also enters the URL.
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    const logger = this.props.stripes.logger;
    logger.log('action', `changed query-index to '${qindex}'`);
    this.props.mutator.query.update({ qindex });
  }

  filtersHaveChanged = (newFilters) => {
    if (newFilters['source.Local'] && !newFilters['source.Knowledge Base']) return;

    const qindex = _.get(this.props.resources.query, 'qindex') || '';
    let indexObject;
    for (const index of availableIndexes) {
      if (index.value === qindex) {
        indexObject = index;
        break;
      }
    }

    if (!indexObject) return;
    if (!indexObject.localOnly) return;

    // Find first available index that is not localOnly
    for (const index of availableIndexes) {
      if (!index.localOnly) {
        this.props.mutator.query.update({ qindex: index.value });
        return;
      }
    }
  }

  onSelectRow = (e, record) => {
    const logger = this.props.stripes.logger;

    const obj = {};
    if (record.source === 'kb') {
      obj._path = `/eholdings/titles/${record.id}`;
    } else if (record.source === 'kb') {
      obj._path = `/inventory/${record.id}`;
    } else {
      logger.log('action', `unsupported source '${record.source}': doing nothing`);
      return true;
    }

    logger.log('action', `clicked ${record.id}, jumping to '${record.source}' version`);
    const query = _.get(this.props.resources, 'query') || {};
    if (query.qindex === 'title') {
      obj.searchType = 'titles';
      obj.q = query.query;
    }

    this.props.mutator.query.update(obj);
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

    const searchableIndexes = availableIndexes.map(index => Object.assign({}, index));
    const filters = _.get(this.props.resources, ['query', 'filters']);
    // possible values:
    //  undefined
    //  'source.Local'
    //  'source.Local,source.Knowledge Base'
    //  'source.Knowledge Base'
    //  ''
    if (filters === undefined || filters === '' ||
        filters.match('source.Knowledge Base')) {
      for (const index of searchableIndexes) {
        if (index.localOnly) index.disabled = true;
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
      filterChangeCallback={this.filtersHaveChanged}
      initialResultCount={30}
      resultCountIncrement={30}
      viewRecordComponent={ViewRecord}
      visibleColumns={['source', 'title', 'contributor']}
      columnWidths={{ source: '10%', title: '40%', contributor: '50%' }}
      resultsFormatter={resultsFormatter}
      onSelectRow={this.onSelectRow}
      viewRecordPerms="users.item.get"
      disableRecordCreation
      parentResources={this.props.resources}
      parentMutator={this.props.mutator}
    />);
  }
}

export default Search;

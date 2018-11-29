import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  makeQueryFunction,
  SearchAndSort
} from '@folio/stripes/smart-components';
import {
  filterState,
  AppIcon,
} from '@folio/stripes/components';
import ViewRecord from './ViewRecord';
import redirectParams from './redirectParams';
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
    restrictWhenAllSelected: true,
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
    cql: 'ext.selected',
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
  { label: 'Search all fields', value: '', localOnly: true },
  { label: 'FOLIO ID', value: 'id' },
  { label: 'Title', value: 'title' },
  { label: 'Identifier', value: 'identifier' },
  { label: 'ISBN', value: 'identifier/type=isbn' },
  { label: 'ISSN', value: 'identifier/type=issn' },
  { label: 'Contributor', value: 'contributor', localOnly: true },
  { label: 'Subject', value: 'subject' },
  { label: 'Classification', value: 'classification', localOnly: true },
  { label: 'Publisher', value: 'publisher' },
];


class Search extends React.Component {
  static propTypes = {
    resources: PropTypes.shape({
      query: PropTypes.shape({
        qindex: PropTypes.string,
        query: PropTypes.string,
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
            'title="%{query.query}*" or identifier="%{query.query}*" or contributor="%{query.query}*" or publisher="%{query.query}*"',
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

    const obj = redirectParams(record);
    logger.log('action', `clicked ${record.id}, jumping to '${record.source}' version with obj`, obj);
    if (obj) {
      this.props.mutator.query.update(obj);
    } else {
      logger.log('action', `unsupported source '${record.source}': doing nothing`);
    }

    return false;
  }

  render() {
    const resultsFormatter = {
      source: x => (
        <AppIcon
          app={x.source === 'local' ? 'inventory' : 'eholdings'}
          iconKey={x.source === 'local' ? 'instance' : 'app'}
          size="small"
        >
          {x.source === 'local' ? 'Local' : 'KB'}
        </AppIcon>
      ),
      contributor: x => (x.contributor || []).map(y => `'${y.name}'`).join(', '),
    };

    const searchableIndexes = availableIndexes.map(index => Object.assign({}, index));
    const filters = _.get(this.props.resources, ['query', 'filters']);
    const filterKeys = filterState(filters);
    if (!filterKeys['source.Local'] || filterKeys['source.Knowledge Base']) {
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
      packageInfo={packageInfo}
      objectName="record"
      searchableIndexes={searchableIndexes}
      selectedIndex={_.get(this.props.resources.query, 'qindex')}
      searchableIndexesPlaceholder={null}
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
      notLoadedMessage="Enter search query to show results"
    />);
  }
}

export default withRouter(Search);

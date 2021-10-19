import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';

import {
  makeQueryFunction,
  SearchAndSort
} from '@folio/stripes/smart-components';

import { filterState } from '@folio/stripes/components';

import packageInfo from '../../package';

import ViewRecord from '../ViewRecord';
import {
  Filters,
  filterNames,
} from '../Filters';

import {
  redirectParams,
  parseFiltersString,
  availableIndexes,
  filterConfig,
} from './model';

const Search = (props) => {
  const intl = useIntl();

  const updateQIndex = () => {
    const qindex = _.get(props.resources.query, 'qindex', '');
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
        props.mutator.query.update({ qindex: index.value });
        return;
      }
    }
  };

  const onFilterChangeHandler = ({ name, values }) => {
    const {
      resources,
      mutator,
    } = props;

    const filters = parseFiltersString(_.get(resources, 'query.filters', ''));

    const updatedActiveFilters = values.length !== 0
      ? {
        ...filters,
        [name]: values,
      }
      : _.omit(filters, [name]);

    const newFilters = [];

    for (const filterName in updatedActiveFilters) {
      if (Object.prototype.hasOwnProperty.call(updatedActiveFilters, filterName)) {
        const filtersString = updatedActiveFilters[filterName].map(filterValue => `${filterName}.${filterValue}`);
        newFilters.push(filtersString);
      }
    }

    mutator.query.update({ filters: newFilters.join(',') });

    if (_.get(updatedActiveFilters, [filterNames.SOURCE], []).join('') === 'local') {
      updateQIndex();
    }
  };

  const onChangeIndex = (e) => {
    const qindex = e.target.value;
    const logger = props.stripes.logger;
    logger.log('action', `changed query-index to '${qindex}'`);
    props.mutator.query.update({ qindex });
  };

  const onSelectRow = (e, record) => {
    const logger = props.stripes.logger;

    const obj = redirectParams(record);
    logger.log('action', `clicked ${record.id}, jumping to '${record.source}' version with obj`, obj);
    if (obj) {
      props.mutator.query.update(obj);
    } else {
      logger.log('action', `unsupported source '${record.source}': doing nothing`);
    }

    return false;
  };

  const renderFilters = (onChange) => {
    return (
      <Filters
        activeFilters={parseFiltersString(_.get(props, 'resources.query.filters', ''))}
        onChange={onChange}
      />
    );
  };

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

  const searchableIndexes = availableIndexes.map(index => ({ ...index }));
  const filters = _.get(props.resources, ['query', 'filters']);
  const filterKeys = filterState(filters);

  if (!filterKeys['source.Local'] || filterKeys['source.Knowledge Base']) {
    for (const index of searchableIndexes) {
      if (index.localOnly) index.disabled = true;
    }
  }

  const translatedSearchableIndexes = searchableIndexes.map(i => {
    const { value, label, ...rest } = i;
    return {
      label: intl.formatMessage({ id: `ui-search.searchableIndexes.${label}` }),
      value,
      ...rest
    };
  });

  return (
    <div data-test-search>
      <SearchAndSort
        packageInfo={packageInfo}
        objectName="record"
        searchableIndexes={translatedSearchableIndexes}
        selectedIndex={_.get(props.resources.query, 'qindex')}
        searchableIndexesPlaceholder={null}
        onChangeIndex={onChangeIndex}
        onFilterChange={onFilterChangeHandler}
        maxSortKeys={1}
        initialResultCount={30}
        resultCountIncrement={30}
        viewRecordComponent={ViewRecord}
        visibleColumns={['source', 'title', 'contributor']}
        columnMapping={{
          source: intl.formatMessage({ id: 'ui-search.header.source' }),
          title: intl.formatMessage({ id: 'ui-search.header.title' }),
          contributor: intl.formatMessage({ id: 'ui-search.header.contributor' }),
        }}
        columnWidths={{ source: '10%', title: '40%', contributor: '50%' }}
        resultsFormatter={resultsFormatter}
        renderFilters={renderFilters}
        onSelectRow={onSelectRow}
        viewRecordPerms="users.item.get"
        disableRecordCreation
        parentResources={props.resources}
        parentMutator={props.mutator}
        notLoadedMessage={intl.formatMessage({ id: 'ui-search.notLoadedMessage' })}
      />
    </div>
  );
};

Search.manifest = Object.freeze({
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

Search.propTypes = {
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
};

export default Search;

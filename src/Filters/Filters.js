import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import _ from 'lodash';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import {
  IntlConsumer
} from '@folio/stripes/core';

import {
  sources,
  locations,
  resourceTypes,
  holdingStatuses,
  languages,
  filterNames,
} from './model';

const {
  SOURCE,
  LOCATION,
  HOLDING_STATUS,
  RESOURCE_TYPE,
  LANGUAGE,
} = filterNames;

const LOCAL_SOURCE = sources[0].value;
const KB_SOURCE = sources[1].value;

export default class Filters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.objectOf(PropTypes.array),
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeFilters: {},
  }

  createOnClearFilterHandler = (filterName) => () => {
    this.props.onChange({
      name: filterName,
      values: [],
    });
  }

  onChangeHandler = (filter) => {
    this.props.onChange(filter);
  }

  isFilterNotEmpty(filterName) {
    return _.get(this.props.activeFilters, [filterName, 'length']) > 0;
  }

  getSourceDataOptions(intl) {
    return sources.map((source) => ({
      label: intl.formatMessage({ id: `ui-search.filters.sources.${source.label}` }),
      value: source.value,
    }));
  }

  getResourceTypeDataOptions(intl) {
    return resourceTypes.map((resourceType) => ({
      label: intl.formatMessage({ id: `ui-search.filters.resourceTypes.${resourceType.label}` }),
      value: resourceType.value,
    }));
  }

  getLocationDataOptions() {
    return locations.map((location) => ({
      ...location,
      disabled: this.isLocationFilterDisabled(),
    }));
  }

  getHoldingStatusDataOptions(intl) {
    return holdingStatuses.map((holdingStatus) => ({
      label: intl.formatMessage({ id: `ui-search.filters.holdingStatus.${holdingStatus.label}` }),
      value: holdingStatus.value,
      disabled: this.isHoldingStatusFilterDisabled(),
    }));
  }

  getLanguageDataOptions(intl) {
    return languages.map((language) => ({
      label: intl.formatMessage({ id: `ui-search.filters.languages.${language.label}` }),
      value: language.value,
      disabled: this.isLanguageFilterDisabled(),
    }));
  }

  isHoldingStatusFilterDisabled = () => {
    const influencedFilter = this.props.activeFilters[SOURCE];
    return influencedFilter && influencedFilter.includes(LOCAL_SOURCE);
  }

  isLocationFilterDisabled = () => {
    const influencedFilter = this.props.activeFilters[SOURCE];
    return influencedFilter && influencedFilter.includes(KB_SOURCE);
  }

  isLanguageFilterDisabled = () => {
    const sourceFilter = this.props.activeFilters[SOURCE];

    return !sourceFilter || sourceFilter.includes(KB_SOURCE);
  }

  render() {
    const {
      activeFilters,
    } = this.props;

    return (
      <React.Fragment>
        <Accordion
          label={<FormattedMessage id="ui-search.filters.source" />}
          id={SOURCE}
          name={SOURCE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(SOURCE)}
          onClearFilter={this.createOnClearFilterHandler(SOURCE)}
        >
          <IntlConsumer>
            {intl => (
              <CheckboxFilter
                name={SOURCE}
                fullWidth
                dataOptions={this.getSourceDataOptions(intl)}
                selectedValues={activeFilters[SOURCE]}
                onChange={this.onChangeHandler}
              />
            )}
          </IntlConsumer>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-search.filters.resourceType" />}
          id={RESOURCE_TYPE}
          name={RESOURCE_TYPE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(RESOURCE_TYPE)}
          onClearFilter={this.createOnClearFilterHandler(RESOURCE_TYPE)}
        >
          <IntlConsumer>
            {intl => (
              <CheckboxFilter
                name={RESOURCE_TYPE}
                dataOptions={this.getResourceTypeDataOptions(intl)}
                selectedValues={activeFilters[RESOURCE_TYPE]}
                onChange={this.onChangeHandler}
              />
            )}
          </IntlConsumer>
        </Accordion>
        <Accordion
          disabled={this.isLocationFilterDisabled()}
          label={<FormattedMessage id="ui-search.filters.location" />}
          id={LOCATION}
          name={LOCATION}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(LOCATION)}
          onClearFilter={this.createOnClearFilterHandler(LOCATION)}
        >
          <CheckboxFilter
            name="location"
            dataOptions={this.getLocationDataOptions()}
            selectedValues={activeFilters[LOCATION]}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          disabled={this.isHoldingStatusFilterDisabled()}
          label="Holding Status"
          id={HOLDING_STATUS}
          name={HOLDING_STATUS}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(HOLDING_STATUS)}
          onClearFilter={this.createOnClearFilterHandler(HOLDING_STATUS)}
        >
          <IntlConsumer>
            {intl => (
              <CheckboxFilter
                name={HOLDING_STATUS}
                dataOptions={this.getHoldingStatusDataOptions(intl)}
                selectedValues={activeFilters[HOLDING_STATUS]}
                onChange={this.onChangeHandler}
              />
            )}
          </IntlConsumer>
        </Accordion>
        <Accordion
          disabled={this.isLanguageFilterDisabled()}
          label={<FormattedMessage id="ui-search.filters.language" />}
          id={LANGUAGE}
          name={LANGUAGE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(LANGUAGE)}
          onClearFilter={this.createOnClearFilterHandler(LANGUAGE)}
        >
          <IntlConsumer>
            {intl => (
              <MultiSelectionFilter
                name={LANGUAGE}
                dataOptions={this.getLanguageDataOptions(intl)}
                selectedValues={activeFilters[LANGUAGE]}
                onChange={this.onChangeHandler}
              />
            )}
          </IntlConsumer>
        </Accordion>
      </React.Fragment>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';

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

  getLocationDataOptions() {
    return locations.map((location) => ({
      ...location,
      disabled: this.isLocationFilterDisabled(),
    }));
  }

  getHoldingStatusDataOptions() {
    return holdingStatuses.map((holdingStatus) => ({
      ...holdingStatus,
      disabled: this.isHoldingStatusFilterDisabled(),
    }));
  }

  getLanguageDataOptions() {
    return languages.map((language) => ({
      ...language,
      disabled: this.isLanguageFilterDisabled(),
    }));
  }

  isHoldingStatusFilterDisabled = () => {
    const influencedFilter = this.props.activeFilters[SOURCE];
    return influencedFilter && influencedFilter.includes('local');
  }

  isLocationFilterDisabled = () => {
    const influencedFilter = this.props.activeFilters[SOURCE];
    return influencedFilter && influencedFilter.includes('kb');
  }

  isLanguageFilterDisabled = () => {
    const influencedFilter = this.props.activeFilters[SOURCE];
    return influencedFilter && influencedFilter.includes('kb');
  }

  render() {
    const {
      activeFilters,
    } = this.props;

    return (
      <React.Fragment>
        <Accordion
          label="Source"
          id={SOURCE}
          name={SOURCE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(SOURCE)}
          onClearFilter={this.createOnClearFilterHandler(SOURCE)}
        >
          <CheckboxFilter
            name={SOURCE}
            fullWidth
            dataOptions={sources}
            selectedValues={activeFilters[SOURCE]}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          label="Resource type"
          id={RESOURCE_TYPE}
          name={RESOURCE_TYPE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(RESOURCE_TYPE)}
          onClearFilter={this.createOnClearFilterHandler(RESOURCE_TYPE)}
        >
          <CheckboxFilter
            name={RESOURCE_TYPE}
            dataOptions={resourceTypes}
            selectedValues={activeFilters[RESOURCE_TYPE]}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          disabled={this.isLocationFilterDisabled()}
          label="Location"
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
          <CheckboxFilter
            name={HOLDING_STATUS}
            dataOptions={this.getHoldingStatusDataOptions()}
            selectedValues={activeFilters[HOLDING_STATUS]}
            onChange={this.onChangeHandler}
          />
        </Accordion>
        <Accordion
          disabled={this.isLanguageFilterDisabled()}
          label="Language"
          id={LANGUAGE}
          name={LANGUAGE}
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={this.isFilterNotEmpty(LANGUAGE)}
          onClearFilter={this.createOnClearFilterHandler(LANGUAGE)}
        >
          <MultiSelectionFilter
            name={LANGUAGE}
            dataOptions={this.getLanguageDataOptions()}
            selectedValues={activeFilters[LANGUAGE]}
            onChange={this.onChangeHandler}
          />
        </Accordion>
      </React.Fragment>
    );
  }
}

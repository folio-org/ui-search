export default function parseFiltersString(filters) {
  if (filters.length === 0) {
    return undefined;
  }

  return filters
    .split(',')
    .reduce((resultFilters, currentFilter) => {
      const [filterName, filterValue] = currentFilter.split('.');

      if (!Array.isArray(resultFilters[filterName])) {
        resultFilters[filterName] = [];
      }

      resultFilters[filterName].push(filterValue);

      return resultFilters;
    }, {});
}

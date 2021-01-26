# Change history for ui-search

## 3.2.0 (IN PROGRESS)
* Update `stripes` to `v6.0.0`. UISE-136.

## [3.1.0](https://github.com/folio-org/ui-search/tree/v3.1.0) (2020-10-13)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v3.0.0...v3.1.0)
* Refactor to `miragejs` from `bigtest/mirage`
* Increment `@folio/stripes` to `v5.0.0`, increment `react-intl` to `v5.7.0` UISE-127.
* Update translations

## [3.0.0](https://github.com/folio-org/ui-search/tree/v3.0.0) (2020-06-11)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v2.0.0...v3.0.0)
* Purge `intlShape` in prep for `react-intl` `v4` migration. Refs STRIPES-672.
* Update `stripes` to `v4.0.0`, `stripes-core` to `5.0.0` and added `react-intl` to dev dependencies. UISE-124.
* Add `ui-search.codexsearch` permission. UISE-119.
* Prefer `stripes.actsAs` to the deprecated `stripes.type` in `package.json`. Refs STCOR-148.
* Update translations

## [2.0.0](https://github.com/folio-org/ui-search/tree/v1.10.0) (2020-03-12)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.10.0...v2.0.0)

* Update eslint to v6.2.1. Refs UISE-117.
* Update "stripes" to 'v3.0.0', "stripes-core" to '4.0.0' and "react-intl" to '2.9.0'. Refs UISE-122.
* Update of translations

## [1.10.0](https://github.com/folio-org/ui-search/tree/v1.10.0) (2019-12-05)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.9.0...v1.10.0)

* Update of translations

## [1.9.0](https://github.com/folio-org/ui-search/tree/v1.9.0) (2019-09-10)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.8.0...v1.9.0)

* Update of translations

## [1.8.0](https://github.com/folio-org/ui-search/tree/v1.8.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.7.0...v1.8.0)

* Support translation of filtering option labels. Refs UISE-107.

## [1.7.0](https://github.com/folio-org/ui-search/tree/v1.7.0) (2019-05-09)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.6.0...v1.7.0)

* Translate column headers. Fixes UISE-107.
* Gracefully handle missing filters. Refs UISE-110.
* Correctly link to eholdings. Refs UISE-110.

## [1.6.0](https://github.com/folio-org/ui-search/tree/v1.6.0) (2019-03-17)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.5.0...v1.6.0)

* Refactor filters. UISE-97.
* Move AppIcon import to `@folio/stripes/core`. Refs STCOM-411.
* Update integration tests to accommodate MCL aria changes. Fixes UISE-102.
* Extract static strings for translation. Fixes UISE-105.
* Add test coverage. UISE-90.

## [1.5.0](https://github.com/folio-org/ui-search/tree/v1.5.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.4.0...v1.5.0)

* Upgrade to stripes v2.0.0.

## [1.4.0](https://github.com/folio-org/ui-search/tree/v1.4.0) (2018-12-13)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.3.0...v1.4.0)

* Enable subject search for non-local too
* Clean-up translations etc

## 1.3.0 (https://github.com/folio-org/ui-search/tree/v1.3.0) (2018-10-5)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.2.0...v1.3.0)

* Conform references to stripes-components and stripes-smart-components to use new stripes framework.

## 1.2.0 (https://github.com/folio-org/ui-search/tree/v1.2.0) (2018-09-12)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.1.0...v1.2.0)

* Update Okapi dependency, `codex`: 2.0
* Change app name to "Codex Search". Applies in the application list in the Stripes menu-bar, within the application itself, and in the top-level route `codexsearch`. Fixes UISE-23.
* New document, [the Codex contract](doc/codex-contract.md), which admittedly sounds like a Dan Brown book. Fixes UISE-28.
* Dummy up the package file to provide an example of app metadata bundle. Fixes UISE-29, towards STCOR-117.
* Display source-type icons instead of 'local', 'kb'. Fixes UISE-6.
* Fix unsupported query to Codex API. Fixes UISE-30.
* Modify set of available indexes based on selected target types. Fixes UISE-34.
* Provide indexes suitable for local-only search. Fixes UISE-31.
* Provide indexes suitable for KB search. Fixes UISE-32.
* Provide indexes suitable when both targets available. Fixes UISE-33.
* Set value of query-index from the `qindex` URL query parameter. Fixes UISE-38.
* Grey out unavailable indexes instead of omitting them entirely. Fixes UISE-40.
* Implement correct filters for local-only targets. Fixes UISE-3.
* Default query for local-only mode is now Codex profile-compliant. Fixes UISE-43.
* When starting the Codex Search UI, do not search for `cql.allRecords=1`. Fixes UISE-41.
* Limit to a single sort-key. Avoids causing problems for mod-ebsco-ekb, and fixes UISE-47.
* Use more-current stripes-components. Refs STRIPES-495.
* Prevent selection of query-index not supported by source. Fixes UISE-46.
* Link from ui-search's KB records into ui-eholdings. Fixes UISE-51, UISE-53, UISE-54 and UISE-55.
* Link from ui-search's local records into ui-inventory. Fixes UISE-50.
* Use correct index (`ext.selected`) for Holding-Status searches. Fixes UISE-60.
* "Available online" filter is selected by default. Fixes UISE-59.
* Enable both _FOLIO ID_ search and _Identifier_ search in EBSCO KB. Fixes UISE-49.
* Upgrade `eslint` dependency to v4.7.2, allowing `eslint-config-stripes` v1.0.0 to work. Fixes UISE-65.
* Add completely trivial testing framework (enabling real tests to follow). Fixes UISE-61.
* More robust analysis of which sources are selected, so local-only index are disabled under correct circumstances. Fixes UISE-64.
* When both "Available online" and "Not available" are checked do not restrict results. Fixes UISE-66.
* Add the very beginnings of a unit-test suite. Fixes UISE-61.
* No more strange redirects after following a link into Inventory or eHoldings! Fixes UISE-56 and UISE-26.
* Initially selected index is "Title", not "ID". Fixes UISE-57.
* When linking into the Inventory app, map filters. Fixes UISE-67.
* "Search all fields" query-index can be selected. Fixes UISE-72.
* Pass packageInfo to SearchAndSort; it's simpler. Refs STSMACOM-64. Available after v1.1.1.
* Include text labels along with record-source icons. Fixes UISE-58.
* Use `%{query.query}` instead of `$QUERY` in makeQueryFunction template. Fixes UISE-75.
* Ignore yarn-error.log file. Refs STRIPES-517.
* Use `<AppIcon>` for Local/KB icons. Fixes UISE-74.
* Bump stripes-components dependency to `^3.0.7`, pulling in the STCOM-321 regression fix, which makes ISSN searching work again. Fixes UISE-82. Available from v1.1.2.
* Removed unused react-bootstrap dep that was pulling in an incompatible babel-runtime release. Refs FOLIO-1425.
* Change default search-area message not to refer to selecting filter. Fixes UISE-81. Available from v1.1.3.
* Updated AppIcon implementation in Search

## [1.1.0](https://github.com/folio-org/ui-search/tree/v1.1.0) (2017-12-05)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v1.0.0...v1.1.0)

* Retarget Okapi operation to use new mod-codex-mock, not inventory; and to depend on Okapi interface `codex` v1.0. Fixes UISE-19.
* Modify short-record display and filters to work with present data. Fixes UISE-20.
* Display "full records" using dummy data from mod-codex-mock. Fixes UISE-21.

## [1.0.0](https://github.com/folio-org/ui-search/tree/v1.0.0) (2017-11-29)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v0.0.2...v1.0.0)

* Set up use of `<SearchAndSort>` component for browsing and sorting. Fixes UISE-11.
* Align URL parameter names, making searching work. Fixes UISE-13.
* Fix material-type filtering to use ID rather than name. Fixes UISE-14.
* Make full-record-view work properly, using a `<Pane>`. Fixes UISE-15.
* Make reset-search button work, honoring the `stripes.home` setting. Fixes UISE-16.

Note that this release, while it successfully runs within Stripes, needs a great deal of work before it's ready for users. In particular, it presently searches the inventory's `items` endpoint rather than the Codex endpoint (because that doesn't exist yet), and its full-record display is a placeholder.

## [0.0.2](https://github.com/folio-org/ui-search/tree/v0.0.2) (2017-11-25)

* New module.

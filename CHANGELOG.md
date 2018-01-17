# Change history for ui-search

## 1.2.0 (IN PROGRESS)

* Update Okapi dependency, `codex`: 2.0
* Change app name to "Codex Search". Applies in the application list in the Stripes menu-bar, within the application itself, and in the top-level route `codexsearch`. Fixes UISE-23.
* New document, [the Codex contract](doc/codex-contract.md), which admittedly sounds like a Dan Brown book. Fixes UISE-28.
* Dummy up the package file to provide an example of app metadata bundle. Fixes UISE-29, towards STCOR-117.
* Display source-type icons instead of 'local', 'kb'. Fixes UISE-6.
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


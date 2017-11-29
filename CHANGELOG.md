# Change history for ui-search

## [1.0.0](https://github.com/folio-org/ui-search/tree/v1.0.0) (2017-11-29)
[Full Changelog](https://github.com/folio-org/ui-search/compare/v0.0.2...v1.0.0)

* Set up use of `<SearchAndSort>` component for browsing and sorting. Fixes UISE-11.
* Align URL parameter names, making searching work. Fixes UISE-13.
* Fix material-type filtering to use ID rather than name. Fixes UISE-14.
* Make full-record-view work properly, using a `<Pane>`. Fixes UISE-15.
* Make reset-search button work, honoring the `stripes.home` setting. Fixes UISE-16.

Note that this release, while it successfully runs within Stripes, needs a great deal of work before it's ready for users. In particular, it presently searches the inventory's `items` endpoint rather then the Codex endpoint (because that doesn't exist yet), and its full-record display is a placeholder.

## [0.0.2](https://github.com/folio-org/ui-search/tree/v0.0.2) (2017-11-25)

* New module.


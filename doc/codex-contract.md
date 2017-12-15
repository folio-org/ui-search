# The Codex contract

<!-- md2toc -l 2 codex-contract.md -->
* [Introduction](#introduction)
* [1. Be a FOLIO module](#1-be-a-folio-module)
* [2. Implement the `codex` interface](#2-implement-the-codex-interface)
* [3. Accept queries meeting the Codex query schema](#3-accept-queries-meeting-the-codex-query-schema)
* [4. Supply records in the Codex record schema](#4-supply-records-in-the-codex-record-schema)
* [See Also](#see-also)

## Introduction

The FOLIO Codex is a layer that presents resources from various providers in an integrated way, unifying local inventories, electronic holdings from knowledge bases, institutional repositories and more.

There is no physical Codex database: records are not harvested from participating providers, but searched in real time. In order to participate in the Codex, a provider must satisfy a specific contract. This document describes that contract, outlining the responsibilities that each source must meet.

## 1. Be a FOLIO module

The Codex Multiplexer ([`mod-codex-mux`](https://github.com/folio-org/mod-codex-mux)) is a FOLIO module that runs under Okapi like any other module. In order for it to find Codex providers, they must also be FOLIO modules, running within the same instance of FOLIO as the multiplexer. They must therefore satisfy all [the usual requirements](https://github.com/folio-org/okapi/blob/master/doc/guide.md#okapis-own-web-services) of a FOLIO module, such as providing a module descriptor and registering with Okapi.

## 2. Implement the `codex` interface

Every FOLIO module declares in its module descriptor that it implements one or more named interfaces: for example, the Circulation Storage module [`mod-circulation-storage`](https://github.com/folio-org/mod-circulation-storage) declares in [its module descriptor](https://github.com/folio-org/mod-circulation-storage/blob/master/descriptors/ModuleDescriptor-template.json) that it provides the
`loan-storage`,
`loan-rules-storage`,
`loan-policy-storage`,
`request-storage`
and
`fixed-due-date-schedules-storage`
interfaces.

A module that is a Codex provider must declare that it implements the `codex` interface. See for example Codex Mock module, which provides dummy data for the front end to develop against, [`mod-codex-mock`](https://github.com/folio-org/mod-codex-mock). The relevant section of [its module descriptor](https://github.com/folio-org/mod-codex-mock/blob/master/descriptors/ModuleDescriptor-one-template.json) declares the interface as follows:

```json
{
  "id": "codex",
  "version": "1.0",
  "interfaceType": "multiple",
  "handlers": [
    {
      "methods": ["GET"],
      "pathPattern": "/codex-instances"
    },
    {
      "methods": ["GET"],
      "pathPattern": "/codex-instances/{id}"
    }
  ]
}
```

Note that this interface declaration, within the `declares` array, specifies:

* The id `codex`.
* The interface-type `multiple`. This is required in order to allow multiple modules in the same FOLIO installation to provide the same interface. (It also avoids clashing with the multiplexer itself, which declares the `codex` interface in non-multiple mode.) See [the relevant section of the Okapi Guide](https://github.com/folio-org/okapi/blob/master/doc/guide.md#multiple-interfaces).
* The paths `/codex-instances` and `/codex-instances/{id}`, for searching and full-record retrieval respectively.

The paths that must be supported are specified in more detail in [the RAML for this interface](https://github.com/folio-org/raml/blob/master/ramls/codex/codex.raml) and the linked schemas.

Note that Codex provider modules may provide additional other interfaces, which are ignored for the purpose of Codex multiplexing. For example, the Inventory Storage module [`mod-inventory-storage`](https://github.com/folio-org/mod-inventory-storage), which already implements 13 interfaces include `item-storage` and `instance-storage` will be extended to also implement the `codex` interface in multiple mode -- see [MODINVSTOR-39](https://issues.folio.org/browse/MODINVSTOR-39). Conversely, the dedicated EBSCO KB Codex module [`mod-codex-ekb](https://github.com/folio-org/mod-codex-ekb) will provide a Codex-compliant facade to the existing EBSCO knowledge-base, providing only the `codex` interface. Both strategies are valid.

(The notion of an "interface" in FOLIO will become reified as a first-class object in the future: see [OKAPI-418](https://issues.folio.org/browse/OKAPI-418).)

## 3. Accept queries meeting the Codex query schema

As indicated by [the `searchable` trait](https://github.com/folio-org/raml/blob/master/traits/searchable.raml) of [the RAML specification](https://github.com/folio-org/raml/blob/master/ramls/codex/codex.raml), the `/codex-instances` endpoint of a Codex provider must accept a `query` parameter whose value is a [CQL](http://zing.z3950.org/cql/intro.html) query. The details of what parts of CQL should be accepted and which indexes should be supported are expressed in machine-readable form in [the core CQL schema](https://github.com/folio-org/raml/blob/master/schemas/codex/codex_instance_cqlschema.json) and [the CQL extension schema](https://github.com/folio-org/raml/blob/master/schemas/codex/codex_instance_cqlschema-ext.json) -- both of which are in turn described by [the CQL schema schema](https://github.com/folio-org/raml/blob/master/schemas/CQLSchema.schema).

These core and extension schemas describe two CQL context sets (analogous to XML namespaces, but they contain indexes that can be used in searching). The core set is named `codex`, and the core Codex indexes (`title`, `subject`, etc.) are included in it. Because this context set is the default one, index names in CQL queries may be specified with or without the `codex` prefix: searches in `title` and `codex.title` are exactly equivalent. The extension set is named `ext`, and it contains extension indexes that may not be meaningful for all kinds of provider. A query that uses an index from this set _must_ explicitly specify the prefix: so `ext.selected=true` must be used rather than `selected=true`.

Codex providers must _recognise_ searches that include any of the indexes specified in these schemas (`title`, `subject`, `ext.selected`, etc.) However, a given provider may not _support_ all indexes. The appropriate response to queries that use unsupported indexes differs depending on which context-set they are from:

* Queries using unsupported indexes from the core set must be rejected outright, with a diagnostic stating the name of the unsupported index.

* Queries using unsupported indexes from the extension set must be interpreted as though the term with the unsupported index was simply not present in the query. For example, when dealing with the query `title=pala* and ext.selected=true`, a provider such as the local inventory (for which the notion of "selected" is inapplicable) should simply treat the query as `title=pala*` -- so that `foo and ext.selected=value` and `foo or ext.selected=value` are both exactly equivalent to just `foo`.

This variation in how unsupported indexes are handled is the key difference between the core and extension context sets, and the principle reason that the distinction exists.

## 4. Supply records in the Codex record schema

Codex providers must supply instance records in the format specified by [the Codex instance schema](https://github.com/folio-org/raml/blob/master/schemas/codex/instance.json) -- and collections of records in the format specified by [the Codex instance-collection schema](https://github.com/folio-org/raml/blob/master/schemas/codex/instanceCollection.json).

Specifically, and most importantly:
* `id` must be set to the ID of the record within its own appliction
* `source` must be set to a short unique string identifying the provider -- for example, `ekb` for the EBSCO knowledge-base or `local` for the local inventory.

These two fields, taken together, will be used by the Codex UI to display full records by linking into the applications that natively deal with the relevant records: [`ui-inventory`](https://github.com/folio-org/ui-inventory) for local inventory records, and [`ui-eholdings`](https://github.com/thefrontside/ui-eholdings) for the EBSCO knowledge-base.

## See Also

* [The RAML definition of the Codex WSAPI](https://github.com/folio-org/raml/blob/master/ramls/codex/codex.raml)
* [The Codex instance schema](https://github.com/folio-org/raml/blob/master/schemas/codex/instance.json)
* The Codex CQL [core schema](https://github.com/folio-org/raml/blob/master/schemas/codex/codex_instance_cqlschema.json) and [extension schema](https://github.com/folio-org/raml/blob/master/schemas/codex/codex_instance_cqlschema-ext.json), and the [schema schema](https://github.com/folio-org/raml/blob/master/schemas/CQLSchema.schema) that describes them both
* [MODINVSTOR-39](https://issues.folio.org/browse/MODINVSTOR-39), the Jira issue to create a Codex-conformant API for the Inventory module.
* [`mod-codex-ekb`](https://github.com/folio-org/mod-codex-ekb), the project to create a Codex-conformant facade to the EBSCO knowledge-base; and [MODCXEKB](https://issues.folio.org/projects/MODCXEKB/issues), the Jira issues pertaining to that project.

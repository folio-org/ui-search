# The Codex contract

## Introduction

The FOLIO Codex is a layer that presents resources from various providers in an integrated way, unifying local inventories, eletronic holdings from knowledge bases, institutional repositories and more.

There is no physical Codex database: records are not harvested from participating providers, but searched in real time. In order to participate in the Codex, a provider must satisfy a specific contract. This document describes that contract, outlining the reponsibilities that each source must meet.

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
* The interface-Type `multiple`. This is required in order to avoid clashing with the multiplexer, and to declare availability for that module to access this one. See [the relevant section of the the Okapi Guide](https://github.com/folio-org/okapi/blob/master/doc/guide.md#multiple-interfaces).
* The paths `/codex-instances` and `/codex-instances/{id}`, for searching and full-record retrieval respectively.

The paths that must be supported are specified in more detail in [the RAML for this interface](https://github.com/folio-org/raml/blob/master/ramls/codex/codex.raml)and the linked schemas.

Note that Codex provider modules may additional provide other interfaces, which are ignored for the purpose of Codex multiplexing. For example, the Inventory Storage module [`mod-inventory-storage`](https://github.com/folio-org/mod-inventory-storage), which already implements 13 interfaces include `item-storage` and `instance-storage` will be extended to also implement the `codex` interface in multiple mode -- see [MODINVSTOR-39](https://issues.folio.org/browse/MODINVSTOR-39). Conversely, the dedicated EBSCO KB Codex module [`mod-codex-ekb](https://github.com/folio-org/mod-codex-ekb) will provide a Codex-compliant facade to the existing EBSCO knowledge-base, providing only the `codex` interface. Both strategies are valid.

(The notion of an "interface" in FOLIO will become reified as a first-class object in the future: see [OKAPI-418](https://issues.folio.org/browse/OKAPI-418).)

## 3. Accept queries meeting the Codex query schema

As indicated by [the `searchable` trait](https://github.com/folio-org/raml/blob/master/traits/searchable.raml) of [the RAML specification](https://github.com/folio-org/raml/blob/master/ramls/codex/codex.raml), the `/codex-instances` endpoint of a Codex provider must accept a `query` parameter whose value is a [CQL](http://zing.z3950.org/cql/intro.html) query. The details of what parts of CQL should be accepted and which indexes are supported by a given implementation can be expressed in machine-readable form in accordance with [the CQL schema](https://github.com/folio-org/raml/blob/master/schemas/CQLSchema.schema).

Codex providers must accept searches that include the index `selected`, whose value is a boolean (`true` or `false`) -- for example, `title=pala* and selected=true`. For providers that inherently support this index, it should be interpreted in the usual way: for example, in the EBSCO knowledge-base where some titles are selected and some are not, the example search should find titles begining with "pala" that have been selected, omitted any "pala" matches that are not selected. Providers for which the notion of "selected" is not meaningful should treat any search on that index as an identity search that can be ignored, so that `foo and selected=value` and `foo or selected=value` are both exactly equivalent to just `foo`.

## 4. Supply records in the Codex record schema

XXX https://github.com/folio-org/raml/tree/master/schemas/codex).

## See Also

https://issues.folio.org/browse/MODINVSTOR-39
mod-codex-ekb

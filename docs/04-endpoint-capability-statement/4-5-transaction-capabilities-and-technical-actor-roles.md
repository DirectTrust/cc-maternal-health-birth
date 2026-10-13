---
title: "4.5 Transaction Capabilities and Technical Actor Roles"
---

# 4.5 Transaction Capabilities and Technical Actor Roles

Declare each supported transaction using its canonical coded identity from the published DirectTrust terminology. TX numbers are navigation labels and SHALL NOT replace the interoperable transaction identity. Declare supportsSend and supportsReceive independently for Sender Actor and Receiver Actor capabilities.

Catalog membership does not establish implementation support. query-for-documents (TX6) is a placeholder for query transactions outside the current Direct exchange scope and SHALL NOT be advertised as implemented solely because its code appears in the catalog.

| **Local** | **Canonical transaction code** | **Sender Actor** | **Receiver Actor** | **Rule** |
|----|----|----|----|----|
| TX1 | send-outpatient-visit-notification | Yes / No | Yes / No | Role-dependent |
| TX2 | send-admission-notification | Yes / No | Yes / No | Role-dependent |
| TX3 | send-birth-notification | Yes / No | Yes / No | Role-dependent |
| TX4 | send-discharge-notification | Yes / No | Yes / No | Role-dependent |
| TX5 | send-documents | Yes / No | Yes / No | Role-dependent |
| TX6 | query-for-documents | Not in scope | Not in scope | Query placeholder |
| TX7 | send-patient-update | Yes / No | Yes / No | Role-dependent |
| TX8 | send-workflow-status | Yes | Yes | Baseline endpoint capability |

A conforming endpoint SHALL declare send-workflow-status with supportsSend=true and supportsReceive=true, as required by the MAP Endpoint CapabilityStatement Profile. Support for other in-scope transactions depends on the endpoint’s declared Technical Actor Roles.

Conformance testing SHALL assess the transaction and Technical Actor Role combinations actually declared by the endpoint. Organization type alone does not determine test applicability.

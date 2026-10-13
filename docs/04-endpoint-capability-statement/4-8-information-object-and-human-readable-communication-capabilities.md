---
title: "4.8 Information Object and Human-Readable Communication Capabilities"
---

# 4.8 Information Object and Human-Readable Communication Capabilities

For each supported transaction and Technical Actor Role, identify information-object representations and transaction-specific options that affect interoperability. These include supported event types, document types, FHIR serializations, and permitted optional information objects. Required Task, Provenance, and human-readable content requirements remain applicable; optional capability declarations cannot remove them. Query options apply only where the applicable guide defines an implemented query transaction.

| **Capability area** | **Examples of what to declare** |
|----|----|
| Event notifications | Supported HL7 V2 event types and versions. |
| Clinical documents | Supported document types and codes when an implemented subset is permitted. |
| FHIR workflow resources | Required resources and supported optional resource representations; required content remains mandatory. |
| Query options (OUT OF SCOPE) | Supported Request by Type, Request by Category, categories, and other query choices. |
| Human-readable content | Supported MIME representations or material presentation constraints. |

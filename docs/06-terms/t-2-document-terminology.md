---
title: "T.2 Document Terminology"
---

# T.2 Document Terminology

These concise definitions establish the language used in Chapter 1 and Appendix A. The detailed explanations, examples, and code catalog are in Appendix A.

| **Term** | **Meaning and use** |
|----|----|
| Source Form | The human-readable representation of the source-authored document information preserved in an exchanged clinical document. It establishes the content and authorship boundaries of that representation. |
| Minimally Structured Document | A standardized clinical document that preserves its human-readable Source Form and includes the dependable structure required by the applicable document and exchange specifications. |
| Progressive Structuring | A methodology for progressively enriching a document’s computable representation while preserving its source information, attribution, and context. |
| Information Collection Scope | The boundary that establishes which information belongs to a collection, such as an encounter, an established episode, or a point-in-time patient summary. |
| Species | The Document Type dimension: the specific semantic kind of clinical information collection. |
| Genus | The Document Template/Profile dimension: the asserted structural and conformance model. |
| Family | The Document Category dimension: the broader semantic group or groups to which a document belongs. |
| Pregnancy History | The guide’s label for LOINC 10162-6. Section use and broader document-classification use are distinct applications; Appendix A lists the use-case mappings. |
| Document Type | The specific semantic kind of clinical document: what information collection it represents. This is the Species dimension. Use Document Type in conceptual prose and the exact standard field name in encoding requirements. |
| Document Category | A broader semantic grouping of documents for discovery and workflow. This is the Family dimension; a document may belong to multiple categories. Its coded representation depends on the applicable standard and exchange policy. |
| Document Template/Profile | The asserted structural and conformance requirements for a document, corresponding to the Genus dimension. It is distinct from Document Type and Document Category. A format code describes a declared format/profile convention; it is not the full template definition. |
| Document Lifecycle | The progression and history of a document’s preparation, completion, amendment, correction, replacement, or invalidation. It is separate from the lifecycle of a Direct message or MAP transaction. |
| Document Status | The asserted clinical or authoring state of a particular document version, interpreted under its source specification. It is distinct from metadata availability, transport disposition, and structured payload acceptance. |
| On-Demand Document | An on-demand document is assembled at the time it is requested/needed, but the effective time of the document is tied to the clinically relevant time of the document’s context, for example a specific encounter or episode of care. |
| Dynamically Generated Document | In this guide, a dynamically generated document takes the current context of available information to include in the document. Its clinical effective time is now. |

## Document Classification Field Crosswalk

Use the conceptual terms below in prose. Use exact field names when specifying population rules. These mappings identify semantic roles; they do not establish interchangeable bindings or cardinalities.

| **Standard representation** | **Document Type** | **Document Category** |
|----|----|----|
| IHE XD DocumentEntry | DocumentEntry.typeCode | DocumentEntry.classCode carries the exchange-defined broad classification; align it with Document Category only where that mapping is declared. |
| CDA | ClinicalDocument/code | ClinicalDocument/sdtc:category (urn:hl7-org:sdtc); not ClinicalDocument/@classCode, whose fixed DOCCLIN value identifies the RIM class. |
| FHIR R4 Composition | Composition.type | Composition.category |
| FHIR R4 DocumentReference | DocumentReference.type | DocumentReference.category |

Document-level CDA templateId and applicable FHIR meta.profile assertions identify Document Template/Profile. XD formatCode and DocumentReference.content.format identify an established format convention where defined; MIME type identifies serialization. SubmissionSet.contentTypeCode classifies the structured payload, not a document category. SubmissionSet.purpose and Task.code identify the requested Shared Activity.

For non-document information objects such as a Task or Provenance Bundle, use information-object type and classification rather than calling them clinical Document Types. Chapter 3 retains the binding and conformance requirements; Appendix C explains XD classification and Appendix D supplies packaging mappings.

## Document Lifecycle Reference

Appendix E, Understanding Document Lifecycle and Status, supplies the document-status crosswalk and the applicable CDA, FHIR, and XD metadata mappings. Do not infer a document’s finality from successful transport or structured payload acceptance.

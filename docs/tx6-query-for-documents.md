---
title: "TX6: query-for-documents"
---

# TX6: query-for-documents

## Transaction Overview

query-for-documents enables a Query Initiator to discover clinical documents available for a patient using the IHE Registry Stored Query \[ITI-18\] FindDocuments query. The transaction returns document metadata describing matching documents; retrieval of a selected document occurs through the applicable IHE document retrieval transaction. It is used in conjunction with the Query for Patient and Retrieve Document transaction to perform a document retrieval via IHE query protocols.

The canonical transaction code is query-for-documents. TX6 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

This transaction defines two complementary query options. A Query Initiator SHALL use one option per query: request by type or request by category.

| **Query option** | **IHE query parameter** | **Question answered** | **Matching behavior** |
|----|----|----|----|
| Request by Type | \$XDSDocumentEntryTypeCode | Do you have this specific type of document? | Exact semantic document-type match |
| Request by Category | \$XDSDocumentEntryClassCode | What documents do you have in this category? | Membership in the requested category |

The collection containing this transaction also defines the document categories used by the applicable Context Implementation Guide. A Query Responder is responsible for maintaining sufficient classification knowledge to determine which of its document types belong to each supported category.

### Actors and Roles

| **Actor** | **Role** |
|----|----|
| Query Initiator / Document Consumer | Invokes FindDocuments for a patient and supplies either one requested document type or one requested document category. |
| Query Responder / Document Registry | Evaluates the query against available document metadata and returns metadata for matching documents. |
| Initiating Gateway / Responding Gateway | May participate when the query is federated across communities, as defined by the applicable IHE document-sharing profile. |

### Referenced IHE Transaction

| **Item** | **Value / constraint** | **Implementation guidance** |
|----|----|----|
| IHE transaction | Registry Stored Query \[ITI-18\] | Use the IHE IT Infrastructure Technical Framework requirements for Registry Stored Query. |
| Stored query | FindDocuments | Both query options use the existing FindDocuments stored query. |
| Query UUID | urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d | Fixed UUID assigned by IHE to FindDocuments. |
| returnType | LeafClass (recommended) | Returns complete XDSDocumentEntry metadata needed to identify and select documents. ObjectRef remains available under base IHE rules. |

## XD Query Metadata Guidance and Constraints

This transaction is different from the message-carrying transactions in this collection: its primary interoperable behavior is the IHE ITI-18 FindDocuments query itself. The canonical transaction code identifies the reusable query behavior, while the query parameters below carry the document-discovery semantics.

The query SHALL conform to IHE ITI-18 FindDocuments. The parameters below define the common constraints for query-for-documents. Optional base-profile parameters may also be supplied when needed by the use case.

| **Conf.** | **Query parameter** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | \$XDSDocumentEntryPatientId | Patient identifier | Identifies the patient whose documents are being requested. |
| R | \$XDSDocumentEntryStatus | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved | Requests currently approved document entries unless the use case explicitly requires another valid status. |
| C | \$XDSDocumentEntryTypeCode | One LOINC document type | Required for Request by Type. |
| C | \$XDSDocumentEntryClassCode | One LOINC document category | Required for Request by Category; exactly one requested category for this transaction. |
| O | Other FindDocuments parameters | As defined by ITI-18 | May further constrain the query without changing the type-versus-category semantics defined here. |

### Coding of LOINC Query Values

LOINC-coded type and category values SHALL use the ITI-18 abbreviated HL7 V2.5 CE coding form. The identifier and coding scheme are populated and the display-name component is omitted:

> code^^coding-scheme

For LOINC, the coding scheme OID is 2.16.840.1.113883.6.1. This transaction constrains the type or category selector to one requested code at a time.

> \<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>

## Query Option 1 – Request by Type

Request by Type is used when the Query Initiator knows the precise kind of document it wants. The Query Initiator SHALL populate \$XDSDocumentEntryTypeCode with one specific LOINC Document Ontology code.

The Query Responder SHALL interpret the requested value as an exact semantic document-type match. If the responder internally uses local document classifications, it MAY translate the requested LOINC code to an equivalent local type. Such translation SHALL represent semantic equivalence and SHALL NOT broaden the request to other document types merely because they belong to the same category.

| **Conf.** | **Requirement** |
|----|----|
| R | The query SHALL include exactly one requested document type in \$XDSDocumentEntryTypeCode. |
| R | The Query Responder SHALL return only DocumentEntry objects representing the requested specific document type, subject to all other supplied query constraints. |
| R | Returned DocumentEntry.typeCode metadata SHALL identify the specific standardized document type represented by the document. |
| RE | When retrieved as CDA, ClinicalDocument.code SHOULD identify the same standardized document type. |
| RE | When retrieved as a FHIR document, Composition.type and corresponding DocumentReference.type SHOULD identify the same standardized document type. |

### Expected Actions – Request by Type

• Identify candidate documents for the requested patient and status.

• Compare the requested LOINC document type to the precise type assigned to each candidate document.

• Where local codes are used internally, apply an exact semantic mapping to the requested standardized LOINC document type.

• Return metadata for each matching document.

• Do not substitute a different document type solely because it is classified in the same broader category.

## Query Option 2 – Request by Category

Request by Category is used when the Query Initiator wants to discover all documents available for a patient that belong to one broader document category. The Query Initiator SHALL populate \$XDSDocumentEntryClassCode with one category code defined by the applicable Context Implementation Guide.

The Query Initiator does not need to know every specific document type that may satisfy the category. The Query Responder is responsible for knowing which document types it stores, creates, or makes available and how those document types are classified.

| **Conf.** | **Requirement** |
|----|----|
| R | The query SHALL include exactly one requested document category in \$XDSDocumentEntryClassCode. |
| R | The Query Responder SHALL evaluate the requested category against all categories associated with each candidate document. |
| R | A document SHALL match when the requested category is one of the categories associated with that document. |
| R | A document MAY be classified into multiple categories. This multiplicity is a Query Responder classification responsibility and does not require the Query Initiator to request multiple categories. |
| R | Each matching document SHALL be represented only once in the query response. |
| R | The returned DocumentEntry.typeCode SHALL continue to identify the specific document type, not merely the category used to discover it. |
| RE | When a returned CDA document is retrieved, applicable document category classifications SHOULD be represented using repeatable ClinicalDocument/sdtc:category elements. |
| RE | When a returned FHIR document is retrieved, applicable category classifications SHOULD be represented using the corresponding repeatable category metadata supported by the FHIR document model. |

### Expected Actions – Request by Category

• Identify candidate documents for the requested patient and status.

• Obtain the full set of category classifications associated with each candidate document.

• Determine whether the single requested category is a member of that set.

• Return metadata for every matching document, regardless of the specific document type.

• Preserve the specific document type in the returned typeCode so the Query Initiator can distinguish among the document types discovered.

## Query Response

FindDocuments returns XDSDocumentEntry metadata, not the clinical document content itself. When returnType is LeafClass, the response provides complete DocumentEntry metadata objects for matching documents. The Query Initiator may use this metadata to select one or more documents for subsequent retrieval.

| **Metadata element** | **Request by Type** | **Request by Category** |
|----|----|----|
| DocumentEntry.typeCode | Expected to equal the requested specific type (or its exact standardized equivalent). | Identifies the specific type of each document discovered; values may differ across returned entries. |
| DocumentEntry.classCode | May provide the responder's applicable query classification. | Represents the category metadata used by the responder in the IHE DocumentEntry model. |
| Document identity / retrieval metadata | Returned as defined by IHE. | Returned as defined by IHE. |

## FHIR Metadata Guidance

The type-versus-category semantics defined by the XD query are representation-independent. Appendix C - Mapping XD Metadata to FHIR Resources governs representation of returned document metadata as FHIR List/DocumentReference metadata. A FHIR-native equivalent of the ITI-18 query interaction itself is not defined by this transaction; implementations SHALL NOT infer one solely from the XD-to-FHIR metadata mapping.

| **Concept** | **IHE XD metadata** | **CDA representation** | **FHIR representation** |
|----|----|----|----|
| Specific document type | DocumentEntry.typeCode | ClinicalDocument.code | Composition.type; DocumentReference.type |
| Document category | DocumentEntry.classCode used for category-oriented discovery | ClinicalDocument/sdtc:category (repeatable) | DocumentReference.category and applicable Composition category metadata |

## Context IG Metadata Guidance

TBD - Context IG Metadata Guidance. Guidance for expressing this query transaction using the redesigned DirectTrust Context IG specification will be added when that specification is stable.

A document type may be assigned to more than one category. The Query Responder SHALL maintain or derive these associations in a manner sufficient to answer a query for any one supported category.

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Query Initiator | Query construction | SHALL issue one supported query option per request and SHALL use the standardized type/category semantics defined by this transaction. |
| Query Responder | Query processing | SHALL evaluate the query against available document metadata and preserve the distinction between exact document type and broader document category. |
| Query Responder | Response | SHALL return metadata for matching documents using the applicable IHE query-response requirements; document retrieval remains a separate interaction. |

## Appendix A – Clarifying Examples

### A.1 Exact Document Type Example – Antepartum Summary

A Query Initiator knows that it specifically requires an Antepartum Summary (LOINC 57055-6). It uses Request by Type.

> \<rim:Slot name="\$XDSDocumentEntryTypeCode"\>\
> \<rim:ValueList\>\
> \<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>

The responder returns metadata only for documents whose precise document type is Antepartum Summary. A different maternal-health document does not satisfy the query merely because it is related to pregnancy.

### A.2 Category Example – Discharge Summary

A Query Initiator wants to discover the discharge-summary documents available for the patient but does not know which specialized discharge-summary types the responder may have. It uses Request by Category with LOINC 18842-5 Discharge Summary.

> \<rim:Slot name="\$XDSDocumentEntryClassCode"\>\
> \<rim:ValueList\>\
> \<rim:Value\>('18842-5^^2.16.840.1.113883.6.1')\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>

Depending on the patient's available records and the responder's classifications, the response might include specific document types such as 92576-8 Maternal Discharge Summary and 97702-5 Maternal and Fetal Medicine Discharge Summary. Their returned typeCode values remain the specific document types.

### A.3 Category Example – Maternal Health

A Query Initiator may request the single category 10162-6 Maternal Health to discover the maternal-health documents available for the patient. The responder evaluates that category against its classification of each available document type.

| **Specific document type** | **Example category membership** | **Matches 10162-6 query?** |
|----|----|----|
| 57055-6 Antepartum Summary | Maternal Health; other applicable categories | Yes |
| 92576-8 Maternal Discharge Summary | Maternal Health; Discharge Summary; other applicable categories | Yes |
| 97702-5 Maternal and Fetal Medicine Discharge Summary | Maternal Health; Discharge Summary; other applicable categories | Yes |
| Unrelated document type | No Maternal Health classification | No |

### A.4 One Query, One Category; One Document, Many Categories

This transaction intentionally keeps query behavior simple: one category is requested at a time. A document may nevertheless be classified under multiple categories.

> Document Type: 92576-8 Maternal Discharge Summary\
> \
> Responder classification:\
> 10162-6 Maternal Health\
> 18842-5 Discharge Summary\
> \[additional applicable category\]\
> \
> Query: classCode = 10162-6 -\> MATCH\
> Query: classCode = 18842-5 -\> MATCH

The multiplicity of document classification is managed by the Query Responder; it does not increase the complexity of the query issued by the Query Initiator.

## Appendix B – Example FindDocuments Query Skeleton

The following skeleton illustrates the common FindDocuments structure. The option-specific Slot is selected according to whether the transaction is Request by Type or Request by Category.

> \<query:AdhocQueryRequest\
> xmlns:query="urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0"\
> xmlns:rim="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"\>\
> \
> \<query:ResponseOption returnComposedObjects="true"\
> returnType="LeafClass"/\>\
> \
> \<rim:AdhocQuery\
> id="urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d"\>\
> \
> \<rim:Slot name="\$XDSDocumentEntryPatientId"\>\
> \<rim:ValueList\>\
> \<rim:Value\>'\[patient identifier\]'\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>\
> \
> \<!-- Select ONE option --\>\
> \
> \<!-- Request by Type --\>\
> \<rim:Slot name="\$XDSDocumentEntryTypeCode"\>\
> \<rim:ValueList\>\
> \<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>\
> \
> \<!-- OR Request by Category\
> \<rim:Slot name="\$XDSDocumentEntryClassCode"\>\
> \<rim:ValueList\>\
> \<rim:Value\>('10162-6^^2.16.840.1.113883.6.1')\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>\
> --\>\
> \
> \<rim:Slot name="\$XDSDocumentEntryStatus"\>\
> \<rim:ValueList\>\
> \<rim:Value\>('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')\</rim:Value\>\
> \</rim:ValueList\>\
> \</rim:Slot\>\
> \
> \</rim:AdhocQuery\>\
> \</query:AdhocQueryRequest\>

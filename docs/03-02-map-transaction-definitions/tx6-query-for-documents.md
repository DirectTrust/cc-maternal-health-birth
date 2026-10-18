Reusable Transaction Definition

cc-maternal-health-birth via the Direct Standard® \| Updated 2026-10-14 \| TX6 revision v6

## 1 Transaction Overview — WHY

### 1.1 Purpose and Scope

query-for-documents discovers available clinical documents for a resolved patient through IHE Registry Stored Query \[ITI-18\], FindDocuments. It returns document metadata; retrieval of selected document content is a separate interaction, normally ITI-43 under the applicable document-sharing profile. Patient identity resolution precedes this query and is not defined by TX6.

A Query Initiator SHALL select one query option per request: one precise Document Type, or one declared Document Category. Query Responder classification knowledge supports category discovery without requiring the initiator to enumerate every document type.

| **Query option**    | **Selector**                | **Matching meaning**                                                                 |
|---------------------|-----------------------------|--------------------------------------------------------------------------------------|
| Request by Type     | \$XDSDocumentEntryTypeCode  | One precise document type; exact semantic match.                                     |
| Request by Category | \$XDSDocumentEntryClassCode | One declared category under the exchange policy; retain each result’s specific type. |

### 1.2 Transaction Identity

The canonical reusable activity code is query-for-documents; TX6 is the cc-maternal-health-birth editorial label. The wire query is identified by the IHE FindDocuments UUID, urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d. That fixed query-definition UUID is not a unique invocation, patient, document or Context Instance identifier. This native ITI-18 interaction does not introduce Task.code or a MAP SubmissionSet.purpose field.

### 1.3 Framework Relationship

TX6 is a native IHE document-query interaction, not a MAP Direct message-carrying transaction. Query Initiator and Query Responder roles apply; returned document author and source identities remain those of the documents. The Chapter 3 Direct MIME package, Workflow Activity Task, MAP SubmissionSet, and TX8 reporting provisions do not apply to the native ITI-18 invocation. If discovered documents are subsequently communicated using another independently defined transaction, that transaction follows its own requirements.

## 2 Message and Payload Requirements — WHAT

### 2.1 Query Request and Response

Apply the applicable IHE query request/response and security requirements. FindDocuments returns metadata or object references according to returnType; it does not return the clinical document files. LeafClass is preferred when complete metadata is needed for selection. ObjectRef remains available when permitted by the selected IHE profile.

| **Item**                | **TX6 constraint**                                                                                                                                       |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| IHE transaction         | Registry Stored Query \[ITI-18\], FindDocuments.                                                                                                         |
| returnType              | LeafClass for full DocumentEntry metadata; ObjectRef under base-profile rules.                                                                           |
| Patient scope           | One patient identifier in the registry/exchange domain, with assigning authority. A sender-local identifier is insufficient unless valid in that domain. |
| Type/category selection | Exactly one of the two selectors in this definition. Additional compatible FindDocuments filters may constrain the results.                              |

### 2.2 Workflow Activity Task and Status Instructions

Intentionally blank for native ITI-18: no MAP Workflow Activity Task, SubmissionSet/List business identifier or Workflow Status Update Endpoint is introduced. IHE transport/message invocation identifiers retain their defined meanings. TX8 acceptance/rejection and Chapter 3 missing-status rules SHALL NOT be substituted for the native IHE query response or fault.

### 2.3 Human Readable Content

A user-facing or diagnostic query view SHOULD show the patient identifier and authority, selected option, requested code and code system, readable classification label, supplied filters, response status and result count. For each result, show its precise Document Type and available title, source, authorship, clinical/service time and retrieval identity. A query preview does not constitute a transmitted MAP human-readable communication.

### 2.4 Direct Message and Transport Requirements

Intentionally blank for this native IHE query. No Direct message, MAP structured payload package, XD Subject convention, or multipart human-readable communication is created by the ITI-18 interaction.

## 3 XD Query Metadata Guidance — HOW

### 3.1 Query Parameters

| **Conf** | **Parameter**               | **Value and rule**                                                                           |
|----------|-----------------------------|----------------------------------------------------------------------------------------------|
| R        | \$XDSDocumentEntryPatientId | Registry-domain patient identifier in the IHE CX form.                                       |
| R        | \$XDSDocumentEntryStatus    | Approved by default; another valid availability status only under an explicit query purpose. |
| C        | \$XDSDocumentEntryTypeCode  | One precise standardized document type for Request by Type; omit the category selector.      |
| C        | \$XDSDocumentEntryClassCode | One declared category for Request by Category; omit the type selector.                       |
| O        | Other FindDocuments filters | As permitted by ITI-18; do not alter the selected type/category meaning.                     |

### 3.2 Coded Values and Classification Policy

Query coded values SHALL use the abbreviated IHE CE form code^^coding-scheme, omitting the display component. LOINC uses CodeSystem OID 2.16.840.1.113883.6.1. A terminology ValueSet URI is not the coding scheme.

\<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>

Chapter 3 and Chapter T distinguish precise Document Type, broad Document Category and Document Template/Profile. A category-oriented classCode selector SHALL use the exchange’s declared classification policy. Base IHE classCode cardinality and matching rules remain unchanged; repeatable CDA sdtc:category or FHIR DocumentReference.category values do not make XDS classCode repeatable or automatically extend FindDocuments to an ontology-subsumption query.

When the service offers discovery across several category memberships, its classification index or explicitly declared query-adaptation policy SHALL support that behavior while preserving valid IHE metadata and precise typeCode values. A standard registry that exposes only its single classCode cannot be assumed to match every additional application category. The initiator and responder SHALL agree which categories are supported; no unsupported category is silently reinterpreted as a different concept.

When code 10162-6 is used in this guide, its display SHALL be Pregnancy History, consistent with Chapter 3. It SHALL NOT be labeled Maternal Health or treated as a universal category for all maternal documents. A broader Maternal Health category requires a separately identified, agreed concept; this revision does not assign one.

### 3.3 Request by Type

The initiator SHALL request one precise standardized document type. The responder SHALL return metadata only for documents with that specific semantic type, subject to the other filters. Internal local-code translation MAY represent exact equivalence; it SHALL NOT broaden the request merely because another type belongs to the same category. Returned typeCode SHALL identify the actual standardized Document Type.

### 3.4 Request by Category

The initiator SHALL request one supported category. The responder SHALL evaluate its declared category membership policy against candidate documents, return each matching document once, and retain its precise typeCode. A document MAY have several application category memberships; that does not require several requested categories or duplicated results. The service SHALL distinguish that policy from base IHE classCode cardinality.

### 3.5 Query Response and Retrieval Metadata

The response SHALL preserve document instance/retrieval identities, availability status and applicable authored/source metadata under the selected IHE profile. Registry availability status does not report clinical completeness, legal authentication, Direct delivery or MAP acceptance. A successful query with no matching documents is a valid empty result, not proof of an unknown patient or package rejection.

| **Metadata concept**            | **Type query**                                                                | **Category query**                                                            |
|---------------------------------|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| typeCode                        | Specific requested type or exact equivalent.                                  | Specific type of each discovered document; may differ across results.         |
| classCode                       | Applicable registry classification.                                           | Applicable classification under the declared query policy.                    |
| uniqueId and retrieval identity | Preserve the document instance and required repository/community information. | Same requirements; use these values for separate retrieval.                   |
| Patient and source information  | Maintain registry patient identity and source provenance.                     | Same requirements; category membership does not change the patient or source. |

## 4 FHIR Metadata Guidance — HOW

### 4.1 Representation Boundary

No FHIR-native query API is defined by this TX6 revision. Metadata crosswalks do not turn ITI-18 into an inferred FHIR search operation. Appendix D governs a separately initiated MAP FHIR Collection package; it does not require a query response to create a MAP SubmissionSet List, Workflow Activity Task or native payload Bundle. Metadata discovery alone does not establish that clinical document bytes are carried.

### 4.2 Information Classification

| **Concept**         | **XD metadata**                                          | **Clinical representation**                                                        |
|---------------------|----------------------------------------------------------|------------------------------------------------------------------------------------|
| Document Type       | DocumentEntry.typeCode                                   | CDA ClinicalDocument.code; FHIR Composition.type and DocumentReference.type.       |
| Document Category   | Applicable DocumentEntry.classCode under exchange policy | Repeatable CDA sdtc:category or FHIR DocumentReference.category when applicable.   |
| Template or profile | Known formatCode and profile-specific metadata           | CDA templateId or FHIR meta.profile; do not substitute for semantic type/category. |

Preserve the retrieved artifact’s clinical snapshot and document identity. A later CDA assembly may have a distinct Assembler/Composer time under Chapter 3; query or retrieval time does not replace original clinical effective/service time or prove a new clinical document was authored.

## 5 Context IG Guidance

Intentionally blank. No additional Context IG query representation is specified in this revision. Perinatal or other applicable Context may inform authorized query selection, but this definition does not invent a FindDocuments Context parameter or infer an episode identifier from a patient identifier.

## 6 Technical Actor Functional Requirements — WHO DOES WHAT

| **Actor**                           | **Requirement**                                                                                                                                               |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Query Initiator / Document Consumer | SHALL resolve the registry-domain patient identity, select one supported query option, apply authorized filters, and evaluate the native response.            |
| Query Responder / Document Registry | SHALL process supported parameters and declared classification semantics, return distinct matching metadata and preserve exact type and retrieval identities. |
| Initiating / Responding Gateway     | When used, SHALL apply the selected federated document-sharing profile; this definition does not relabel ITI-38 as ITI-18 or alter gateway requirements.      |
| Document retrieval participant      | SHALL retrieve selected content through the applicable separate retrieval transaction and preserve document identity and clinical snapshot.                   |

## 7 Transaction Specific Processing — WHAT IS SPECIAL

### 7.1 Query Outcomes and Anomalies

Apply the native IHE query response, error and security behavior. Invalid parameters, unavailable service, unauthorized query or unresolved required patient domain need query-specific handling. A successful empty result SHALL NOT be represented as TX8 patient-not-found. A query timeout leaves the query result unconfirmed and requires appropriate retry/follow-up under local policy; it does not establish that no documents exist.

### 7.2 Remaining Specification Items

Category-index/query-adaptation policy, the full supported category vocabulary, cross-community deployment rules and any future FHIR query API require explicit specification and tests. These items do not change the completed native-query boundary or authorize invented codes. CCP testing is a subsequent verification activity, not a completed validation claim in this definition.

## 8 Relevant Examples — SHOW ME

### 8.1 Exact Antepartum Summary Type

Request LOINC 57055-6 Antepartum Summary through the type selector. Other maternal document types do not satisfy this query merely because they concern pregnancy.

\<rim:Slot name="\$XDSDocumentEntryTypeCode"\>  
\<rim:ValueList\>  
\<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>  
\</rim:ValueList\>  
\</rim:Slot\>

### 8.2 Discharge Summary Category

Under a declared classification policy, request LOINC 18842-5 Discharge Summary. Documents classified in that category may include a Maternal Discharge Summary or Maternal and Fetal Medicine Discharge Summary. Returned typeCode values continue to identify their specific document types; the responder does not replace them with the requested category.

\<rim:Value\>('18842-5^^2.16.840.1.113883.6.1')\</rim:Value\>

### 8.3 Pregnancy History Category

A service that explicitly supports Pregnancy History category discovery may accept 10162-6. Only documents assigned that category under the agreed policy match. Pregnancy-related subject matter or the presence of a pregnancy-history section alone is not an automatic assignment. This example does not assert that all Antepartum or Maternal Discharge Summaries have that category.

\<rim:Value\>('10162-6^^2.16.840.1.113883.6.1')\</rim:Value\>

### 8.4 FindDocuments Skeleton

\<query:AdhocQueryRequest  
xmlns:query="urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0"  
xmlns:rim="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"\>  
\<query:ResponseOption returnComposedObjects="true" returnType="LeafClass"/\>  
\<rim:AdhocQuery id="urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d"\>  
\<rim:Slot name="\$XDSDocumentEntryPatientId"\>  
\<rim:ValueList\>\<rim:Value\>'\[patient CX with authority\]'\</rim:Value\>\</rim:ValueList\>  
\</rim:Slot\>  
\<rim:Slot name="\$XDSDocumentEntryTypeCode"\>  
\<rim:ValueList\>\<rim:Value\>('57055-6^^2.16.840.1.113883.6.1')\</rim:Value\>\</rim:ValueList\>  
\</rim:Slot\>  
\<rim:Slot name="\$XDSDocumentEntryStatus"\>  
\<rim:ValueList\>\<rim:Value\>('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')\</rim:Value\>\</rim:ValueList\>  
\</rim:Slot\>  
\</rim:AdhocQuery\>  
\</query:AdhocQueryRequest\>

For Request by Category, replace the type Slot with the one requested classCode Slot; do not include both. The patient value is illustrative and must be replaced with an actual registry-domain CX identifier.

### 8.5 Standards and Alignment References

IHE ITI Technical Framework, ITI-18: https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html. IHE document metadata: https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html. LOINC 10162-6: https://loinc.org/10162-6. Current local alignment references: Chapter 3 v58 and Appendix D v14 (2026-10-14), and TX8 v12 for the distinction between native IHE query outcomes and separate MAP workflow-status reporting. These references do not import MAP packaging or TX8 requirements into TX6.

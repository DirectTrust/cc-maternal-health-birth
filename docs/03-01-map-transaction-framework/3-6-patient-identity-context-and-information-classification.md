---
title: "3.6 Patient Identity Context and Information Classification"
---

# 3.6 Patient Identity Context and Information Classification

Patient identity, Context Instance identifiers, and information classification establish whose information is being exchanged, the workflow context to which it belongs, and how it should be understood. The following subsections explain these perspectives and the temporal rules that preserve an accurate clinical snapshot when a document is assembled or shared later.

## Patient Identity and Patient Matching for Push Transactions

For a MAP push transaction, patientId and sourcePatientId represent different patient-identifier perspectives. patientId SHALL be populated only when the Information Source knows the patient identifier appropriate to the Information Recipient or a mutually agreed exchange patient-identifier domain. The Information Source SHALL NOT copy its own local patient identifier into patientId merely because no recipient-known identifier is available. The Information Source local identifier belongs in DocumentEntry.sourcePatientId.

When all DocumentEntries in a SubmissionSet pertain to one patient, MAP SubmissionSet Patient Info SHALL be present. The extension SHALL use the same patient demographic representation and semantics defined for DocumentEntry.sourcePatientInfo. Patient Info SHALL be provided even when patientId is known, because it supplies an independent matching/checking fallback that can improve confidence in the Content Consumer patient match.

A patient identifier learned or resolved during transaction packaging MAY be represented in SubmissionSet.patientId and applicable DocumentEntry.patientId when it is known to be appropriate to the Information Recipient or agreed exchange domain. Packaging software SHALL NOT alter the underlying source ADT, CDA, or other clinical source object solely to inject that recipient-known patient identifier.

Example — TX1 followed by TX8

TX1: Organization A sends an Outpatient Visit Notification to Organization B. For TX1, A is the Information Source and B is the Information Recipient. SubmissionSet.sourceId identifies A. DocumentEntry.sourcePatientId carries A’s locally known patient identifier. SubmissionSet.patientId and applicable DocumentEntry.patientId are populated only if A knows the patient identifier appropriate to B or the mutually agreed exchange domain. SubmissionSet Patient Info is present regardless, providing the demographic information B can use to match or confirm the patient.

TX8: Organization B subsequently sends Workflow Status back to Organization A. TX8 is a new Transaction Instance, so B is now the Information Source and A is the Information Recipient. SubmissionSet.sourceId therefore identifies B. If B successfully matched the patient, B’s locally known patient identifier may be represented as the sourcePatientId of the TX8 information. patientId is populated only if B knows the identifier appropriate to A or the mutually agreed exchange domain. SubmissionSet Patient Info is again present. The TX8 correlation to TX1 preserves the relationship between the transactions without preserving the TX1 actor-role assignments.

If B cannot match the patient, B SHALL NOT manufacture a local sourcePatientId. A failed TX8 may still carry the SubmissionSet Patient Info associated with the attempted match and report the applicable structured payload rejection outcome.

## Context Instance Identifiers and Type Codes

ContextInstance TypeCodes have an Extensible binding to the DirectTrust Context TypeCode Value Set (DTContextTypeCodeVS), http://objects.directtrust.org/standards/terminology/ValueSet/DTContextTypeCodeVS, as specified in the SubmissionSet terminology binding table in Section 3.7.6. This binding applies to Context Instance type declarations in the Workflow Activity Task and corresponding XD or FHIR metadata. The type code identifies the kind of established Context Instance; the associated identifier identifies the particular instance.

The value set includes DirectTrust Context type codes and the IHE-defined accession, referral, order, DICOM Study Instance UID, and encounter identifier type URNs. In FHIR, the IHE types SHALL use urn:ietf:rfc:3986 as Coding.system and the complete IHE URN as Coding.code. DirectTrust types SHALL use the DirectTrust Context TypeCode CodeSystem canonical URI. The assigning authority or identifier namespace SHALL remain distinct from the type coding system. In XD CXi encoding, the complete type URN is carried in CXi.5.

IHE definitions are provided in ITI TF Volume 3, Table 4.2.3.1.7-2, with FHIR identifier mapping in ITI TF Volume 2, Appendix Z, Section Z.9.1.2. The IHE Study Instance UID type is urn:ihe:iti:xds:2016:studyInstanceUID; the encounter identifier type is urn:ihe:iti:xds:2015:encounterId.

## Information Classification and Metadata Derivation

MAP SHALL distinguish workflow activity from information-object classification. SubmissionSet.purpose identifies the Shared Activity supported by the package and SHALL align with the Workflow Activity Task.code. SubmissionSet.contentTypeCode identifies the package type and, unless a Transaction Definition states otherwise, SHALL use the typeCode of the principal DocumentEntry. DocumentEntry classCode and typeCode classify the information object; they SHALL NOT be populated with a MAP transaction code merely to identify the Shared Activity.

For clinical documents, Appendix A, Understanding Standardized Clinical Documents, explains Species, Genus, and Family and provides the maternal-health document-type catalog. Terms and Definitions supplies concise definitions. These references support application of the bindings below; they do not replace the normative requirements in this chapter or a Transaction Definition. When LOINC 10162-6 is used in this guide, its display label SHALL be Pregnancy History. Use the same label in document sections and coded metadata without conflating the semantic roles of those elements.

Document Status is distinct from structured payload workflow status and metadata availability. Apply Appendix E when interpreting CDA sdtc:statusCode, Composition.status, or DocumentReference.docStatus. A DocumentEntry availabilityStatus or DocumentReference.status value SHALL NOT substitute for the document’s clinical status; an accepted structured payload does not establish that its document is final.

Chapter T establishes Document Type, Document Category, and Document Template/Profile as the conceptual classification terms. For clinical documents, DocumentEntry.typeCode and DocumentReference.type represent Document Type. DocumentEntry.classCode and DocumentReference.category carry the applicable broad classification; use them as Document Category mappings only according to the declared exchange policy. Preserve the existing bindings and cardinalities. Non-document information objects retain their information-object classifications.

Clinical and discovery semantics SHALL be obtained from the source object or deterministically resolved from an authoritative reference source. Packaging software SHALL NOT manufacture clinical semantics or use synthetic NONE, Not specified, or equivalent placeholder codes to satisfy coded metadata. When omission is permitted and a value cannot be established, the element is omitted; when a required value cannot be established, the condition is reported as a metadata error.

For author metadata, authorRole represents the author’s patient- or act-specific function and has an Extensible binding to Care Team Member Function when that relationship is known. authorSpecialty represents professional specialty and has an Extensible binding to the combined membership of NUCC Provider Taxonomy and SNOMED CT Medical Specialty (C80 Practice Setting Codes). Both authorRole and authorSpecialty may repeat. practiceSettingCode describes the clinical practice setting associated with creation of the information. healthcareFacilityTypeCode describes the type of facility in which the clinical activity occurred and accepts codes from any of the three facility-type ValueSets listed in Section 3.7.7. These concepts SHALL NOT be treated as interchangeable.

Metadata derivation SHOULD remain traceable. Implementations should be able to distinguish values extracted from the clinical source, values resolved from an authoritative provider/facility reference such as Endpoint Discovery, and values generated as packaging mechanics (for example hash, size, MIME type, or package identifiers).

## Clinical Snapshot and Document Assembly Time

A document represents information applicable to a particular clinical encounter, event, or period. That clinical snapshot SHALL be preserved regardless of when the document is assembled or exchanged. Generating a document later does not authorize substitution of newer patient information for the information applicable to the snapshot.

For example, a discharge summary assembled one month after discharge shall report the weight applicable at discharge, rather than a weight recorded at a subsequent follow-up visit. Later corrections or additions, when included, SHALL be clearly identified and distinguished from the original snapshot.

As a second example, an EHR may retain a completed discharge summary in its internal representation and generate a CDA representation only when the document is requested. For MAP, this is considered release of an existing document in a shareable format. The CDA SHALL preserve the original document’s effective time and clinical snapshot. The Assembler participant’s time SHALL identify when the CDA representation was assembled in response to the request. This assumes the EHR retains sufficient historical information to reproduce that document accurately; a query of current patient values alone does not meet this requirement.

For CDA documents, DocumentEntry.creationTime SHOULD use the time of the version-appropriate Assembler or Composer participant identifying creation of the exchanged representation. If that participant or its time is absent, ClinicalDocument/effectiveTime SHALL supply the fallback when available. Do not invent a missing time or replace it with transaction time. Preserve ClinicalDocument/effectiveTime and its source meaning in the document. Encounter start and completion SHALL map separately to serviceStartTime and serviceStopTime when supplied. This MAP population rule explicitly qualifies the usual ClinicalDocument/effectiveTime-to-creationTime crosswalk; the derivation SHALL identify which source was used.

For HL7 V2 notifications, DocumentEntry.creationTime SHALL use MSH-7 message creation time. serviceStartTime and serviceStopTime SHALL use source-supported PV1-44 and PV1-45, respectively. EVN-2 SHALL be identified as event recorded time; EVN-6, when supplied, SHALL be identified as actual event occurrence time. Missing EVN-6 SHALL remain unavailable, and disagreements with visit boundaries SHALL be surfaced without silent substitution. Preserve source precision and timezone meaning. Event occurrence has no separate standard DocumentEntry timestamp field; do not misuse eventCodeList as a timestamp.

When CDA represents an existing document in another format, ClinicalDocument/effectiveTime preserves the original document’s creation time. Assembly time SHALL NOT replace that time solely because a CDA representation was generated later.

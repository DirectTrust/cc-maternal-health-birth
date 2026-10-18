---
title: "Appendix E: Understanding Document Lifecycle and Status"
---

# Understanding Document Lifecycle and Status

<span class="smallcaps">Keep document state distinct from exchange and workflow status.</span>

Appendix E provides a focused reference for Document Lifecycle and Document Status across CDA and FHIR. It connects the document concepts in Appendix A with the common requirements in Chapter 3 and metadata mappings in Appendix D. Chapter T defines the terminology. This reference provides mappings across CDA, FHIR, and IHE XD metadata where applicable.

## Document Lifecycle Concepts

Document Lifecycle describes the preparation and subsequent history of a document. Document Status describes a state asserted for a particular document version. Authentication, replacement relationships, version identity, and provenance add context; no single status field carries the entire history.

A preliminary document can be exchanged and accepted into a workflow while remaining preliminary. More often, finalized documents are exchanged. A final document can be rejected from a workflow for an unrelated processing defect.

Document status remains separate from message delivery, structured payload disposition, and subsequent workflow or service fulfillment. TX8 reporting is conditional; absence of TX8 is not evidence of document status or acceptance/rejection.

## Where Each Status Lives

Identify the object whose status is being described before selecting a code or interpreting metadata.

| **Representation**        | **Status element and code system**                                                                                                                                                                                                         | **Meaning and boundary**                                                                                                                                                                                                              |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CDA clinical document     | ClinicalDocument/sdtc:statusCode; urn:hl7-org:sdtc. ActStatus: http://terminology.hl7.org/CodeSystem/v3-ActStatus; OID 2.16.840.1.113883.5.14.                                                                                             | An approved SDTC header extension, not an arbitrary statusCode in a clinical entry. Applicable templates may constrain its use. The most applicable codes are: new, completed, active, nullified, cancelled, obsolete.                |
| FHIR R4 Composition       | Composition.status; http://hl7.org/fhir/composition-status, version 4.0.1. Additional codes used here are carried through the R5-to-R4 extension http://hl7.org/fhir/5.0/StructureDefinition/extension-Composition.status using valueCode. | Clinical/authoring status. The base R4 codes used here are preliminary, final, and entered-in-error. The additional R5 codes used here are cancelled and deprecated; they are carried by the extension, not as base R4 status values. |
| FHIR R4 DocumentReference | DocumentReference.docStatus; the same R4 CompositionStatus binding. Additional codes used here are carried through http://hl7.org/fhir/5.0/StructureDefinition/extension-DocumentReference.docStatus using valueCode.                      | Clinical status of the referenced document; distinct from the metadata reference status. Uses the same selected document-status meanings as Composition.                                                                              |
| FHIR metadata reference   | DocumentReference.status; http://hl7.org/fhir/document-reference-status.                                                                                                                                                                   | current, superseded, entered-in-error describe the reference, not document finality.                                                                                                                                                  |
| IHE XD metadata           | DocumentEntry.availabilityStatus.                                                                                                                                                                                                          | Approved/Deprecated describe document availability in the XD metadata lifecycle. Approved does not mean a final clinical document.                                                                                                    |
| MAP workflow report       | When TX8 applies: required report Task.status and accept/reject Provenance.                                                                                                                                                                | Acceptance or rejection of the originating structured payload; not document status.                                                                                                                                                   |

## CDA and FHIR Document Status Crosswalk

The following is interpretive guidance on the alignment of Document Status codes across CDA and FHIR structured documents.

| **Document concept**                                               | **CDA ActStatus and context**                                                                                                                                                                                        | **FHIR status and mapping caution**                                                                                                                                         |
|--------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| New – first version of a new logical document instance             | new or active can describe preparation or work in progress; use the governing template and authoring workflow.                                                                                                       | preliminary in R4 may be appropriate for an incomplete/unverified document. Neither CDA code is universally equivalent to preliminary.                                      |
| Completed version                                                  | completed describes normal completion of the documentation Act.                                                                                                                                                      | final is appropriate only when the version meets FHIR’s completion and verification meaning. A status alone does not assert a legal signature.                              |
| Created in error                                                   | nullified denotes an erroneously created Act; examine the scope of invalidation.                                                                                                                                     | entered-in-error is related, but FHIR’s document-series implications require explicit review; do not mechanically map every nullified instance to an entire invalid series. |
| Cancelled – underlying activity did not start or was not completed | This guide uses ActStatus cancelled with the FHIR CompositionStatus cancelled meaning. This guide-specific interpretation takes precedence here over the base ActStatus definition of abandonment before activation. | cancelled, carried through the R5-to-R4 status extension: the document is unavailable because the underlying activity did not start or was not completed.                   |
| Obsolete – replaced by another document instance                   | obsolete identifies a document instance replaced by a new instance.                                                                                                                                                  | deprecated, carried through the R5-to-R4 status extension. For this mapping, the document has been superseded and should no longer be used.                                 |

Status concepts for DocumentReference do not have a counterpart in CDA because the HL7 Clinical Document Architecture standard did not address document registration.

| **Document Management concept** | **CDA Context** | **FHIR DocumentReference Context**          |
|---------------------------------|-----------------|---------------------------------------------|
| Current reference               | N/A             | DocumentReference.status = current          |
| Superseded reference            | N/A             | DocumentReference.status = superseded       |
| Erroneous reference             | N/A             | DocumentReference.status = entered-in-error |

---
title: "TX3: send-birth-notification"
---

# TX3: send-birth-notification

## Transaction Overview

send-birth-notification is a derived maternal-health transaction created after a newborn admission/registration event is detected and the newborn is successfully associated with the maternal patient. The source newborn admission identifies the baby as the patient; the derived Birth Notification CDA identifies the mother as the primary subject and represents the newborn as linked related-subject information.

The canonical transaction code is send-birth-notification. TX3 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

TX3 is therefore not a newly invented HL7 Version 2 ADT event code. It is a semantic transformation of viewpoint used to support maternal continuity-of-care and postpartum workflow.

The temporary document-type code DT-Birth SHALL be used for the Birth Notification until a LOINC Document Ontology code is assigned.

### SMTP/MIME Message Header

The following SMTP/MIME message-header metadata supports early message routing and processing, use-case awareness, reusable transaction identification, Payload Metadata representation, Direct final-destination delivery notification, and optional workflow-status return.

Message-header layering. x-direct-useCase identifies the use-case context known to the sender; x-direct-transaction identifies the reusable exchange behavior; and x-direct-metadataTypeCode identifies how Payload Metadata is represented. Message Delivery confirms arrival of the Message at its Final Destination. Workflow Status provides the stronger assurance that the Payload reached its intended workflow. Both responses use the Direct address supplied in Disposition-Notification-To.

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through SMTP, an IMAP/mailbox arrangement, XDR, a custom API, or another supported receiving interface. A successful Final Destination Delivery Notification does not establish that the Payload was parsed, matched, routed, accepted, or delivered into its intended business workflow.

| **Conf.** | **Header element** | **Fixed value / constraint** | **Implementation guidance** |
|----|----|----|----|
| R | Content-Type | multipart/mixed | Outer Direct message content type. |
| R | x-direct-metadata-payload-versionIdentifier | 1 | Metadata and Payload Framework version identifier. |
| R | x-direct-useCase | cc-maternal-health-birth | Identifies the use-case context known to the sender. It is not an exclusive internal-routing instruction; the Receiver Actor may apply received information to other authorized workflows for which it is relevant. |
| R | x-direct-metadataTypeCode | urn:dt-org:dsm:map:SMTP+XD:1.0 | Identifies the Payload Metadata representation. This value indicates that XD metadata/XDM package processing applies; Subject is not used as an XDM processing signal. |
| O | x-direct-purpose | TREATMENT | Purpose of use when applicable. |
| O | x-direct-workflow-status-requested | true \| false; absent = false | When true, requests TX8 send-workflow-status after the Payload reaches, or fails to reach, its intended workflow. The response is sent to Disposition-Notification-To. |
| O | Subject | No fixed value specified | Human-readable subject line. SHALL NOT be relied upon as the machine-processable indication that the message carries XD/XDM metadata. |
| O | Disposition-Notification-Options | X-DIRECT-FINAL-DESTINATION-DELIVERY=optional,true | Include when Direct Final Destination Delivery Notification is requested. |
| RE/R2 | Disposition-Notification-To | Sender-designated Direct address | Return address for a requested MDN and for requested TX8 Workflow Status. SHALL be populated when x-direct-workflow-status-requested=true and when final-destination delivery notification is requested. |
| R | x-direct-transaction | send-birth-notification | Canonical, stable reusable transaction code. SHALL carry the canonical transaction identity, not the local editorial TX number. |

## XD Metadata Guidance

XD is the fully specified representation of Payload Metadata for this transaction. The requirements in this section define the package-level and payload-object metadata semantics used as the source requirements for alternative metadata representations.

This transaction does not establish persistent stateful work and therefore does not require an outbound FHIR Task. When Workflow Status is requested, the Receiver responds using TX8 as specified by that transaction.

### Payload Packaging Structure

| **Conf.** | **MIME part / package object** | **Content** | **MIME type** |
|----|----|----|----|
| R | MIME Part 1 | Human-readable healthcare communication | text/plain |
| O | MIME Part 1 alternative | HTML healthcare communication | text/html |
| R | MIME Part 2 | XDM ZIP package | application/zip |
| R | XDM SubmissionSet | XDM SubmissionSet | n/a |
| R | Contained XDM document 2 | CDA Birth Notification | application/xml+cda |
| R | Contained XDM document 3 | Human-readable healthcare communication | text/plain |
| O | Contained XDM document 3 alternative | HTML healthcare communication | text/html |

### MIME Part 1 - Human Readable Communication

MIME Part 1 SHALL provide a concise human-readable communication sufficient for a person to understand the event, information supplied, or workflow status without requiring machine processing.

### MIME Part 2 - Structured Data Package

MIME Part 2 holds the XDM structured data package and the machine-processable payload modules associated with the transaction.

| **Conf.** | **Metadata element** | **Value / constraint** | **Notes** |
|----|----|----|----|
| R | Content-Type | application/zip | The second outer MIME part is the XDM package. |
| R | Content-Transfer-Encoding | base64 | Required for the binary ZIP package. |
| R | Content-ID | System-assigned | Populate a MIME Content-ID. |
| R | Content-Disposition | attachment; filename="xdm.zip" | Fixed package disposition. |

#### SubmissionSet

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | uniqueId | System-assigned | Globally unique SubmissionSet identifier. |
| R | availabilityStatus | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved | Fixed status. |
| R | submissionTime | System-generated | No additional use-case constraint. |
| R | intendedRecipient | Direct address selected for maternal-care recipient | The Information Recipient is the maternal-care participant; the Intermediary may determine this recipient. |
| RE/R2 | patientId | Maternal patient identifier known to intended recipient | The mother is the subject of the TX3 transaction. |
| O | sourcePatientInfo | Maternal demographics used for matching | Do not substitute newborn demographics for SubmissionSet patient identity. |
| R | sourcePatientId | Maternal identifier from source/matched maternal record | Preserve assigning authority. |
| R | author | Actual Sender Actor / represented organization | If an Intermediary creates the derived package, it may be the package author without becoming the Information Source of the underlying birth information. |
| R | purpose | send-birth-notification | Canonical transaction code used as the transaction purpose. SHALL match x-direct-transaction. |
| RE/R2 | contentTypeCode | send-birth-notification | Canonical transaction code. SHALL match x-direct-transaction and identify the reusable transaction represented by this package. The local editorial TX number is not carried as interoperable metadata. |
| O | title | Birth Notification | Concise human-readable package title. |
| O | description | Maternal birth event with linked newborn identity | Describe the maternal-facing business meaning. |
| O | referenceIdList | Pregnancy, Birth/Visit, and applicable Postpartum Context Instance identifiers | Use only the contexts that actually apply to the transaction. |

#### Workflow Task Applicability

When included, the Task conveys workflow Context Instance identity, current state, intent, responsibility, and timing. It SHOULD be the first DocumentEntry, but typeCode is the authoritative recognition mechanism.

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| O | entryUUID | System-assigned | Registry entry identifier. |
| O | URI | System-assigned package URI | As required by the selected XDM option. |
| O | uniqueId | System-assigned | Globally unique payload identifier. |
| O | mimeType | application/fhir+xml | Initial recommended serialization for examples; equivalent JSON may be supported where specified. |
| O | classCode | send-birth-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| O | title | Human-readable workflow-module title | May identify the transaction and workflow context. |
| O | patientId | Patient identifier known to intended recipient when available | Align with SubmissionSet patient identity strategy. |

#### Document Entry - CDA Birth Notification

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | entryUUID | System-assigned | Registry entry identifier. |
| R | uniqueId | System-assigned | Globally unique CDA payload identifier. |
| R | mimeType | application/xml+cda | Fixed MIME type. |
| RE/R2 | formatCode | Applicable CDA / Minimally Structured Document formatCode | TBD exact code/value. |
| RE/R2 | languageCode | Language of the CDA narrative | Populate when known. |
| RE/R2 | classCode | send-birth-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| RE/R2 | typeCode | DT-Birth Birth Notification | Temporary document Species code pending LOINC assignment. |
| RE/R2 | patientId | Maternal patient identifier known to receiver | The CDA recordTarget is the mother. |
| RE/R2 | sourcePatientId | Maternal identifier from source/matched maternal record | Preserve assigning authority. |
| RE/R2 | sourcePatientInfo | Maternal demographics | The newborn is represented within the CDA as related-subject content, not as the XDS patient subject. |
| RE/R2 | creationTime | CDA creation/effective time as applicable | Keep clinical time distinct from assembly/transmission time. |
| RE/R2 | author | Actual CDA Content Creator and represented organization | The CDA SHALL preserve the underlying Birthing Provider information provenance while explicitly representing transformation provenance when an Intermediary created the derived artifact. |
| O | serviceStartTime | Birth/encounter start time when applicable | Use only if semantically appropriate to the CDA. |
| O | serviceStopTime | Birth/encounter end or clinically meaningful point when applicable | Do not invent a future or estimated time. |

## FHIR Metadata Guidance

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance, using Appendix C - Mapping XD Metadata to FHIR Resources. SubmissionSet metadata is represented in a FHIR List Resource, and corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This is an alternative representation of the same Payload Metadata, not a different metadata model.

FHIR Task profiling for Workflow Status is defined by TX8; it is not duplicated in this transaction.

## Context IG Metadata Guidance

TBD - Context IG Metadata Guidance. Guidance for representing this transaction's Payload Metadata using the DirectTrust Context IG specification will be added following completion of the current major Context IG redesign.

| **Context information** | **Use-case guidance** |
|----|----|
| Pregnancy Context Instance | Carry or correlate when the exchanged information belongs to the established pregnancy episode. |
| Visit / Encounter Context | Carry when a specific visit or stay is relevant to the transaction. |
| Workflow / Request Context | Carry when the transaction establishes or advances a bounded workflow. |
| Context status | Do not confuse status with context identity. The Context Instance Identifier remains stable while lifecycle state changes. |

### Newborn Admission Detection and Maternal Association

An Information Source or Intermediary monitoring an ADT feed SHALL recognize the newborn-admission pattern used by the implementation. When PID-21 Mother's Identifier is populated, the processing logic SHALL preserve the identifier value and assigning authority needed to resolve the maternal patient. NK1 relationship information MAY provide complementary human-readable or corroborating relationship information.

If the mother cannot be resolved when maternal association is required, the processor SHALL treat the condition as a processing anomaly and SHALL NOT create an uncorrelated Birth Notification.

### Potential Spawned Newborn-Care Workflow

Detection of the newborn admission may also initiate a separate newborn-care workflow involving an intended pediatric provider. In that separate workflow, the newborn remains the patient/subject and the mother is represented as a related person. That workflow is outside the scope of TX3.

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Newborn event detection | SHALL recognize the newborn-admission pattern and inspect maternal-linkage information needed to associate the newborn with the mother. |
| Content Creator | Maternal matching | SHALL use PID-21 Mother's Identifier, including assigning authority where available, as the primary machine-processable maternal linkage when present; MAY use NK1 as complementary relationship information. |
| Content Creator | Semantic transformation | SHALL create a maternal-subject Birth Notification CDA in which the newborn is represented as related-subject content. |
| Content Creator | Provenance | SHALL preserve sufficient provenance to distinguish the underlying Information Source from the party that assembled/transformed the derived CDA. |
| Message Sender | Transmission | SHALL package and transmit the Direct message to the identified maternal Information Recipient. |
| Message Receiver | Receipt | SHALL receive and validate the message and make its payload/metadata available to the Content Consumer. |
| Content Consumer | Processing | SHALL render/process the CDA and correlate it with the maternal patient and applicable Context Instances. |
| Receiver Actor | Workflow status | When x-direct-workflow-status-requested=true, SHALL initiate TX8 after determining whether the Payload reached its intended workflow and SHALL send the TX8 Direct message to the address specified by Disposition-Notification-To. Defined processing anomalies may require TX8 regardless of the request flag. |

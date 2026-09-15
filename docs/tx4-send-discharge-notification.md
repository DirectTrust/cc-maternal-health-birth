---
title: "TX4: send-discharge-notification"
---

# TX4: send-discharge-notification

## Transaction Overview

send-discharge-notification conveys a maternal health discharge notification in both human-readable and machine-processable form. The human readable communication provides the essential information about the patient and the event. The machine-processable payload is an HL7 Version 2 notification.

The canonical transaction code is send-discharge-notification. TX4 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

The transaction’s payload and metadata can be packaged using XDM or FHIR packaging.

The transaction is designed to support the following payloads:

- hospital discharge events,

- emergency department discharge events.

### SMTP/MIME Message Header

The following SMTP/MIME message-header metadata supports early message routing and processing, use-case awareness, reusable transaction identification, Payload Metadata representation, Direct final-destination delivery notification, and optional workflow-status return.

Message-header layering. x-direct-useCase identifies the use-case context known to the sender; x-direct-transaction identifies the reusable exchange behavior; and x-direct-metadataTypeCode identifies how Payload Metadata is represented. Message Delivery confirms arrival of the Message at its Final Destination. Workflow Status provides the stronger assurance that the Payload reached its intended workflow. Both responses use the Direct address supplied in Disposition-Notification-To.

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through SMTP, an IMAP/mailbox arrangement, XDR, a custom API, or another supported receiving interface. A successful Final Destination Delivery Notification does not establish that the Payload was parsed, matched, routed, accepted, or delivered into its intended business workflow.

| **Conf.** | **Header element** | **Fixed value / constraint** | **Implementation guidance** |
|----|----|----|----|
| R | Content-Type | multipart/mixed | Outer message content type. |
| R | x-direct-metadata-payload-versionIdentifier | 1 | Metadata and payload framework version identifier. |
| R | x-direct-useCase | cc-maternal-health-birth | Identifies the use-case context known to the sender. It is not an exclusive internal-routing instruction; the Receiver Actor may apply received information to other authorized workflows for which it is relevant. |
| R | x-direct-metadataTypeCode | urn:dt-org:dsm:map:SMTP+XD:1.0 | Identifies the Payload Metadata representation. This value indicates that XD metadata/XDM package processing applies; Subject is not used as an XDM processing signal. |
| O | x-direct-purpose | TREATMENT | Purpose of use. |
| O | Subject | No fixed value specified | Human-readable subject line. SHALL NOT be relied upon as the machine-processable indication that the message carries XD/XDM metadata. |
| O | Disposition-Notification-Options | X-DIRECT-FINAL-DESTINATION-DELIVERY=optional,true | Include when Direct Final Destination Delivery Notification is requested. |
| RE/R2 | Disposition-Notification-To | Sender-designated Direct address | Return address for a requested MDN and for requested TX8 Workflow Status. SHALL be populated when x-direct-workflow-status-requested=true and when final-destination delivery notification is requested. |
| R | x-direct-transaction | send-discharge-notification | Canonical, stable reusable transaction code. SHALL carry the canonical transaction identity, not the local editorial TX number. |
| O | x-direct-workflow-status-requested | true \| false; absent = false | When true, requests TX8 send-workflow-status after the Payload reaches, or fails to reach, its intended workflow. The response is sent to Disposition-Notification-To. |

Note that messages carrying XDM metadata packaging additional are required to include

| **R** |  | **Some sort of XDM 1.0 value** | **Required label for messaging carrying XDM packages.** |
|----|----|----|----|

## XD Metadata Guidance

XD is the fully specified representation of Payload Metadata for this transaction. The requirements in this section define the package-level and payload-object metadata semantics used as the source requirements for alternative metadata representations.

The following SMTP/MIME message-header metadata supports reporting, routing, correlation, and use-case-aware processing of TX1 messages using the XDM Packaging syntax and structure.

### Payload Packaging Structure

The Direct message SHALL use multipart/mixed packaging.

It SHALL contain a human-readable healthcare communication and an XDM ZIP package containing the machine-processable notification and an identical human-readable communication conveying the essential notification information.

| **Conf.** | **MIME part** | **Content** | **MIME type** |
|----|----|----|----|
| R | MIME Part 1 | Human-readable healthcare communication | text/plain |
| O | MIME Part 1 alternative | HTML healthcare communication | text/html |
| R | MIME Part 2 | XDM ZIP package | application/zip |
| R | XDM SubmissionSet | XDM SubmissionSet |  |
| R | Contained XDM document 1 | HL7 Version 2 notification | text/hl7v2 |
| R | Contained XDM document 2 | Human-readable healthcare communication | text/plain |
| O | Contained XDM document 2 alternative | HTML healthcare communication | text/html |

### MIME Part 1 – Human Readable Communication

### MIME Part 2 – Structured Data Package

MIME Part 2 holds the structured data package which includes both machine processable and human readable information combined.

| **Conf.** | **Metadata element** | **Value / constraint** | **Notes** |
|----|----|----|----|
| R | Content-Type | application/zip | The second outer MIME part is the XDM package. |
| R | Content-Transfer-Encoding | base64 | Required for the binary ZIP package. |
| R | Content-ID | System-assigned | Populate a MIME Content-ID. |
| R | Content-Disposition | attachment; filename="xdm.zip" | Fixed value from the workbook. |

#### SubmissionSet

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | uniqueId | System-assigned | Added by the system. |
| R | availabilityStatus | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved | Fixed status. |
| R | submissionTime | System-generated submission time | No additional use-case constraint. |
| R | intendedRecipient | Direct address selected for the recipient | The telecommunication component SHALL contain the registered Direct address corresponding to the SMTP RCPT TO recipient. |
| RE/R2 | patientId | ClinicalDocument/recordTarget/id or a patient identifier known to the intended recipient | May be obtained from a known-patient-identifier source; the workbook notes that it may not always be known. |
| O | sourcePatientInfo | Patient demographics from the notification, including PID-derived name and related data | Populate from the source patient information used for matching. |
| R | sourcePatientId | Patient identifier from PID / source system | Represents the identifier known to the sender. |
| R | author | Sending author/person and represented organization; include the Direct address in telecom | The SubmissionSet author identifies who is sending the package, not necessarily the clinical author. |
| R | sourceId | Identifier for the SubmissionSet author | The workbook suggests that the Direct address may be suitable for this workflow. |
| R | purpose | send-discharge-notification | Canonical transaction code used as the transaction purpose. SHALL match x-direct-transaction. |
| RE/R2 | contentTypeCode | send-discharge-notification | Canonical transaction code. SHALL match x-direct-transaction and identify the reusable transaction represented by this package. The local editorial TX number is not carried as interoperable metadata. |
| O | title | cc-maternal-health-birth:send-disharge-notification: | Use the display name associated with the selected event code. |
| O | description | Human-readable description of the notification | Workbook maps this concept to ClinicalDocument/sdtc:text; for an HL7 V2 notification, populate an equivalent concise description. |
| O | referenceIdList | urn:dt-org:dsm:map:2025:pregnancy | Pregnancy Context Instance Identifier. |
| O | referenceIdList | urn:dt-org:dsm:map:2026:visit | Visit Context Instance Identifier. |
| O | referenceIdList | urn:dt-org:dsm:map:2026:request | Request Context Instance Identifier, when applicable. |
| O | limitedMetadata | No fixed value specified | Use as defined by the base XDM/XDR specification. |
| R | entryUUID | System-assigned UUID | SubmissionSet registry object identifier for each attachment. |
| O | slot/@name | List of UUIDs for documents contained in the SubmissionSet | Populate when the selected packaging approach uses this extension. |

#### Document Entry – HL7 V2 Notification

The first DocumentEntry contians the HL7 V2 notification.

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | entryUUID | System-assigned | Registry entry identifier. |
| R/X | URI | System-assigned package URI | As required by the selected XDM option. |
| R | uniqueId | System-assigned | Globally unique identifier for this payload instance. |
| R | mimeType | text/hl7v2 | Fixed MIME type. |
| RE/R2 | formatCode | No fixed value specified | Use an applicable HL7 V2 notification format code when established. |
| RE/R2 | languageCode | Language of human-readable content | Populate when known. |
| RE/R2 | classCode | send-discharge-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| RE/R2 | typeCode | Same code as SubmissionSet.contentTypeCode | Identifies the specific notification event. |
| O | title | Identical to SubmissionSet.title | Keep title consistent across the package. |
| O | referenceIdList | Applicable subset of the SubmissionSet context identifiers | The individual document may have a narrower context. |
| RE/R2 | patientId | Patient identifier known to the receiver | Use the same patient identity strategy as the SubmissionSet. |
| RE/R2 | sourcePatientId | From PID | Source patient identifier. |
| RE/R2 | sourcePatientInfo | From PID | Source patient demographics. |
| RE/R2 | creationTime | From EVN | Use the event time represented in the notification. |
| RE/R2 | author | Treating facility name from PV1 or the location where represented | Identifies the treating facility responsible for the event. |
| R | author.role | TF (Treating Facility) | Fixed author role. |
| O | author.specialty | No additional use-case constraint | Populate if available. |
| O | serviceStartTime | Event/encounter start time when known | Populate from the HL7 V2 event/visit data. |
| O | serviceStopTime | Event/encounter stop time when known | Populate when applicable. |
| RE/R2 | practiceSettingCode | Code describing the clinical practice setting | Populate from available event/facility data. |
| RE/R2 | confidentialityCode | Applicable confidentiality code | Populate consistently with organizational policy. |
| RE/R2 | healthcareFacilityTypeCode | Code describing the treating facility | Populate from the facility/location represented in the event. |
| O | limitedMetadata | No fixed value specified | Use as defined in the base profile. |
| R | objectType | urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExtrinsicObject | Fixed XDS object type. |
| O | Slot/@name | Available extensions | Use only extensions permitted by the base profile. |
| R/O | hash | Calculated document hash | Follow the base XDM/XDR option requirements. |
| R/O | size | Document size in bytes | Follow the base XDM/XDR option requirements. |

#### Document Entry – Health Communication

The second DocumentEntry contains the human-readable healthcare communication included with the notification.

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | entryUUID | System-assigned | Registry entry identifier. |
| R/X | URI | System-assigned package URI | As required by the selected XDM option. |
| R | uniqueId | System-assigned | Globally unique payload identifier. |
| R | mimeType | text/plain; text/html when the optional HTML alternative is included | Match the contained human-readable artifact. |
| RE/R2 | formatCode | No fixed value specified | Use the applicable health-communication format code if established. |
| RE/R2 | languageCode | Language of the communication | Populate when known. |
| RE/R2 | classCode | send-discharge-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| RE/R2 | typeCode | 56444-3 | Health communication document type. |
| O | title | Identical to SubmissionSet.title | Keep title consistent. |
| O | referenceIdList | Applicable subset of the SubmissionSet context identifiers | May be narrower than the SubmissionSet context. |
| RE/R2 | patientId | Patient identifier known to the receiver | Same matching strategy as the package. |
| RE/R2 | sourcePatientId | From PID | Source patient identifier. |
| RE/R2 | sourcePatientInfo | From PID | Source patient demographics. |
| RE/R2 | creationTime | From EVN | Use the notification event time. |
| RE/R2 | author | Treating facility from PV1 or the location where represented | Facility responsible for the notification. |
| R | author.role | TF (Treating Facility) | Fixed author role. |
| O | author.specialty | No additional use-case constraint | Populate if available. |
| O | serviceStartTime | Event/encounter start time when known | Populate from the event. |
| O | serviceStopTime | Event/encounter stop time when known | Populate when applicable. |
| RE/R2 | practiceSettingCode | Applicable practice-setting code | Populate when known. |
| RE/R2 | confidentialityCode | Applicable confidentiality code | Populate consistently with policy. |
| RE/R2 | healthcareFacilityTypeCode | Applicable facility-type code | Populate from event/facility data. |
| O | limitedMetadata | No fixed value specified | Use as defined in the base profile. |
| R | objectType | urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExtrinsicObject | Fixed XDS object type. |
| O | Slot/@name | Available extensions | Use only permitted extensions. |
| R/O | hash | Calculated document hash | Follow base profile. |
| R/O | size | Document size in bytes | Follow base profile. |

## FHIR Metadata Guidance

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance, using Appendix C - Mapping XD Metadata to FHIR Resources. SubmissionSet metadata is represented in a FHIR List Resource, and corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This is an alternative representation of the same Payload Metadata, not a different metadata model.

## Context IG Metadata Guidance

TBD - Context IG Metadata Guidance. Guidance for representing this transaction's Payload Metadata using the DirectTrust Context IG specification will be added following completion of the current major Context IG redesign.

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Payload creation | SHALL create the payload content required by send-discharge-notification and preserve the responsible Information Source and applicable clinical/workflow provenance. |
| Message Sender | Transmission | SHALL package and transmit the Direct message using the message-header, Payload Metadata, and packaging constraints defined for this transaction. |
| Message Receiver | Receipt | SHALL receive and validate the Direct message and make the Payload and Payload Metadata available to the Content Consumer. |
| Content Consumer | Processing | SHALL process the Payload according to the supported transaction behavior and applicable local workflow. |
| Receiver Actor | Workflow status | When x-direct-workflow-status-requested=true, SHALL initiate TX8 after determining whether the Payload reached its intended workflow and SHALL send TX8 to Disposition-Notification-To. |

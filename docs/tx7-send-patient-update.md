---
title: "TX7: send-patient-update"
---

# TX7: send-patient-update

## Transaction Overview

send-patient-update sends updated patient information to an organization that previously received information about the patient. Previously shared patient information is used to support matching to the existing patient record; the transaction payload conveys the updated patient information.

The canonical transaction code is send-patient-update. TX7 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

This transaction deliberately separates prior identity information used for matching from the new information being asserted. The exact machine-processable payload representation is not yet fixed by the source specifications reviewed for this draft; fields marked TBD remain to be completed when that representation is selected.

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
| R | x-direct-transaction | send-patient-update | Canonical, stable reusable transaction code. SHALL carry the canonical transaction identity, not the local editorial TX number. |

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
| R | Contained XDM document 2 | Updated Patient Information payload | TBD |
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
| R | intendedRecipient | Direct address selected for organization that previously received information | The recipient is expected to have an existing patient record to update. |
| RE/R2 | patientId | Previously known patient identifier when known to intended recipient | Use for correlation to the existing recipient record. |
| R | sourcePatientId | Current/source patient identifier | Preserve assigning authority. |
| R | sourcePatientInfo | Previously shared patient-identifying information plus current information as required by the selected payload | Prior information supports matching; updated information is carried in the payload. |
| R | author | Actual Sender Actor / represented organization | Identifies who assembled/sent the package. |
| R | purpose | send-patient-update | Canonical transaction code used as the transaction purpose. SHALL match x-direct-transaction. |
| RE/R2 | contentTypeCode | send-patient-update | Canonical transaction code. SHALL match x-direct-transaction and identify the reusable transaction represented by this package. The local editorial TX number is not carried as interoperable metadata. |
| O | title | Patient Update | Concise human-readable package title. |
| O | description | Description of patient information change | Do not expose unnecessary sensitive detail in the title. |
| O | referenceIdList | Pregnancy or other applicable Context Instance identifiers | Carry only when the update is associated with a defined context. |

#### Workflow Task Applicability

When included, the Task conveys workflow Context Instance identity, current state, intent, responsibility, and timing. It SHOULD be the first DocumentEntry, but typeCode is the authoritative recognition mechanism.

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| O | entryUUID | System-assigned | Registry entry identifier. |
| O | URI | System-assigned package URI | As required by the selected XDM option. |
| O | uniqueId | System-assigned | Globally unique payload identifier. |
| O | mimeType | application/fhir+xml | Initial recommended serialization for examples; equivalent JSON may be supported where specified. |
| O | classCode | send-patient-update | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| O | title | Human-readable workflow-module title | May identify the transaction and workflow context. |
| O | patientId | Patient identifier known to intended recipient when available | Align with SubmissionSet patient identity strategy. |

#### Document Entry - Updated Patient Information

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | entryUUID | System-assigned | Registry entry identifier. |
| R | uniqueId | System-assigned | Globally unique payload identifier. |
| R | mimeType | TBD | To be fixed when the machine-processable payload representation is selected. |
| RE/R2 | formatCode | TBD | To be fixed with the payload representation. |
| RE/R2 | classCode | send-patient-update | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. DocumentEntry.typeCode separately identifies the specific payload object or clinical/event type. |
| RE/R2 | typeCode | Patient Update code TBD | Local or standardized terminology still to be assigned. |
| RE/R2 | patientId | Previously known patient identifier when available | Supports matching to the recipient's existing record. |
| RE/R2 | sourcePatientId | Current/source patient identifier | Preserve assigning authority. |
| RE/R2 | sourcePatientInfo | Patient demographics needed to interpret the update | Maintain clear distinction between prior matching information and updated values. |
| RE/R2 | creationTime | Payload creation time | Represents creation of the update payload, not an unrelated clinical encounter. |
| RE/R2 | author | Information Source / actual Content Creator as applicable | Preserve responsible-party provenance. |

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

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Prior identity information | SHALL provide sufficient previously shared patient information to support matching at the receiving organization. |
| Content Creator | Updated information | SHALL clearly distinguish the updated patient information from prior information used only for matching. |
| Message Sender | Transmission | SHALL package and transmit the Direct message using the selected payload representation and applicable metadata. |
| Message Receiver | Receipt | SHALL receive and validate the message and make the payload/metadata available to the Content Consumer. |
| Content Consumer | Match before update | SHALL match the subject to the appropriate existing patient record before applying the new information. |
| Content Consumer | Update processing | SHALL process the updated patient information according to organizational policy and preserve relevant provenance. |
| Receiver Actor | Workflow status | When x-direct-workflow-status-requested=true, SHALL initiate TX8 after determining whether the Payload reached its intended workflow and SHALL send the TX8 Direct message to the address specified by Disposition-Notification-To. Defined processing anomalies may require TX8 regardless of the request flag. |

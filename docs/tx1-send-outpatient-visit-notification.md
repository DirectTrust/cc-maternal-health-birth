---
title: "TX1: send-outpatient-visit-notification"
---

# TX1: send-outpatient-visit-notification

## Transaction Overview

send-outpatient-visit-notification conveys completion of an outpatient maternal-health encounter in both human-readable and machine-processable form. The machine-processable payload is an HL7 Version 2 outpatient visit notification. In the Mimi Shell examples, an ADT^A03 is used for the completed outpatient visit and LOINC 98145-6 identifies the outpatient visit notification.

The canonical transaction code is send-outpatient-visit-notification. TX1 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

The transaction can be sent directly by an Information Source or by an Intermediary acting as the Sender Actor for a message-processing leg. The use of an Intermediary does not change the Information Source.

### SMTP/MIME Message Header

The following SMTP/MIME message-header metadata supports early message routing and processing, use-case awareness, reusable transaction identification, Payload Metadata representation, Direct final-destination delivery notification, and optional workflow-status return.

| **Conf.** | **Header element** | **Fixed value / constraint** | **Implementation guidance** |
|----|----|----|----|
| R | Content-Type | multipart/mixed | Outer Direct message content type. |
| R | x-direct-metadata-payload-versionIdentifier | 1 | Metadata and Payload Framework version identifier. |
| R | x-direct-useCase | cc-maternal-health-birth | Identifies the use-case context in which this message instance is being exchanged. This value is not an exclusive internal-routing instruction; a Receiver Actor MAY apply the information to other authorized local workflows for which it is relevant. |
| R | x-direct-transaction | send-outpatient-visit-notification | Canonical, stable transaction code. SHALL carry the reusable transaction identity, not the local editorial label TX1. |
| R | x-direct-metadataTypeCode | urn:dt-org:dsm:map:SMTP+XD:1.0 | Identifies the Payload Metadata representation used by this message. This value indicates that XD metadata/XDM package processing applies; the Subject header is not used as an XDM processing signal. |
| O | x-direct-purpose | TREATMENT | Purpose of use when applicable. |
| O | x-direct-workflow-status-requested | true \| false; absent = false | When true, requests a TX8 send-workflow-status response. A successful TX8 response provides the stronger assurance that the Payload of the Message reached its intended workflow. The TX8 response SHALL be sent to the Direct address in Disposition-Notification-To. False or absent suppresses routine workflow-status reporting only; it does not suppress a required processing-anomaly response. |
| O | Subject | No fixed value specified | Human-readable subject line. SHALL NOT be relied upon as the machine-processable indication that the message carries XD/XDM metadata. |
| O | Disposition-Notification-Options | X-DIRECT-FINAL-DESTINATION-DELIVERY=optional,true | Include this Direct Message Notifications parameter when final-destination delivery notification is requested. A successful notification asserts delivery of the Message to the Final Destination defined by the applicable Direct/Edge implementation; it does not assert delivery of the Payload into its intended workflow. |
| RE/R2 | Disposition-Notification-To | Sender-designated Direct address | Return address for the requested Direct final-destination delivery notification and for TX8 Workflow-Status responses. SHALL be populated when x-direct-workflow-status-requested=true and when a final-destination delivery notification is requested. |

Message-header layering. x-direct-useCase identifies the use-case context known to the sender; x-direct-transaction identifies the reusable exchange behavior; and x-direct-metadataTypeCode identifies how Payload Metadata is represented. Direct final-destination delivery notification and TX8 Workflow Status are complementary but fundamentally different assurances. Final-destination delivery confirms that the Direct Message reached the Final Destination defined by the applicable Direct/Edge implementation. TX8 provides the stronger workflow-level assertion that the Payload of the Message reached its intended workflow. Both responses use the Direct address supplied in Disposition-Notification-To.

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through an SMTP or IMAP arrangement, an XDR edge, a custom API, or another supported receiving interface; the mailbox may also be hosted by the HISP or at the receiving edge. Accordingly, a successful MDN SHALL NOT be interpreted as proof that the Payload was parsed, patient-matched, context-correlated, accepted by the intended application, routed to its intended workflow, or acted upon by a Content Consumer.

## Message and Payload Requirements

This transaction does not establish persistent stateful work and therefore does not require an outbound FHIR Task. When Workflow Status is requested, the Receiver responds using TX8 as specified by that transaction.

### Payload Packaging Structure

| **Conf.** | **MIME part / package object** | **Content** | **MIME type** |
|----|----|----|----|
| R | MIME Part 1 | Human-readable healthcare communication | text/plain |
| O | MIME Part 1 alternative | HTML healthcare communication | text/html |
| R | MIME Part 2 | XDM ZIP package | application/zip |
| R | XDM SubmissionSet | XDM SubmissionSet | n/a |
| R | Contained XDM document 2 | HL7 Version 2 Outpatient Visit Notification | text/hl7v2 |
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

## XD Metadata Guidance

XD is the fully specified representation of Payload Metadata for this transaction. The following requirements define the SubmissionSet and DocumentEntry metadata that SHALL be used when XD/XDM metadata is employed. These same Payload Metadata semantics and coding requirements are the source requirements for the alternative FHIR representation described in Section 4.

### SubmissionSet

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | uniqueId | System-assigned | Globally unique SubmissionSet identifier. |
| R | availabilityStatus | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved | Fixed status. |
| R | submissionTime | System-generated | No additional use-case constraint. |
| R | intendedRecipient | Direct address selected for recipient | Correspond to SMTP RCPT TO destination. |
| RE/R2 | patientId | Patient identifier known to intended recipient | Use the best identifier known to the receiving organization when available. |
| O | sourcePatientInfo | Patient demographics from PID | Supports matching. |
| R | sourcePatientId | Patient identifier from source PID | Preserve assigning authority. |
| R | author | Actual Sender Actor / represented organization | Identifies who assembled/sent the package; does not replace clinical provenance in the notification. |
| R | purpose | send-outpatient-visit-notification | Canonical transaction code used by the Metadata and Payload Framework purpose extension. SHALL match x-direct-transaction and the transaction represented by SubmissionSet.contentTypeCode. |
| RE/R2 | contentTypeCode | send-outpatient-visit-notification | Canonical reusable transaction classification for the SubmissionSet. SHALL match x-direct-transaction. TX1 is not carried as interoperable metadata. |
| O | title | Outpatient Visit Notification | Concise human-readable package title. |
| O | description | Human-readable description of completed outpatient encounter | Keep semantically aligned with the HL7 V2 event. |
| O | referenceIdList | Pregnancy Episode; and any other relevant Context Instance identifiers such as Visit, Referral, or other Task/Request contexts | Preserve Context Instance type, identifier value, namespace, and assigning authority. |

### Workflow Task Applicability

This transaction does not establish persistent stateful work and therefore does not require an outbound FHIR Task. When Workflow Status is requested, the Receiver responds using TX8 as specified by that transaction.

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| O | entryUUID | System-assigned | Registry entry identifier. |
| O | URI | System-assigned package URI | As required by the selected XDM option. |
| O | uniqueId | System-assigned | Globally unique payload identifier. |
| O | mimeType | application/fhir+xml | Initial recommended serialization for examples; equivalent JSON may be supported where specified. |
| O | classCode | send-outpatient-visit-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. |
| O | title | Human-readable workflow-module title | May identify the transaction and workflow context. |
| O | patientId | Patient identifier known to intended recipient when available | Align with SubmissionSet patient identity strategy. |

### DocumentEntry - HL7 V2 Outpatient Visit Notification

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | entryUUID | System-assigned | Registry entry identifier. |
| R | uniqueId | System-assigned | Globally unique payload identifier. |
| R | mimeType | text/hl7v2 | Fixed MIME type. |
| RE/R2 | formatCode | Applicable HL7 V2 notification format code when established | TBD if a more specific formatCode is adopted. |
| RE/R2 | classCode | send-outpatient-visit-notification | Canonical transaction classification. SHALL match x-direct-transaction and SubmissionSet.contentTypeCode. |
| RE/R2 | typeCode | 98145-6 Outpatient Visit notification | Identifies the specific payload/event type represented by this DocumentEntry. It is distinct from the reusable transaction code carried in classCode. |
| RE/R2 | patientId | Patient identifier known to receiver | Align with SubmissionSet identity strategy. |
| RE/R2 | sourcePatientId | From PID | Preserve assigning authority. |
| RE/R2 | sourcePatientInfo | From PID | Source patient demographics. |
| RE/R2 | creationTime | Event/encounter completion time | Use the clinically represented event time. |
| RE/R2 | author | Treating organization/facility represented in the event | Preserve clinical event provenance. |
| O | serviceStartTime | Encounter start time when known | Align with PV1-44 or equivalent source data. |
| O | serviceStopTime | Encounter completion time | Align with PV1-45 or equivalent source data. |

## FHIR Metadata Guidance

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in Section 3, using the XD to FHIR Metadata Mapping defined in Appendix C - Mapping XD Metadata to FHIR Resources. SubmissionSet metadata is represented in a FHIR List Resource, and the corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This section does not define a different metadata model; it defines an alternative FHIR representation of the same Payload Metadata.

## Context IG Metadata Guidance

TBD - Context IG Metadata Guidance. Guidance for representing this transaction's Payload Metadata using the DirectTrust Context IG specification will be added following completion of the current major Context IG redesign.

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Notification creation | SHALL create the human-readable communication and machine-processable outpatient HL7 Version 2 notification required by the transaction. |
| Message Sender | Transmission | SHALL package and transmit the Direct message using the metadata and XDM constraints defined here. |
| Message Receiver | Receipt | SHALL receive and validate the Direct message and make the payload and metadata available to the Content Consumer. |
| Content Consumer | Processing | SHALL render/process the notification and correlate it to the appropriate patient and context. |
| Receiver Actor | Workflow status | When x-direct-workflow-status-requested=true, SHALL initiate TX8 after the Content Consumer determines the applicable workflow state and SHALL send the TX8 Direct message to the address specified by Disposition-Notification-To. Defined processing anomalies may require TX8 regardless of the request flag. |

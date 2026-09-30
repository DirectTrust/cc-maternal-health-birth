---
title: "TX8: send-workflow-status"
---

# TX8: send-workflow-status

## Transaction Overview

Task.code preservation. TX8 communicates a state change for the same logical Workflow Activity Task established by the initiating actionable transaction. Task.code SHALL therefore retain the initiating transaction's TransactionTypesCS code and SHALL NOT be changed to send-workflow-status. The current TX8 exchange is identified as send-workflow-status by x-direct-transaction and the applicable SubmissionSet transaction metadata.

TX8 communicates Workflow Status for a previously initiated transaction. It reports the state of the action the Information Recipient was asked to perform with the information in the Payload. This assertion is distinct from Direct Final Destination Delivery Notification, which reports transport delivery of the Message to its Final Destination.

When an initiating message sets x-direct-workflow-status-requested=true, the prior Receiver Actor becomes the Sender Actor for the TX8 return leg. The Information Source and Information Recipient of the underlying exchange do not change merely because Technology Actor roles reverse for the response message.

TX8 uses FHIR Task as the workflow-status representation. For cc-maternal-health-birth, the initiating transaction includes the Workflow Activity Task with status=requested. TX8 returns an updated representation of that same logical Task with the resulting workflow-processing state.

### SMTP/MIME Message Header

The Message Header identifies the use case, canonical transaction, Payload Metadata representation, and requested Direct delivery behavior. Object-specific characteristics such as formatCode and payload MIME type belong in Payload Metadata and are not duplicated as Direct-X message-header parameters.

| **Conf.** | **Header element** | **Fixed value / constraint** | **Implementation guidance** |
|----|----|----|----|
| R | x-direct-useCase | cc-maternal-health-birth | Identifies the use-case context. |
| R | x-direct-transaction | send-workflow-status | Canonical reusable transaction code; do not carry the local TX8 label as interoperable identity. |
| R | x-direct-metadataTypeCode | Applicable XD metadata representation code | Identifies how Payload Metadata is represented. |
| O | x-direct-purpose | TREATMENT | Purpose of use when applicable. |
| O | Subject | No fixed value | Human-readable only; not a machine processing signal. |
| O | Disposition-Notification-Options | X-DIRECT-FINAL-DESTINATION-DELIVERY=optional,true | Include when Final Destination Delivery Notification is requested for the TX8 message itself. |
| RE/R2 | Disposition-Notification-To | Sender-designated Direct address | Populate when an MDN for the TX8 message is requested. The initiating transaction supplied the return address used to route TX8. |

## XD Metadata Guidance

The XD/XDM package contains the FHIR Task workflow-status payload and the human-readable healthcare communication. SubmissionSet.uniqueId identifies this TX8 transaction instance. The Task.groupIdentifier correlates the returned workflow status to the originating Transaction Instance Identifier.

### Payload Packaging Structure

| **Conf.** | **MIME part / package object** | **Content** | **MIME type** |
|----|----|----|----|
| R | MIME Part 1 | Human-readable workflow-status communication | text/plain |
| O | MIME Part 1 alternative | HTML workflow-status communication | text/html |
| R | MIME Part 2 | XDM ZIP package | application/zip |
| R | XDM SubmissionSet | XDM SubmissionSet | n/a |
| R | Contained XDM document 1 | FHIR Task workflow-status payload | application/fhir+xml |
| R | Contained XDM document 2 | Human-readable healthcare communication | text/plain or text/html |

### SubmissionSet

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | uniqueId | System-assigned | Globally unique identifier of this TX8 transaction instance. |
| R | availabilityStatus | Approved | Fixed status per applicable XD/XDM rules. |
| R | submissionTime | System-generated | Time the TX8 package is created/submitted. |
| R | intendedRecipient | Return Direct address | Route to the Message Sender / Information Source associated with the initiating exchange. |
| RE/R2 | patientId | Known patient identifier | Align with the established patient identity strategy. |
| R | author | Actual TX8 Sender Actor / represented organization | Party creating/sending the workflow-status package. |
| R | purpose | send-workflow-status | Canonical transaction purpose. |
| R | contentTypeCode | send-workflow-status | Canonical transaction classification. |
| O | title | Workflow Status | Human-readable title. |
| R | referenceIdList | Originating Transaction Instance Identifier | Carry the originating SubmissionSet.uniqueId for package-level correlation where permitted by the selected XD profile. |
| R | sourceId | Established Organization Identity OID of the SubmissionSet Source | Identifies the entity responsible for contributing the SubmissionSet. When Task.requester is also the SubmissionSet Source, reuse that organization's established Organization Identity OID; otherwise identify the contributing source independently. |

### DocumentEntry - FHIR Task Workflow Status

| **Conf.** | **Metadata element** | **Value / source** | **Use-case guidance** |
|----|----|----|----|
| R | uniqueId | System-assigned | Globally unique identifier for the Task payload object. |
| R | mimeType | application/fhir+xml | FHIR XML is the initial serialization; equivalent JSON may be supported when specified. |
| R | classCode | send-workflow-status | Canonical transaction classification. |
| R | typeCode | Task \| http://hl7.org/fhir/resource-types | Identifies the payload as a FHIR Task. |
| O | title | Workflow Status Task | Human-readable title. |
| R | patientId | Patient identifier known to intended recipient when applicable | Align with SubmissionSet patient identity strategy. |
| R | creationTime | Task.authoredOn | Time the returned Task/status assertion is created. |
| R | author | Actual Task Content Creator / represented organization | Party making the workflow-status assertion. |

## FHIR Task Guidance

### Two Task Patterns

Bounded workflow-delivery Task. When the initiating transaction did not establish a persistent Task, the Receiver Actor creates a Task whose work is to place the received Payload into its intended workflow. The returned Task is normally born terminal: status=completed when workflow delivery succeeds, or status=failed when it does not.

Persistent workflow Task. When the initiating transaction established a persistent Task, the Receiver Actor returns an updated representation of that same logical Task to report the resulting state of the requested processing. The same Task.identifier is retained across lifecycle updates.

### Task Element Use

| **Task element** | **Use in TX8** | **Implementation guidance** |
|----|----|----|
| Task.identifier | Logical Task identifier | Retain the logical Task identifier established by the initiating actionable transaction. |
| Task.groupIdentifier | Originating Transaction Instance Identifier | SHALL carry the originating SubmissionSet.uniqueId so the response can be correlated to the exact initiating transaction instance. |
| Task.status | State of the work | Bounded Task: normally completed or failed. Persistent Task: use the applicable R4 lifecycle state. |
| Task.businessStatus | Business-specific workflow result | Use to distinguish business meaning such as Requested Processing Completed or Requested Processing Failed. |
| Task.statusReason | Reason for current status | Use especially when failed, rejected, cancelled, or on-hold; may identify patient-match, routing, unsupported-transaction, or processing failure as profiled. |
| Task.intent | Intent of the work | Use the profile-defined value consistently; exact constraint remains to be finalized. |
| Task.code | Initiating transaction / requested activity | SHALL retain the initiating transaction's TransactionTypesCS code. Do not replace it with send-workflow-status; TX8 is identified in exchange/SubmissionSet metadata. |
| Task.for | Patient / beneficiary | Reference the patient when applicable. |
| Task.requester | Party requesting the work | For bounded TX8, represent the originating Information Source/requesting party as applicable. |
| Task.owner | Party responsible for performing the work | Represent the Information Recipient / receiving workflow owner as applicable. |
| Task.authoredOn | Task creation time | Record creation of the bounded Task or original persistent Task. |
| Task.lastModified | Status update time | Use for updates to persistent Tasks and when useful for TX8. |
| Task.input / Task.output | Optional work inputs/results | Use sparingly; do not duplicate the XDM package merely to restate Payload Content. |

### Correlation to the Initiating Exchange

The originating Transaction Instance Identifier is the uniqueId of the SubmissionSet carried by the initiating transaction. TX8 SHALL return that identifier in Task.groupIdentifier. Task.identifier identifies the Task and SHALL NOT be substituted for the originating Transaction Instance Identifier. Pregnancy Episode, Encounter, Referral, and other Context Instance identifiers remain separate identities and MAY be carried elsewhere as specified by the applicable transaction/profile.

### Workflow Status Semantics

| **Situation** | **Task.status** | **businessStatus / statusReason guidance** |
|----|----|----|
| Requested processing completed | completed | businessStatus = Requested Processing Completed. |
| Requested processing failed | failed | businessStatus = Requested Processing Failed; statusReason identifies the processing anomaly when known. |
| Persistent Task received/claimed by fulfiller | received | Reports the state of the same logical Workflow Activity Task established by the initiating transaction. |
| Persistent Task accepted | accepted | Demonstrates the fulfiller agreed to perform the work. |
| Persistent Task in progress | in-progress | Work has begun. |
| Persistent Task completed | completed | Requested work reached its successful terminal state; this is broader than mere Payload delivery. |

## FHIR Metadata Guidance

When FHIR is used to represent XD Payload Metadata, follow the XD-to-FHIR Metadata Mapping appendix: SubmissionSet information is represented in a FHIR List and DocumentEntry information in DocumentReference Resources. This does not change the Task semantics defined above.

## Context IG Metadata Guidance

TBD. The DirectTrust Context IG is undergoing major revision. This Use Case Guide does not define Context IG metadata guidance until the applicable specification is stable enough to profile.

## Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Status determination | SHALL create a TX8 Task that accurately reflects the result of placing the initiating Payload into its intended workflow or, when applicable, the updated state of an established persistent Task. |
| Content Creator | Correlation | SHALL populate Task.groupIdentifier with the originating Transaction Instance Identifier / SubmissionSet.uniqueId. |
| Content Creator | Task identity | SHALL retain the Task.identifier established by the initiating actionable transaction; TX8 updates the same logical Task. |
| Content Creator | Provenance | SHALL identify the party making the workflow-status assertion and preserve the Information Source and Information Recipient roles of the underlying exchange. |
| Message Sender | Transmission | SHALL transmit TX8 to the Workflow Status Update Endpoint identified by the originating Workflow Activity Task. |
| Message Receiver | Receipt | SHALL receive and validate TX8 and make the Task and human-readable communication available to the Content Consumer. |
| Content Consumer | Processing | SHALL correlate TX8 using Task.groupIdentifier and distinguish workflow delivery status from Direct transport delivery and from the lifecycle of persistent work. |

### TX8 Destination and Endpoint Separation

TX8 SHALL be addressed to the Workflow Status Update Endpoint identified by the originating Workflow Activity Task. It SHALL NOT infer its destination solely from Disposition-Notification-To.

Disposition-Notification-To is transport-layer information for MDN / Final Destination Delivery Notification. The Workflow Status Update Endpoint is workflow context. These addresses MAY be different.

The Workflow Status Update Endpoint SHALL be represented as a FHIR Endpoint and SHALL declare support for ServDescCS code workflow-status using the NDH Implementation Guide Supported extension ig-usecase when that extension is used by the directory representation.

### Actor and Provenance Clarification

Clinical Content Author/Source, Workflow Requester / Information Source (Task.requester), SubmissionSet Source (SubmissionSet.sourceId), Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

### Workflow Status Update Routing

TX8 is sent to the Workflow Status Update Endpoint carried by the same logical Task. That endpoint may have been supplied in the initiating Draft Task or resolved by the Content Creator before the Task became requested. It SHALL NOT be inferred from Disposition-Notification-To.

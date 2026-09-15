---
title: Endpoint Capability Statement
---

# Endpoint Capability Statement

An organization operating a Direct endpoint that asserts support for cc-maternal-health-birth SHOULD publish an Endpoint Capability Statement as a human-readable web page. The page provides prospective data-sharing partners with the implementation-specific information they need to configure, test, and successfully exchange information with the endpoint.

This chapter tells implementers what information to publish, how to organize it, and which implementation choices to make explicit. It does not replace the transaction specifications in Chapter 3 and the individual transaction definition files. Instead, it tells an organization how to describe its implementation of those specifications.

Publish information that a data-sharing partner needs to construct, send, receive, process, test, or troubleshoot an exchange. Do not reproduce normative transaction requirements merely to restate the Implementation Guide. When a capability is optional or not implemented, say so explicitly rather than omitting it.

## Creating the Endpoint Capability Statement

Create a web page using the sections in this chapter and present them in the order shown below. Keep the page current and identify the date on which the capability statement was last updated. If different Direct addresses or services implement different capability sets, publish a separate statement for each materially different endpoint or clearly distinguish the capability sets on the page.

| **Order** | **Section to publish** | **Purpose** |
|----|----|----|
| 1 | Endpoint and Organization Identification | Identify the responsible organization, endpoint, implementation version, and support contact. |
| 2 | Supported Use Case | State support for cc-maternal-health-birth and the supported version. |
| 3 | Supported Transactions | Declare Send, Receive, both, or Not Supported for every canonical transaction used by this Use Case Guide. |
| 4 | Payload Metadata Representations | Declare XD, FHIR, and, when available, DirectTrust Context IG metadata capabilities. |
| 5 | Payload Content Capabilities | Declare the payload types, document types, event types, and options the endpoint can create, send, receive, or process. |
| 6 | Message Delivery and Workflow Status | Describe Final Destination Delivery Notification behavior and TX8 workflow-status capability. |
| 7 | Identifier Capabilities | Publish identifier namespaces the endpoint produces, recognizes, or requires. |
| 8 | Terminology Capabilities | Publish optional or implementation-specific terminology capabilities that affect interoperability. |
| 9 | Testing and Operational Support | Provide onboarding, testing, troubleshooting, and operational contact information. |

## Endpoint and Organization Identification

Begin the page with a concise identification table. Include the following information when applicable.

| **Publish** | **What to provide** |
|----|----|
| Responsible Organization | Legal or operational organization responsible for the endpoint. |
| Endpoint / Direct Address | Direct address, address pattern, or other endpoint identification a partner uses for exchange. |
| Endpoint or Service Name | Human-readable name of the service, if one is used. |
| Endpoint Operator / Intermediary | Identify a HIE, data utility, HISP, or other Intermediary operating the endpoint or processing service on behalf of the Information Recipient when relevant. |
| Supported Use Case | cc-maternal-health-birth |
| Supported IG Version | Version or versions implemented. |
| Technical / Trading Partner Contact | Contact mechanism for onboarding and interoperability questions. |
| Capability Statement Last Updated | Date the published information was last verified. |

## Supported Transactions

Create a Supported Transactions table containing every canonical transaction referenced by this Use Case Guide. Use the canonical transaction code as the interoperable transaction identity. The local TX number MAY be displayed as an editorial navigation aid, but do not use TX1, TX2, or another local number as the interoperable identifier.

For each transaction, state whether the endpoint can Send, Receive, Send and Receive, or does not support the transaction. Do not omit unsupported transactions; label them Not Supported so a partner can distinguish lack of support from missing documentation.

| **Local Label** | **Canonical Transaction** | **Send** | **Receive** | **Implementation Notes** |
|----|----|----|----|----|
| TX1 | send-outpatient-visit-notification | Yes / No | Yes / No | Declare supported event/payload options and any material constraints. |
| TX2 | send-admission-notification | Yes / No | Yes / No | Declare supported registration/admission event types. |
| TX3 | send-birth-notification | Yes / No | Yes / No | Declare support for the maternal Birth Notification workflow and payload. |
| — | Other transactions defined by the current Use Case Guide | Yes / No | Yes / No | Add every canonical transaction; do not omit unsupported transactions. |

## Payload Metadata Representations

Create a separate table that declares how the endpoint represents and processes Payload Metadata. Payload Metadata representation is distinct from Payload Content. Do not declare FHIR Payload Metadata support merely because the endpoint can send or receive a FHIR Resource as a payload.

| **Payload Metadata Representation** | **Send** | **Receive** | **Version / Notes** |
|----|----|----|----|
| XD | Yes / No | Yes / No | Declare the supported XD/XDM metadata implementation. |
| FHIR | Yes / No | Yes / No | Declare support for the XD-to-FHIR mapping: SubmissionSet metadata in a FHIR List and DocumentEntry metadata in DocumentReference Resources. |
| DirectTrust Context IG | TBD | TBD | Do not claim support until applicable guidance is available for the redesigned Context IG. |

## Payload Content Capabilities

For each supported transaction, identify the payload objects and transaction-specific choices that materially affect interoperability. Transaction support does not imply support for every payload type, document type, event type, query option, category, or workflow module associated with that transaction.

| **Canonical Transaction** | **Payload / Option** | **Send** | **Receive** | **What to document** |
|----|----|----|----|----|
| send-outpatient-visit-notification | HL7 V2 event notification | Yes / No | Yes / No | Supported event types and versions. |
| send-outpatient-visit-notification | FHIR Task workflow module, when used | Yes / No | Yes / No | Whether the optional Task module can be created and/or consumed. |
| send-outpatient-visit-notification | Human-readable communication | Yes / No | Yes / No | Supported human-readable MIME representation. |
| send-documents | Maternal-health CDA documents | Yes / No | Yes / No | Enumerate each supported document type, including codes. |
| query-for-documents | Request by Type / Request by Category | Yes / No | Yes / No | Declare supported query options and categories. |

## Message Delivery and Workflow Status

Document Direct message-delivery behavior separately from workflow-status behavior. A successful Final Destination Delivery Notification confirms that the Direct message reached the Final Destination as defined by the applicable Direct messaging and edge implementation. It does not establish that the Payload reached its intended workflow.

If the endpoint supports Final Destination Delivery Notification, describe the receiving/edge implementation sufficiently for a data-sharing partner to understand what successful Final Destination delivery means for this endpoint. For example, identify whether the relevant boundary is associated with SMTP, an IMAP-accessible mailbox arrangement, XDR, a custom API, or another documented edge implementation.

Separately declare whether the endpoint honors x-direct-workflow-status-requested and supports TX8 send-workflow-status. Workflow Status provides the stronger assurance that the Payload reached or failed to reach its intended workflow. Requesting Workflow Status does not require an outbound Task. An endpoint supporting TX8 should state that it can create/consume the bounded workflow-delivery Task pattern and, when applicable, update persistent Tasks established by transactions that create stateful work.

| **Capability to document** | **Endpoint statement** |
|----|----|
| Final Destination Delivery Notification | Supported / Not Supported |
| Meaning of Final Destination for this endpoint | Describe the applicable edge/delivery boundary. |
| Disposition-Notification-To | Describe any endpoint-specific expectations; do not publish a fixed return address unless it is actually required. |
| x-direct-workflow-status-requested | Honored / Not Supported |
| TX8 send-workflow-status | Supported / Not Supported; describe supported workflow-status behavior. |
| TX8 FHIR Task pattern | State support for bounded workflow-delivery Tasks and, if applicable, persistent Task updates. |

## Identifier Capabilities

Publish identifier namespaces that the endpoint actually produces, recognizes, or requires for matching and correlation. Do not publish a generic list of namespaces merely because they are mentioned by the Use Case Guide.

| **Identifier Role** | **NamingSystem / Namespace** | **Produce** | **Recognize** | **Required** | **Notes** |
|----|----|----|----|----|----|
| Patient / Person Identifier | Endpoint-specific | Yes / No | Yes / No | Yes / No | State identifier type and assigning authority where relevant. |
| Organization Identifier | Endpoint-specific | Yes / No | Yes / No | Yes / No | Identify supported organization namespaces. |
| Provider Identifier | NPI and/or other supported namespace | Yes / No | Yes / No | Yes / No | State supported provider identifiers. |
| Visit Context Instance Identifier | Applicable namespace | Yes / No | Yes / No | Yes / No | Describe correlation expectations. |
| Pregnancy Context Instance Identifier | Applicable namespace | Yes / No | Yes / No | Yes / No | Describe correlation expectations. |
| Request Context Instance Identifier | Applicable namespace | Yes / No | Yes / No | Yes / No | Describe correlation expectations. |

## Terminology Capabilities

Publish terminology capabilities only when an implementation choice affects successful exchange. Do not reproduce required ValueSets simply to duplicate the specification. Identify supported optional document types, event types, query categories, or other coded choices when a partner must know the implemented subset.

| **Terminology Area** | **What to publish** |
|----|----|
| Document types | Supported document-type codes when the transaction permits an implemented subset. |
| Event types | Supported registration, admission, discharge, outpatient, birth, or other event types where choices exist. |
| Query categories | Categories the endpoint can evaluate when Request by Category is supported. |
| Other constrained ValueSets | Any optional or endpoint-specific subset that materially affects interoperability. |

## Testing and Operational Support

Conclude the Endpoint Capability Statement with practical onboarding and support information. Include only information appropriate for public or trading-partner publication.

| **Publish when available** | **What to provide** |
|----|----|
| Test Endpoint / Direct Address | Clearly distinguish test from production. |
| Testing Process | Prerequisites, test cases, or conformance/onboarding steps. |
| Onboarding Requirements | Trading-partner or configuration prerequisites that materially affect exchange. |
| Technical Support | Contact or support process for interoperability issues. |
| Operational Constraints | Hours, maintenance windows, size limits, or other constraints a partner must know. |
| Revision Information | Date and, when useful, version/history of the capability statement. |

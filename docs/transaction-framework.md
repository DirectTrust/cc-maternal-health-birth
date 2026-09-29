---
title: Transaction Framework
---

# Transaction Framework

## 3.1 Purpose and Scope

Chapter 3 defines the common framework used to perform the transactions introduced in Chapter 2. It defines the reusable transaction model, actor responsibilities, participation roles, processing lifecycle, workflow-unit packaging architecture, transport framework, Workflow Status model, provenance model, and common XD extensions. Each individual Transaction Definition defines a particular Shared Activity and the transaction-specific information requirements needed to perform it.

Division of responsibility: Chapter 3 defines how MAP Transactions work generally. A Transaction Definition defines a particular Shared Activity. Its Structured Payload specification defines the information exchanged to perform that Shared Activity.

## 3.2 Foundational Transaction Model

### 3.2.1 A Transaction Is a Two-Party Shared Activity

A MAP Transaction describes more than transmission of a message. The Transaction is the shared action performed by two parties; the functional requirements of its actors define the complementary responsibilities required to perform that action.

### 3.2.2 Transaction Identity Follows the Shared Activity

A new Direct message, processing link, technical boundary, or change in Transaction Actor function does not by itself create a new Transaction. A subsequent separately authorized workflow action involving the same, copied, or derived information is a new Transaction.

### 3.2.3 Transaction Instance and Transport Correlation

The SMTP Message-ID identifies and correlates an individual Direct message. It is not the workflow activity identifier. Each independently processable workflow unit is identified by its SubmissionSet/Workflow Activity Task pair and may complete or fail independently.

## 3.3 Three Independent Accountability Lenses

| **Lens** | **Question answered** | **Meaning** |
|----|----|----|
| Transaction Participation Role | WHY? | Why an entity is authorized to possess and process the information at a point in the exchange. |
| Transaction Actor | WHAT FUNCTION? | What functional responsibility the entity performs in executing the Transaction. |
| Provenance Activity | WHAT HAPPENED? | What actually happened to or with the information. |

These lenses remain independent. Actor function does not prove a Provenance Activity occurred, and a change in actor function does not by itself change the entity’s Participation Role.

## 3.4 Transaction Actors and Grouping

| **Transaction Actor** | **Common responsibility** |
|----|----|
| Content Creator | Creates or obtains information; establishes or retrieves applicable context; assembles, classifies, packages, and validates the transaction-ready content required by the Transaction Definition. |
| Message Sender | Constructs and transmits the Direct message using the transaction-ready package and routing/control instructions. |
| Message Receiver | Receives and validates the Direct message and makes Payload, metadata, message controls, and transport evidence available for receiver-side processing. |
| Content Consumer | Processes the received information according to the Shared Activity and determines the resulting processing outcome. |

Grouped Sender Actor = Content Creator + Message Sender. Grouped Receiver Actor = Message Receiver + Content Consumer. Grouping establishes externally observable responsibilities without prescribing internal product architecture.

## 3.5 Transaction Participation Roles

| **Role** | **Framework meaning** |
|----|----|
| Information Source | Party authorized and responsible for initiating or supplying the information for the Shared Activity. |
| Intermediary | Party authorized to possess/process the information for limited transaction-defined functions without thereby becoming the Information Source. |
| Routing Target | Party authorized to receive/process the information for limited routing/processing functions without thereby becoming the Information Recipient. |
| Information Recipient | Party authorized and intended to perform the transaction-defined business/workflow processing requested by the Workflow Activity Task. |

## 3.6 Core Transaction Processing Lifecycle

The primary processing flow is: CREATE → PACKAGE → SEND → RECEIVE → CONSUME.

Each processing link follows Content Creator → Message Sender → Message Receiver → Content Consumer. Workflow Status and Provenance are separate concerns that overlay this processing path; they SHALL NOT be interpreted as serial terminal stages of the core lifecycle.

## 3.7 Workflow Activity and Structured Payload Architecture

### 3.7.1 Independently Processable Workflow Unit

One SubmissionSet and exactly one Workflow Activity Task form a linked pair representing one independently processable workflow request. One Direct Message/XDM package may carry 1..N SubmissionSets; when N are carried, N Workflow Activity Tasks are carried, one per SubmissionSet.

### 3.7.2 Inside-Out Information Model

Information → Classification → Context → Shared Provenance → Equitable Human Readability → SubmissionSet → Transport

This sequence is a teaching and specification order. It starts with what must be shared and why, then moves outward toward packaging and transport. DocumentEntry numbers remain useful package identifiers, but they do not dictate the order in which a Transaction Definition is explained.

### 3.7.3 SubmissionSet ↔ Workflow Activity Task Alignment Contract

| **SubmissionSet** | **Workflow Activity Task** | **Common rule** |
|----|----|----|
| contentTypeCode | Payload / principal DocumentEntry type | Package type. Unless a Transaction Definition states otherwise, contentTypeCode SHALL use the typeCode of the principal DocumentEntry. |
| uniqueId | designated Task.identifier | Same logical Workflow Activity Identifier; values SHALL match. |
| purpose | Task.code | Same Shared Activity. Values SHALL express the same transaction activity under their applicable coding systems. |
| patient identity and matching metadata | Task.for / Payload patient identity | Patient identity information intentionally duplicated across the workflow unit SHALL be consistent. SubmissionSet Patient Info provides the common package-level matching fallback defined in 3.8. |
| referenceIdList | Applicable Context Instance declarations | Package-level Context Instance identifiers SHALL be consistent with Task declarations required by the Transaction Definition. |

### 3.7.4 Workflow Status Instructions in the Workflow Activity Task

Workflow Status instructions are workflow semantics and SHALL be represented with the originating Workflow Activity Task rather than as Direct transport headers. The Task SHALL carry the information needed to correlate subsequent TX8 processing outcomes to the originating Transaction Instance.

| **Task concept** | **Common requirement** |
|----|----|
| Successful Payload Receipt reporting request | Indicates whether successful Payload Receipt reporting is requested. Absence of the request does not suppress permitted or required Workflow Status reporting. |
| Workflow Status Update Endpoint | R, 1..\*. One or more Direct endpoints designated to receive TX8 Workflow Status for the originating Transaction Instance. |
| Context Instance identifiers | Carries/correlates the Context Instances required by the Transaction Definition. |

### 3.7.5 Workflow Status Update Endpoint Accumulation

At least one endpoint = SHALL. The transaction-initiating system SHALL identify at least one Workflow Status Update Endpoint to receive TX8 Workflow Status for the originating Transaction Instance.

Preserve existing endpoints = SHALL. Each subsequent Sender Actor SHALL preserve all Workflow Status Update Endpoints already associated with the originating Transaction Instance.

Add your own endpoint = MAY. An Intermediary Sender Actor MAY add its own Workflow Status Update Endpoint when that intermediary also needs to be informed of the eventual Payload Receipt or Payload Rejection outcome.

Workflow Status Update Endpoints are carried end-to-end with the transaction and are not discovered through the DirectTrust Directory or Endpoint Discovery Resource. When TX8 is required, Workflow Status SHALL be sent to each unique Workflow Status Update Endpoint accumulated for the originating Transaction Instance. Duplicate Direct addresses SHALL result in a single TX8 delivery to that address for the same reportable outcome.

## 3.8 MAP Extensions to XD SubmissionSet Metadata

MAP uses standard XD/XDS SubmissionSet metadata and intentionally adds package-level information where an authorized receiver or intermediary needs it to identify, correlate, route, patient-match, or safely process a workflow unit without first opening an arbitrary clinical Payload. When all DocumentEntries in a SubmissionSet pertain to a single patient, MAP requires package-level Patient Info as defined below. Every MAP-added SubmissionSet Slot used by a Transaction SHALL be explicitly called out in that Transaction Definition.

| **Metadata** | **MAP status** | **Purpose** |
|----|----|----|
| patientId | Existing XD/XDS metadata; conditional in MAP push packaging | Patient identifier known to the Information Source to be appropriate to the Information Recipient or a mutually agreed exchange patient-identifier domain. It SHALL NOT be populated merely by copying the Information Source local identifier. |
| Patient Info | MAP-added SubmissionSet Slot using the same representation and semantics as DocumentEntry sourcePatientInfo | Required for a single-patient SubmissionSet. Promotes the DocumentEntry patient demographic matching information to package level so the Content Consumer can match or confirm the patient without first opening a DocumentEntry. It is included even when patientId is known, as a matching/checking fallback. |
| DocumentEntry.sourcePatientId | Existing XD/XDS DocumentEntry metadata | Patient identifier assigned/used by the Information Source for the source clinical information. In a push, this is the sender-known patient identifier; it is not a substitute for patientId. |
| DocumentEntry.sourcePatientInfo | Existing XD/XDS DocumentEntry metadata | Patient demographic information associated with the source patient identity. MAP SubmissionSet Patient Info copies/promotes these established semantics to package level. |
| referenceIdList | MAP-added SubmissionSet Slot using established semantics | Established Context Instance identifiers for package-level correlation; not an additional patient-identifier bucket. |

### 3.8.1 Patient Identity and Patient Matching for Push Transactions

For a MAP push transaction, patientId and sourcePatientId represent different patient-identifier perspectives. patientId SHALL be populated only when the Information Source knows the patient identifier appropriate to the Information Recipient or a mutually agreed exchange patient-identifier domain. The Information Source SHALL NOT copy its own local patient identifier into patientId merely because no recipient-known identifier is available. The Information Source local identifier belongs in DocumentEntry.sourcePatientId.

When all DocumentEntries in a SubmissionSet pertain to one patient, MAP SubmissionSet Patient Info SHALL be present. The extension SHALL use the same patient demographic representation and semantics defined for DocumentEntry.sourcePatientInfo. Patient Info SHALL be provided even when patientId is known, because it supplies an independent matching/checking fallback that can improve confidence in the Content Consumer patient match.

A patient identifier learned or resolved during transaction packaging MAY be represented in SubmissionSet.patientId and applicable DocumentEntry.patientId when it is known to be appropriate to the Information Recipient or agreed exchange domain. Packaging software SHALL NOT alter the underlying source ADT, CDA, or other clinical source object solely to inject that recipient-known patient identifier.

### 3.8.2 Transaction-Relative Source and Recipient Roles

Information Source and Information Recipient are roles for the current MAP Transaction. They do not remain permanently attached to an organization because that organization initiated an earlier related transaction. A subsequent transaction in the reverse direction assigns the roles according to that subsequent Shared Activity. SubmissionSet.sourceId identifies the source of the current SubmissionSet. Correlation to an originating transaction preserves the workflow relationship; it does not freeze the originating transaction roles.

#### Example — TX1 followed by TX8

TX1: Organization A sends an Outpatient Visit Notification to Organization B. For TX1, A is the Information Source and B is the Information Recipient. SubmissionSet.sourceId identifies A. DocumentEntry.sourcePatientId carries A’s locally known patient identifier. SubmissionSet.patientId and applicable DocumentEntry.patientId are populated only if A knows the patient identifier appropriate to B or the mutually agreed exchange domain. SubmissionSet Patient Info is present regardless, providing the demographic information B can use to match or confirm the patient.

TX8: Organization B subsequently sends Workflow Status back to Organization A. TX8 is a new Transaction Instance, so B is now the Information Source and A is the Information Recipient. SubmissionSet.sourceId therefore identifies B. If B successfully matched the patient, B’s locally known patient identifier may be represented as the sourcePatientId of the TX8 information. patientId is populated only if B knows the identifier appropriate to A or the mutually agreed exchange domain. SubmissionSet Patient Info is again present. The TX8 correlation to TX1 preserves the relationship between the transactions without preserving the TX1 actor-role assignments.

If B cannot match the patient, B SHALL NOT manufacture a local sourcePatientId. A failed TX8 may still carry the SubmissionSet Patient Info associated with the attempted match and report the applicable Payload Rejection outcome.

## 3.8.3 Canonical Discovery Metadata and Classification

MAP SHALL distinguish workflow activity from information-object classification. SubmissionSet.purpose identifies the Shared Activity supported by the package and SHALL align with the Workflow Activity Task.code. SubmissionSet.contentTypeCode identifies the package type and, unless a Transaction Definition states otherwise, SHALL use the typeCode of the principal DocumentEntry. DocumentEntry classCode and typeCode classify the information object; they SHALL NOT be populated with a MAP transaction code merely to identify the Shared Activity.

Clinical and discovery semantics SHALL be obtained from the source object or deterministically resolved from an authoritative reference source. Packaging software SHALL NOT manufacture clinical semantics or use synthetic NONE, Not specified, or equivalent placeholder codes to satisfy coded metadata. When omission is permitted and a value cannot be established, the element is omitted; when a required value cannot be established, the condition is reported as a metadata error.

For author metadata, authorRole represents the author's patient- or act-specific function and uses the Care Team Member Function value set when that relationship is known. authorSpecialty represents the author's professional specialty and follows the US Core Practitioner Role Specialty Codes semantics, permitting applicable SNOMED CT specialty and/or NUCC Provider Taxonomy coding. Both authorRole and authorSpecialty may repeat. practiceSettingCode describes the clinical practice setting associated with creation of the information; healthcareFacilityTypeCode describes the type of facility in which the clinical activity occurred. These concepts are related but SHALL NOT be treated as interchangeable.

Metadata derivation SHOULD remain traceable. Implementations should be able to distinguish values extracted from the clinical source, values resolved from an authoritative provider/facility reference such as Endpoint Discovery, and values generated as packaging mechanics (for example hash, size, MIME type, or package identifiers).

## 3.9 Message and Transport Framework

### 3.9.1 SMTP/MIME and Direct Transport Requirements

| **Element** | **Common purpose** |
|----|----|
| Message-ID | Identifies the individual Direct message and supports transport-level correlation, including MDNs. Distinct from the Transaction Instance / Workflow Activity Identifier. |
| Content-Type | Defines the multipart/mixed Direct message and MIME boundary. |
| Disposition-Notification-To | Identifies the return endpoint for requested Direct transport disposition notifications. |
| Disposition-Notification-Options | Requests/configures applicable Direct disposition-notification behavior. |

### 3.9.2 MAP Message Metadata

| **MAP header** | **Purpose** |
|----|----|
| x-direct-metadata-payload-versionIdentifier | Framework version governing interpretation and processing. |
| x-direct-metadataTypeCode | Early recognition/routing based on Structured Data Package metadata representation. |
| x-direct-useCase | Early use-case-aware routing to the appropriate Content Consumer Processor. |
| x-direct-purposeOfUse | Broad network-level reporting/measurement of exchange purpose without Payload inspection. |

The Direct message header SHALL NOT use x-direct-workflow-status-requested. The request for successful Payload Receipt reporting and the Workflow Status Update Endpoint(s) belong to the Workflow Activity Task. Disposition-Notification-To remains a transport-level return address for Direct disposition reporting and SHALL NOT be interpreted as a Workflow Status Update Endpoint.

### 3.9.3 Direct Delivery Notification and Workflow Status

Direct final-destination delivery notification and TX8 Workflow Status are complementary but fundamentally different assurances. Final-destination delivery confirms that the Direct Message reached the Final Destination defined by the applicable Direct/Edge implementation. TX8 reports the processing outcome of the action the Information Recipient was asked to perform with the information in the Payload. The MDN uses the transport-level address supplied in Disposition-Notification-To. TX8 uses the Workflow Status Update Endpoint(s) carried with the Workflow Activity Task; the endpoints MAY differ.

A successful final-destination MDN SHALL NOT be interpreted as evidence that the Information Recipient successfully parsed, patient-matched, context-correlated, accepted, retained, routed, or processed the Payload in its intended workflow.

## 3.10 Workflow Status — A Separate Shared Activity

TX8 send-workflow-status is a subsequent Shared Activity that communicates a terminal processing outcome for an originating MAP transaction. For this version of the use case, TX8 reports Payload Receipt or Payload Rejection. It is not a general-purpose intermediate workflow-progress protocol and is distinct from the clinical status of the patient or condition represented by the exchanged information.

### 3.10.1 Successful Payload Receipt Reporting

Successful Payload Receipt SHALL be reported through TX8 when successful receipt reporting was requested by the originating workflow. Successful Payload Receipt MAY be reported through TX8 even when successful receipt reporting was not requested by the originating workflow. The absence of a request for successful Payload Receipt reporting SHALL NOT be interpreted as a request to suppress Workflow Status reporting.

### 3.10.2 Payload Rejection Reporting

A defined processing failure requiring Workflow Status SHALL be reported through TX8 regardless of whether successful Payload Receipt reporting was requested. The failed TX8 SHALL identify the applicable failure reason and SHALL assert Payload Rejection when the originating Payload was rejected from the intended workflow.

### 3.10.3 Terminal Outcome Semantics

| **Outcome** | **FHIR Task status** | **Required Provenance Activity** | **Expected observable behavior** |
|----|----|----|----|
| Successful Payload Receipt | completed | Payload Receipt | Payload accepted/retained according to the originating transaction processing requirements. |
| Payload Rejection | failed | Payload Rejection | Payload not retained as accepted information in the intended workflow environment. |

A system asserting Payload Rejection SHALL demonstrate that the rejected Payload files were not retained as accepted information in the Information Recipient’s workflow environment. This does not prohibit security logs, transient queues, quarantine, audit records, or legally required transport evidence.

The TX8 Task outcome, asserted Provenance Activity, and observable recipient behavior SHALL be consistent.

### 3.10.4 Correlation and Multiple TX8 Deliveries

TX8 is a new Transaction Instance that SHALL correlate to the originating Transaction Instance and applicable Context Instance(s). When more than one Workflow Status Update Endpoint has accumulated, the same reportable processing outcome is delivered to each unique endpoint. Multiple TX8 deliveries of the same outcome do not represent multiple workflow outcomes.

Because TX8 is a new Transaction Instance in the reverse organizational direction, the sender of TX8 assumes the Information Source role for TX8 and the original transaction initiator assumes the Information Recipient role for TX8. SubmissionSet.sourceId and patient-identity metadata SHALL therefore be interpreted from the perspective of TX8 itself, while the TX8 correlation identifies the originating Transaction Instance and applicable Context Instance(s).

### 3.10.5 TX8 Terminates Workflow-Status Chaining

TX8 SHALL NOT request or require a subsequent TX8 Workflow Status transaction in response to itself. A TX8 Workflow Activity Task SHALL NOT request successful Payload Receipt reporting and SHALL NOT identify Workflow Status Update Endpoints for the purpose of requesting another TX8. Direct final-destination delivery notification remains applicable to the TX8 Direct Message when requested. The resulting pattern is: originating transaction → TX8 → optional Direct delivery notification for TX8 → stop.

## 3.11 Provenance Across the Transaction Lifecycle

Provenance is not a serial stage after Consume. Independently attributable provenance assertions are created as provenance-significant activities occur across the lifecycle. Each actor asserts only activities it can authoritatively assert.

| **Lifecycle point** | **Illustrative provenance relationship** |
|----|----|
| Create | Creation, derivation, or transformation evidence may become known before package finalization. |
| Package | Package Assembly may be recorded when it occurs. |
| Send | Payload Transmission and Message Delivery are distinct activities and occur after package finalization. |
| Receive | Payload Receipt or Payload Rejection may be asserted by the actor that determines the workflow-processing outcome. |
| Consume | Storage, transformation, acceptance, rejection, or other later activities may generate additional provenance assertions. |

Provenance known before package finalization may be shared in the originating Submission Package when the Transaction Definition permits it. Provenance generated during or after transmission exists outside that original package and may subsequently be conveyed through an appropriate transaction. TX8 SHALL include the Provenance assertion required for its reported terminal outcome.

## 3.12 Putting the Models Together

| **Dimension** | **What it describes** |
|----|----|
| Transaction processing | What is happening to the information: Create → Package → Send → Receive → Consume. |
| Workflow Status | What the parties subsequently communicate about the terminal processing outcome of the requested workflow. |
| Provenance | Independently attributable evidence accumulating as activities occur before, during, and after the transaction processing path. |

## 3.13 The Eight Transactions in This Use Case

| **Local label** | **Shared Activity** | **High-level purpose** |
|----|----|----|
| TX1 | send-outpatient-visit-notification | Notify about completion of an outpatient encounter. |
| TX2 | send-admission-notification | Notify about admission/registration. |
| TX3 | send-birth-notification | Notify designated maternal-health recipients about a birth event using maternal-facing information. |
| TX4 | send-discharge-notification | Notify about discharge. |
| TX5 | send-documents | Send clinical/workflow documents. |
| TX6 | query-for-documents | Discover available documents; structurally different from SubmissionSet-oriented send transactions. |
| TX7 | send-patient-update | Communicate updated patient information. |
| TX8 | send-workflow-status | Report terminal Payload Receipt or Payload Rejection for an originating MAP transaction. |

TX1–TX8 are local editorial labels within this Use Case. They are not interoperable terminology codes. Each individual Transaction Definition is the complete normative definition of its Shared Activity and transaction-specific information requirements. TX8 applies to TX1, TX2, TX3, TX4, TX5, and TX7 as specified by those definitions. TX6 does not use Direct and does not invoke TX8. TX8 does not invoke itself.

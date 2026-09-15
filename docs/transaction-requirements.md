---
title: Transaction Requirements
---

# Transaction Requirements

This chapter defines the normative transaction-level behaviors for cc-maternal-health-birth. It provides common requirements that apply across transactions and a compact behavioral specification for each transaction identified in Chapter 2. Detailed SMTP/MIME headers, Direct-X metadata, XDM or FHIR packaging, SubmissionSet and DocumentEntry metadata, payload-specific constraints, and Context IG metadata are maintained in the corresponding modular transaction definition files.

**Conformance Language**

Beginning with this chapter, this Implementation Guide uses normative conformance verbs to distinguish requirements from descriptive or explanatory guidance. SHALL identifies a requirement that must be satisfied for conformance to the applicable transaction. SHOULD identifies a recommended behavior for which there may be valid implementation reasons to use an alternative. MAY identifies permitted but optional behavior. SHALL NOT identifies prohibited behavior.

Chapter 3 applies these conformance verbs to the functional behaviors of Technology Actors and Grouped Actors participating in each transaction. Requirements expressed using conformance verbs in a Normative Requirement column constitute the functional conformance requirements for the identified Actor.

More granular conformance requirements for individual message headers, metadata elements, payload elements, and exchange options are defined in the corresponding transaction-specific specification files. Those specifications use element-level conformance designations such as R, O, RE/R2, R/X, and R/O where appropriate.

**Technology Actors and Actor Grouping**

This chapter uses precise Technology Actor terminology so that responsibility for information is not confused with the technology functions performed on any particular message-processing leg. Information Source, Information Recipient, and Intermediary are Information Exchange Actor roles that describe responsibility for the exchange. Content Creator, Message Sender, Message Receiver, and Content Consumer are Technology Actor roles that describe functions performed by technology.

A Grouped Actor combines two or more Technology Actors for purposes of this Implementation Guide. Grouping establishes the combined externally observable requirements of the grouped actors but does not specify the internal interaction between them. The Sender Actor groups the Content Creator and Message Sender. The Receiver Actor groups the Message Receiver and Content Consumer. The grouped functions may be implemented in one product or distributed across multiple systems, apps, or services.

| **Technology Actor** | **Responsibility** |
|----|----|
| Content Creator | Creates or obtains the Payload Content; preserves Information Source provenance; establishes or retrieves applicable Context Instance identifiers; selects the canonical transaction; determines or resolves the Information Recipient when authorized; creates a persistent FHIR Task only when the exchange establishes stateful work; creates the human-readable representation; manufactures Payload Metadata; assembles and validates the transaction package; and supplies message-level routing/control instructions to the Message Sender. |
| Message Sender | Constructs the Direct message envelope from the transaction-ready package and supplied routing/control instructions; applies the required MIME/SMTP and Direct-X headers; addresses and transmits the message; and participates in applicable Direct delivery-notification behavior. It does not reinterpret the clinical Payload or independently redefine the transaction. |
| Message Receiver | Performs the Direct Secure Messaging functions necessary to receive and validate a message; preserves message-level metadata; and makes the Payload, Payload Metadata, and workflow-status request information available to the Content Consumer. |
| Content Consumer | Processes the received Payload and metadata according to the semantic, business, and workflow requirements of the transaction; performs patient/context correlation; places the Payload into the intended workflow; and determines the resulting workflow state used when TX8 is required. |
| Sender Actor (Grouped) | Content Creator + Message Sender. The interaction between the grouped actors is intentionally not specified. |
| Receiver Actor (Grouped) | Message Receiver + Content Consumer. The interaction between the grouped actors is intentionally not specified. |

## Content Creator to Message Sender Handoff

The Content Creator SHALL hand the Message Sender a transaction-ready package plus the message-level instructions needed to transmit it. At this boundary, the transaction identity, intended recipient or routing target, Payload Content, human-readable representation, Payload Metadata, applicable Context Instance identifiers, and any workflow-status request have already been determined. The Message Sender is not expected to infer the business meaning of the Payload in order to decide which transaction is being sent.

The Content Creator SHALL NOT create a FHIR Task merely to carry Context Instance identifiers or merely because Workflow Status is requested. A persistent Task is established only when the initiating exchange creates or advances identifiable stateful work whose lifecycle matters independently of message delivery.

## Message Receiver to Content Consumer Handoff

The Message Receiver SHALL make the received Payload, Payload Metadata, relevant message-header controls, and available transport provenance accessible to the Content Consumer. The Content Consumer determines whether the Payload can be correlated and placed into its intended workflow. This boundary is why successful Direct Final Destination delivery and successful Workflow Status are distinct assertions.

**Intermediaries and Multi-Leg Message Flows**

The dominant exchange pattern in this use case may include a smart HIE or data utility service acting as an Intermediary. An Intermediary may become the Receiver Actor for one message-processing leg and the Sender Actor for a subsequent leg without becoming either the Information Source or the Information Recipient. The Information Recipient may initially be unknown to the Information Source; an authorized Intermediary may use patient, business, context, directory, and routing information to determine the appropriate Information Recipient or Recipients and then send the transaction onward.

**FOUNDATIONAL PRINCIPLE: Business responsibility follows the information; Technology Actor roles follow each message-processing leg. Message routing, recipient discovery, assembly, transformation, or retransmission by an Intermediary does not transfer the Information Source role to the Intermediary and does not make the Intermediary the Information Recipient.**

**Data Provenance Across Actor Boundaries**

Maintaining these distinctions is necessary to capture and preserve accurate Data Provenance. Each participant SHALL preserve upstream provenance and add provenance for the activities it performs without obscuring or replacing the provenance of the information it received. Relevant provenance activities include Create, Sign, Seal, Update, Assemble, Transform, Transmit, Receive, Void, Deprecate, and Entered-in-Error. The precise representation of these activities is defined by the applicable payload and modular transaction specifications.

For example, an Intermediary may Receive a newborn A01, use maternal linkage information to match the mother, Transform or Assemble information into a derived Birth Notification CDA, and Transmit that CDA to a maternal-care recipient. Those activities add Intermediary provenance, but the Birthing Provider remains the Information Source of the underlying clinical birth information.

**Common Transaction Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Sender Actor | Authorization | SHALL send use-case transactions only to endpoints authorized for the applicable exchange relationship and use case. |
| Receiver Actor | Authorization anomaly | When a message is received from an entity not authorized to participate in this use case, SHALL follow the processing-anomaly workflow defined for this guide and reference the Endpoint Capability Statement where applicable. |
| Receiver Actor | Patient matching | SHALL use available patient-identifying metadata and payload information to match the subject to the appropriate patient record when patient matching is required. |
| Receiver Actor | Patient-match anomaly | When an authorized sender is known but the patient cannot be matched, SHALL follow the processing-anomaly workflow and communicate the failure using TX8 send-workflow-status when required by this guide. |
| Receiver Actor | Context matching | SHALL use applicable Context Instance Identifiers to correlate the transaction with the relevant pregnancy episode, visit, request, or other workflow context. |
| Receiver Actor | Context-match anomaly | When a required Context Instance Identifier cannot be matched, SHALL follow the processing-anomaly workflow and communicate the failure using TX8 send-workflow-status when required by this guide. |
| All Actors | Provenance and metadata | SHALL retain provenance and metadata needed to understand the source, context, and processing of exchanged information. |
| All Actors | Human readability | SHALL preserve the human-readable representation required by the applicable transaction and payload specification. |
| All Actors | Endpoint capabilities | SHALL use the Endpoint Capability Statement defined in Chapter 4 to communicate supported transactions, options, and payload capabilities. |
| Sender Actor | Workflow-status request | MAY request return of Workflow Status using x-direct-workflow-status-requested. Requesting Workflow Status does not require the initiating transaction to contain a FHIR Task. |
| Receiver Actor | Workflow-status response | When workflow-status-requested is true, SHALL return TX8 send-workflow-status after determining whether the Payload reached or failed to reach its intended workflow. When no persistent Task was established by the initiating exchange, the Receiver Actor creates a bounded workflow-delivery Task for TX8. When a persistent Task was established, an update to that same logical Task MAY fulfill the requested Workflow Status when the reported state demonstrates workflow arrival. |
| Receiver Actor | Requested workflow status | The Message Receiver SHALL make the workflow-status request and originating Transaction Instance Identifier available to the Content Consumer. For the TX8 return leg, the prior Receiver Actor assumes the Sender Actor role. TX8 SHALL correlate to the originating transaction and SHALL be routable to the Message Sender and Information Source associated with that initiating exchange. |

## TX1: send-outpatient-visit-notification

Conveys completion of an outpatient maternal-health encounter in human-readable and machine-processable form. The machine-processable payload is an HL7 Version 2 outpatient visit notification.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX1 |
| Transaction name | send-outpatient-visit-notification |
| Use-case role | Triggering / secondary transaction |
| Context | Patient; Pregnancy Episode; Visit |
| Sender Actor obligation | Send the applicable completed outpatient-visit notification. |
| Receiver Actor obligation | Receive, render, process, and use the event notification to support the intended maternal-health workflow. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Notification creation | SHALL create the human-readable communication and machine-processable outpatient HL7 Version 2 notification required by the transaction module. |
| Content Consumer | Processing | SHALL render and process the notification and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-outpatient-visit-notification](/tx1-send-outpatient-visit-notification).

## TX2: send-admission-notification

Conveys a maternal-health registration or admission event in human-readable and machine-processable form. The machine-processable payload is an HL7 Version 2 notification.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX2 |
| Transaction name | send-admission-notification |
| Use-case role | Triggering / secondary transaction |
| Context | Patient; Pregnancy Episode; Visit |
| Sender Actor obligation | Send the applicable patient registration, hospital admission, or emergency-department admission notification. |
| Receiver Actor obligation | Receive, render, process, and use the event notification to support the intended maternal-health workflow. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Notification creation | SHALL create the human-readable communication and machine-processable HL7 Version 2 notification required by the transaction module. |
| Content Consumer | Processing | SHALL render and process the notification and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-admission-notification](/tx2-send-admission-notification).

## TX3: send-birth-notification

Notifies a maternal-care participant that the maternal patient has given birth and that a distinct patient identity has been established for the newborn. The machine-processable payload is a concise CDA Birth Notification derived from the newborn admission event and maternal-newborn association.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX3 |
| Transaction name | send-birth-notification |
| Use-case role | Derived event / workflow-triggering transaction |
| Context | Patient (Mother); Pregnancy Episode; Visit; |
| Primary subject | Maternal patient |
| Related subject | Newborn |
| Trigger | Detection of a newborn admission/registration event and successful association of the newborn with the maternal patient. |
| Sender Actor obligation | Create and send the maternal-subject Birth Notification when the defined trigger and routing conditions are satisfied. |
| Receiver Actor obligation | Receive, render, process, and use the Birth Notification to support maternal continuity-of-care and postpartum workflow. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Why TX3 is Different**

TX3 is not simply a new HL7 Version 2 ADT event code. It is a derived maternal-health transaction created when a newborn admission event provides enough information to associate the newly established newborn patient with the maternal patient. The source event and the derived notification therefore have different subjects and different business viewpoints.

The source newborn admission identifies the baby as the patient. The derived TX3 Birth Notification identifies the mother as the primary subject and represents the newborn as linked related-subject information. This semantic transformation allows the notification received by the maternal-care participant to tell the maternal story: the patient has delivered and a distinct newborn patient identity has been established.

**Newborn Admission Detection and Maternal Association**

An Information Source that creates or receives the newborn admission event, or an Intermediary monitoring an ADT feed on behalf of participating organizations, SHALL be capable of recognizing the newborn-admission pattern used by the implementation. When PID-21 Mother's Identifier is populated, the processing logic SHALL preserve the identifier value and assigning authority needed to resolve the maternal patient. NK1 relationship information may provide complementary human-readable or corroborating relationship information.

After the maternal patient is resolved, the processor determines whether an applicable maternal-health workflow exists and whether a TX3 recipient should be notified. If so, the processor creates the Birth Notification CDA from the newborn admission information and the matched maternal context. If the mother cannot be resolved when maternal association is required, the processor SHALL treat this as a defined processing anomaly rather than creating an uncorrelated Birth Notification.

**Information Source and Intermediary Responsibilities**

A Birthing Provider acting directly as the Information Source may perform the newborn-event detection, maternal matching, CDA creation, and routing itself. When an Intermediary receives the Birthing Provider's ADT feed, the Intermediary may perform this monitoring and transformation on behalf of the exchange workflow. In either case, responsibility for the derived notification and its provenance SHALL remain explicit in the resulting transaction metadata.

When the Intermediary creates and sends the derived TX3 artifact, it becomes the Sender Actor for that message leg, but the Birthing Provider remains the Information Source of the underlying birth information.

**Potential Spawned Workflow - Newborn Care**

Detection of the newborn admission may also initiate a separate workflow involving the newborn and an intended pediatric or infant-care provider. In such a workflow, the newborn remains the patient/subject and the mother is represented as a related person. That potential newborn-care workflow is distinct from TX3 and is outside the scope of this Implementation Guide. Its possibility is noted so implementers do not confuse the maternal Birth Notification with the original newborn admission event or with subsequent newborn-care exchanges.

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| ADT Feed Monitor / Content Creator | Newborn-event detection | SHALL recognize the implementation's newborn admission pattern and inspect maternal-linkage information needed to associate the newborn with the mother. |
| ADT Feed Monitor / Content Creator | Maternal matching | SHALL use PID-21 Mother's Identifier, including assigning authority where available, as the primary machine-processable maternal linkage when present; MAY use NK1 as complementary relationship information. |
| Content Creator | Semantic transformation | SHALL create a maternal-subject Birth Notification CDA in which the newborn is represented as related-subject content rather than representing the source newborn A01 as though it were itself the TX3 payload. |
| Content Creator | Provenance | SHALL retain sufficient provenance to show that the Birth Notification was derived from the newborn admission event and matched maternal context. |
| Content Consumer | Processing | SHALL render and process the CDA Birth Notification and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-birth-notification](/tx3-send-birth-notification).

## TX4: send-discharge-notification

Conveys a maternal-health discharge event in human-readable and machine-processable form. The machine-processable payload is an HL7 Version 2 discharge notification.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX4 |
| Transaction name | send-discharge-notification |
| Use-case role | Triggering / secondary transaction |
| Context | Patient; Pregnancy Episode; Visit |
| Sender Actor obligation | Send the applicable hospital or emergency-department discharge event notification. |
| Receiver Actor obligation | Receive, render, process, and use the discharge event to support postpartum and continuity-of-care workflows. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Notification creation | SHALL create the human-readable communication and machine-processable HL7 Version 2 discharge notification required by the transaction module. |
| Content Consumer | Processing | SHALL render and process the notification and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-discharge-notification](/tx4-send-discharge-notification).

## TX5: send-documents

Sends one or more maternal-health documents to support pregnancy notification and risk assessment, referral/orders, antepartum information sharing, birth, postpartum, and continuity-of-care workflows.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX5 |
| Transaction name | send-documents |
| Use-case role | Primary document push transaction |
| Context | Patient; Pregnancy Episode; Visit, Request, or other Context Instance when applicable |
| Sender Actor obligation | Send one or more maternal-health documents using the applicable payload and metadata constraints. |
| Receiver Actor obligation | Receive, render, process, and retain the documents and associated metadata. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Document creation | SHALL create or select the specified document type and populate the required document header and metadata. |
| Content Creator | Minimally Structured Document | When CDA is used under this guide, SHALL use the applicable Minimally Structured Document requirements. |
| Content Consumer | Rendering and storage | SHALL enable rendering and storage of the payload, provenance, and metadata and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-documents](/tx5-send-documents).

## TX6: query-for-documents

Discovers clinical documents available for a patient using IHE Registry Stored Query \[ITI-18\] FindDocuments. The transaction supports Request by Type and Request by Category.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX6 |
| Transaction name | query-for-documents |
| Use-case role | Document discovery query |
| Context | Patient; Pregnancy Episode |
| Sender Actor obligation | Issue FindDocuments with the patient and either one specific document type or one document category. |
| Receiver Actor obligation | Evaluate the requested type or category and return metadata for matching documents. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Query Initiator | Request by Type | SHALL populate \$XDSDocumentEntryTypeCode with exactly one specific document type when requesting by type. |
| Query Responder | Request by Type | SHALL evaluate the requested type as an exact semantic document-type match. |
| Query Initiator | Request by Category | SHALL populate \$XDSDocumentEntryClassCode with exactly one document category when requesting by category. |
| Query Responder | Request by Category | SHALL evaluate the requested category against all categories associated with each available document and return metadata for every matching document. |
| Query Responder | Returned type | SHALL preserve the specific document type in returned DocumentEntry.typeCode metadata. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for query-for-documents](/tx6-query-for-documents).

## TX7: send-patient-update

Sends updated patient information to organizations that previously received information about the patient. Previously shared patient information supports matching; the payload conveys the updated patient information.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX7 |
| Transaction name | send-patient-update |
| Use-case role | Direct push / patient update |
| Context | Patient; Pregnancy Episode when applicable |
| Sender Actor obligation | Send prior patient-identifying information needed for matching together with the Updated Patient Information payload. |
| Receiver Actor obligation | Match the patient using previously known information and apply the updated patient information to the appropriate record. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Prior patient information | SHALL provide sufficient previously shared patient information in metadata to support matching at the receiving organization. |
| Content Creator | Updated information | SHALL convey the new patient information in the transaction payload. |
| Content Consumer | Match before update | SHALL match the subject to the appropriate existing patient record before applying the updated information. |
| Content Consumer | Update processing | SHALL process the updated patient information according to organizational policy and apply the Common Transaction Requirements. |
| Content Consumer | Workflow status | SHALL send TX8 when requested or when a defined processing anomaly requires workflow-status communication. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-patient-update](/tx7-send-patient-update).

## TX8: send-workflow-status

Communicates the state of an established workflow or Context Instance. TX8 supports workflow acceptance, progress, completion, failure, defined anomalies, correlation of related activity, and transitions between workflow contexts.

**Transaction Overview**

| **Attribute** | **Specification** |
|----|----|
| Transaction identifier | TX8 |
| Transaction name | send-workflow-status |
| Use-case role | Cross-cutting workflow / context-lifecycle transaction |
| Context | Task / Context Instance(s): Patient; Pregnancy Episode; Visit; Request; or other workflow context when applicable. |
| Sender Actor obligation | Send a human-readable and machine-processable workflow-status communication correlated to the applicable Context Instance when requested or required by this guide. |
| Receiver Actor obligation | Receive, correlate, process, and use the workflow-status communication in relation to the applicable task, transaction, payload, or Context Instance. When workflow-status reporting is requested by the initiating message, the Receiver Actor SHALL initiate TX8 send-workflow-status after the Content Consumer determines the applicable workflow state; a defined processing anomaly may require TX8 regardless of the request flag. |

**Workflow Status Is Distinct from Message Delivery**

Successful SMTP/Direct delivery establishes that a message was delivered to the receiving endpoint. It does not establish that the payload was accepted into the intended business workflow. TX8 communicates workflow-level state. Workflow status is also distinct from the clinical status of the patient or condition represented by the exchanged information.

**Establishing and Correlating a Context Instance**

FHIR Task is reserved for workflow semantics. When an initiating exchange establishes persistent stateful work, the Sender Actor creates the Task and includes it in the Payload. For routine notifications that do not establish persistent work, no outbound Task is required. If Workflow Status is requested, TX8 uses a bounded workflow-delivery Task created by the Receiver Actor and normally returned in a terminal state.

A persistent Task retains its logical Task.identifier as its status advances. For TX8 correlation, Task.groupIdentifier carries the originating Transaction Instance Identifier, defined by this guide as the originating SubmissionSet.uniqueId. Detailed Task profiling and XD packaging requirements are defined in TX8 and in future transaction specifications that establish persistent Tasks.

**Workflow Lifecycle Communication**

TX8 is not limited to a one-time confirmation. It may communicate that a workflow has been requested, accepted into the intended process, is in progress, has completed, has failed, or has encountered another defined anomaly. The applicable Context Instance Identifier enables subsequent communications to be correlated with the same established workflow.

TX8 may also communicate information needed to signal completion of one longitudinal context and transition to another. This capability is important in maternal-health workflows where pregnancy, birth, and postpartum activities are related but may be managed as distinct Context Instances.

**Requesting Return of Workflow Status**

A Sender Actor may use the Direct-X workflow-status-requested metadata parameter to request routine return of TX8 workflow status. When requested, the Receiver Actor returns status according to the applicable transaction rules. When the parameter is false or absent, routine status is not requested. This preference does not suppress a TX8 communication that this guide requires to report a defined processing anomaly.

The exact Direct-X header name, syntax, cardinality, defaulting behavior, and transaction-specific conformance requirements are defined in the modular transaction specifications so each transaction file remains self-contained for implementation.

**Technical Actor Functional Requirements**

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Message Sender | Requested status | When workflow status has been requested, SHALL return status according to the applicable transaction rules. |
| Message Sender | Successful workflow acceptance | MAY or SHALL, as specified by the initiating transaction, communicate that the payload has entered the intended workflow; status reflects the workflow state rather than mere message delivery. |
| Message Sender | Progress and completion | MAY communicate in-progress and terminal states, including completion, when supported by the workflow. |
| Message Sender | Processing anomaly | SHALL send TX8 when required by this guide to communicate a defined anomaly that prevents or materially alters intended workflow processing. |
| Message Sender | Context transition | MAY communicate information needed to signal completion of one Context Instance and establishment or activation of another when defined by the workflow. |
| Message Receiver | Correlation | SHALL use available Context Instance Identifiers and metadata to associate the communication with the applicable task, transaction, payload, or workflow context. |
| Message Receiver | Status interpretation | SHALL distinguish workflow status from transport/delivery status and from clinical status. |

Detailed payload packaging, metadata, and transaction-specific implementation requirements are defined in the [modular transaction specification for send-workflow-status](/tx8-send-workflow-status).

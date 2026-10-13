---
title: "Appendix C: Understanding XD Classification Metadata"
---

# Appendix C: Understanding XD Classification Metadata

_Distinguish information object classification from package purpose._

Appendix C explains the XD classification model used in the MAP Transaction Framework. It distinguishes DocumentEntry.classCode, DocumentEntry.typeCode, and SubmissionSet.contentTypeCode, and separates those classifications from the Shared Activity identified by SubmissionSet.purpose and Task.code. Appendix A supplies the standardized clinical-document model; Chapter 3 and each Transaction Definition establish the applicable bindings and population requirements.

## Purpose

XD metadata provides several ways to classify the information exchanged in a SubmissionSet. Three elements in particular—DocumentEntry.classCode, DocumentEntry.typeCode, and SubmissionSet.contentTypeCode—can appear similar. They are related, but they answer different questions.

Begin with the broad classification of each information object, identify its specific semantic type, and then identify the type of the structured payload organized by the SubmissionSet. Event notifications illustrate how related information objects can communicate the same event while serving different roles.

## DocumentEntry Class Code

DocumentEntry.classCode provides a broad classification of an individual information object. It supports discovery and interpretation when a structured payload includes objects serving different clinical, representation, or processing roles. MIME type identifies representation; classCode identifies a semantic classification.

For clinical documents, Chapter T defines Document Category as the broader semantic grouping and Document Type as the specific kind of document. XD classCode carries the exchange-defined broad classification; it is a Document Category mapping when the applicable policy declares that alignment. A classCode can classify a non-document information object without making that object a clinical document.

An event notification structured payload includes the primary HL7 Version 2 notification, the required Workflow Activity Task, and the human-readable communication. Required or permitted Provenance is carried in separate Collection Bundle information objects. These objects contribute to one Shared Activity without becoming the same kind of information object.

| **Information object** | **Example classCode** | **Classification meaning** |
|----|----|----|
| Human-readable healthcare communication | LOINC 56444-3 | Identifies the human-readable healthcare communication. |
| FHIR Task workflow module | Task resource type, where permitted | Illustrates the workflow-resource class; apply the declared CodeSystem and binding. |
| HL7 V2 ADT notification | LOINC 86530-3 — Visit notification | Identifies the object as a machine-processable ADT notification. |

The event-notification example uses LOINC 56444-3, Healthcare communication Document, for the human-readable communication and LOINC 86530-3, Visit notification, for the broad notification class. A Task resource-type classification illustrates the workflow object’s role where an applicable Transaction Definition explicitly permits that classification and coding system.

DocumentEntry.classCode answers: What general kind or role of information object is this DocumentEntry?

## DocumentEntry Type Code

DocumentEntry.typeCode provides the more specific semantic classification of the information represented by a DocumentEntry.

For a clinical document this is its Document Type. For other information objects it is their specific semantic information type. Document Template/Profile and MIME type describe different dimensions; neither substitutes for typeCode.

The specific semantic type may identify the healthcare event being communicated. The fact that an object is serialized as an HL7 Version 2 message or FHIR Task does not by itself establish that event type. Use the classCode, typeCode, MIME type, and applicable profile together to describe distinct aspects of the object.

For the primary HL7 Version 2 event notification, select the specific notification type established by the applicable Transaction Definition, taking the event and patient class into account. The general notification class and specific notification type serve different purposes.

An applicable Transaction Definition may assign the same event-specific typeCode to the related notification, Task, and human-readable communication. This convention must be explicit; participation in the same structured payload does not automatically give every information object the same typeCode.

| **Information object** | **classCode** | **typeCode** |
|----|----|----|
| Human-readable communication | 56444-3 | Event-specific code when specified by the TX Definition |
| FHIR Task | Task resource type, where permitted | Event-specific code when specified by the TX Definition |
| HL7 V2 notification | 86530-3 | Event-specific code when specified by the TX Definition |

Shared typeCode values may identify the common healthcare communication represented by differently classified objects. Independently classified objects retain their own type: for example, a Provenance Collection Bundle uses the Provenance Information classification required by Chapter 3 rather than inheriting the event type merely because it accompanies a notification.

DocumentEntry.typeCode answers: What specific information or event does this DocumentEntry represent?

## SubmissionSet Content Type Code

SubmissionSet.contentTypeCode classifies the structured payload organized by the SubmissionSet. It applies at package level, while DocumentEntry.classCode and typeCode describe individual information objects.

A useful question for selecting the value is:

What information type best characterizes this structured payload?

Chapter 3 establishes the default: unless a Transaction Definition specifies otherwise, SubmissionSet.contentTypeCode uses the typeCode of the primary information object’s DocumentEntry. In an event notification, that is the primary HL7 Version 2 notification. This alignment does not require all other DocumentEntries to carry that same typeCode.

SubmissionSet.purpose answers a different question: which Shared Activity is requested? It aligns with Task.code, using the applicable transaction binding. A clinical event code does not replace the requested-activity code, and a MAP transaction code does not replace information-object classification.

| **Metadata element** | **Question it answers** |
|----|----|
| DocumentEntry.classCode | What broad classification describes this information object? |
| DocumentEntry.typeCode | What specific information type does this object represent? |
| SubmissionSet.contentTypeCode | What information type characterizes the structured payload? |
| SubmissionSet.purpose and Task.code | Which Shared Activity is requested? |

## Default Alignment and Transaction Specific Exceptions

The default alignment applies to the primary information object, not mechanically to every included object. Common Chapter 3 bindings remain applicable unless a Transaction Definition explicitly establishes an allowed specialization.

Apply the primary DocumentEntry typeCode as SubmissionSet.contentTypeCode by default. A Transaction Definition may instead establish a different package classification when needed to express the structured payload’s semantics.

For a package containing multiple information-object types, the Transaction Definition identifies the primary information object and any explicit contentTypeCode exception. An alternative classification must have a defined meaning and comply with the applicable terminology binding; it is not an ad hoc packaging choice.

Select classCode for each object’s broad classification and typeCode for its specific semantic type. Use the primary typeCode for package classification unless the Transaction Definition specifies an exception. Use SubmissionSet.purpose and Task.code for the requested Shared Activity. Apply the bindings in Chapter 3 together with explicit transaction-specific values.

## Application to Event Notifications

The table below illustrates an event-notification classification pattern. The event-specific typeCode may be shared among these related objects only where the applicable Transaction Definition establishes that convention. The primary notification supplies the default SubmissionSet.contentTypeCode. Optional Provenance Collection Bundles retain their separately specified classification.

The workflow request is expressed in Task.code and SubmissionSet.purpose. The classCode and typeCode describe the Task information object according to its declared bindings; they do not substitute for those workflow controls. Each Task, primary notification, human-readable file, and Provenance Bundle has its own metadata and SubmissionSet membership.

## Why this matters for progressive interoperability

A Receiver Actor may support human-readable communication, workflow Tasks, and machine-processable clinical notifications through different processing capabilities. Classification helps it interpret the included information objects while preserving their relationship within one structured payload.

Metadata can express a shared event meaning where that mapping is defined, while retaining distinct classifications for other objects. The structured payload is accepted or rejected as a whole into the intended workflow. Classification alone does not establish acceptance, successful processing, or clinical service fulfillment.

## Source guidance

The Event Notifications via the Direct Standard®, Version 1.2, is a source for the event-notification metadata pattern. The examples here distinguish that notification pattern from MAP’s additional Workflow Activity Task and Provenance requirements. Apply the current specifications governing the implemented transaction; examples do not establish a universal binding for every information object.

Chapter 3 defines the common inventories, required typeCode, Extensible bindings, primary-object package classification, and workflow-purpose rules. A non-LOINC classification, including a FHIR resource-type code, requires the applicable binding and transaction specification to support its use. Unknown formatCode may be omitted under Chapter 3; information-object typeCode remains required and uses a defined standard or expressly permitted temporary code.

## References and Supporting Guidance

The following sources and guide sections support interpretation of these classifications. Use the applicable normative requirements when constructing or evaluating metadata.

DirectTrust. Event Notifications via the Direct Standard®, Version 1.2, ANSI/DS2020-03-101-2025, approved March 25, 2025. Access: https://directtrust.org/standards/access-standards .

DirectTrust. Framework for Metadata and Payloads via the Direct Standard®, Part I, Version 1.0, DS2024-07-100-2026, approved February 26, 2026. Apply its message and structured payload model together with the common requirements in Chapter 3. Access: https://directtrust.org/standards/access-standards .

### Collection relationship

Appendix A, Understanding Standardized Clinical Documents, explains Species, Genus, Family, clinical scope, and the maternal-health document catalog. Appendix B distinguishes identity and Context from status. Appendix D supplies XD-to-FHIR mappings. This appendix explains classification; normative requirements remain in Chapter 3 and the applicable Transaction Definition.

Chapter T supplies the classification field crosswalk. Appendix E supplies the separate document lifecycle and status reference; classification does not establish document finality or metadata availability.

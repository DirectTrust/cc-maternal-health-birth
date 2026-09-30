---
title: "TX1: send-outpatient-visit-notification"
---

# TX1: send-outpatient-visit-notification

*cc-maternal-health-birth via the Direct Standard® Version 1.0 • Last Updated 2026-09-27*

## 1 Transaction Overview

send-outpatient-visit-notification conveys completion of an outpatient maternal-health encounter in both human-readable and machine-processable form. The machine-processable Payload is an HL7 Version 2 outpatient visit notification. In the Mimi Shell examples, an ADT^A03 is used for the completed outpatient visit and LOINC 98145-6 identifies the outpatient visit notification.

Task.code SHALL carry the TransactionTypesCS code send-outpatient-visit-notification. Task.code.text SHALL make the Task Action Precept explicit: “Process the information in the Payload in the intended workflow.” The canonical transaction code is send-outpatient-visit-notification; TX1 is a local editorial label and is not the interoperable transaction identifier.

The transaction can be sent directly by an Information Source or by an Intermediary acting as the Sender Actor for a message-processing leg. The use of an Intermediary does not change the Information Source.

## 1.1 Direct Message and Transport

TX1 SHALL apply the common MAP Message and Transport Framework defined in Chapter 3. The Direct message SHALL NOT use x-direct-workflow-status-requested. Disposition-Notification-To, when used, is reserved for Direct transport disposition reporting and is not the TX8 return route.

| **MAP message metadata** | **TX1 selection** |
|----|----|
| x-direct-useCase | cc-maternal-health-birth |
| x-direct-metadataTypeCode | urn:dt-org:dsm:map:SMTP+XD:1.0 |
| x-direct-metadata-payload-versionIdentifier | 1 |
| x-direct-purposeOfUse | TREATMENT when applicable |

## 1.2 Direct Delivery Notification and Workflow Status

Direct final-destination delivery notification and TX8 Workflow Status are complementary but fundamentally different assurances. Final-destination delivery confirms that the Direct Message reached the Final Destination defined by the applicable Direct/Edge implementation. TX8 reports the processing outcome of the action the Information Recipient was asked to perform with the information in the Payload. A successful final-destination MDN SHALL NOT be interpreted as evidence that the Information Recipient successfully processed or retained the Payload.

## 2 Message and Payload Requirements

TX1 includes exactly one FHIR Task as the Workflow Activity DocumentEntry for each independently processable SubmissionSet. The Task expresses the action the Information Recipient is asked to perform and carries the workflow context and Workflow Status instructions needed for subsequent TX8 communication.

### 2.1 Payload Packaging Structure

| **Conf.** | **Package object** | **Content MIME type** |
|----|----|----|
| R | Outer human-readable healthcare communication | text/plain |
| O | Outer human-readable alternative | text/html |
| R | XDM ZIP package | application/zip |
| R | XDM SubmissionSet | n/a |
| R | Workflow Activity Task | application/fhir+xml |
| R | HL7 Version 2 Outpatient Visit Notification | text/hl7v2 |
| R | Human-readable healthcare communication | text/plain |
| O | Human-readable alternative | text/html |

### 2.2 Workflow Activity Task

| **Task concept** | **TX1 requirement** |
|----|----|
| Task.code | R. send-outpatient-visit-notification. |
| Task action precept | R. Process the information in the Payload in the intended workflow. |
| Task.identifier / SubmissionSet.uniqueId | R. Same logical Workflow Activity Identifier. |
| Task.for | R/RE as applicable. Patient identity consistent with the SubmissionSet and HL7 v2 Payload. |
| Context | R when applicable. Carry/correlate the Perinatal Context Instance and any other Context Instance required by the transaction. |
| Successful Payload Receipt reporting request | R as a defined workflow instruction. Indicates whether successful Payload Receipt reporting is requested. |
| Workflow Status Update Endpoint | R, 1..\*. At least one Direct endpoint designated by the transaction-initiating system. |

### 2.3 Workflow Status Endpoint Processing

At least one Workflow Status Update Endpoint SHALL be supplied by the transaction-initiating system. Each subsequent Sender Actor SHALL preserve every existing Workflow Status Update Endpoint. An Intermediary Sender Actor MAY add its own endpoint when it also needs to receive the eventual Payload Receipt or Payload Rejection outcome. The endpoint set SHALL NOT be resolved through the DirectTrust Directory or Endpoint Discovery Resource.

When TX8 is required, the actor determining the reportable processing outcome SHALL cause TX8 Workflow Status to be sent to each unique Workflow Status Update Endpoint accumulated for the originating Transaction Instance.

## 3 XD Metadata Guidance

XD is the fully specified representation of Payload Metadata for TX1. The following transaction-specific requirements supplement the common Chapter 3 framework.

TX1 applies the Chapter 3 canonical metadata model: SubmissionSet.purpose identifies the Shared Activity; SubmissionSet.contentTypeCode is the typeCode of the principal notification DocumentEntry. Because TX1 is a single-patient push, MAP SubmissionSet Patient Info SHALL be present using the same representation and semantics as DocumentEntry.sourcePatientInfo. patientId SHALL be populated only when the Information Source knows the identifier appropriate to the Information Recipient or a mutually agreed exchange patient-identifier domain. Author, specialty, practice-setting, and facility-type metadata SHALL be source-driven or deterministically resolved from authoritative reference data and SHALL NOT use manufactured NONE/Not specified placeholders.

### 3.1 SubmissionSet

| **Metadata element** | **TX1 value / source** | **Requirement** |
|----|----|----|
| uniqueId | System-assigned | R; same logical identifier as designated Workflow Activity Task.identifier. |
| patientId | Patient identifier known by the Information Source to be appropriate to the Information Recipient or mutually agreed exchange patient-identifier domain | C. Populate only when known. SHALL NOT be populated with the Information Source local identifier merely because no recipient-known identifier is available. |
| Patient Info | Promoted from the established DocumentEntry.sourcePatientInfo representation: PID-3 Patient Identifier List, PID-5 Patient Name, PID-7 Date/Time of Birth, PID-8 Administrative Sex, and PID-11 Patient Address, as available | R for TX1. TX1 is a single-patient SubmissionSet. Include even when patientId is known so the Content Consumer can independently match or confirm the patient. |
| purpose | send-outpatient-visit-notification | R; aligns with Workflow Activity Task.code. |
| contentTypeCode | 98145-6 Outpatient Visit notification | RE/R2; aligns with the typeCode of the principal HL7 v2 notification DocumentEntry. |
| referenceIdList | Perinatal Context and other applicable Context Instances | O/RE as applicable. |
| sourceId | Established Organization Identity OID of the Information Source contributing this SubmissionSet | R. Identifies the source of the current TX1 SubmissionSet. |

### 3.1.1 Patient Identity and Matching

TX1 deliberately separates the patient identifier known to the Information Source from a patient identifier known to be appropriate to the Information Recipient. The sender-known identifier belongs in DocumentEntry.sourcePatientId. It SHALL NOT be copied into SubmissionSet.patientId or DocumentEntry.patientId merely to populate those fields.

SubmissionSet Patient Info is a MAP extension that promotes the established DocumentEntry.sourcePatientInfo demographic representation to package level. For TX1 it is required even when patientId is known. This allows the Content Consumer to attempt a patient match when patientId is unavailable and to independently check a supplied patientId for a higher-confidence match.

Packaging software MAY populate SubmissionSet.patientId and applicable DocumentEntry.patientId when an intermediary or other authoritative process has resolved an identifier appropriate to the Information Recipient or mutually agreed exchange domain. That packaging-time fact SHALL NOT require alteration of the source HL7 v2 notification. The source clinical object remains the source record; the XD metadata records facts known at transaction packaging time.

### 3.2 DocumentEntry — HL7 V2 Outpatient Visit Notification

| **Metadata element** | **TX1 value / source** | **Requirement** |
|----|----|----|
| mimeType | text/hl7v2 | R. |
| classCode | 86530-3 Hospital notification | RE/R2; classifies the principal information object as a notification. |
| typeCode | 98145-6 Outpatient Visit notification | RE/R2; specific notification type and source for SubmissionSet.contentTypeCode. |
| patientId | Patient identifier known to be appropriate to the Information Recipient or mutually agreed exchange patient-identifier domain | C. Populate only when known; do not substitute the sender-local identifier. |
| sourcePatientId | From the source HL7 v2 patient identifier(s), preserving assigning authority | RE/R2. Represents the patient identifier assigned/used by the Information Source. |
| creationTime | Encounter completion time | RE/R2. |
| serviceStartTime | Encounter start when known | O. |
| serviceStopTime | Encounter completion time | O. |
| sourceId | SubmissionSet Source Organization Identity OID | R. |
| authorRole | Care Team Member Function from patient/encounter-specific source context | RE/R2 when known; may repeat. |
| authorSpecialty | US Core Practitioner Role Specialty Codes semantics; applicable SNOMED CT specialty and/or NUCC Provider Taxonomy | RE/R2 when known; may repeat. |
| practiceSettingCode | Canonical practice-setting code derived from the clinical setting/source or authoritative facility reference | RE/R2 when known. |
| healthcareFacilityTypeCode | Canonical healthcare-facility-type code derived from the encounter location or authoritative facility reference | RE/R2 when known. |
| sourcePatientInfo | From the source HL7 v2 patient demographics using established XD sourcePatientInfo representation | RE/R2. Patient matching/checking information associated with the source patient identity. |

## 4 FHIR Metadata Guidance

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance using the common XD-to-FHIR mapping. This is an alternative representation of the same Payload Metadata, not a different metadata model.

## 5 Context Guidance

TX1 SHALL preserve and correlate applicable Context Instance identifiers. For the Mimi Shell pregnancy and postpartum journey, the Perinatal Context Instance spans prenatal care, labor/delivery, and postpartum care through clinical closure. Delivery does not create a new maternal postpartum Context Instance.

## 6 Technical Actor Functional Requirements

| **Actor** | **Requirement category** | **Normative requirement** |
|----|----|----|
| Content Creator | Notification creation | SHALL create the human-readable communication and machine-processable outpatient HL7 Version 2 notification required by TX1. |
| Content Creator | Workflow Activity Task | SHALL create/complete the TX1 Workflow Activity Task, including the successful Payload Receipt reporting instruction and at least one Workflow Status Update Endpoint. |
| Message Sender | Transmission | SHALL package and transmit the Direct message using the metadata and XDM constraints defined here and in Chapter 3. |
| Message Sender | Endpoint preservation | SHALL preserve existing Workflow Status Update Endpoints; an Intermediary Sender Actor MAY add its own endpoint when it also needs the processing outcome. |
| Message Receiver | Receipt | SHALL receive and validate the Direct message and make the Payload and metadata available to the Content Consumer. |
| Content Consumer | Processing | SHALL render/process the notification and attempt to correlate it to the appropriate patient and Context Instance(s) and process it in the intended workflow. |
| Receiver Actor | Successful Payload Receipt | SHALL cause successful TX8 Payload Receipt to be sent when requested; MAY cause successful TX8 Payload Receipt to be sent when not requested. |
| Receiver Actor | Payload Rejection | SHALL cause failed TX8 Payload Rejection to be sent when a defined processing failure requires Workflow Status, regardless of whether successful receipt reporting was requested. |

## 6.1 TX8 Outcome Routing

TX8 for TX1 SHALL correlate to the originating TX1 Transaction Instance and applicable Context Instance(s). Successful processing is represented by Task.status=completed with required Provenance activity Payload Receipt. A reportable rejection is represented by Task.status=failed with required Provenance activity Payload Rejection and the applicable failure reason. The same reportable outcome SHALL be sent to each unique Workflow Status Update Endpoint accumulated for the TX1 Transaction Instance.

## 6.2 Actor and Provenance Clarification

Clinical Content Author/Source, Workflow Requester / Information Source, SubmissionSet Source, Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

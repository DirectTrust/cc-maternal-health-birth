# TX1: send-outpatient-visit-notification

**<span class="smallcaps">Reusable Transaction Definition</span>**

## Transaction Overview — WHY

The following provisions describe transaction overview.

### Purpose and Scope

send-outpatient-visit-notification conveys completion of an outpatient maternal-health encounter in both human-readable and machine-processable form. The machine-processable Payload is an HL7 Version 2 outpatient visit notification. In the Mimi Shell examples, an ADT^A03 is used for the completed outpatient visit and LOINC 98145-6 identifies the outpatient visit notification.

### Transaction Identity

SubmissionSet.purpose SHALL carry the DTCodeSystem code send-outpatient-visit-notification independently of the presence of a Workflow Activity Task. When a Task is included, Task.code SHALL match SubmissionSet.purpose in code and code system, and Task.code.text SHALL make the approved Task Action Precept explicit: “Process the information in the Payload in the intended workflow.” The canonical transaction code is send-outpatient-visit-notification; TX1 is a local editorial label and is not the interoperable transaction identifier.

### Framework Relationship

This Transaction Definition specializes the common MAP Transaction Framework in Chapter 3. Common requirements apply together with the TX1-specific requirements in this definition.

The transaction can be sent directly by an Information Source or by an Intermediary acting as the Sender Actor for a message-processing leg. The use of an Intermediary does not change the Information Source.

Clinical Content Author/Source, Workflow Requester / Information Source, SubmissionSet Source, Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

## Message and Payload Requirements — WHAT

The following provisions describe message and payload requirements.

### Payload Packaging Structure

TX1 SHALL apply the common MIME packaging and human-readable content preservation requirements in Chapter 3 Section 3.8.4. The Structured Payload Package SHALL contain copies of every human-readable file supplied in MIME Part 1, as required by that section. The following tables distinguish the message-level packaging from the contents of the accompanying Structured Data Package.

The Structured Payload Package SHALL contain zero or one Workflow Activity Task, exactly one primary HL7 Version 2 notification, identical copies of the required human-readable text/plain communication and every supplied text/html alternative, and optional Provenance describing the included objects or activity. Secondary clinical documents and other supplemental Payload objects SHALL NOT be included. Clinical documents SHALL be sent separately using TX5 send-documents. FHIR resources needed solely to represent metadata and referenced actors or patient information are supporting resources, not additional submitted Payload objects.

Apply Chapter 3 Sections 3.7.5–3.7.6 and Appendix D for package completeness. All required payload and supporting references SHALL resolve within the transmitted Structured Payload Package. Review reports and inspection views outside that package do not supply required transmitted resources. Supporting patient, actor and endpoint resources do not acquire additional DocumentEntries merely because they support a reference.

For XD, when a Task is included, its supporting resources SHALL be contained in the Task with local fragment references. Provenance assertions and their agents SHALL reside in their own Provenance Collection Bundle. Do not reference another object’s contained resources or use nested containment. For FHIR metadata, any Task support remains in the outer Collection Bundle; Provenance bundle entries remain inside their carrying bundle. Apply Chapter 3 and Appendix D for carried targets, security labels, and serialization.

#### Message-Level Payload Packaging Structure

The Direct message uses the common outer multipart/mixed structure. MIME Part 1 is multipart/alternative with exactly one text/plain file and optional text/html alternatives. MIME Part 2 is the accompanying Structured Data Package.

| **Message MIME part** | **Conf.** | **Package object**                      | **Content MIME type** |
|-----------------------|-----------|-----------------------------------------|-----------------------|
| MIME Part 1           | R         | Human-readable healthcare communication | text/plain            |
| MIME Part 1           | O         | Human-readable alternative(s)           | text/html             |
| MIME Part 2           | R         | Structured Data Package                 | application/zip       |

#### Structured Data Package Contents

The Structured Data Package accompanies the TX1 notification. Its metadata identifies the included information objects and represents the SubmissionSet and DocumentEntries using the selected XD or FHIR metadata option. SubmissionSet business identity and purpose are required independently of an optional Workflow Activity Task.

| **Conf.** | **Package object**                          | **Content MIME type / representation**        | **Requirement**                                                                                                                                                         |
|-----------|---------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R         | XDM/FHIR SubmissionSet/List                 | Selected metadata representation              | Package-level metadata; apply the common Chapter 3 representation requirements.                                                                                         |
| R         | XDM/FHIR DocumentEntries/DocumentReferences | Selected metadata representation              | Metadata describing the included information objects.                                                                                                                   |
| O         | Workflow Activity Task Resource             | application/fhir+xml or application/fhir+json | Zero or one Workflow Activity Task. When included, apply Section 2.2 and Chapter 3; absent Task has no DocumentEntry.                                                   |
| R         | HL7 Version 2 Outpatient Visit Notification | text/hl7v2                                    | Primary information object for TX1. Exactly one primary notification is permitted; secondary clinical documents and supplemental Payload objects SHALL NOT be included. |
| O         | Provenance Collection Bundle                | application/fhir+xml or application/fhir+json | When included, use the representation selected for the package. Describes the included objects or activity; it does not authorize additional clinical documents.        |
| R         | Human-readable healthcare communication     | text/plain                                    | Identical copy of the text/plain file included in MIME Part 1; content coverage is specified in Section 2.3.                                                            |
| C         | Human-readable alternative(s)               | text/html                                     | Required when HTML is supplied in MIME Part 1. Include identical copies of every supplied HTML alternative; HTML remains optional at message level.                     |

### Workflow Activity Task

TX1 MAY include one FHIR Workflow Activity Task (0..1) as a separate Workflow Activity DocumentEntry. When present, the Task expresses the action the Information Recipient is asked to perform and carries applicable workflow instructions under Chapter 3. The TX1 receiver SHALL process a conformant notification without requiring an optional Task. TX1 support alone does not imply TX8 Sender or Receiver capability.

| **Task concept**                           | **TX1 requirement**                                                                                                                                                                               |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                                  | C (when Task present). DTCodeSystem send-outpatient-visit-notification; matches SubmissionSet.purpose in code and code system.                                                                    |
| Task action precept                        | C (when Task present). Process the information in the Payload in the intended workflow.                                                                                                           |
| Task.identifier / SubmissionSet.uniqueId   | C (when Task present). Task.identifier matches the independently required SubmissionSet business identifier.                                                                                      |
| Task.for                                   | C (when Task present). Patient identity consistent with the SubmissionSet and HL7 v2 Payload.                                                                                                     |
| Context                                    | C (when Task present). Carry/correlate the Perinatal Context Instance and any other Context Instance required by the transaction.                                                                 |
| Whole-payload acceptance reporting request | C (when Task present and applicable). Reporting obligation is conditional under Chapter 3 and applicable workflow requirements.                                                                   |
| Workflow Status Update Endpoint            | C (when Task present and reporting applicable). Use Task-carried eligible endpoints. Without Task, only the Directory-CapabilityStatement-qualified MDN address is eligible when TX8 is required. |

#### Workflow Activity Identification

An intermediary updating package membership or Provenance SHALL preserve the SubmissionSet.uniqueId/List business identifier. When a Workflow Activity Task is present, its designated Task.identifier SHALL remain aligned with that SubmissionSet identifier. Updated representations receive new entryUUID/List.id and, when present, Task.id values; affected membership and references are updated without changing the logical originating Transaction Instance.

SubmissionSet.uniqueId identifies the originating TX1 Transaction Instance independently of Task presence. When a Workflow Activity Task is included, its designated Task.identifier SHALL identify the same logical Transaction Instance. Task.code SHALL match SubmissionSet.purpose in code and code system.

#### Context Instance Association

TX1 SHALL preserve and correlate applicable Context Instance identifiers. For the Mimi Shell pregnancy and postpartum journey, the Perinatal Context Instance spans prenatal care, labor/delivery, and postpartum care through clinical closure. Delivery does not create a new maternal postpartum Context Instance.

HL7 V2 source mapping and status. Distinguish the visit/encounter identifier in PV1-19 from an established episode identifier. HL7 V2.8 defines PV1-54 Service Episode Identifier and PV1-53 Service Episode Description; those fields are absent from the V2.5.1 base used by the current samples. PV1-54 is a candidate for the message patient’s service episode, not an adopted mapping for the related mother’s Perinatal Context in a newborn A01. No PV2 field is selected by this definition as a generic Context Instance identifier.

Illustrative provisional mapping. An illustrative provisional V2.5.1 mapping carries PERICTXID in an OBX with value type EI: OBX-5.1 is the identifier value, OBX-5.2 the namespace label, OBX-5.3 the universal assigning-authority identifier, and OBX-5.4 the universal identifier type. A separate PERICTXTYPE OBX with value type CWE carries the Context type code in OBX-5.1, its display in OBX-5.2 and its source coding-system designation in OBX-5.3. These locally named observations are provisional illustrative mappings; their use is not a claim that base HL7 defines these observation identifiers. Preserve the source coding-system designation and separately identify the established DTContextTypeCodeCS binding; do not silently replace a source L designation.

Source implementation mapping. The selected V2 version, source location, value type, assigning authority, Context type coding and subject association SHALL be documented by the implementation. A source rendering SHALL distinguish message-carried context from context supplied only by the Task, package metadata or an authorized lookup. It SHALL NOT make a missing source context appear to have been present in the original V2 message.

#### Transaction Correlation

The originating transaction concludes when the authorized Receiver Actor accepts or rejects the whole structured payload into its intended workflow. TX8 is a separate subsequent transaction reporting that disposition when required. The originating SubmissionSet business identifier provides correlation independently of Task presence; a TX8 report carries its own required reporting Task and identification snapshot of the originating SubmissionSet.

The Content Consumer SHALL gather and maintain supplied Context Instance Identifiers with their values, assigning authorities, types, and subject associations. It SHALL preserve relevant identifiers in later exchanges concerning those contexts. Visit, perinatal, referral, order, request, and other contexts may continue beyond the individual transaction; a later exchange has its own transaction identity.

TX1 SHALL apply the common transaction correlation requirements in Chapter 3. A responding TX8 SHALL identify the originating TX1 Transaction Instance by its SubmissionSet business identifier and applicable Context Instance(s), whether or not TX1 included a Task.

#### Workflow Status Instructions

When an originating Workflow Activity Task is included, it MAY carry applicable Workflow Status Update Endpoints and whole-payload reporting instructions. When the Task is absent, no Task-based endpoints or instructions SHALL be presumed. The applicable Transaction Definition, workflow instructions, and exchange agreement determine when TX8 reporting is required, subject to Chapter 3 processing-failure requirements.

When TX8 reporting is required, the actor determining the reportable processing outcome SHALL apply Chapter 3 routing and capability requirements. With an originating Task, use applicable Task-carried Workflow Status Update Endpoints and preserve/deduplicate eligible destinations. Without an originating Task, the sole eligible fallback is the Direct address established for Message Delivery Notifications, and only if its Directory-discoverable CapabilityStatement declares TX8 Receiver support. If no eligible destination can be resolved, record the unsuccessful reporting obligation and do not dispatch TX8; this does not itself alter the TX1 processing outcome.

When required, TX8 for TX1 SHALL correlate to the originating TX1 SubmissionSet business identifier and applicable Context Instance(s). TX8 reports the whole-package acceptance or rejection outcome using its own required reporting Task and outcome Provenance Collection Bundle, according to the TX8 Transaction Definition. Absence of a TX8 report SHALL NOT itself be interpreted as acceptance, rejection, or non-receipt.

When a Workflow Activity Task is included and TX8 reporting instructions apply, the Content Creator MAY select eligible Workflow Status Update Endpoints using authorized configuration and Directory-discoverable CapabilityStatements. A destination SHALL NOT be treated as TX8-capable solely on the basis of SERV_DESC. Without an originating Task, the Chapter 3 Directory-qualified MDN-address fallback applies only when TX8 reporting is required; do not invent a Task or additional endpoint.

### Human-Readable Content

The human-readable communication SHALL adequately describe the requested Workflow Activity and the information included in the Structured Payload Package. A reader SHALL be able to understand that this is a completed outpatient visit notification and what the Information Recipient is being asked to do without processing the HL7 Version 2 notification or FHIR Task. The following information SHALL be surfaced when present in the source notification or associated Workflow Activity Task; unavailable values SHALL NOT be invented.

The HTML, TXT and debug renderings SHALL distinguish the patient, visit/encounter, established episode and Transaction/Workflow Activity identifiers. For each supplied Context identifier, show its value, assigning namespace/authority, type code and readable type, whose Context it is, source location and mapping status. Where the source does not establish the type, authority or subject association, show that limitation rather than infer a value. The debug view SHALL identify the segment/field/component, OBX observation identifier and value type when applicable. A later-version field present in a V2.5.1 message SHALL be identified as an extension needing an agreed profile, not as a base V2.5.1 field.

| **Information to surface**               | **TX1 human-readable coverage**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Workflow Activity                        | Identify send-outpatient-visit-notification and state the requested action: process the notification in the intended workflow. Include the logical Workflow Activity Identifier and applicable Context identifiers, with readable labels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Patient and identifiers                  | Show the patient name, date of birth, administrative sex, patient identifiers and their assigning authorities, and available address/contact information needed to recognize or match the patient.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Notification and event                   | Identify the notification type, HL7 Version 2 message/event type, event or encounter-completion time, and encounter/visit identifier. Make clear that the event represents completion of an outpatient visit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Encounter and facility                   | Show the encounter start and completion times, outpatient setting, treating facility and encounter location, and responsible provider(s), when supplied.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Source and routing                       | Identify the responsible Information Source and intended Information Recipient. Distinguish the treating facility/provider from an Intermediary or transport sender when they differ.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Workflow Status instructions             | When TX8 reporting is applicable, describe the reporting expectation and eligible destinations. With Task, use applicable Task instructions; without Task, only the Directory-CapabilityStatement-qualified MDN Direct-address fallback may be used.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Included Payload objects                 | Identify the primary HL7 Version 2 notification and any optional Workflow Activity Task, plus the required human-readable copies and permitted Provenance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Included Provenance                      | When Provenance is included, the communication SHOULD summarize the represented activity, responsible actor/organization, activity time, and affected Payload object or transaction. Preserve the distinction between clinical authorship, package creation, transmission, and processing.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Context identity and source transparency | The HTML, TXT and debug renderings SHALL distinguish the patient, visit/encounter, established episode and Transaction/Workflow Activity identifiers. For each supplied Context identifier, show its value, assigning namespace/authority, type code and readable type, whose Context it is, source location and mapping status. Where the source does not establish the type, authority or subject association, show that limitation rather than infer a value. The debug view SHALL identify the segment/field/component, OBX observation identifier and value type when applicable. A later-version field present in a V2.5.1 message SHALL be identified as an extension needing an agreed profile, not as a base V2.5.1 field. |

### Provenance Requirements

Initiating Provenance is OPTIONAL. When supplied, each independently attributable Provenance information object SHALL be a FHIR Collection Bundle containing its assertions and required supporting agents, classified DT-20261011-1, Provenance Information, from DTTemporaryCodeCS. Apply Chapter 3 Section 3.10 and Appendix D for activities, participation types, targets, and resolution. No additional initiating assertion is required by this definition. The subsequent TX8 SHALL carry whole-package accept or reject Provenance, with coded performer identifying the receiving Organization responsible for the disposition.

### Direct Message and Transport Requirements

TX1 SHALL apply the common MAP Message and Transport Framework and common cc-maternal-health-birth MAP message metadata requirements defined in Chapter 3 without modification. This Transaction Definition states only TX1-specific transport or metadata requirements.

TX1 SHALL apply the common Direct Message Delivery Notification and conditional TX8 Workflow Status requirements defined in Chapter 3. Support for TX1 alone does not mandate TX8 capability.

## XD Metadata Guidance — HOW

XD is the fully specified representation of Payload Metadata for TX1. The following transaction-specific requirements supplement the common Chapter 3 framework.

TX1 applies the Chapter 3 canonical metadata model: SubmissionSet.purpose identifies send-outpatient-visit-notification independently of an optional Task; SubmissionSet.contentTypeCode is the typeCode of the principal notification DocumentEntry. When Task is present, Task.code matches SubmissionSet.purpose in code and code system.

### SubmissionSet

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the contributing Organization identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

| **Metadata element** | **TX1 value / source**                                                                                                                                                                                                        | **Requirement**                                                                                                                                                |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| uniqueId             | System-assigned                                                                                                                                                                                                               | R. Identifies the originating TX1 Transaction Instance independently of Task; when Task present, designated Task.identifier matches.                           |
| patientId            | Patient identifier known by the Information Source to be appropriate to the Information Recipient or mutually agreed exchange patient-identifier domain                                                                       | C. Populate only when known. SHALL NOT be populated with the Information Source local identifier merely because no recipient-known identifier is available.    |
| Patient Info         | Promoted from the established DocumentEntry.sourcePatientInfo representation: PID-3 Patient Identifier List, PID-5 Patient Name, PID-7 Date/Time of Birth, PID-8 Administrative Sex, and PID-11 Patient Address, as available | R for TX1. TX1 is a single-patient SubmissionSet. Include even when patientId is known so the Content Consumer can independently match or confirm the patient. |
| purpose              | send-outpatient-visit-notification                                                                                                                                                                                            | R. Required independently of Task; when Task present, Task.code matches in code and code system.                                                               |
| contentTypeCode      | 98145-6 Outpatient Visit notification                                                                                                                                                                                         | RE/R2; aligns with the typeCode of the principal HL7 v2 notification DocumentEntry.                                                                            |
| referenceIdList      | Perinatal Context and other applicable Context Instances                                                                                                                                                                      | O/RE as applicable.                                                                                                                                            |
| sourceId             | Established Organization Identity OID of the Information Source contributing this SubmissionSet                                                                                                                               | R. Identifies the source of the current TX1 SubmissionSet.                                                                                                     |

#### Patient Identity and Matching

TX1 deliberately separates the patient identifier known to the Information Source from a patient identifier known to be appropriate to the Information Recipient. The sender-known identifier belongs in DocumentEntry.sourcePatientId. It SHALL NOT be copied into SubmissionSet.patientId or DocumentEntry.patientId merely to populate those fields.

SubmissionSet Patient Info is a MAP extension that promotes the established DocumentEntry.sourcePatientInfo demographic representation to package level. For TX1 it is required even when patientId is known. This allows the Content Consumer to attempt a patient match when patientId is unavailable and to independently check a supplied patientId for a higher-confidence match.

Packaging software MAY populate SubmissionSet.patientId and applicable DocumentEntry.patientId when an intermediary or other authoritative process has resolved an identifier appropriate to the Information Recipient or mutually agreed exchange domain. That packaging-time fact SHALL NOT require alteration of the source HL7 v2 notification. The source clinical object remains the source record; the XD metadata records facts known at transaction packaging time.

### Workflow Activity Task DocumentEntry

When included, the Workflow Activity Task DocumentEntry SHALL carry the single FHIR Task specified in Section 2.2. No Task DocumentEntry is included when Task is absent. Common DocumentEntry metadata requirements apply as defined in Chapter 3.

### Primary DocumentEntry

For HL7 V2 notifications, DocumentEntry.creationTime SHALL use MSH-7 message creation time. serviceStartTime and serviceStopTime SHALL use source-supported PV1-44 and PV1-45, respectively. EVN-2 SHALL be identified as event recorded time; EVN-6, when supplied, SHALL be identified as actual event occurrence time. Missing EVN-6 SHALL remain unavailable, and disagreements with visit boundaries SHALL be surfaced without silent substitution. Preserve source precision and timezone meaning. Event occurrence has no separate standard DocumentEntry timestamp field; do not misuse eventCodeList as a timestamp.

The Primary DocumentEntry is the HL7 Version 2 Outpatient Visit Notification.

| **Metadata element**       | **TX1 value / source**                                                                                                        | **Requirement**                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| mimeType                   | text/hl7v2                                                                                                                    | R.                                                                                        |
| classCode                  | 86530-3 Hospital notification                                                                                                 | RE/R2; classifies the principal information object as a notification.                     |
| typeCode                   | 98145-6 Outpatient Visit notification                                                                                         | RE/R2; specific notification type and source for SubmissionSet.contentTypeCode.           |
| patientId                  | Patient identifier known to be appropriate to the Information Recipient or mutually agreed exchange patient-identifier domain | C. Populate only when known; do not substitute the sender-local identifier.               |
| sourcePatientId            | From the source HL7 v2 patient identifier(s), preserving assigning authority                                                  | RE/R2. Represents the patient identifier assigned/used by the Information Source.         |
| creationTime               | MSH-7 notification/message creation time                                                                                      | Preserve notification creation separately from event occurrence and visit boundaries.     |
| serviceStartTime           | Encounter start when known                                                                                                    | O.                                                                                        |
| serviceStopTime            | Encounter completion time                                                                                                     | O.                                                                                        |
| sourceId                   | SubmissionSet Source Organization Identity OID                                                                                | R.                                                                                        |
| authorRole                 | Care Team Member Function from patient/encounter-specific source context                                                      | RE/R2 when known; may repeat.                                                             |
| authorSpecialty            | US Core Practitioner Role Specialty Codes semantics; applicable SNOMED CT specialty and/or NUCC Provider Taxonomy             | RE/R2 when known; may repeat.                                                             |
| practiceSettingCode        | Canonical practice-setting code derived from the clinical setting/source or authoritative facility reference                  | RE/R2 when known.                                                                         |
| healthcareFacilityTypeCode | Canonical healthcare-facility-type code derived from the encounter location or authoritative facility reference               | RE/R2 when known.                                                                         |
| sourcePatientInfo          | From the source HL7 v2 patient demographics using established XD sourcePatientInfo representation                             | RE/R2. Patient matching/checking information associated with the source patient identity. |

### Provenance DocumentEntry(s)

Apply the common Chapter 3 metadata requirements to any Provenance DocumentEntry included in the TX1 package. TX1 adds no further Provenance DocumentEntry metadata constraints.

### Human-Readable DocumentEntry

The packaged human-readable content SHALL meet Section 2.3 and the common Chapter 3 preservation and metadata requirements. The required text/plain representation and optional text/html alternative are identified in Section 2.1.

### Secondary Data DocumentEntry(s)

Intentionally blank. Secondary information objects are not permitted in TX1.

## FHIR Metadata Guidance — HOW

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance using the common XD-to-FHIR mapping. This is an alternative representation of the same Payload Metadata, not a different metadata model.

### SubmissionSet Representation

Apply the common XD-to-FHIR mapping to the TX1 SubmissionSet requirements in Section 3.1. The current SubmissionSet List SHALL conform to the MAP SubmissionSet List profile and carry the required map-submission-purpose extension identifying send-outpatient-visit-notification, independently of optional Task presence.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the current contributing Organization. dt-intendedRecipient identifies the same intended party as the Task recipient; a transport Endpoint SHALL NOT replace that party’s identity.

### Workflow Activity Task

When a Workflow Activity Task is included, apply Section 2.2 and Chapter 3 to its identification, Context, correlation and applicable Workflow Status instructions. No Task resource is required when the originating TX1 package omits it.

### Primary Payload Representation

Apply the common XD-to-FHIR mapping to the principal HL7 Version 2 notification metadata in Section 3.3; preserve the source notification as the Primary Payload.

### Provenance Collection Bundle(s)

Apply Chapter 3.10 and Appendix D to each supplied Provenance Collection Bundle. Preserve assertions, coded activities, participation types, agents and logical targets. Its entries remain inside that carrying bundle; they are not automatically outer Bundle peers.

### Human-Readable Content

Preserve the same human-readable content and coverage specified in Sections 2.1 and 2.3 using the common FHIR metadata representation.

### Secondary Data Resource(s)

Intentionally blank. Secondary information objects are not permitted in TX1.

## Context IG Guidance

Intentionally blank.

## Technical Actor Functional Requirements — WHO DOES WHAT

The following provisions describe technical actor functional requirements.

### Sender Actor

The Sender Actor combines Content Creator and Message Sender functions. It creates and preserves the information objects, metadata, Context identifiers and applicable Provenance, then packages and transmits the message.

| **Actor**       | **Requirement category** | **Normative requirement**                                                                                                                                                                                                   |
|-----------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Creator | Notification creation    | SHALL create the human-readable communication and machine-processable outpatient HL7 Version 2 notification required by TX1.                                                                                                |
| Content Creator | Workflow Activity Task   | MAY create one TX1 Workflow Activity Task. When included, SHALL conform to Chapter 3 and carry applicable workflow-status instructions; Task absence SHALL NOT prevent processing an otherwise conformant TX1 notification. |

| **Actor**      | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                         |
|----------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Sender | Transmission             | SHALL package and transmit the Direct message using the metadata and XDM constraints defined here and in Chapter 3.                                                                                                                                               |
| Message Sender | Endpoint preservation    | When Task is present, SHALL preserve applicable Task-carried Workflow Status Update Endpoints and may add eligible endpoints as permitted by Chapter 3. Without Task, SHALL not invent endpoints; use Directory-qualified MDN fallback only when TX8 is required. |

### Receiver Actor

The Receiver Actor combines Message Receiver and Content Consumer functions. It validates receipt, resolves required patient and Context associations, determines whole-package disposition, and causes TX8 reporting only when required under Chapter 3 and applicable workflow obligations. It SHALL not infer TX8 support from TX1 support alone.

| **Actor**        | **Requirement category** | **Normative requirement**                                                                                          |
|------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------|
| Message Receiver | Receipt                  | SHALL receive and validate the Direct message and make the Payload and metadata available to the Content Consumer. |

| **Actor**        | **Requirement category**     | **Normative requirement**                                                                                                                                                                                                         |
|------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer | Processing                   | SHALL resolve the patient under the receiving endpoint’s declared policy, resolve required Visit/Context associations, and accept the notification into the supported workflow before determining acceptance.                     |
| Receiver Actor   | Whole-payload acceptance     | SHALL, when TX8 reporting is required, cause successful TX8 structured payload acceptance to be sent when required; MAY cause successful TX8 structured payload acceptance to be sent when not requested.                         |
| Receiver Actor   | structured payload rejection | SHALL, when TX8 reporting is required, cause failed TX8 structured payload rejection to be sent when a defined processing failure requires TX8 under Chapter 3, regardless of whether successful receipt reporting was requested. |

## Transaction-Specific Processing — WHAT IS SPECIAL

Acceptance requires resolving the patient under the receiving endpoint’s declared policy and accepting the notification into the supported workflow. Any required Visit, encounter, or other Context association SHALL also be resolved. A receiver MAY establish the visit association from authoritative notification information under its policy; it need not already exist locally.

The common processing anomaly handling and conditional Workflow Status reporting requirements in Chapter 3 Section 3.9 and the TX8 send-workflow-status Transaction Definition SHALL apply to TX1. No additional TX1-specific anomaly requirements are imposed. When a required TX8 cannot be dispatched because no eligible endpoint exists, record that reporting failure separately from the originating TX1 outcome.

When a received transaction results in a defined terminal failure requiring TX8, apply the Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason) specified in Chapter 3 Section 3.9.2. Use a shared applicable code with an explanation; optional missing information does not alone establish rejection. Local filtering or preparation failures before this transaction is issued SHALL NOT be reported as rejection of a nonexistent transaction.

## Relevant Examples — SHOW ME

The following examples illustrate the same send-outpatient-visit-notification Shared Activity using XD and FHIR metadata. Both describe Mimi Elena Shell’s initial prenatal outpatient visit on March 20, 2026, at Health Services of North Texas. These standalone illustrations explain the requirements; Chapter 3 and this Transaction Definition remain authoritative.

### TX1 — XD Metadata

Illustrative XD packaging: an outpatient ADT^A03^ADT_A03 completion notification is the primary DocumentEntry. Include required metadata, preserved human-readable TXT/optional HTML, and permitted Provenance under Chapter 3. An initiating Workflow Activity Task is optional; when included, represent it as a separate DocumentEntry and apply its correlation and routing requirements.

This illustration shows the relationship among the requested workflow activity, primary notification, human-readable communication, and package/object metadata. Optional inspection views are separate from the normative transmitted XD metadata.

### TX1 — FHIR Metadata

Illustrative FHIR packaging: an outpatient ADT^A03^ADT_A03 completion notification is the primary DocumentReference. Include the current MAP SubmissionSet List profile with its required Purpose extension, preserved human-readable TXT/optional HTML, and permitted Provenance. The originating Workflow Activity Task is optional; when included, its code and identifier align with the SubmissionSet.

The FHIR illustration preserves the XD transaction semantics and information requirements. Interpret identifiers within their Transaction Instance and Context; independently constructed illustrations need not share generated identifiers.

TX8 Section 8 illustrates structured payload acceptance and structured payload rejection as alternative terminal outcomes, not consecutive workflow steps.

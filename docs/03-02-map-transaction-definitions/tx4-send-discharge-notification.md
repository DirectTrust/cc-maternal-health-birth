# TX4: send-discharge-notification

**<span class="smallcaps">Reusable Transaction Definition</span>**

## Transaction Overview — WHY

The following provisions describe transaction overview.

### Purpose and Scope

send-discharge-notification conveys a hospital or emergency department discharge notification in human-readable and machine-processable form. The primary information object is an HL7 Version 2 discharge/end-visit notification, normally ADT^A03. The human-readable communication identifies the patient, encounter and discharge event and explains the requested processing.

The transaction supports the following discharge events:

> • hospital discharge; and
>
> • emergency department discharge.

TX4 applies independently to the patient discharged. Maternal and newborn discharges are separate patient events, each with its own notification, Workflow Activity Task and Transaction Instance. TX4 does not require a specialized maternal document creation activity.

The Payload and Payload Metadata may be represented using XD or FHIR packaging as supported by the receiving endpoint. The representation changes how the same Payload Metadata is encoded; it does not create a different transaction.

### Transaction Identity

The canonical transaction code is send-discharge-notification. TX4 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

### Framework Relationship

This Transaction Definition specializes the common Transaction Framework defined in Chapter 3, including the terminology bindings in Section 3.7.7. Common transport, Workflow Activity Task, Workflow Status, patient identity, Context/correlation, Provenance and message-metadata requirements apply together with the TX4-specific requirements below.

Clinical Content Author/Source, Workflow Requester / Information Source (Task.requester), SubmissionSet Source (SubmissionSet.sourceId), Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

## Message and Payload Requirements — WHAT

The following provisions describe message and payload requirements.

### Payload Packaging Structure

The TX4 Payload SHALL include exactly one machine-processable HL7 Version 2 discharge notification and a human-readable healthcare communication conveying the essential discharge information. HTML alternatives MAY also be supplied. The Structured Payload Package SHALL contain zero or one Workflow Activity Task, exactly one primary HL7 Version 2 notification, identical copies of the required human-readable text/plain communication and every supplied text/html alternative, and optional Provenance describing the included objects or activity. Secondary clinical documents and other supplemental Payload objects SHALL NOT be included. Clinical documents SHALL be sent separately using TX5 send-documents. FHIR resources needed solely to represent metadata and referenced actors or patient information are supporting resources, not additional submitted Payload objects.

Apply the common MIME packaging and human-readable content preservation requirements in Chapter 3 Section 3.8.4. The following tables identify the message-level components and the information objects required for TX4. Detailed common transport and ZIP MIME requirements are governed by Chapter 3.

Apply Chapter 3 Sections 3.7.5–3.7.6 and Appendix D for package completeness. All required payload and supporting references SHALL resolve within the transmitted Structured Payload Package. Review reports and inspection views outside that package do not supply required transmitted resources. Supporting patient, actor and endpoint resources do not acquire additional DocumentEntries merely because they support a reference.

For XD, Task supporting resources SHALL be contained in the Task with local fragment references. Provenance assertions and their agents SHALL reside in their own Provenance Collection Bundle. Do not reference another object’s contained resources or use nested containment. For FHIR metadata, Task support remains in the outer Collection Bundle; Provenance bundle entries remain inside their carrying bundle. Apply Chapter 3 and Appendix D for carried targets, security labels, and serialization.

#### Message-Level Payload Packaging Structure

| **Message MIME-part** | **Conf.** | **Package object**                                      | **Content MIME type** |
|-----------------------|-----------|---------------------------------------------------------|-----------------------|
| MIME Part 1           | R         | Human-readable healthcare communication                 | text/plain            |
| MIME Part 1           | O         | Human-readable alternative(s)                           | text/html             |
| MIME Part 2           | R         | Structured Payload Package — XD or FHIR metadata option | application/zip       |

#### Structured Data Package Contents

| **Conf.** | **Package object**                          | **Content MIME type / representation**        | **Requirement**                                                                                                                                                                                                                  |
|-----------|---------------------------------------------|-----------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R         | XDM/FHIR SubmissionSet/List                 | Selected metadata representation              | Package-level metadata; apply Chapter 3.                                                                                                                                                                                         |
| R         | XDM/FHIR DocumentEntries/DocumentReferences | Selected metadata representation              | Metadata describing the included information objects.                                                                                                                                                                            |
| O         | Workflow Activity Task Resource             | application/fhir+xml or application/fhir+json | Zero or one Workflow Activity Task; when included apply Section 2.2 and Chapter 3. No Task object is included when absent.                                                                                                       |
| R         | HL7 Version 2 Discharge Notification        | text/hl7v2                                    | Primary information object for TX4; classify the specific event as specified in Section 7.1. Exactly one primary notification is permitted; secondary clinical documents and supplemental Payload objects SHALL NOT be included. |
| O         | Provenance Collection Bundle                | application/fhir+xml or application/fhir+json | When included, use the representation selected for the package. Describes the included objects or activity; it does not authorize additional clinical documents.                                                                 |
| R         | Human-readable healthcare communication     | text/plain                                    | Identical copy of the MIME Part 1 text/plain file; content coverage is specified in Section 2.3.                                                                                                                                 |
| C         | Human-readable alternative(s)               | text/html                                     | Include identical copies of every HTML alternative supplied in MIME Part 1; HTML remains optional at message level.                                                                                                              |

### Workflow Activity Task

Workflow Activity Task coding. In an initiating send-discharge-notification exchange, Task.code SHALL carry the DTCodeSystem code send-discharge-notification. Interpreted with the Task’s Use Case, this code selects this transaction specification; the Information Recipient functional requirements defined for this transaction are the requested processing activity. Task.code.text SHALL make the Task Action Precept explicit: “Process the information in the Payload in the intended workflow.”

A TX4 Structured Payload Package MAY contain one Workflow Activity Task (0..1), in addition to its required primary HL7 Version 2 discharge notification. When present, the Task SHALL conform to Chapter 3 and this Transaction Definition and requests processing of the discharge notification. A receiving endpoint supporting TX4 MAY process an otherwise conformant TX4 package without implementing optional Workflow Activity Task processing. Task absence does not change the transaction identity or discharge-event requirements. TX4 support alone does not imply TX8 support. TX8 carries its own required reporting Task and a separate originating-package identification snapshot.

| **Task concept**                           | **TX4 requirement**                                                                                                                                                                                           |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                                  | C (when Task present). DTCodeSystem send-discharge-notification; same code and code system as SubmissionSet.purpose.                                                                                          |
| Task action precept                        | C (when Task present). Process the information in the Payload in the intended workflow.                                                                                                                       |
| Task identifier / SubmissionSet.uniqueId   | C (when Task present). Designated Task.identifier aligns with SubmissionSet.uniqueId; SubmissionSet identity exists independently.                                                                            |
| Task.for                                   | RE as applicable. Patient identity consistent with the notification and package; do not invent an identifier.                                                                                                 |
| Context                                    | Applicable established Context identifiers, with value, namespace/assigning authority, type and subject association. Preserve the patient’s identity; discharge does not itself close the Perinatal Context.  |
| Whole-payload acceptance reporting request | C (when Task present and applicable). Follow Chapter 3 conditional TX8 reporting instructions; TX4 support alone does not mandate TX8.                                                                        |
| Workflow Status Update Endpoint(s)         | C (when Task present and TX8 applicable). Preserve eligible Task-carried destinations. Without Task, use only Directory-CapabilityStatement-qualified MDN Direct-address fallback when reporting is required. |

#### Workflow Activity Identification

An intermediary updating package membership or Provenance SHALL preserve the SubmissionSet.uniqueId/List business identifier. When an originating Workflow Activity Task is present, its designated Task.identifier SHALL remain aligned with the SubmissionSet business identifier. Updated representations receive new entryUUID/List.id and, when present, Task.id values; update membership and affected references without creating a new logical Transaction Instance.

SubmissionSet.uniqueId identifies the logical TX4 transaction independently of Task presence. SubmissionSet.purpose SHALL identify send-discharge-notification using the DTCodeSystem. When a Workflow Activity Task is present, its designated Task.identifier SHALL align with the SubmissionSet business identifier and Task.code SHALL match SubmissionSet.purpose in both code and code system. The specific discharge event classification SHALL NOT replace the transaction code.

#### Context Instance Association

TX4 SHALL apply the common Context and correlation rules defined by Chapter 3. Applicable established Context Instance identifiers SHOULD be carried in Payload Metadata when known and authorized. A maternal discharge may be associated with the established Perinatal Context Instance and applicable Visit Context Instance.

Discharge ends the encounter represented by the notification. It SHALL NOT, by itself, be interpreted as closure of the patient’s Perinatal Context Instance. Preserve the established identifier and type through postpartum care until authoritative clinical closure; do not generate a replacement Perinatal identifier merely because the patient has been discharged.

HL7 V2 source mapping and status. Distinguish the visit/encounter identifier in PV1-19 from an established episode identifier. PV1-54 Service Episode Identifier and PV1-53 Service Episode Description exist in later V2 versions but are absent from the V2.5.1 base used by the current samples. Any use of later-version fields in a V2.5.1 message needs an agreed extension profile. No PV2 field is selected here as a generic Context Instance identifier.

Illustrative provisional mapping. An illustrative provisional V2.5.1 mapping uses PERICTXID in an OBX with value type EI and PERICTXTYPE in an OBX with value type CWE. Preserve the identifier, assigning authority, source coding-system designation and Context type. These local observations are provisional illustrative mappings, not observation identifiers defined by base HL7. Apply the Chapter 3 DT Context Type ValueSet and identify the adopted source mapping explicitly.

Source implementation mapping. The selected V2 version, source location, value type, assigning authority, Context type coding and subject association SHALL be documented by the implementation. A source rendering SHALL distinguish message-carried context from context supplied only by the Task, package metadata or an authorized lookup. It SHALL NOT make a missing source context appear to have been present in the original V2 message.

#### Transaction Correlation

The originating transaction concludes when the authorized Receiver Actor accepts or rejects the whole structured payload into its intended workflow. TX8 is a separate subsequent transaction reporting that disposition. If no correlated TX8 arrives within the Chapter 3 reporting interval, the originating system SHALL close its tracking context as outcome unconfirmed and requiring follow-up. Timeout does not establish rejection, acceptance, or non-receipt. A late report resolves the original outcome while preserving timeout and follow-up history.

The Content Consumer SHALL gather and maintain supplied Context Instance Identifiers with their values, assigning authorities, types, and subject associations. It SHALL preserve relevant identifiers in later exchanges concerning those contexts. Visit, perinatal, referral, order, request, and other contexts may continue beyond the individual transaction; a later exchange has its own transaction identity.

Apply the common Chapter 3 transaction correlation requirements. A responding TX8 SHALL identify the originating TX4 Transaction Instance and applicable Context Instance(s). A related TX2 admission and this TX4 discharge have separate Transaction Instances; their encounter or Context identifiers may correlate the clinical events.

#### Workflow Status Instructions

When a Workflow Activity Task is present, it MAY carry applicable Workflow Status Update Endpoints, whole-payload acceptance reporting instructions, and correlation identifiers under Chapter 3. When Task is absent, use the Chapter 3 no-Task routing rules only if TX8 reporting is required. Disposition-Notification-To remains a transport-level address and is not by itself evidence of TX8 receiving capability.

When TX8 reporting is applicable, determine its obligation and eligible destinations under Chapter 3 and TX8. With an originating Task, preserve and accumulate applicable Task-carried endpoints, verifying destination TX8 Receiver capability. Without an originating Task, only the Direct address established for Message Delivery Notifications is eligible, and only when its Directory-discoverable CapabilityStatement declares TX8 Receiver support. If no eligible destination exists, record the unsuccessful reporting obligation without dispatching TX8; this does not itself alter the originating TX4 processing outcome.

When a Workflow Activity Task is present and TX8 reporting instructions apply, the Content Creator MAY select an initial Workflow Status Update Endpoint using Directory-discoverable CapabilityStatement information and authorized configuration, and SHALL preserve applicable Task-carried instructions. Task absence SHALL NOT cause an endpoint to be invented or a Task to be reconstructed. SERV_DESC does not independently establish TX8 support.

### Human-Readable Content

The human-readable communication SHALL adequately describe the requested Workflow Activity and included information. A reader SHALL understand the hospital or ED discharge and the processing requested without interpreting the HL7 Version 2 notification or FHIR Task. Surface the required information below when present in the source or associated Task; unavailable values SHALL NOT be invented.

The HTML, TXT and debug renderings SHALL distinguish the patient, visit/encounter, established episode and Transaction/Workflow Activity identifiers. For each supplied Context identifier, show its value, assigning namespace/authority, type code and readable type, whose Context it is, source location and mapping status. Where the source does not establish the type, authority or subject association, show that limitation rather than infer a value. The debug view SHALL identify the segment/field/component, OBX observation identifier and value type when applicable. A later-version field present in a V2.5.1 message SHALL be identified as an extension needing an agreed profile, not as a base V2.5.1 field.

Discharge timing and disposition. Show actual discharge date/time from PV1-45 when supplied, admission/start time from PV1-44 when supplied, and discharge disposition from PV1-36 with its source code and readable description when available. Surface discharge destination when provided by the source. Distinguish these facts from EVN event-recording/occurrence times and MSH message-generation time. Do not replace an unavailable discharge time with the transmission timestamp or label such a substitution as an observed discharge.

| **Information to surface**               | **TX4 human-readable coverage**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Workflow Activity                        | Identify send-discharge-notification and the requested processing action; include the logical Workflow Activity identifier and applicable Context identifiers with readable labels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Patient and identifiers                  | Show patient name, date of birth, administrative sex, identifiers and assigning authorities, and available address/contact information needed for recognition or matching. Maternal and newborn discharge notifications identify their respective patients separately.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Notification and event                   | State hospital or ED discharge; surface the V2 message/event type, actual discharge time, event-recording/occurrence time and notification/control identifier when supplied. Distinguish message-generation time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Encounter and facility                   | Show encounter/visit identifier, admission/start time and discharge time, patient class/setting, treating facility/location and available responsible providers. Include discharge disposition and destination when supplied.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Source and recipient                     | Identify the responsible Information Source and intended Information Recipient; distinguish clinical source, contributing organization, Intermediary, and transport sender when they differ.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Workflow Status instructions             | When applicable, identify conditional whole-payload acceptance reporting and eligible TX8 destinations. With Task use applicable Task instructions; without Task use only Directory-CapabilityStatement-qualified MDN fallback.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Included Payload objects                 | Identify the primary HL7 Version 2 discharge notification and any included Workflow Activity Task, as well as required human-readable copies.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Included Provenance                      | When included, SHOULD summarize activity, responsible actor/organization, activity time, and affected object or transaction. Distinguish clinical authorship, package creation, transmission, and processing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Context identity and source transparency | The HTML, TXT and debug renderings SHALL distinguish the patient, visit/encounter, established episode and Transaction/Workflow Activity identifiers. For each supplied Context identifier, show its value, assigning namespace/authority, type code and readable type, whose Context it is, source location and mapping status. Where the source does not establish the type, authority or subject association, show that limitation rather than infer a value. The debug view SHALL identify the segment/field/component, OBX observation identifier and value type when applicable. A later-version field present in a V2.5.1 message SHALL be identified as an extension needing an agreed profile, not as a base V2.5.1 field. |

### Provenance Requirements

Initiating Provenance is OPTIONAL. When supplied, each independently attributable Provenance information object SHALL be a FHIR Collection Bundle containing its assertions and required supporting agents, classified DT-20261011-1, Provenance Information, from DTTemporaryCodeCS. Apply Chapter 3 Section 3.10 and Appendix D for activities, participation types, targets, and resolution. No additional initiating assertion is required by this definition. The subsequent TX8 SHALL carry whole-package accept or reject Provenance, with coded performer identifying the receiving Organization responsible for the disposition.

### Direct Message and Transport Requirements

TX4 uses the common Direct message metadata defined by Chapter 3. SubmissionSet.purpose identifies the transaction independently of an optional Workflow Activity Task. Do not duplicate structured transaction identity or workflow-status instructions as invented Direct transport headers.

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through SMTP, an IMAP/mailbox arrangement, XDR, a custom API, or another supported receiving interface. A successful Final Destination Delivery Notification does not establish that the Payload was parsed, matched, routed, accepted, or delivered into its intended business workflow.

Apply the common Chapter 3 message header, selected metadata representation, XD edge Subject convention, MIME packaging, and Direct delivery-notification requirements without modification. The XD Subject convention SHALL NOT be used for the FHIR metadata option.

## XD Metadata Guidance — HOW

XD is the fully specified representation of Payload Metadata for this transaction. The requirements in this section define package-level and Payload-object metadata semantics and serve as the source requirements for alternative metadata representations.

### SubmissionSet

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the contributing Organization identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

| **Conf.** | **Metadata element** | **Value / source**                                                                                            | **TX4 guidance**                                                                                                                                                                                                                                       |
|-----------|----------------------|---------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R         | uniqueId             | System-assigned                                                                                               | Globally unique SubmissionSet identifier.                                                                                                                                                                                                              |
| R         | availabilityStatus   | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved                                                           | Fixed status.                                                                                                                                                                                                                                          |
| R         | submissionTime       | System-generated submission time                                                                              | No additional TX4 constraint.                                                                                                                                                                                                                          |
| R         | intendedRecipient    | Intended person or Organization and known telecom                                                             | Identify the intended person or Organization, including its known telecom. The current Routing Target may differ from this intended party; SMTP RCPT TO identifies the Routing Target.                                                                 |
| RE/R2     | patientId            | Patient identifier known to the intended recipient or mutually agreed exchange domain                         | Populate only when such an identifier is known. SHALL NOT copy a sender-local identifier merely because recipient patientId is unavailable.                                                                                                            |
| R         | Patient Info         | Patient demographics from the notification using DocumentEntry.sourcePatientInfo representation and semantics | Required for a single-patient SubmissionSet even when patientId is known; supports patient matching and confirmation.                                                                                                                                  |
| R         | author               | Initiating Organization, optionally its author person; preserve known telecom                                 | Identifies the Organization initiating the Shared Activity, optionally a person acting for it; distinct from the current contributor and transport sender.                                                                                             |
| R         | sourceId             | Established Organization Identity OID of the SubmissionSet Source                                             | Identifies the entity responsible for contributing the SubmissionSet. When Task.requester is also the SubmissionSet Source, reuse that organization’s established Organization Identity OID; otherwise identify the contributing source independently. |
| R         | purpose              | send-discharge-notification                                                                                   | Required DTCodeSystem send-discharge-notification independently of Task; when Task is present, its code SHALL match in code and code system.                                                                                                           |
| R         | contentTypeCode      | Type code of the primary discharge notification DocumentEntry                                                 | Hospital discharge: 79430-5; ED discharge: 98142-3. This identifies the event, not the transaction.                                                                                                                                                    |
| O         | title                | cc-maternal-health-birth:send-discharge-notification:\[display name for contentTypeCode\]                     | Use the display name associated with the selected event type.                                                                                                                                                                                          |
| O         | description          | Human-readable description of the notification                                                                | For HL7 V2, populate an equivalent concise description.                                                                                                                                                                                                |
| O         | referenceIdList      | Applicable established Context Instance identifiers                                                           | Preserve known patient-specific Perinatal/Visit Context identifiers with namespace and type. Discharge does not itself close the Perinatal Context.                                                                                                    |
| O         | limitedMetadata      | No fixed value specified                                                                                      | Use as defined by the base XD/XDM specification.                                                                                                                                                                                                       |
| R         | entryUUID            | System-assigned UUID                                                                                          | SubmissionSet registry object identifier.                                                                                                                                                                                                              |
| O         | slot/@name           | List of UUIDs for documents contained in the SubmissionSet                                                    | Populate when the selected packaging approach uses this extension.                                                                                                                                                                                     |

### Workflow Activity Task DocumentEntry

When a Workflow Activity Task is included, its DocumentEntry SHALL carry that Task separately from the primary HL7 Version 2 notification. No Task DocumentEntry is present when Task is absent. Apply Chapter 3 and the XD packaging rules.

### Primary DocumentEntry

For HL7 V2 notifications, DocumentEntry.creationTime SHALL use MSH-7 message creation time. serviceStartTime and serviceStopTime SHALL use source-supported PV1-44 and PV1-45, respectively. EVN-2 SHALL be identified as event recorded time; EVN-6, when supplied, SHALL be identified as actual event occurrence time. Missing EVN-6 SHALL remain unavailable, and disagreements with visit boundaries SHALL be surfaced without silent substitution. Preserve source precision and timezone meaning. Event occurrence has no separate standard DocumentEntry timestamp field; do not misuse eventCodeList as a timestamp.

The principal DocumentEntry contains the HL7 Version 2 hospital or ED discharge notification. An A03 trigger alone does not distinguish TX4 from an outpatient visit completion notification under TX1; use the represented event, setting and intended workflow.

| **Conf.** | **Metadata element**       | **Value / source**                                                          | **TX4 guidance**                                                                                                                                    |
|-----------|----------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| R         | entryUUID                  | System-assigned                                                             | Registry entry identifier.                                                                                                                          |
| R/X       | URI                        | System-assigned package URI                                                 | As required by the selected XDM option.                                                                                                             |
| R         | uniqueId                   | System-assigned                                                             | Globally unique identifier for this Payload instance.                                                                                               |
| R         | mimeType                   | text/hl7v2                                                                  | Fixed MIME type.                                                                                                                                    |
| RE/R2     | formatCode                 | Applicable HL7 V2 notification format code when established                 | No additional TX4 fixed value.                                                                                                                      |
| RE/R2     | languageCode               | Language of human-readable content                                          | Populate when known.                                                                                                                                |
| R         | classCode                  | 86530-3 Hospital notification                                               | Classifies the information object. SHALL NOT carry the transaction code.                                                                            |
| R         | typeCode                   | Specific discharge event code                                               | Hospital discharge: 79430-5; ED discharge: 98142-3.                                                                                                 |
| O         | title                      | Consistent with SubmissionSet.title                                         | Keep title consistent across the package.                                                                                                           |
| O         | referenceIdList            | Applicable established Context Instance identifiers                         | Preserve known patient-specific Perinatal/Visit Context identifiers with namespace and type. Discharge does not itself close the Perinatal Context. |
| RE/R2     | patientId                  | Patient identifier known to the receiver or mutually agreed exchange domain | Use the same recipient-identity strategy as the SubmissionSet.                                                                                      |
| RE/R2     | sourcePatientId            | Patient identifier from PID / source system                                 | Carries the sender/source-local patient identifier.                                                                                                 |
| RE/R2     | sourcePatientInfo          | Patient demographics from PID                                               | Source patient demographics.                                                                                                                        |
| RE/R2     | creationTime               | MSH-7 notification/message creation time                                    | Preserve notification creation separately from event occurrence and visit boundaries.                                                               |
| RE/R2     | author                     | Treating facility name from PV1 or represented location                     | Identifies the treating facility responsible for the event.                                                                                         |
| R         | author.role                | Source-supported patient/act-specific author function                       | Use the Chapter 3 Care Team Member Function binding when known; do not substitute a facility label for a person’s function.                         |
| O         | author.specialty           | No additional TX4 constraint                                                | Populate if available.                                                                                                                              |
| O         | serviceStartTime           | Admission/encounter start time when known                                   | Populate from source-supported encounter timing, normally PV1-44 when appropriate to the selected profile.                                          |
| O         | serviceStopTime            | Discharge/encounter end time when known                                     | Populate from source-supported discharge time, normally PV1-45; do not substitute message-generation time.                                          |
| RE/R2     | practiceSettingCode        | Code describing the clinical practice setting                               | Populate from available event/facility data.                                                                                                        |
| RE/R2     | confidentialityCode        | Applicable confidentiality code                                             | Populate consistently with organizational policy.                                                                                                   |
| RE/R2     | healthcareFacilityTypeCode | Code describing the treating facility                                       | Populate from the facility/location represented in the event.                                                                                       |
| O         | limitedMetadata            | No fixed value specified                                                    | Use as defined in the base profile.                                                                                                                 |
| R         | objectType                 | urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1                               | Stable DocumentEntry object type; apply Chapter 3 and the base XD requirements.                                                                     |
| O         | Slot/@name                 | Available extensions                                                        | Use only extensions permitted by the base profile.                                                                                                  |
| R/O       | hash                       | Calculated document hash                                                    | Follow the base XDM/XDR option requirements.                                                                                                        |
| R/O       | size                       | Document size in bytes                                                      | Follow the base XDM/XDR option requirements.                                                                                                        |

### Provenance DocumentEntry(s)

Apply common Chapter 3 metadata and Provenance requirements to any included Provenance. TX4 imposes no additional initiating-package Provenance requirement. Preserve the actor-role distinctions in Section 1.3.

### Human-Readable DocumentEntry

The human-readable DocumentEntry contains the human-readable healthcare communication included with the notification. It SHALL describe the same discharge event represented by the principal HL7 Version 2 notification. Its patient, Context, event timing, source, and confidentiality metadata SHALL remain consistent with the principal notification DocumentEntry. Where a metadata element is applicable to both DocumentEntries, use the same semantics defined in Section 3.3 while classifying the human-readable information object with the applicable human-readable document class/type rather than the HL7 V2 event type.

Apply the identical-copy preservation requirements in Chapter 3 and the content coverage in Section 2.3. Include every supplied HTML alternative inside the Structured Payload Package when HTML is supplied in MIME Part 1.

### Secondary Data DocumentEntry(s)

Intentionally blank. Secondary information objects are not permitted in TX4.

## FHIR Metadata Guidance — HOW

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance using the guide’s XD-to-FHIR mapping. SubmissionSet metadata is represented in a FHIR List Resource, and corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This is an alternative representation of the same Payload Metadata, not a different metadata model.

The current SubmissionSet List SHALL conform to the MAP SubmissionSet List profile (http://objects.directtrust.org/standards/fhir/StructureDefinition/map-submissionset-list) and SHALL carry the required map-submission-purpose extension identifying send-discharge-notification. The List purpose, designationType content classification, and each DocumentReference.type are distinct. When a Workflow Activity Task is present, Task.code SHALL match the List purpose in code and code system. Preserve patient identity, Context/correlation, information-object classification, source, and provenance semantics required by this definition and Chapter 3.

### SubmissionSet Representation

Apply the common XD-to-FHIR mapping to Section 3.1. Preserve package identification, recipient, patient demographics and identity, source, purpose, event classification, and applicable Context semantics.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the current contributing Organization. dt-intendedRecipient identifies the same intended party as the Task recipient; a transport Endpoint SHALL NOT replace that party’s identity.

### Workflow Activity Task

When a Workflow Activity Task is present, apply Section 2.2 and Chapter 3 to its identification, requested action, Context, transaction correlation, and applicable Workflow Status instructions. No Task resource is required when the originating TX4 package omits it.

### Primary Payload Representation

Apply the common mapping to the primary HL7 Version 2 discharge notification metadata in Section 3.3. Preserve the notification as the primary information object, its discharge event classification, patient identity, timing and applicable Context associations.

### Provenance Collection Bundle(s)

Apply Chapter 3.10 and Appendix D to each supplied Provenance Collection Bundle. Preserve assertions, coded activities, participation types, agents and logical targets. Its entries remain inside that carrying bundle; they are not automatically outer Bundle peers.

### Human-Readable Content

Preserve Sections 2.1, 2.3, and 3.5 human-readable content, metadata consistency, and identical-copy requirements using the common FHIR representation.

### Secondary Data Resource(s)

Intentionally blank. Secondary information objects are not permitted in TX4.

## Context IG Guidance

Intentionally blank. TX4 adds no Context IG representation requirements; common guidance applies when that representation is established.

## Technical Actor Functional Requirements — WHO DOES WHAT

The following provisions describe technical actor functional requirements.

### Sender Actor

The Sender Actor combines Content Creator and Message Sender functions. It creates and preserves the information objects, metadata, Context identifiers and applicable Provenance, then packages and transmits the message.

| **Actor**       | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                             |
|-----------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Creator | Payload creation         | SHALL create the permitted TX4 objects in Section 2.1, preserve source-supported patient/encounter identities, discharge timing and disposition, and preserve applicable clinical/workflow provenance. SHALL NOT attach secondary clinical documents. |

| **Actor**      | **Requirement category** | **Normative requirement**                                                                                                                                                |
|----------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Sender | Transmission             | SHALL package and transmit the Direct message using the common Chapter 3 message metadata and the Payload Metadata / packaging constraints defined for this transaction. |

### Receiver Actor

The Receiver Actor combines Message Receiver and Content Consumer functions. It validates receipt, resolves required patient and Context associations, determines whole-package disposition, and causes required TX8 reporting.

| **Actor**        | **Requirement category** | **Normative requirement**                                                                                                  |
|------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Message Receiver | Receipt                  | SHALL receive and validate the Direct message and make the Payload and Payload Metadata available to the Content Consumer. |

| **Actor**             | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                        |
|-----------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer      | Processing               | SHALL process the discharge notification in the supported workflow, resolve required patient and encounter associations, and apply the discharge-specific qualifications in Section 7. SHALL determine separately identified transaction outcomes independently. |
| Information Recipient | Workflow Status          | When TX8 reporting is applicable, SHALL follow Chapter 3 conditional obligations and destination-capability checks; absence of a usable TX8 destination is a reporting failure, not a change to the TX4 processing outcome.                                      |

## Transaction-Specific Processing — WHAT IS SPECIAL

Apply common Chapter 3 processing anomaly rules. When TX8 reporting is applicable, use Chapter 3 Section 3.9 and the TX8 send-workflow-status Transaction Definition; TX4 support alone does not imply TX8 sending or receiving support. The following qualifications are specific to TX4.

When a received transaction results in a defined terminal failure requiring TX8, apply the Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason) specified in Chapter 3 Section 3.9.2. Use a shared applicable code with an explanation; optional missing information does not alone establish rejection. Local filtering or preparation failures before this transaction is issued SHALL NOT be reported as rejection of a nonexistent transaction.

### Discharge Event Classification

TX4 uses one reusable transaction for hospital and ED discharge notifications. SubmissionSet.purpose SHALL identify send-discharge-notification; when Task is present, Task.code SHALL match in code and code system. The primary DocumentEntry.typeCode and SubmissionSet.contentTypeCode SHALL identify the specific discharge event. The primary classCode is 86530-3 Hospital notification, following the admission/discharge notification convention. An A03 outpatient visit completion is TX1 when its represented activity is an outpatient visit notification; do not classify every A03 as TX4.

| **Discharge event**            | **Primary DocumentEntry classCode** | **Primary DocumentEntry typeCode**                  |
|--------------------------------|-------------------------------------|-----------------------------------------------------|
| Hospital discharge             | 86530-3 Hospital notification       | 79430-5 Hospital Discharge notification             |
| Emergency Department discharge | 86530-3 Hospital notification       | 98142-3 Emergency Department Discharge Notification |

### Patient and Encounter Resolution

The Content Consumer SHALL associate the notification with the correct patient and encounter using available identifiers, assigning authorities and source demographics. A previously received TX2 is not a prerequisite if the supported workflow can resolve the discharge through other authoritative information.

If the patient or required encounter cannot be resolved and this prevents requested processing, determine TX4 rejection and apply TX8 reporting only when required under Chapter 3. This definition does not require unsupported patient creation or encounter reconstruction. An absent optional Context identifier SHALL NOT, by itself, cause rejection.

A maternal discharge notification concerns the mother; a newborn discharge notification concerns the newborn. Do not substitute the mother’s identifiers or encounter for the newborn’s. Carry only source-supported Context associations and identify whose Context is represented.

### Processing Outcome and Separate Clinical Documents

Successful TX4 processing means the discharge notification was accepted into the intended workflow. A successful TX8 structured payload acceptance SHALL NOT be interpreted as completion of follow-up care, closure of the entire Perinatal episode, or receipt of a discharge summary.

Discharge summaries, instructions, care plans and other clinical documents SHALL NOT be included as secondary objects in TX4. Send such documents separately using TX5. Determine and report the processing outcome of each separately identified activity independently; a separate document exchange does not change an already established TX4 outcome.

## Relevant Examples — SHOW ME

These narrative patterns describe TX4 scenarios; they do not claim supplied executable TX4 sample packages. XD and FHIR metadata options preserve the same transaction and event semantics. For common whole-payload acceptance and structured payload rejection examples, see Section 8 of TX8 send-workflow-status.

### Maternal Hospital Discharge

A hospital sends Mimi Elena Shell’s maternal discharge A03 to the intended recipient. SubmissionSet.purpose identifies send-discharge-notification, and an optional Task.code matches it. The primary DocumentEntry uses classCode 86530-3 and typeCode 79430-5 Hospital Discharge notification; SubmissionSet.contentTypeCode uses 79430-5. Preserve available maternal patient, encounter and Perinatal identifiers, discharge time and disposition. The Perinatal Context remains available for postpartum care.

### Emergency Department Discharge

An ED discharge uses the same TX4 transaction code with primary DocumentEntry.typeCode and SubmissionSet.contentTypeCode 98142-3 Emergency Department Discharge Notification. Human-readable content identifies the ED setting, encounter, discharge timing and source-supported disposition or destination.

### Newborn Discharge and Independent Processing Outcomes

A newborn hospital discharge identifies the newborn as the notification patient and, when a Task is present, its Task.for subject and carries the newborn’s encounter identifier. Maternal associations, if supplied, remain explicitly related information. No maternal Birth Notification CDA or newborn source rendering is attached as a secondary document.

If the supported receiving workflow resolves and accepts the discharge without having received the corresponding admission notification, successful TX4 processing remains possible. If a required identity or encounter cannot be resolved, apply the common TX8 failure handling. A separate TX5 discharge-summary exchange has its own Task, Transaction Instance and processing outcome.

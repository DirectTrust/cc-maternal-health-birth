# TX3: send-birth-notification

<span class="smallcaps">Reusable Transaction Definition</span>

## Transaction Overview — WHY

The following provisions describe transaction overview.

### Purpose and Scope

send-birth-notification is a specialized document-send activity that applies the CDA exchange pattern of TX5 to maternal continuity of care. It is initiated from a newborn Birth Admission A01 received through TX2, after the newborn has been successfully associated with the mother and her established Perinatal Context Instance. The Information Recipient is the mother’s OB or the maternal-care practice identified through that context.

The derived Maternal Birth Notification CDA SHALL identify the mother as recordTarget and the newborn as the explicit subject of its Newborn Delivery Information section. The newborn remains the patient in the source A01. TX3 does not change that source patient identity; it creates a new maternal-record document containing identified newborn-related information.

TX3 is therefore not a newly invented HL7 Version 2 ADT event code. It is a semantic transformation of viewpoint used to support maternal continuity-of-care and postpartum workflow.

Each independently processable TX3 workflow unit SHALL contain zero or one separate Workflow Activity Task and one primary Maternal Birth Notification CDA. The original newborn A01 SHALL NOT be included in the TX3 message or Structured Payload Package. It is retained by the transforming system for source traceability under applicable retention requirements.

### Transaction Identity

The canonical transaction code is send-birth-notification. TX3 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

SubmissionSet.purpose SHALL carry send-birth-notification from DTCodeSystem independently of Task presence. When an initiating Workflow Activity Task is included, Task.code SHALL match that purpose in code and code system. TX3 specializes the document exchange pattern of TX5, but does not carry send-documents as its transaction code.

The primary CDA document type SHALL use DT20260913-1 (Birth Notification Temporary Code) from the DirectTrust DTTemporaryCodeCS CodeSystem until an appropriate LOINC Document Ontology code is assigned. This is the current package concept replacing the older DT-Birth shorthand and example-local DT-20260913-01 spelling. Apply Chapter 3’s Extensible classification binding and preserve the temporary code’s actual code system identity.

### Framework Relationship

The originating transaction concludes when the authorized Receiver Actor accepts or rejects the whole structured payload into its intended workflow. TX8 is a separate subsequent transaction reporting that outcome when required under the applicable workflow instructions and Chapter 3/TX8 rules. TX3 support alone does not universally require TX8 Sender or Receiver capability.

This definition specializes Chapter 3’s common MAP Transaction Framework, including the terminology bindings in Section 3.7.4 and message-header constraints in Section 3.8.3. It reuses TX5’s maternal CDA exchange approach. TX2 defines the incoming newborn admission activity; TX3 is a separately identified, subsequently created maternal document activity. TX8 defines common anomaly handling and terminal processing outcome reporting.

Clinical Content Author/Source, Workflow Requester / Information Source (Task.requester), SubmissionSet Source (SubmissionSet.sourceId), Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

## Message and Payload Requirements — WHAT

The following provisions describe message and payload requirements.

### Payload Packaging Structure

Apply Chapter 3 Section 3.8.4 for the outer multipart/mixed message, MIME Part 1 multipart/alternative communication, and identical copies of its TXT and every optional HTML alternative inside the Structured Payload Package. The XD and FHIR metadata options preserve the same maternal CDA and workflow semantics. The generated CDA Source Form is a distinct presentation of the source-derived maternal notification; it does not replace the required message communication.

Apply Chapter 3 Sections 3.7.5–3.7.6 and Appendix D for package completeness. All required payload and supporting references SHALL resolve within the transmitted Structured Payload Package. Review reports and inspection views outside that package do not supply required transmitted resources. Supporting patient, actor and endpoint resources do not acquire additional DocumentEntries merely because they support a reference.

For XD, Task supporting resources SHALL be contained in the Task with local fragment references. Each optional Provenance information object SHALL be a FHIR Collection Bundle containing its assertions and required supporting agents. Do not reference another object’s contained resources or use nested containment. For FHIR metadata, Task support remains in the outer Collection Bundle and Provenance bundle entries remain inside their carrying bundle. Apply Chapter 3 and Appendix D for carried targets, security labels, and serialization.

#### Message-Level Payload Packaging Structure

The following requirements apply to message-level payload packaging structure.

| **Message MIME-part** | **Conf.** | **Package object**                                      | **Content MIME type** |
|-----------------------|-----------|---------------------------------------------------------|-----------------------|
| MIME Part 1           | R         | Human-readable healthcare communication                 | text/plain            |
| MIME Part 1           | O         | Human-readable alternative(s)                           | text/html             |
| MIME Part 2           | R         | Structured Payload Package — XD or FHIR metadata option | application/zip       |

#### Structured Data Package Contents

The following requirements apply to structured data package contents.

| **Conf.** | **Package object**                          | **Content MIME type / representation**        | **Requirement**                                                                                             |
|-----------|---------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| R         | XDM/FHIR SubmissionSet/List                 | Selected metadata representation              | Maternal workflow package metadata; apply Section 3.1.                                                      |
| R         | XDM/FHIR DocumentEntries/DocumentReferences | Selected metadata representation              | Metadata for all included objects.                                                                          |
| O         | Workflow Activity Task Resource             | application/fhir+xml or application/fhir+json | Zero or one initiating Task, separate from the primary CDA when present; apply Section 2.2.                 |
| R         | Maternal Birth Notification CDA             | application/cda+xml                           | Primary document. Includes the generated HTML Source Form and newborn section described in Section 3.3.     |
| O         | Provenance Collection Bundle                | application/fhir+xml or application/fhir+json | Optional initiating assertions and their supporting agents in a Collection Bundle; apply Section 3.4.       |
| R         | Human-readable healthcare communication     | text/plain                                    | Identical copy of MIME Part 1 TXT; Section 2.3 specifies coverage.                                          |
| C         | Human-readable alternative(s)               | text/html                                     | Identical copies of every HTML alternative supplied in MIME Part 1; HTML remains optional at message level. |

No secondary clinical information object is designated for this TX3 pattern. The newborn A01 and its full newborn-patient rendering are excluded. The generated maternal Source Form is part of the primary CDA rather than a separately required DocumentEntry.

### Workflow Activity Task

When a Workflow Activity Task is included in an initiating send-birth-notification exchange, Task.code SHALL carry DTCodeSystem send-birth-notification and match SubmissionSet.purpose in code and code system. Task.code.text SHALL retain the approved action precept: “Process the information in the Payload in the intended workflow.” Task absence SHALL NOT change TX3 purpose, patient viewpoint, clinical content, or processing requirements.

| **Task concept**                           | **TX3 requirement**                                                                                                                                                                                 |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                                  | C (when Task included). DTCodeSystem code send-birth-notification.                                                                                                                                  |
| Task action precept                        | C (when Task included). Process the information in the Payload in the intended workflow.                                                                                                            |
| Task identifier / SubmissionSet.uniqueId   | C (when Task included). Task.identifier matches the SubmissionSet business identifier, which is required independently.                                                                             |
| Task.for                                   | The mother. Preserve established maternal identity; do not use the newborn as the Task patient.                                                                                                     |
| Context                                    | R. Mother’s established Perinatal Context Instance identifier and namespace. Type: urn:dt-org:dsm:map:2025:perinatal.                                                                               |
| Transaction correlation                    | Preserve the originating TX2 Transaction Instance identity when available, separately from the source A01 message identifier, CDA instance identifier, and current TX3 identifier.                  |
| Whole-payload acceptance reporting request | Workflow instruction governing successful TX8 reporting.                                                                                                                                            |
| Workflow Status Update Endpoint(s)         | C (when Task included and reporting applies). Use eligible Task-carried destinations; otherwise the Directory-qualified no-Task MDN fallback is the sole eligible destination when TX8 is required. |

#### Workflow Activity Identification

An intermediary updating package membership or optional Provenance SHALL preserve the SubmissionSet.uniqueId/List business identifier and established Context identifiers. When an initiating Task exists, preserve its aligned identifier and applicable workflow-status routing instructions. Do not fabricate a Task solely for correlation or TX8 reporting.

SubmissionSet.uniqueId (or the corresponding FHIR List business identifier) SHALL identify the TX3 Transaction Instance independently of Task presence. When an initiating Task is present, its identifier SHALL match that business identity. The TX3 Transaction Instance, primary CDA instance, source A01 message, maternal Perinatal Context, and originating TX2 remain distinct identifiers.

#### Context Instance Association

TX3 SHALL carry the mother’s established Perinatal Context Instance identifier using type urn:dt-org:dsm:map:2025:perinatal, bound to DTContextTypeCodeVS under Chapter 3. Preserve the identifier value and assigning authority or namespace received in the input; do not generate a new maternal episode identifier or treat a type code as an instance identifier.

Input prerequisite: the newborn Birth Admission TX2 SHALL include the mother’s Perinatal Context Instance identifier, distinguishable from the newborn’s encounter and patient identifiers. The hospital is assumed to have received this identifier through the birth registration workflow or an Antepartum Summary shared with the hospital, retained its association with the mother, and carried it forward into the newborn admission A01 and associated TX2 context declarations. This assumption does not imply that every base HL7 A01 supplies that context without implementation-specific support.

The implementation is assumed to provide authorized resolution of that established maternal context to the mother, her OB, the OB’s practice, and an appropriate preferred Direct address. The identifier does not encode the recipient address. Confirm the maternal association and applicable provider relationship; unresolved or ambiguous association SHALL NOT result in an uncorrelated Birth Notification.

Carry maternal Visit/Encounter, Request, or other established Context identifiers only when they actually apply. Do not describe a newborn encounter as the mother’s encounter. Context identity remains stable while lifecycle state changes; reporting a birth does not itself close the perinatal episode or create a postpartum episode.

HL7 V2 source mapping and status. Distinguish the visit/encounter identifier in PV1-19 from an established episode identifier. HL7 V2.8 defines PV1-54 Service Episode Identifier and PV1-53 Service Episode Description; those fields are absent from the V2.5.1 base used by the current samples. PV1-54 is a candidate for the message patient’s service episode, not an adopted mapping for the related mother’s Perinatal Context in a newborn A01. No PV2 field is selected by this definition as a generic Context Instance identifier.

Illustrative provisional mapping. An illustrative provisional V2.5.1 mapping carries PERICTXID in an OBX with value type EI: OBX-5.1 is the identifier value, OBX-5.2 the namespace label, OBX-5.3 the universal assigning-authority identifier, and OBX-5.4 the universal identifier type. A separate PERICTXTYPE OBX with value type CWE carries the Context type code in OBX-5.1, its display in OBX-5.2 and its source coding-system designation in OBX-5.3. These locally named observations are provisional illustrative mappings; their use is not a claim that base HL7 defines these observation identifiers. Preserve the source coding-system designation and separately identify the established DTContextTypeCodeCS binding; do not silently replace a source L designation.

Source mapping. The selected V2 version, source location, value type, assigning authority, Context type coding and subject association SHALL be documented by the implementation. A source rendering SHALL distinguish message-carried context from context supplied only by the Task, package metadata or an authorized lookup. It SHALL NOT make a missing source context appear to have been present in the original V2 message.

For a newborn Birth Admission, label the mother’s context “Related maternal Perinatal Context” and show the source-supported maternal identifier and namespace separately from the newborn’s patient identifier and PV1-19 visit identifier. State that the maternal context supports a separately identified TX3 activity; it does not make the newborn the patient of the maternal episode. PID-21 supports the maternal patient association but is not the Perinatal episode identifier. The provisional local OBX mapping, a later-version PV1-54 candidate and an actual agreed source profile SHALL remain distinguishable.

#### Transaction Correlation

The Content Consumer SHALL gather and maintain supplied Context Instance Identifiers with their values, assigning authorities, types, and subject associations. It SHALL preserve relevant identifiers in later exchanges concerning those contexts. Visit, perinatal, referral, order, request, and other contexts may continue beyond the individual transaction; a later exchange has its own transaction identity.

Apply Chapter 3 correlation requirements. When TX8 reporting is required, the responding TX8 SHALL correlate to the TX3 Transaction Instance and applicable maternal Perinatal Context. Correlation to the input TX2, where supported, records derivation between separate activities. It does not make TX3 a status response to TX2 or change the input TX2’s prior processing outcome.

#### Workflow Status Instructions

TX8, when required, SHALL correlate to the originating TX3 SubmissionSet/List business identifier. With an originating Task present, apply its workflow-status routing instructions and eligible destinations. With no originating Task, only the Direct address established for Message Delivery Notifications is eligible, and only when its Directory-discoverable CapabilityStatement declares TX8 Receiver support (send-workflow-status, supportsReceive=true). TX8 carries its own reporting Task and SubmissionSet.

When an originating Workflow Activity Task is included, it SHALL distinguish workflow-response routing from transport-level disposition routing. Disposition-Notification-To is reserved for MDN / Direct message disposition reporting; it does not independently establish TX8 capability. The DirectTrust Directory is authoritative for discovering the destination CapabilityStatement; the CapabilityStatement establishes declared TX8 Receiver capability. SERV_DESC does not independently establish support.

TX8 reporting obligations are conditional under Chapter 3, Chapter 4, and the TX8 definition. When required and an originating Task is present, use its eligible workflow-status destinations, preserving and deduplicating the applicable accumulated set. With no Task, use only the Directory-CapabilityStatement-qualified MDN Direct address. If no eligible destination can be resolved, record the unsuccessful TX8 reporting obligation and do not dispatch TX8. Failure to dispatch TX8 SHALL NOT, by itself, change the originating TX3 processing outcome.

The Content Creator MAY identify Task-carried Workflow Status Update Endpoints from authorized configuration and Directory-discoverable capability information when a Task is present. It SHALL NOT create a Task merely to establish TX8 routing. TX8 capability and the obligation to report SHALL be evaluated independently.

### Human-Readable Content

The message communication SHALL concisely explain the maternal-facing send-birth-notification activity, the supplied CDA, and the processing requested of the mother’s OB. It need not reproduce the full CDA narrative or Source Form. Surface the following coverage when available from verified source information, resolved maternal context, the CDA, metadata, or Task; unavailable clinical values SHALL NOT be invented.

| **Information to surface**     | **TX3 human-readable coverage**                                                                                                                                                                                            |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Requested activity             | send-birth-notification; requested maternal workflow processing; current TX3 SubmissionSet business identifier, independent of Task.                                                                                       |
| Maternal patient               | Mother’s name, birth date, identifiers with assigning authorities, and available matching demographics. Clearly identify her as the patient for this document and exchange.                                                |
| Newborn relationship           | Newborn name or temporary name, stable identifier(s) with assigning authorities, and verified mother–newborn relationship. Clearly label the baby as related-subject information.                                          |
| Birth and admission            | Birth date/time and newborn admission date/time as distinct facts when supplied; originating hospital and relevant location. Include available source-supported measurements or other newborn facts without invention.     |
| Perinatal Context              | Mother’s established Perinatal Context Instance identifier and namespace. Identify other applicable maternal context separately.                                                                                           |
| Primary CDA                    | Title, type DT20260913-1 with its code system, document instance identifier, media type, document effective time, and version/state information when supported. Identify the included generated maternal HTML Source Form. |
| Source and transformation      | Originating hospital and source A01 message identity, creator/transforming service, and derivation or assembly time when supplied. Explain that a maternal CDA was generated from a newborn admission source.              |
| Recipient and status           | Intended maternal-care recipient; conditional successful-reporting request and eligible Workflow Status Update Endpoints, distinguishing Task-present routing from Directory-qualified no-Task MDN fallback.               |
| Confidentiality and Provenance | Applicable confidentiality label. When a Provenance resource is included, SHOULD summarize its activity, actor, time, and affected objects. Do not infer clinical authorship from message sending.                         |

The generated HTML Source Form is specified in Section 3.3. Both presentations SHALL use consistent verified facts, while serving different purposes: the message communication summarizes the exchange and requested activity; the Source Form presents the derived maternal notification content retained within the CDA.

The HTML, TXT and debug renderings SHALL distinguish the patient, visit/encounter, established episode and Transaction/Workflow Activity identifiers. For each supplied Context identifier, show its value, assigning namespace/authority, type code and readable type, whose Context it is, source location and mapping status. Where the source does not establish the type, authority or subject association, show that limitation rather than infer a value. The debug view SHALL identify the segment/field/component, OBX observation identifier and value type when applicable. A later-version field present in a V2.5.1 message SHALL be identified as an extension needing an agreed profile, not as a base V2.5.1 field.

For a newborn Birth Admission, label the mother’s context “Related maternal Perinatal Context” and show the source-supported maternal identifier and namespace separately from the newborn’s patient identifier and PV1-19 visit identifier. State that the maternal context supports a separately identified TX3 activity; it does not make the newborn the patient of the maternal episode. PID-21 supports the maternal patient association but is not the Perinatal episode identifier. The provisional local OBX mapping, a later-version PV1-54 candidate and an actual agreed source profile SHALL remain distinguishable.

### Direct Message and Transport Requirements

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through SMTP, an IMAP/mailbox arrangement, XDR, a custom API, or another supported receiving interface. A successful Final Destination Delivery Notification does not establish that the Payload was parsed, matched, routed, accepted, or delivered into its intended business workflow.

Apply Chapter 3 Sections 3.8.1–3.8.5 for message headers, terminology or fixed-value constraints, XD edge transport, MIME packaging, and delivery notifications. The XD Subject convention SHALL NOT be used for FHIR metadata. SubmissionSet.purpose identifies send-birth-notification independently of Task presence; optional Task reporting instructions do not replace package purpose.

## XD Metadata Guidance — HOW

XD is the fully specified representation of Payload Metadata for this transaction. The requirements in this section define the package-level and payload-object metadata semantics used as the source requirements for alternative metadata representations.

Apply Chapter 3’s common metadata and Extensible terminology bindings. The TX3 patient viewpoint is maternal throughout the package. The newborn is related-subject information in the CDA, not a second DocumentEntry patient. Tables below specialize metadata derivation; they do not substitute the transaction code for document classification.

### SubmissionSet

The following requirements apply to submissionset.

| **Conf.** | **Metadata element** | **Value / source**                                            | **TX3 guidance**                                                                                                                           |
|-----------|----------------------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| R         | uniqueId             | TX3 SubmissionSet business identifier                         | Identifies the TX3 Transaction Instance independently of Task. When Task exists, Task.identifier matches.                                  |
| R         | availabilityStatus   | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved           | Fixed XD SubmissionSet status under Chapter 3.                                                                                             |
| R         | submissionTime       | System-generated submission time                              | Distinct from birth, clinical effective, and transformation times.                                                                         |
| R         | intendedRecipient    | Resolved maternal-care recipient Direct address               | Resolve through the maternal perinatal context and applicable provider/endpoint information; do not infer solely from a relationship name. |
| RE/R2     | patientId            | Maternal identifier appropriate to recipient or agreed domain | Populate only when known; never substitute the newborn or an arbitrary sender-local identifier.                                            |
| R         | Patient Info         | Verified maternal demographics                                | Chapter 3 single-patient package fallback using sourcePatientInfo semantics; required even when patientId is known.                        |
| O         | SourcePatientId      | Source-known maternal identifier, when promoted               | Use the permitted Chapter 3 extension and preserve authority; the CDA sourcePatientId remains maternal.                                    |
| R         | author               | Initiating Organization, optionally a person acting for it    | Distinguish from hospital clinical source, CDA author, requester, and sender.                                                              |
| R         | sourceId             | Established Organization Identity OID of SubmissionSet Source | Identify this TX3 source; reuse requester organization identity only when the roles coincide.                                              |
| R         | purpose              | send-birth-notification                                       | Required purpose independent of Task; Task.code matches code and code system when included.                                                |
| RE/R2     | contentTypeCode      | DT20260913-1 from DTTemporaryCodeCS                           | Use primary CDA typeCode. Temporary clinical document type, not the send-birth-notification activity code.                                 |
| O         | title                | Maternal Birth Notification                                   | Describe the maternal-facing package.                                                                                                      |
| O         | description          | Maternal notification with identified newborn information     | Explain the included CDA and generated Source Form; no original newborn A01 attachment.                                                    |
| R         | referenceIdList      | Established maternal Perinatal Context identifier             | Type urn:dt-org:dsm:map:2025:perinatal; preserve identifier and authority. Other applicable maternal context is optional.                  |
| O         | limitedMetadata      | As permitted by base profile                                  | No TX3 fixed True value.                                                                                                                   |
| R         | entryUUID            | System-assigned registry identifier                           | Identifies the SubmissionSet registry object.                                                                                              |
| O         | slot/@name           | Permitted Chapter 3/base-profile extensions                   | Declare any extensions used; not a bucket for untyped newborn identifiers.                                                                 |

MAP-added SubmissionSet content used here includes purpose, Patient Info, maternal Context declarations, and any permitted source-patient identity promotion. Values SHALL agree with the Task and primary CDA. Maternal matching information SHALL NOT be replaced with newborn demographics.

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the originating source identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

### Workflow Activity Task DocumentEntry

When included, the Workflow Activity Task is separate from the CDA and uses application/fhir+xml or application/fhir+json according to the selected package representation. When no Task is included, there is no Task DocumentEntry. Apply Chapter 3 and Appendix D.

### Primary DocumentEntry

For CDA documents, DocumentEntry.creationTime SHOULD use the time of the version-appropriate Assembler or Composer participant identifying creation of the exchanged representation. If that participant or its time is absent, ClinicalDocument/effectiveTime SHALL supply the fallback when available. Do not invent a missing time or replace it with transaction time. Preserve ClinicalDocument/effectiveTime and its source meaning in the document. Encounter start and completion SHALL map separately to serviceStartTime and serviceStopTime when supplied. This MAP population rule explicitly qualifies the usual ClinicalDocument/effectiveTime-to-creationTime crosswalk; the derivation SHALL identify which source was used.

The primary artifact SHALL be the generated Maternal Birth Notification CDA. The document’s recordTarget SHALL be the resolved mother. A header participant identifying the baby is not a substitute for an explicit newborn section subject. The source A01 remains a newborn-patient record retained by the transforming system.

CDA Context placement. The mother’s established Perinatal Context SHALL be referenced through ClinicalDocument/inFulfillmentOf/order. order/id carries the instance identifier with its namespace in root and value in extension; order/code carries the established type urn:dt-org:dsm:map:2025:perinatal from DTContextTypeCodeCS. This reference SHALL NOT generate a new episode or imply a newly placed clinical order. documentationOf/serviceEvent SHALL NOT be used as a substitute for this agreed Context association. CDA order/code SHALL use the DTContextTypeCodeCS OID 1.3.6.1.4.1.41179.4.1.2; its code is the Context type, not the Context Instance Identifier.

| **Conf.** | **Metadata element**       | **Value / source**                                                                       | **TX3 guidance**                                                                                                                                                                   |
|-----------|----------------------------|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R         | entryUUID                  | System-assigned registry identifier                                                      | Distinct from CDA instance and activity identifiers.                                                                                                                               |
| R/X       | URI                        | Package-local CDA location                                                               | Apply selected XDM option.                                                                                                                                                         |
| R         | uniqueId                   | CDA ClinicalDocument/id                                                                  | Preserve the new maternal document instance identity; do not use the source A01 message identifier.                                                                                |
| R         | mimeType                   | application/cda+xml                                                                      | CDA XML representation under the document binding.                                                                                                                                 |
| RE/R2     | formatCode                 | urn:dt-org:dsm:map:cda:maternal-health-birth-notification:1.0                            | MAP birth-notification format code from DTFormatCodeCS. The format code identifies the content pattern and does not by itself establish conformance to an applicable CDA template. |
| RE/R2     | languageCode               | CDA ClinicalDocument/languageCode                                                        | Use actual narrative language; Chapter 3 binding applies.                                                                                                                          |
| RE/R2     | classCode                  | Appropriate LOINC Document Ontology class                                                | Apply Chapter 3. No fixed TX3 activity class; confirm the intended broad maternal-document classification.                                                                         |
| RE/R2     | typeCode                   | DT20260913-1 — Birth Notification Temporary Code                                         | CodeSystem: http://objects.directtrust.org/standards/terminology/CodeSystem/DTTemporaryCodeCS. SHALL align with CDA document code and package contentTypeCode.                     |
| O         | title                      | CDA ClinicalDocument/title                                                               | Maternal Birth Notification; preserve document title independently from package description.                                                                                       |
| R         | referenceIdList            | Mother’s established Perinatal Context identifier                                        | Use urn:dt-org:dsm:map:2025:perinatal and the actual instance identifier/namespace. Additional applicable document context may be carried.                                         |
| RE/R2     | patientId                  | Recipient-appropriate maternal identifier                                                | Apply Chapter 3 push patient identity rule.                                                                                                                                        |
| RE/R2     | sourcePatientId            | Maternal CDA recordTarget/patientRole/id                                                 | Preserve source-known maternal identity and assigning authority.                                                                                                                   |
| RE/R2     | sourcePatientInfo          | Maternal CDA recordTarget demographics                                                   | Use verified maternal data; newborn demographics belong in related-subject content.                                                                                                |
| RE/R2     | creationTime               | Version-appropriate Assembler or Composer time; otherwise ClinicalDocument/effectiveTime | Identify the creation-time source; preserve birth, admission and clinical effective times separately.                                                                              |
| RE/R2     | author                     | Actual CDA author or transformation device and organization                              | Represent the real derived-document creator; preserve the originating hospital/source attribution separately.                                                                      |
| RE/R2     | author.role                | Known applicable author participation function                                           | Chapter 3 Care Team Member Function binding. Do not invent a treating-clinician role for a software author.                                                                        |
| O         | author.specialty           | Available authoritative specialty                                                        | Chapter 3 permits NUCC or C80 specialty codes. No invented specialty for a transformation device.                                                                                  |
| O         | serviceStartTime           | Applicable source-supported birth/event period                                           | Use the CDA/profile binding and actual supported clinical time.                                                                                                                    |
| O         | serviceStopTime            | Applicable known service/event end                                                       | Do not add a future maternal discharge time to a notification authored at birth.                                                                                                   |
| RE/R2     | practiceSettingCode        | Applicable authoritative practice-setting classification                                 | Chapter 3 binding; do not derive from software location alone.                                                                                                                     |
| RE/R2     | confidentialityCode        | CDA confidentiality classification                                                       | Apply actual classification and authorized handling; no unconditional N default.                                                                                                   |
| RE/R2     | healthcareFacilityTypeCode | Actual clinical facility/setting classification                                          | Apply any of Chapter 3’s three acceptable facility-type ValueSets when appropriate.                                                                                                |
| O         | limitedMetadata            | As permitted by base profile                                                             | No additional fixed TX3 value.                                                                                                                                                     |
| R         | objectType                 | urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1                                            | XD registry object representation.                                                                                                                                                 |
| O         | Slot/@name                 | Permitted extensions                                                                     | Chapter 3/base profile requirements apply.                                                                                                                                         |
| R/O       | hash                       | Calculated document-byte hash                                                            | Apply selected base-profile option.                                                                                                                                                |
| R/O       | size                       | Document size in bytes                                                                   | Apply selected base-profile option.                                                                                                                                                |
| R         | sourceId                   | Originating TX3 SubmissionSet source identity                                            | Independent of the hospital source and CDA author when different parties fill those roles.                                                                                         |

#### CDA Content and Source Form

The following requirements apply to cda content and source form.

| **CDA component**                    | **TX3 content requirement**                                                                                                                                                                                                                                                                                                            |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Maternal header                      | SHALL identify the resolved mother as recordTarget with verified identifiers/demographics; preserve document instance, version, language, confidentiality, creator/device, custodian, and intended maternal-care recipient information as applicable.                                                                                  |
| Newborn Delivery Information section | SHALL explicitly identify the baby as section subject, with stable source-supported newborn identity and relationship to the mother. Section narrative and entries SHALL describe that baby. Use a section code only when its defined meaning applies to the supplied content; do not infer a code from the section title.             |
| Generated HTML Source Form           | SHALL be a Maternal Birth Notification form generated from verified source A01 facts and resolved maternal context. Include it as CDA Source Form content with text/html representation and make it available through the applicable CDA rendering. It is not the full A01 rendering and is not a separate newborn-patient attachment. |
| Source Form coverage                 | SHALL clearly separate maternal identity/perinatal context from newborn related-subject identity. Show birth and admission facts when present, originating hospital, source message identifier, transforming service, and relevant supported clinical information. No invented measurements or Apgars.                                 |
| Consistency and source attribution   | The Source Form and newborn section SHALL use the same verified facts. Identify which facts came from the newborn A01 and which from maternal context resolution. Preserve derivation/source attribution in the CDA and, when included, a Provenance resource.                                                                         |
| Clinical timing and Context          | Preserve birth, admission, clinical effective, author/assembly, and submission times as distinct concepts. Include only facts known when the notification is created. Reference the established maternal Perinatal Context through inFulfillmentOf/order as specified in Section 3.3; do not create a new clinical order or episode.   |

The HTML Source Form may repeat clinically relevant CDA narrative facts, but it is not the exchange-level TXT/HTML communication required by Section 2.3. The latter summarizes the workflow and document metadata and has identical outer/inner copies. Implementations SHALL retain access to the Source Form as part of the CDA.

The CDA SHALL preserve the explicit newborn section subject, established maternal Perinatal Context, source-supported timing, and consistent Source Form content. Use applicable CDA templates and verified terminology; do not invent template identifiers or clinical section or entry codes.

### Provenance DocumentEntry(s)

Initiating Provenance is OPTIONAL. When supplied, each independently attributable Provenance information object SHALL be a FHIR Collection Bundle containing its assertions and required supporting agents, classified DT-20261011-1, Provenance Information, from DTTemporaryCodeCS. Apply Chapter 3 Section 3.10 and Appendix D for activities, participation types, targets, and resolution. No additional initiating assertion is required by this definition. The subsequent TX8 SHALL carry whole-package accept or reject Provenance, with coded performer identifying the receiving Organization responsible for the disposition. The CDA SHALL distinguish the source hospital and newborn admission from the service or Organization that generated the maternal document. Optional transformation assertions target the generated CDA and identify the actual responsible agents, derivation time, and retained source-message identity; they do not replace clinical authorship. The newborn A01 SHALL remain outside the transmitted TX3 package.

### Human-Readable DocumentEntry

Include the identical TXT communication and every supplied HTML alternative from MIME Part 1; apply Section 2.3 and Chapter 3 Section 3.8.4. Metadata SHALL describe these as maternal workflow communications, not as the primary CDA or the newborn A01. The embedded Source Form is separately governed by Section 3.3.

### Secondary Data DocumentEntry(s)

Intentionally blank. No secondary clinical DocumentEntry is designated in this TX3 pattern. The newborn A01 and its complete source rendering SHALL NOT be included. The generated maternal HTML Source Form is retained within the primary CDA.

## FHIR Metadata Guidance — HOW

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance, using Appendix D — FHIR Collection Bundle Packaging. SubmissionSet metadata is represented in a FHIR List Resource, and corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This is an alternative representation of the same Payload Metadata, not a different metadata model.

### Apply the current MAP SubmissionSet List profile and Appendix D mapping to Section 3.1. The List SHALL carry the required Purpose extension identifying send-birth-notification independently of optional Task presence. Preserve maternal package identity, source, intended recipient, content classification, perinatal context, patient-matching data, and all required package metadata. When a Task exists, its code and identifier SHALL align with SubmissionSet purpose and business identity.

Apply the common List mapping to Section 3.1. Preserve maternal package identity, source, intended recipient, content classification, perinatal context, patient-matching fallback, and current TX3 purpose. Do not create newborn-patient metadata for a source artifact that is not included.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the originating SubmissionSet source Organization; it is not a representation version identifier. dt-intendedRecipient identifies the same intended party as the Task recipient; a transport Endpoint SHALL NOT replace that party’s identity.

### Workflow Activity Task

An initiating Task is optional (0..1); when included, carry it separately from the CDA. Its activity is send-birth-notification and its patient is the mother. Preserve the established Perinatal Context Instance and applicable workflow instructions. A Task SHALL NOT be invented when absent.

### Primary Payload Representation

The primary clinical artifact remains CDA XML when FHIR metadata is selected. Preserve the same CDA bytes, including generated HTML Source Form content, and represent its metadata through DocumentReference under the common mapping. The mother is the DocumentReference patient/subject; the newborn section subject remains inside the CDA.

### Provenance Resource(s)

Apply Section 3.4 and Chapter 3 Section 3.10 to optional initiating Provenance Collection Bundles. Preserve source identity and transformation assertions independently from assembly and transport events. A source-message logical identifier supports derivation traceability without adding the original newborn A01 to the transmitted package.

### Human-Readable Content

Apply Sections 2.1, 2.3, and 3.5 for maternal communication metadata and identical copies. Preserve the generated Source Form inside the primary CDA and its availability through document rendering.

### Secondary Data Resource(s)

Intentionally blank. No secondary clinical resource/object is designated. The original newborn A01 is excluded under the same rule as the XD option.

## Context IG Guidance

Context Consumers SHALL apply the Context Instance requirements in Section 2.2.2 and Chapter 3. A Context-specific representation, when used, SHALL preserve the identifier value, assigning authority, type, and maternal subject association.

## Technical Actor Functional Requirements — WHO DOES WHAT

The following provisions describe technical actor functional requirements.

### Sender Actor

The Sender Actor prepares the maternal notification and its structured payload, with an optional Workflow Activity Task, then sends it to the current Routing Target while preserving the Intended Recipient.

#### Content Creator

The following requirements apply to content creator.

| **Actor**       | **Requirement category**           | **Normative requirement**                                                                                                                                                                                                                                                      |
|-----------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Creator | Newborn event detection            | SHALL recognize the implementation’s newborn Birth Admission A01 pattern and validate sufficient maternal linkage. Detection of a general admission alone SHALL NOT establish a birth event.                                                                                   |
| Content Creator | Maternal matching                  | SHALL preserve PID-21 Mother’s Identifier value and assigning authority when populated and use it as the primary machine-processable maternal link when present. NK1 MAY supply complementary/corroborating relationship information; ambiguous identity SHALL NOT be guessed. |
| Content Creator | Perinatal resolution and recipient | SHALL resolve the established maternal Perinatal Context Instance and appropriate maternal-care recipient under Section 2.2.2; no new maternal episode or guessed Direct address.                                                                                              |
| Content Creator | Semantic transformation            | SHALL generate the maternal CDA, explicit newborn section subject, and derived HTML Source Form from verified data. Exclude the original newborn A01 from the TX3 package.                                                                                                     |
| Content Creator | Provenance and packaging           | SHALL preserve hospital source and transformation attribution, include zero or one separate Task, derive consistent maternal metadata, and provide the required human-readable files with identical package copies.                                                            |

#### Message Sender

The following requirements apply to message sender.

| **Actor**      | **Requirement category** | **Normative requirement**                                                                                                                                                                                           |
|----------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Sender | Transmission             | SHALL package and transmit the maternal TX3 to the identified recipient using Chapter 3 and TX3 requirements, preserving the source document, maternal identity/context, and accumulated Workflow Status endpoints. |

### Receiver Actor

The Receiver Actor receives the package and establishes whether the complete payload is accepted or rejected under the declared receiving policy. It applies TX8 reporting only when required under Chapter 3, the applicable transaction rules, and the endpoint’s declared Technical Actor Role capabilities.

#### Message Receiver

The following requirements apply to message receiver.

| **Actor**        | **Requirement category** | **Normative requirement**                                                                                                                                                                                                             |
|------------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Receiver | Receipt                  | SHALL receive and validate the message and make its CDA, communication, optional Task, and metadata available to the Content Consumer. Successful transport receipt alone does not establish successful maternal workflow processing. |

#### Content Consumer

The following requirements apply to content consumer.

| **Actor**             | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                                                                                                                   |
|-----------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer      | Maternal processing      | SHALL resolve the mother and applicable perinatal context, render/access the CDA and its Source Form, and accept/retain the notification in the intended authorized maternal continuity/postpartum workflow. SHALL preserve the baby’s related-subject identity rather than treating newborn observations as maternal observations.                         |
| Information Recipient | Workflow Status          | SHALL determine the terminal TX3 processing outcome and apply conditional Chapter 3/TX8 reporting. Successful reporting is required only when applicable; defined reportable failures follow the applicable rules. When no eligible destination exists, record the unsuccessful reporting obligation without dispatch and without altering TX3 disposition. |

## Transaction-Specific Processing — WHAT IS SPECIAL

The following provisions describe transaction-specific processing.

When a received transaction results in a defined terminal failure requiring TX8, apply the Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason) specified in Chapter 3 Section 3.9.2. Use a shared applicable code with an explanation; optional missing information does not alone establish rejection. Local filtering or preparation failures before this transaction is issued SHALL NOT be reported as rejection of a nonexistent transaction.

### Newborn Admission Detection and Maternal Association

An Information Source or Intermediary monitoring an ADT feed SHALL recognize the newborn-admission pattern used by the implementation. When PID-21 Mother's Identifier is populated, the processing logic SHALL preserve the identifier value and assigning authority needed to resolve the maternal patient. NK1 relationship information MAY provide complementary human-readable or corroborating relationship information.

If the mother cannot be resolved when maternal association is required, the processor SHALL treat the condition as a processing anomaly and SHALL NOT create an uncorrelated Birth Notification.

This birth-specific TX2 input prerequisite includes the mother’s Perinatal Context Instance identifier, learned through prior registration or Antepartum Summary exchange. A legacy input carrying only a Pregnancy type SHALL NOT be silently relabeled Perinatal; resolve its relationship to the established perinatal instance through authoritative context information before preparing a conforming TX3. Do not invent an identifier to satisfy this requirement.

### Perinatal Context and Recipient Resolution

If the maternal perinatal instance, applicable OB/practice relationship, or an appropriate recipient Direct endpoint cannot be resolved uniquely, the processor SHALL NOT send an uncorrelated or ambiguously addressed maternal notification. Address the condition within the input processing workflow. Use TX8’s common patient/context/capability failure categories when their defined terminal-failure conditions apply; do not invent a new rejection code simply for this TX3 definition.

A pre-creation failure means that no outgoing TX3 has yet been issued. It SHALL NOT be reported as rejection of a nonexistent TX3. If generating TX3 is part of the requested incoming TX2 processing, report a terminal failure against that input activity as its requirements specify. If newborn admission processing succeeded and TX3 generation is a separately requested downstream activity, preserve that successful TX2 outcome and handle the downstream failure separately. Apply the TX2 definition’s separate-activity and terminal-outcome requirements.

### CDA Construction and Maternal Workflow Processing

Apply common anomaly handling in Chapter 3 Section 3.9.6 and TX8. Missing primary CDA, unsupported required profile, unresolved maternal identity/context, a wrong patient/subject association, or a material Source Form/narrative inconsistency is a processing anomaly when it prevents the required maternal activity. Optional newborn clinical detail or optional Provenance resource absence alone SHALL NOT establish rejection. Required source/transformation attribution remains necessary.

Acceptance requires resolving the mother under the receiving endpoint’s declared patient-resolution policy, associating the supplied maternal notification with her chart, resolving its required maternal Perinatal Context association, and accepting the whole structured payload into the supported workflow. The endpoint SHALL declare whether its policy permits creation of a new chart when no high-confidence existing match is found. If the required identity, chart, Context, or workflow association cannot be established, the package SHALL be rejected. Acceptance does not establish completion of postpartum care, closure of the Perinatal Context, or the outcome of the original newborn TX2.

### Potential Spawned Newborn-Care Workflow

Detection of the newborn admission may also initiate a separate newborn-care workflow involving an intended pediatric provider. In that separate workflow, the newborn remains the patient/subject and the mother is represented as a related person. That workflow is outside the scope of TX3.

## Relevant Examples — SHOW ME

The following illustrative narrative patterns stand independently of any published sample package. XD and FHIR metadata options preserve the same maternal CDA and workflow semantics. The examples cover both Task-present and Task-absent initiating TX3 configurations. Where TX8 reporting is required, use eligible Task-carried destinations or the Directory-qualified no-Task MDN fallback; inability to dispatch TX8 does not change TX3 disposition.

### October 14 Maternal Birth Notification

The hospital sends a newborn Birth Admission A01 in TX2. It includes the verified mother–newborn association and the mother’s established Perinatal Context Instance identifier, previously received through birth registration or Antepartum Summary sharing. The transforming service resolves Mimi Shell’s maternal episode and the associated OB/practice Direct endpoint, then creates a new TX3 and Maternal Birth Notification CDA.

Mimi is the CDA recordTarget. Her baby is the explicit subject of the Newborn Delivery Information section. A generated HTML Maternal Birth Notification Source Form uses source-supported newborn facts and verified maternal context. The separate message TXT/optional HTML identifies the activity, maternal patient, related newborn, episode, CDA metadata, source, and reporting instructions. The structured package contains the one Task, CDA, metadata, optional Provenance, and identical human-readable message copies; no newborn A01 attachment is included.

### Unresolved Maternal Context Before TX3 Creation

A newborn A01 is received, but its maternal perinatal association cannot be resolved uniquely. The service does not manufacture a maternal CDA or guess an OB endpoint. Input processing and any terminal reporting follow Section 7.2; this is not a rejected outgoing TX3 that was never created.

### Maternal Recipient Processing and TX8

The OB practice resolves the mother under its declared policy, associates the notification and required Perinatal Context with her chart, and determines whole-package acceptance or rejection. In a Task-present case, applicable Task-carried reporting destinations govern required TX8 reporting. In a Task-absent case, a required TX8 report may be dispatched only to the MDN Direct address when its Directory-discoverable CapabilityStatement declares TX8 Receiver support. If no eligible destination exists, the receiver records reporting failure separately without changing the TX3 outcome.

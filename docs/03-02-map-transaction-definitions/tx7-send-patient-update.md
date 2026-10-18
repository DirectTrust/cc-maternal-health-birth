---
title: "TX7: send-patient-update"
---

# TX7: send-patient-update

Reusable Transaction Definition

cc-maternal-health-birth via the Direct Standard® \| Version 1.0 \| Updated 2026-10-14 \| TX7 revision v12

## 1 Transaction Overview — WHY

### 1.1 Purpose and Scope

send-patient-update communicates additions, removals, and replacements of supported patient demographics and patient identifiers to an Information Recipient with an existing relationship to the patient or previously received patient information. Prior information supports matching to the existing record; the Payload identifies the information to change. The transaction does not establish a new patient record or merge patient records.

| **Information category**       | **TX7 scope** | **Boundary**                                                                                                                              |
|--------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Patient demographics           | Included      | Names, addresses, telephone contact data, date of birth, administrative sex, supported base Patient birth details and death information.  |
| Patient identifiers            | Included      | MRN, SSN, driver’s license and other patient identifiers, preserving type and assigning authority/system.                                 |
| Operations                     | Included      | Add previously unrecorded in-scope information; Remove an existing value; Remove/Add to correct or replace a value.                       |
| Coverage and accounts          | Excluded      | Insurance, coverage eligibility, member/subscriber IDs and account numbers.                                                               |
| Care and relationships         | Excluded      | PCP, preferred pharmacy, care teams, preferences, language preferences, related persons, NOK, guardians and personal/legal relationships. |
| Encounter and clinical updates | Excluded      | Room, bed, location, encounter state, dietary orders and clinical changes; patient merges and identity links between distinct people.     |

Scope is determined by the information concept, not merely by its presence in PID or Patient. A coverage identifier does not become an in-scope patient identifier by placing it in Patient.identifier. FHIR Patient, HL7 V2 PID and CDA recordTarget are not identical sets of information. CDA is not a supported TX7 primary Payload option in this revision.

### 1.2 Transaction Identity

SubmissionSet.purpose SHALL carry the DTCodeSystem code send-patient-update independently of Task presence, with the Chapter 3 TransactionTypesVS Extensible binding. When a Workflow Activity Task is included, Task.code SHALL carry the same code and code system. Task.code.text SHALL preserve the approved Task Action Precept: “Process the information in the Payload in the intended workflow.” TX7 is a local editorial label, not the interoperable transaction identifier. A Content Consumer SHALL interpret the received update according to the permitted operations and its authorized workflow; receipt alone does not authorize indiscriminate replacement of a patient record.

### 1.3 Framework Relationship

This Transaction Definition specializes Chapter 3. The common MAP message, metadata, correlation and Workflow Status requirements apply. Appendix D specifies the common XD-to-FHIR packaging mapping. The transaction MAY originate from a native source or an Intermediary processing source updates. The Information Source, clinical author, Workflow Requester, SubmissionSet Source, Transaction Sender and Information Recipient remain distinct roles.

The originating TX7 concludes when the authorized Receiver Actor accepts or rejects the whole structured payload into its intended workflow. TX8 is a separate, subsequent and conditionally required report of that disposition; support for TX7 does not by itself impose TX8 Sender or Receiver capability. When a correlated TX8 is expected and the Chapter 3 reporting interval expires without it, tracking is outcome unconfirmed and requires follow-up; timeout is not rejection, acceptance or proof of non-receipt. A late report resolves the original outcome while preserving timeout and follow-up history.

## 2 Message and Payload Requirements — WHAT

### 2.1 Payload Packaging Structure

Apply Chapter 3 Section 3.8.4. The outer message is multipart/mixed. MIME Part 1 is multipart/alternative containing one required text/plain communication and optional text/html alternatives. MIME Part 2 carries the Structured Payload Package. Identical copies of the TXT and every supplied HTML alternative SHALL be preserved inside that package.

Apply Chapter 3’s Workflow Unit and Structured Payload Architecture requirements and Appendix D for completeness. All required payload and supporting references SHALL resolve within the transmitted Structured Payload Package. Review reports and inspection views outside that package do not supply required transmitted resources. Supporting patient, actor and endpoint resources do not acquire additional DocumentEntries merely because they support a reference.

For XD, supporting resources referenced by an included Task SHALL be contained in that Task; local fragment references resolve only within that containing resource. Each optional Provenance information object SHALL be a FHIR Collection Bundle containing 1..\* assertions and its required supporting agents. For the FHIR change-list option, the previous Patient snapshot is contained in the change List as specified in Section 3.6. Relative peer-object references resolve to files in the same XDM subset. References into another object’s contained resources and nested containment SHALL NOT be used. For FHIR metadata, the change List and any included Task support are direct entries in the outer Collection Bundle; Provenance assertions and agents remain inside their own carrying Collection Bundle. Apply Chapter 3 and Appendix D for security labels and consistent serialization.

#### Message-Level Payload Packaging Structure

| **Message MIME part** | **Conf** | **Package object**                          | **Content MIME type** |
|-----------------------|----------|---------------------------------------------|-----------------------|
| MIME Part 1           | R        | Human-readable patient update communication | text/plain            |
| MIME Part 1           | O        | Human-readable alternative(s)               | text/html             |
| MIME Part 2           | R        | Structured Payload Package                  | application/zip       |

#### Structured Payload Package Contents

| **Conf** | **Package object**                       | **Content MIME type / representation**                     | **Requirement**                                                                                                                                                                                                                                                       |
|----------|------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R        | SubmissionSet and DocumentEntry metadata | Selected XD or FHIR metadata option                        | Describes the information objects and requested Workflow Activity.                                                                                                                                                                                                    |
| O        | Workflow Activity Task                   | application/fhir+xml or application/fhir+json              | Zero or one Task per recipient-specific TX7. When included, its identifier and code align with SubmissionSet identity and purpose.                                                                                                                                    |
| R        | Primary update object                    | text/hl7v2 OR application/fhir+xml / application/fhir+json | Exactly one V2 A08/A47 or one MAP TX7 Patient Change List. Select one alternative; do not submit both as competing primary objects.                                                                                                                                   |
| C        | Updated-information Patient              | application/fhir+xml or application/fhir+json              | Required secondary DE for the FHIR change-list option. Not an additional clinical document.                                                                                                                                                                           |
| C        | Previous-information Patient             | Supporting Patient resource; see Sections 3.6 and 4.1      | Required pre-update matching/removal evidence for the FHIR change-list option. XD: local contained snapshot in the primary change List, and in Task only when Task is present and needs it. FHIR: supporting outer Bundle entry without a separate DocumentReference. |
| O        | Provenance Collection Bundle             | application/fhir+xml or application/fhir+json              | 0..\* independently attributable bundles; each carries its assertions and required agents.                                                                                                                                                                            |
| R        | Human-readable communication             | text/plain                                                 | Identical MIME Part 1 text file; see Section 2.3.                                                                                                                                                                                                                     |
| C        | Human-readable alternatives              | text/html                                                  | Identical copies of every HTML alternative supplied in MIME Part 1.                                                                                                                                                                                                   |

The FHIR change List is the primary DE because it defines the changes being communicated; the updated Patient supplies the values for those changes. Its secondary status does not make it optional. Unrelated documents and supplemental clinical information SHALL NOT be included; send clinical documents separately using TX5. Base Patient and Bundle resources are used without new MAP Patient or Bundle profiles.

### 2.2 Workflow Activity Task

Zero or one Workflow Activity Task MAY be included per independently processable recipient-specific TX7 workflow unit, subject to Chapter 3. SubmissionSet.uniqueId and the corresponding SubmissionSet List business identifier SHALL identify the same logical Transaction Instance independently of Task. When a Task is present, Task.identifier SHALL match that business identifier. Each distinct Information Recipient has its own TX7 Transaction Instance; multiple reporting endpoints do not create additional originating TX7 activities.

| **Task concept**                         | **TX7 requirement**                                                                                                                                                     |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                                | C when Task present. DTCodeSystem send-patient-update, matching SubmissionSet.purpose in code and system.                                                               |
| Action precept                           | C when Task present. Process the information in the Payload in the intended workflow.                                                                                   |
| Patient association                      | SHALL identify the same patient as prior matching metadata and update content. Updated identity is an assertion to validate, not proof of a match.                      |
| Information Recipient                    | Exactly one distinct recipient per TX7; preserve organization and role context.                                                                                         |
| Context                                  | Preserve applicable established Context Instance identifiers; do not manufacture an episode association for a general demographic change.                               |
| Package acceptance reporting instruction | C when Task present. State whether successful TX8 Package Acceptance reporting is requested; reporting obligations otherwise follow Chapter 3 and TX8.                  |
| Workflow Status Update Endpoint          | C when Task present and reporting applies. Eligible accumulated endpoints; without Task, only a Directory-CapabilityStatement-qualified MDN Direct address may be used. |

#### 2.2.1 Workflow Activity Identification

SubmissionSet.uniqueId and the corresponding SubmissionSet List business identifier SHALL identify the same logical TX7 Transaction Instance independently of Task. When a Task is present, its designated Task.identifier SHALL match. An intermediary revising membership, Provenance or reporting endpoints SHALL preserve the business identifier, assign new representation identifiers (including SubmissionSet.entryUUID/List.id and Task.id when applicable), and update affected references. This does not initiate a new Transaction Instance. Package-representation, patient and Context Instance identifiers SHALL remain distinct.

#### 2.2.2 Context Instance Association

Carry applicable Context Instance identifiers and their types and assigning authorities under the common Chapter 3 requirements. Use Perinatal for the established maternal episode when relevant; a demographic update need not be restricted to that episode. Preserve message-carried context separately from authorized lookup or packaging-time context. Do not infer an established episode from an encounter number.

#### 2.2.3 Transaction Correlation

When TX8 reporting applies, each TX8 SHALL correlate to the originating recipient-specific TX7 Transaction Instance and applicable Context Instance(s). A single source update MAY produce several independent TX7 transactions. One recipient’s outcome SHALL NOT be interpreted as the outcome for another recipient.

A responding TX8 has its own current SubmissionSet/List, Workflow Activity Task and Transaction Instance. Its primary information object is a minimal identification snapshot of the originating TX7 SubmissionSet/List. Its required accept/reject Provenance Collection Bundle targets the originating persistent package identifier preserved in that carried snapshot. The report SHALL NOT substitute the originating or reporting Task as that target, retransmit the update solely for correlation, or request another TX8. Disposition occurrence time and TX8 creation/send time remain distinct.

#### 2.2.4 Workflow Status Instructions

Successful whole-payload acceptance reporting through TX8 is conditional under Chapter 3 and the applicable workflow instructions; defined reportable terminal failures retain their applicable reporting obligations. When a Task is present and TX8 reporting applies, use eligible Task-carried Workflow Status Update Endpoints, preserving and deduplicating the accumulated endpoint set and verifying TX8 Receiver capability from each Directory-discoverable CapabilityStatement. When no originating Task is present, the Direct address established for Message Delivery Notifications is the sole eligible TX8 destination, and only when its Directory-discoverable CapabilityStatement declares TX8 Receiver capability. SERV_DESC alone is not proof of capability. No initiated TX7 means no originating transaction for a TX8 response.

If TX8 reporting is required but no eligible endpoint can be established, the reporting actor SHALL record the unsuccessful reporting obligation and SHALL NOT dispatch TX8. That reporting failure SHALL NOT alter the determined originating TX7 processing outcome. The Content Creator MAY include authorized workflow-status routing instructions in an optional Task; it SHALL NOT invent a Task or endpoint merely to satisfy TX8 routing. TX7 support does not imply TX8 support.

### 2.3 Human-Readable Content

The required human-readable communication SHALL identify the requested workflow, patient, prior matching information, affected information and intended recipient. Changes SHALL be understandable without processing the Task, V2 message or FHIR resources. Distinguish pre-update information from the values being added or removed.

| **Information to surface** | **TX7 human-readable coverage**                                                                                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Workflow and identity      | send-patient-update; requested action; Workflow Activity and Transaction identifiers; applicable Context identifiers.                                                                     |
| Patient before changes     | Available pre-update name, birth date, administrative sex, address and identifiers with assigning authority sufficient to support recognition and matching.                               |
| Change rows                | Field, Add/Remove action, actual value and occurrence context. Corrections show linked Remove/Add rows. Never show a missing value as a known previous value.                             |
| Identifier changes         | Identifier type, assigning authority/system, old and new values where applicable. Distinguish correction, addition and removal.                                                           |
| Source and timing          | Responsible Information Source, recorded change/effective time when known, intended recipient and any intermediary or transformation.                                                     |
| Payload objects            | Primary object title/type and media type; required updated Patient when present; previous-value support; optional Provenance summary.                                                     |
| Status instructions        | Whether successful processing reporting is requested and the Workflow Status Update Endpoint(s), distinct from MDN addresses.                                                             |
| V2/debug transparency      | Message type and version; affected segment/field/repetition/component; clear distinction between message-carried new values and prior values obtained from authoritative change evidence. |

For the FHIR option, the communication SHALL reflect the List operations and referenced values, including standalone Add/Remove and paired corrections. For A08, a populated PID field alone SHALL NOT be presented as evidence that the field changed. Source-specific omissions, nulls and repeating-field rules SHALL be honored. Unavailable values SHALL NOT be invented.

### 2.4 Direct Message and Transport Requirements

Apply the common Chapter 3 message-header, XD edge Subject convention, FHIR metadata, Direct Delivery Notification and Workflow Status requirements without redefining them here. Transport delivery does not establish patient matching, acceptance or completion of patient-update processing.

### 2.5 Primary Payload Alternatives

#### 2.5.1 HL7 Version 2 Patient Update

A08 supports in-scope patient-information updates under the selected source V2 profile. PID communicates updated values; it does not generically contain paired previous and new values. The Content Creator SHALL obtain reliable prior state or explicit source change evidence to identify the actual changes and populate prior matching metadata. In a native-source scenario use its change record or pre-update state. An Intermediary MAY compare an incoming update with a reliable source-specific prior state, accounting for message order, duplicates and source omission semantics.

A47 supports correction of an incorrectly assigned PID-3 patient identifier: MRG-1 carries the previous identifier and PID-3 the corrected identifier. It is not a patient merge and is not used simply because a previously unknown identifier becomes known. Identifier additions use the applicable patient-information update profile. Corrections to supported legacy dedicated identifier fields MAY use A08 when permitted by the selected V2 version/profile; A47 does not automatically replace values carried only outside PID-3. Do not generalize A08 to corrections with a more specific required trigger.

The implementation SHALL identify its V2 version/profile and define supported fields, explicit clearing, repetition replacement and source change evidence. Blank or omitted fields SHALL NOT silently become removal instructions. An A08 generated solely for excluded information SHALL NOT initiate TX7. Mixed-content source messages MAY lead to TX7 only for supported changes; unrelated populated source fields SHALL NOT be treated as instructions to update them. The narrow FHIR option is available when a supported V2 change representation cannot be produced.

#### 2.5.2 FHIR Patient Change List

The primary DE SHALL be a List asserting the MAP TX7 Patient Change List profile, canonical http://objects.directtrust.org/standards/fhir/StructureDefinition/map-tx7-patient-change-list. Its required updated Patient SHALL be a secondary DE. Serialize the FHIR objects as application/fhir+xml or application/fhir+json. Payload choice is independent of XD versus FHIR metadata packaging. Do not introduce an inner Collection Bundle for these objects.

List.mode SHALL be changes. Each entry SHALL have exactly one map-patient-change-action code, add or remove, and explicit deleted=false for Add or deleted=true for Remove. List.subject SHALL reference the updated Patient. Each entry.item SHALL reference a Patient and carry exactly one HL7 targetElement extension (http://hl7.org/fhir/StructureDefinition/targetElement), identifying a populated Element.id within that resource. Add entries target the updated Patient; Remove entries target the previous Patient. This is a MAP element-focused change interpretation of List, not deletion of the Patient resource.

Target values SHALL be within the supported Patient elements: identifier, name, telephone telecom, address, gender, birthDate, deceased\[x\] and base multipleBirth\[x\], with applicable value-bearing descendants. In this draft, changes to additional Patient extensions are not specified. For repeating values, generally target the whole Identifier, HumanName, Address or ContactPoint to preserve occurrence context. Keep identifier system/type/authority, contact use and address/name context where present. Do not use array position as the enduring identity of an occurrence.

#### 2.5.3 Correction Pairs and Patient Roles

Proposed TX7 convention for review. List.entry.id SHALL have the form change-N-add or change-N-remove, where N is a positive integer identifying a change group within that List. Exactly one Add and one Remove with the same N constitute a replacement; present Remove immediately before Add. The shared group establishes pairing; adjacency is for readability. An unmatched Add or Remove is a standalone operation. At most one entry of each action is permitted per group. Element IDs have no such pairing meaning in base FHIR; this convention is introduced by TX7.

A correction pair SHALL address the same logical Patient field and occurrence and be validated and applied together. Different values in a repeating field are not automatically a correction pair. Group identifiers SHALL NOT be used as patient identifiers. Bundle entry order has no meaning. Previous and updated versions of the same logical Patient MAY retain the same Patient.id and SHALL be distinguished by meta.versionId and version-specific references where applicable. Bundle.fullUrl remains unversioned; the same fullUrl may identify entries with distinct meta.versionId values under FHIR R4 rules. When distinct resource identities are supplied, use their corresponding resolvable references. Readable names alone do not establish prior/updated roles. XD contained snapshots SHALL follow the containment rules and SHALL NOT carry meta.versionId or meta.lastUpdated.

The previous Patient SHALL carry sufficient pre-update information for matching and all values targeted by Remove entries. The updated Patient SHALL carry patient identity and all values targeted by Add entries. Both represent the same person and MAY contain partial information; neither is an instruction to replace the recipient’s entire Patient record. Omitted fields have no removal meaning. Add-only still includes prior matching information; Remove-only still includes an updated Patient as List.subject, even when there is no replacement value.

## 3 XD Metadata Guidance — HOW

XD is the canonical metadata model. Apply Chapter 3 requirements together with the transaction-specific guidance below. Both V2 and FHIR primary Payload choices use the same patient-update Shared Activity. Supporting patient/actor resources do not authorize unrelated clinical documents.

### 3.1 SubmissionSet

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the contributing Organization identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

| **Metadata element**                      | **TX7 value / source**                                              | **Requirement**                                                                                                                                                   |
|-------------------------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| uniqueId                                  | TX7 SubmissionSet business identifier                               | R; identifies the TX7 Transaction Instance independently of Task; matches Task.identifier when present.                                                           |
| purpose                                   | send-patient-update                                                 | R; DTCodeSystem send-patient-update independently of Task. Task.code SHALL match code and system when present.                                                    |
| contentTypeCode                           | DT20260927-2 Patient Update, DTTemporaryCodeCS                      | Use the primary update typeCode. Existing temporary package concept; pending intended LOINC assignment.                                                           |
| patientId                                 | Recipient-known or agreed exchange-domain patient identifier        | Populate only when known appropriate; do not substitute sender-local ID.                                                                                          |
| sourcePatientId                           | Source identity before the update, with authority                   | Preserve prior source identifier when the update changes it. New identifier belongs in the Payload.                                                               |
| Patient Info (MAP sourcePatientInfo Slot) | Pre-update patient information                                      | R for a single-patient package; use verified pre-update demographics regardless of whether recipient patientId is known. This is a MAP-added SubmissionSet field. |
| intendedRecipient                         | One relevant Information Recipient                                  | Distinguish recipient organization/role from selected Direct endpoint.                                                                                            |
| sourceId / author                         | Contributing Organization OID / responsible initiating organization | Apply common source/author requirements and preserve actor roles.                                                                                                 |
| referenceIdList                           | Applicable established Context identifiers                          | Carry when relevant; type and authority retained.                                                                                                                 |

#### 3.1.1 Patient Identity and Matching

Previously shared identifiers and demographics support matching to an existing recipient record. SubmissionSet and DocumentEntry Source Patient Information SHALL describe pre-update information available from reliable evidence. The identifier appropriate to the recipient is separate from the source-local identifier. A supplied recipient identifier SHALL be independently checked against the available matching information. Neither the updated identifier nor a claimed match SHALL establish an otherwise ambiguous patient identity.

### 3.2 Workflow Activity Task DocumentEntry

When a Workflow Activity Task is present, its separate Task DocumentEntry carries the Task specified in Section 2.2. When Task is absent, no Task DocumentEntry is included. Apply Chapter 3 metadata. SubmissionSet source organization and authorship are handled using the common model.

### 3.3 Primary DocumentEntry

| **Metadata element**                | **TX7 value / source**                                    | **Requirement**                                                                                                                                                               |
|-------------------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mimeType                            | text/hl7v2, application/fhir+xml or application/fhir+json | R; selected primary V2 message or FHIR change List.                                                                                                                           |
| typeCode                            | DT20260927-2 Patient Update                               | Use http://objects.directtrust.org/standards/terminology/CodeSystem/DTTemporaryCodeCS. Align SubmissionSet.contentTypeCode.                                                   |
| classCode                           | Applicable Patient Update object classification           | Apply Chapter 3. DT20260927-2 may represent the declared temporary Patient Update classification; no permanent LOINC category is asserted for this nonclinical update object. |
| formatCode                          | Known applicable content format only                      | MAY be omitted when unknown. The old urn:dt-org:map:patient-update:1.1 is not present in the current terminology package and is not asserted here.                            |
| creationTime                        | Creation of the update object                             | Preserve distinct source change/effective time when known; do not invent encounter times.                                                                                     |
| sourcePatientInfo / sourcePatientId | Pre-update matching information and source identifier     | Maintain prior-versus-new distinction; apply common representation requirements.                                                                                              |
| patientId                           | Recipient-known / agreed exchange identifier              | Conditional on an authoritative suitable identity.                                                                                                                            |
| author and other common metadata    | Source-driven values                                      | Apply Chapter 3 bindings; no fabricated specialty, setting or facility placeholders.                                                                                          |

### 3.4 Provenance DocumentEntry(s)

Optional Provenance Collection Bundles MAY describe source updates, authoring, transformation or package/activity derivation. Each independently attributable bundle has its own DocumentEntry or DocumentReference and SubmissionSet membership. Use DT-20261011-1 Provenance Information from DTTemporaryCodeCS for required information-object classification. Assertions and required agents resolve within that bundle. Cross-bundle targets use identifier-based matching to exactly one information object carried in the same structured payload, under Chapter 3 and Appendix D. Preserve the original source and distinguish it from the transforming or packaging actor.

### 3.5 Human-Readable DocumentEntry

Include the required text/plain DE and every supplied HTML alternative. Apply Section 2.3 coverage and common preservation/metadata rules.

### 3.6 Secondary Data DocumentEntry(s)

For the V2 option, intentionally blank: no supplemental clinical objects are permitted. For the FHIR change-list option, exactly one updated Patient is a required secondary information object with the selected FHIR media type, its own DocumentEntry/DocumentReference and SubmissionSet membership. Its typeCode and applicable broad object classification SHALL use Patient from http://hl7.org/fhir/resource-types (XD CodeSystem OID 2.16.840.1.113883.4.642.4.2), identifying the resource rather than a clinical document or requested transaction. Source Patient Information remains the verified pre-update matching information; Patient payload values are the updated assertions.

For XD packaging, the primary change List SHALL contain the previous Patient snapshot needed to resolve its Remove targets. Remove entry.item references use \#\<contained-id\> within that List, with targetElement identifying the preserved prior field. When a Task is included and references a previous Patient, the required supporting Patient SHALL be contained locally within that Task. When Task is absent, no Task-local Patient is required or permitted to be fabricated. References into another information object’s contained resources and nested containment SHALL NOT be used.

## 4 FHIR Metadata Guidance — HOW

Apply Appendix D to the XD semantics. The FHIR metadata option uses one outer Bundle of type collection. The primary change List and required updated Patient are native direct Bundle entries with corresponding DocumentReferences. No nested primary Collection Bundle is used. V2 content is carried using the common Binary/DocumentReference pattern.

### 4.1 SubmissionSet Representation

Exactly one SubmissionSet List represents the package and SHALL conform to the current MAP SubmissionSet List profile, http://objects.directtrust.org/standards/fhir/StructureDefinition/map-submissionset-list, including its required Purpose extension carrying send-patient-update. It is distinct from the primary TX7 Patient Change List. For the change-list option, the pre-update Patient is a direct outer Bundle entry referenced by the MAP Source Patient Information mapping. SourcePatientID is an Identifier consistent with pre-update source identity; it is not itself a Patient reference. Preserve recipient/exchange identity separately. Use established source organization, designationType and dt-intendedRecipient mappings; do not invent List.subject as a substitute for sourcePatientInfo.

The previous Patient is supporting matching metadata and removal evidence, not an independently submitted clinical information object. In FHIR packaging it is a direct outer Bundle entry without a DocumentReference or SubmissionSet membership solely for that supporting role. Use the current Appendix D source-patient mapping consistently with its verified pre-update identifiers, demographics and version. Complete computable profile validation before asserting conformance; this does not reopen the established carriage decision.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the current contributing Organization. dt-intendedRecipient identifies the intended party independently of Task; when Task is present, its recipient SHALL be consistent. A transport Endpoint SHALL NOT replace the intended party’s identity.

### 4.2 Workflow Activity Task

When Task is present, carry one native Task entry and its DocumentReference under common packaging rules. Its patient association SHALL identify the same person using prior matching context. Preserve requester, Information Recipient, Context, correlation and applicable Workflow Status Update Endpoints. When Task is absent, no Task or Task DocumentReference is included.

### 4.3 Primary Payload Representation

For the FHIR content option, the change List is the primary native resource. The SubmissionSet List references its DocumentReference; that DocumentReference identifies the change List entry. The change List references previous and updated Patient entries with unambiguous references, including version-specific references when both entries retain the same logical Patient identity. targetElement focuses on an Element.id within the referenced Patient. Every required reference SHALL resolve in the same outer Bundle; no remote lookup or nested Collection Bundle is required.

For the V2 content option, preserve the primary A08/A47 as a Binary information object referenced by its DocumentReference. FHIR metadata selection does not transform the V2 Payload into a FHIR Patient automatically.

### 4.4 Provenance Collection Bundle(s)

Each included Provenance information object SHALL be a separate native Collection Bundle entry with its own DocumentReference and current SubmissionSet List membership. Its 1..\* Provenance assertions and supporting agents are entries within that carrying bundle; they are not independently submitted outer entries merely because they support an assertion. Apply Appendix D for target matching, reference scope, security labels and source attribution.

### 4.5 Human-Readable Content

Use the common Binary and DocumentReference packaging for preserved text/plain and optional HTML. These copies SHALL contain the same communication as MIME Part 1 and meet Section 2.3.

### 4.6 Secondary Data Resource(s)

For the FHIR change-list option, the required updated Patient is a native Bundle entry with a corresponding DocumentReference included in SubmissionSet membership. List.subject and Add targets SHALL reference that Patient. Remove targets SHALL reference the distinct previous Patient introduced in Section 4.1. These identities and roles are established by references and operations, not filenames or Bundle entry order. No unrelated secondary clinical objects are permitted. For the V2 option, intentionally blank.

| **Resource**                         | **Role in FHIR change-list package**   | **References**                                                                                                                                   |
|--------------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| SubmissionSet List                   | Package metadata                       | Entries → Task, change List, updated Patient, human-readable and optional Provenance DocumentReferences; source patient info → previous Patient. |
| Previous Patient                     | Pre-update identity and removal values | Target of source patient info and Remove entry.item references.                                                                                  |
| Task                                 | Workflow Activity                      | Requester/recipient/status references under common rules.                                                                                        |
| TX7 change List                      | Primary information object             | subject → updated Patient; Remove → previous Patient; Add → updated Patient.                                                                     |
| Updated Patient                      | Required secondary information object  | New values and identifying context; corresponding DocumentReference belongs to SubmissionSet.                                                    |
| DocumentReferences / Binary / actors | Common supporting packaging            | Apply Appendix D; Bundle membership is not the same as SubmissionSet membership.                                                                 |

## 5 Context IG Guidance

Intentionally blank. No additional Context IG representation is specified in this revision.

## 6 Technical Actor Functional Requirements — WHO DOES WHAT

### 6.1 Content Creator

| **Actor**       | **Requirement category**      | **Normative requirement**                                                                                                                                                                                                         |
|-----------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Creator | Identify changes              | SHALL identify actual supported additions/removals/replacements from reliable source evidence. A08 generation alone is insufficient; no separate coverage/eligibility function is in scope.                                       |
| Content Creator | Determine relevant recipients | SHALL determine which authorized Information Recipients need each supported change, using relevant existing relationships or prior exchange evidence.                                                                             |
| Content Creator | Suppress duplicates           | SHALL suppress duplicate notification of the same change to the same recipient while preserving distinct later updates.                                                                                                           |
| Content Creator | Create transactions           | SHALL create a distinct SubmissionSet and Transaction Instance for each recipient, with zero or one Workflow Activity Task. No recipients or no supported change means no TX7 and therefore no TX8 for a nonexistent transaction. |
| Content Creator | Represent and render          | SHALL select a supported content option, preserve prior identity, generate clear human-readable changes and avoid inventing missing state. Transformations require an established mapping and appropriate provenance.             |

### 6.2 Message Sender

| **Actor**      | **Requirement category**   | **Normative requirement**                                                                                                                                                                                              |
|----------------|----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Sender | Packaging and transmission | SHALL package and transmit the selected TX7 objects using Chapter 3 and the selected metadata option.                                                                                                                  |
| Message Sender | Status endpoints           | SHALL preserve applicable accumulated Workflow Status Update Endpoints when a Task is present. When Task is absent and TX8 reporting is required, apply only the Directory-CapabilityStatement-qualified MDN fallback. |

### 6.3 Message Receiver

| **Actor**        | **Requirement category**   | **Normative requirement**                                                                                                                     |
|------------------|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Message Receiver | Receive and make available | SHALL validate the received message and make metadata, update objects and preserved human-readable content available to the Content Consumer. |

### 6.4 Content Consumer

| **Actor**        | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                                                                                                                   |
|------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer | Match before update      | SHALL establish an unambiguous existing patient match before applying changes.                                                                                                                                                                                                                                                                              |
| Content Consumer | Validate and process     | SHALL validate references, field scope, occurrence context and correction pairs. SHALL NOT replace the whole patient record from partial resources.                                                                                                                                                                                                         |
| Content Consumer | Preserve evidence        | SHALL preserve applicable source/provenance and audit history. Removal changes current asserted information, not historical evidence.                                                                                                                                                                                                                       |
| Receiver Actor   | TX8 outcome              | SHALL determine the processing outcome and apply conditional Chapter 3/TX8 reporting obligations. Successful reporting is conditional; defined reportable failures follow applicable requirements. If no eligible TX8 destination exists, record the unsuccessful reporting obligation, do not dispatch TX8, and do not change the originating TX7 outcome. |

## 7 Transaction-Specific Processing — WHAT IS SPECIAL

When a received transaction results in a defined terminal failure requiring TX8, apply the Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason) specified in Chapter 3 Section 3.9.2. Use a shared applicable code with an explanation; optional missing information does not alone establish rejection. Local filtering or preparation failures before this transaction is issued SHALL NOT be reported as rejection of a nonexistent transaction.

### 7.1 Patient Update Processing

Apply Chapter 3 Section 3.9.6 and TX8 for general processing anomalies and status reporting. Local change filtering and duplicate suppression before a TX7 is initiated are not recipient rejections and do not generate TX8. Unknown source change state requires local resolution; do not fabricate a before-image.

When a received update cannot be unambiguously matched, or an identifier authority is missing, the Content Consumer SHALL NOT guess. When a Remove target conflicts with the current recipient value, or a correction cannot be associated with the intended occurrence, the Consumer SHALL NOT overwrite a different value. An already-applied identical change MAY be handled idempotently when its identity and effect are established. Follow organizational reconciliation policy and the common reportable anomaly rules; do not create new failure codes in this definition.

Add SHALL NOT create duplicate occurrences or a second value in a singleton field unless a valid correction removes the prior value. Validate paired Remove/Add operations together; do not leave a singleton field cleared because its replacement failed. A standalone Remove requires an identifiable current occurrence. Unrelated omissions remain unchanged. For repeating data, validate identifier authority/type or other occurrence context. TX8 completed reports acceptance of the whole structured payload into the authorized patient-update workflow; it does not by itself prove that every asserted change was committed to the recipient’s longitudinal record. If local policy stages reconciliation after acceptance, distinguish that subsequent work from the concluded TX7 disposition.

### 7.2 Remaining Specification Items for Review

| **Item**                    | **Current decision**                                                                                                            | **Remaining work**                                                                                                                                                                                                                                                                                             |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| List profile alignment      | One List profile; no Patient or Bundle profile                                                                                  | Check the packaged Change List profile against the flat FHIR Collection model, version-aware Patient references, XD-contained prior Patient, and correction-group convention. Any remaining profile discrepancy requires artifact alignment; this definition does not silently modify the terminology package. |
| Previous Patient under XD   | Previous snapshots are locally contained in the primary change List, and in Task only when Task is present and references them. | Validate local fragment and peer-file references, security labels and preserved Remove targets in both Task-present and Task-absent packages. No extra prior-Patient DocumentEntry is created merely for matching.                                                                                             |
| Supporting Patient metadata | Updated Patient is a required secondary information object, classified as Patient                                               | Align the profile and examples with the resource-types coding and pre-update sourcePatientInfo mapping; complete computable validation.                                                                                                                                                                        |
| Terminology and validation  | DT20260927-2 is available; formatCode may be omitted                                                                            | Permanent LOINC classification remains open. Full HL7 Validator validation of the List profile and representative packages is outstanding.                                                                                                                                                                     |
| V2 implementation profile   | A08 and narrowly defined A47 alternatives                                                                                       | Specify supported version, clearing and repetition semantics, reliable change evidence and recipient interpretation before implementation.                                                                                                                                                                     |

## 8 Relevant Examples — SHOW ME

The following are standalone illustrative patterns, independent of complete sample packages. Demonstrate the same changes using XD and FHIR metadata where the applicable packaging rules are fully specified. Do not assign a fixed example count. Common TX8 success/failure examples remain in the TX8 Definition.

### 8.1 Demographic Correction

Correct date of birth from 1961-08-05 to 1961-05-08. Human-readable rows identify Remove then Add. For FHIR, entries change-1-remove and change-1-add target birthDate elements in previous and updated Patients. Source Patient Information retains the prior birth date. For A08, new PID-7 is supported by separately obtained authoritative previous state.

### 8.2 Patient Identifier Correction

Correct an MRN within the same assigning authority. A47 MRG-1 carries the incorrect identifier and PID-3 the corrected identifier. An equivalent FHIR example uses paired identifier Remove/Add entries preserving system/type. Driver’s license and SSN corrections follow the selected identifier profile; a merge is excluded.

### 8.3 Addition and Removal

An SSN previously not recorded becomes known: Add only, without inventing an old SSN. Remove a telephone number recorded for the wrong person: Remove only, without a fabricated replacement. Both retain sufficient pre-update matching information, and the FHIR option includes the updated Patient even when it carries only identity for a Remove-only change.

### 8.4 Recipient Selection and Non-Triggering Updates

One supported source change relevant to two organizations creates two independent TX7 transactions and separately determined outcomes. Where TX8 reporting applies, each has its own correlated TX8 report; a TX7 without a Task uses only the Directory-CapabilityStatement-qualified MDN fallback. An A08 generated only for a bed, dietary or coverage change creates no TX7. These illustrate Content Creator responsibilities without introducing a separate eligibility transaction.

### 8.5 Standards References

HL7 V2.5.1 Chapter 3, Sections 3.3.8 (A08) and 3.3.47 (A47): https://www.hl7.eu/HL7v2x/v251/std251/ch03.html. HL7 FHIR R4 List: https://hl7.org/fhir/R4/list.html. HL7 targetElement extension and R4-compatible definition: https://hl7.org/fhir/extensions/StructureDefinition-targetElement.html. MAP-specific element operations and pairing are defined by this transaction, not by base FHIR alone.

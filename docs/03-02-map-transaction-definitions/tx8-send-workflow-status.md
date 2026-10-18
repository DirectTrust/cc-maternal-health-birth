# TX8: send-workflow-status

**<span class="smallcaps">Reusable Transaction Definition</span>**

## Transaction Overview — WHY

Reliable information exchange requires more than successful message delivery. Organizations also need to know whether information they sent or helped convey was accepted into the recipient's intended workflow or rejected because it could not be processed. Without this feedback, participants may incorrectly assume that delivered information is available for use, leaving processing failures undetected and potentially disrupting coordination across organizational boundaries.  
  
send-workflow-status recognizes that information exchange is a multi-participant activity and provides a standardized mechanism for making the outcome of that exchange observable and actionable to the participants involved. By communicating a correlated, machine-processable acceptance or rejection decision to the appropriate participants, the transaction supports shared situational awareness, timely resolution of processing failures, and accountability across the information exchange process.

### Purpose and Scope

send-workflow-status reports the terminal acceptance or rejection of the originating MAP Structured Payload Package as a whole, including any Workflow Activity Task present and all included DocumentEntries. This pattern does not report partial acceptance. TX8 is distinct from SMTP/Direct delivery status and from downstream clinical service fulfillment.

Acceptance or rejection implies that the reporting actor received sufficient information to determine the package’s disposition. A separate receive Provenance record is not required in TX8. Unpacking does not itself establish acceptance. Package acceptance does not establish import or clinical review of every included object, or delivery of downstream services. An accepted referral package may be associated with a ServiceRequest that is later not fulfilled; that later outcome does not retroactively reject the package.

Package Acceptance SHALL be reported through TX8 when package acceptance reporting was requested by the originating workflow. Package Acceptance MAY be reported through TX8 even when package acceptance reporting was not requested. The absence of a request SHALL NOT be interpreted as a request to suppress Workflow Status reporting.

A defined processing failure requiring Workflow Status SHALL be reported through TX8 regardless of whether package acceptance reporting was requested. When the originating Payload is rejected from the intended workflow, TX8 SHALL report Package Rejection and the applicable failure reason.

### Transaction Identity

The canonical transaction code is send-workflow-status. TX8 is a local editorial label and is not the interoperable transaction identifier. TX8 is a separate, subsequent correlated Transaction Instance in the reverse organizational direction. The authorized Receiver Actor determines acceptance or rejection before TX8 reports it; TX8 reports the disposition of the concluded originating transaction rather than continuing or replacing that transaction. The organization sending TX8 is therefore the Information Source for TX8, and the original transaction initiator is the Information Recipient for TX8. Correlation preserves the relationship to the originating transaction; it does not freeze the originating transaction actor roles.

The originating Transaction context concludes when the authorized Receiver Actor accepts or rejects the entire structured payload into the intended workflow. TX8 is a separate, subsequent Transaction Instance that reports that established disposition. Receipt of TX8 confirms the outcome to its recipients; it does not determine when the originating transaction concluded. Acceptance does not establish completion of subsequent clinical processing or service fulfillment.

If no correlated TX8 is received within the applicable reporting interval, the originating system SHALL close its transaction tracking context with the outcome unconfirmed and mark it as requiring follow-up. This administrative closure does not establish acceptance, rejection, or non-receipt and does not cancel required reporting. A late TX8 SHALL be correlated to the original transaction and used to resolve its recorded unconfirmed outcome; it SHALL NOT create a new originating Transaction Instance or erase the timeout and follow-up history.

### Framework Relationship

This Transaction Definition specializes the common MAP Transaction Framework in Chapter 3, including Section 3.9.6. It defines the common processing anomaly handling and terminal Workflow Status reporting used by initiating MAP transactions. Each initiating Transaction Definition defines its own successful processing requirements and any additional processing rules or anomaly qualifications in Section 7.

## Message and Payload Requirements — WHAT

A TX8 message carries the correlated workflow status and its supporting information in machine-processable and human-readable forms. The following requirements define the package, reporting Task, and transport representation.

### Payload Packaging Structure

The snapshot, reporting Task, outcome Provenance Bundle, and human-readable copies are distinct submitted information objects. The original clinical payload is not retransmitted.

TX8 SHALL apply the common MAP Message and Transport Framework in Chapter 3. Its independently processable package SHALL contain a primary originating-package identification snapshot, one reporting Task, a required outcome Provenance Collection Bundle, and identical copies of the human-readable communication.

TX8 SHALL apply Chapter 3 Section 3.8.4. The Direct message uses multipart/mixed; MIME Part 1 is multipart/alternative with one required text/plain file and optional text/html alternatives. MIME Part 2 carries the Structured Payload Package using the selected XD or FHIR metadata representation. The package SHALL contain identical copies of every human-readable file supplied in MIME Part 1.

Apply Chapter 3 and Appendix D for package completeness. Provenance.target.identifier SHALL match exactly one carried minimal originating-package snapshot by its preserved business identifier. Original clinical objects and original membership links are not retransmitted solely to establish the target. Review files outside the transmitted package do not supply required resources.

For XD, Task support SHALL be contained within the reporting Task. Provenance assertions and required agents SHALL reside in their own Collection Bundle. The primary snapshot SHALL be a separate FHIR R4 List serialized as application/fhir+xml. Package-local locators and bundle-local support references SHALL resolve without external retrieval. Do not reference another information object’s contained resources.

#### Message-Level Payload Packaging Structure

| **Message MIME-part** | **Conf.** | **Package object**                                   | **Content MIME type** |
|-----------------------|-----------|------------------------------------------------------|-----------------------|
| MIME Part 1           | R         | Human-readable Workflow Status                       | text/plain            |
| MIME Part 1           | O         | Human-readable alternative(s)                        | text/html             |
| MIME Part 2           | R         | Structured Payload Package — XDM ZIP or FHIR package | application/zip       |

#### Structured Data Package Contents

| **Conf.** | **Package object**                                | **Content MIME type / representation**                     | **Requirement**                                                                                                                              |
|-----------|---------------------------------------------------|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| R         | XDM/FHIR SubmissionSet/List                       | Selected metadata representation                           | Package-level metadata; apply Chapter 3.                                                                                                     |
| R         | XDM/FHIR DocumentEntries/DocumentReferences       | Selected metadata representation                           | Describe the included information objects.                                                                                                   |
| R         | Originating package identification snapshot       | application/fhir+xml or application/fhir+json; XD uses XML | Primary object; FHIR List with preserved originating identifiers and no membership. Each has its own metadata and report package membership. |
| R         | FHIR Task — Workflow Status and Workflow Activity | application/fhir+xml or application/fhir+json              | Exactly one reporting Task, separate from the primary originating identification snapshot.                                                   |
| R         | Outcome Provenance Collection Bundle              | application/fhir+xml or application/fhir+json              | Required accept/reject assertion, coded performer, bundle-local agents, logical target matching the carried snapshot.                        |
| R         | Human-readable Workflow Status                    | text/plain                                                 | Identical copy of the MIME Part 1 text/plain file; coverage is specified in Section 2.3.                                                     |
| C         | Human-readable alternative(s)                     | text/html                                                  | Include identical copies of every HTML alternative supplied in MIME Part 1; HTML remains optional at message level.                          |

### Workflow Activity Task

Exactly one reporting FHIR Task SHALL represent send-workflow-status and communicate the originating disposition. It is separate from the primary identification snapshot and has its own DocumentEntry or DocumentReference. Do not include a second Task.

TX8 Task.status describes the originating package’s disposition: completed means package acceptance; failed means package rejection. It does not describe success or failure of creating or transmitting the TX8 report. The existing single-Task and no-recursion rules remain applicable.

| **Reported outcome** | **Task.status** | **Required Provenance Activity** | **Meaning**                                                                                                                                |
|----------------------|-----------------|----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Package Acceptance   | completed       | accept                           | The whole originating package was accepted into the intended workflow; receipt is implied; downstream service fulfillment is not asserted. |
| Package Rejection    | failed          | reject                           | The whole originating package was rejected with a reason; sufficient receipt is implied; no partial acceptance is reported.                |

The TX8 Task outcome, asserted Provenance Activity, and observable recipient behavior SHALL be consistent. A system asserting Package Rejection SHALL demonstrate that the rejected Payload files were not retained as accepted information. Security logs, transient queues, quarantine, audit records, and legally required transport evidence do not constitute retention as accepted information.

| **FHIR Task concept**           | **TX8 requirement**                                                                                                                 |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                       | send-workflow-status                                                                                                                |
| Task.status                     | completed for Package Acceptance; failed for Package Rejection                                                                      |
| Task.identifier                 | Identifies the TX8 Transaction Instance / Workflow Activity as profiled by MAP                                                      |
| Correlation                     | Explicit correlation to the originating SubmissionSet business identifier, whether or not an originating Task exists                |
| Task.for                        | Patient identity when applicable                                                                                                    |
| Failure reason                  | Required when status=failed; Task.output.valueCodeableConcept uses MAPFailureReasonVS with Extensible binding and explanatory text. |
| Successful-reporting request    | SHALL NOT request another TX8                                                                                                       |
| Workflow Status Update Endpoint | SHALL NOT be used to request another TX8                                                                                            |

A failed TX8 SHALL carry a machine-processable failure reason in Task.output.valueCodeableConcept with an Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason). Shared codes use system http://objects.directtrust.org/standards/terminology/CodeSystem/DTCodeSystem. Task.output.type.text identifies “Framework failure reason”; it is descriptive output typing, not a new CodeSystem. Task.output.valueCodeableConcept.text and Task.statusReason.text SHALL explain the failure. Use an applicable ValueSet concept when one exists; an alternative coding is permitted when no concept adequately expresses the failure. Shared codes are sender-not-authorized, unsupported-use-case, payload-not-processable, patient-not-found, and context-not-found. Use the current DirectTrust Terminology and Artifacts package definitions.

Task Action Precept. Task.code.text SHALL make the requested TX8 activity explicit: “Process the information in the Payload in the intended workflow.” The TX8 Content Consumer processes and correlates the status assertion; it does not repeat the originating clinical activity.

#### Workflow Activity Identification

Task.identifier and SubmissionSet.uniqueId SHALL identify the same logical TX8 Workflow Activity, as defined in Chapter 3.

The originating SubmissionSet business identifier establishes the logical Workflow Activity Identifier used for correlation, whether or not the originating Structured Payload Package includes a Workflow Activity Task. If the originating Task is present, its Task.identifier SHALL match the originating SubmissionSet business identifier. TX8 SHALL have its own distinct transaction and Workflow Activity identity and SHALL explicitly reference the originating Transaction Instance.

#### Context Instance Association

TX8 SHALL identify the originating Transaction Instance and SHALL preserve/correlate the applicable Context Instance identifiers needed to interpret the reported outcome. TX8 SHALL NOT create a new clinical Context Instance merely because Workflow Status is being reported.

#### Transaction Correlation

The TX8 Task SHALL explicitly correlate the reported outcome to the originating Transaction Instance. The TX8 Workflow Activity identifier identifies the status-reporting activity; it SHALL NOT replace the identifier of the originating activity. Apply Chapter 3 Sections 3.2.3 and 3.9.4.

The originating SubmissionSet.uniqueId is the authoritative business identifier of the originating Workflow Activity. When the originating Task exists, its Task.identifier SHALL agree with that identifier. TX8 SHALL preserve the originating identifier for correlation and SHALL assign a distinct identifier to the TX8 SubmissionSet and its single reporting Task. The absence of an originating Task SHALL NOT cause a Task to be inferred or reconstructed.

#### Workflow Status Instructions

When the originating Structured Payload Package includes a Workflow Activity Task, the TX8 Sender SHALL use the applicable Workflow Status Update Endpoints conveyed and accumulated under that Task and the governing workflow instructions, subject to confirmation of eligible TX8 Receiver capability. When the originating package has no Workflow Activity Task and TX8 reporting is required, the sole eligible Workflow Status Update Endpoint is the Direct address established for Message Delivery Notifications, and only if its DirectTrust Directory-discoverable CapabilityStatement declares send-workflow-status Receiver support (supportsReceive=true). Directory SERV_DESC alone SHALL NOT establish that capability.

The TX8 Sender SHALL dispatch the same reportable outcome once to each distinct eligible Workflow Status Update Endpoint selected under Section 2.2.5. In the Task-present case, preserve and deduplicate applicable accumulated endpoints. In the Task-absent case, no fan-out or alternative return address is inferred: only the Directory-qualified Message Delivery Notification Direct address is eligible. If no eligible destination can be resolved, the reporting actor SHALL record the unsuccessful TX8 reporting obligation and SHALL NOT attempt TX8 dispatch. Failure to dispatch TX8 SHALL NOT, by itself, change the originating Transaction Instance disposition.

TX8 is terminal Workflow Status reporting for an originating MAP transaction. A TX8 Workflow Activity Task SHALL NOT request package acceptance reporting and SHALL NOT identify Workflow Status Update Endpoints for the purpose of requesting another TX8. Direct final-destination delivery notification MAY still be requested for the TX8 Direct Message. No subsequent TX8 is generated to report processing of a TX8 Payload.

When an originating Workflow Activity Task is present, the Content Creator SHALL include the applicable Workflow Status Update Endpoint instructions required by the initiating transaction; subsequent Sender Actors SHALL preserve applicable accumulated endpoints. When the originating Task is absent, a required TX8 report SHALL use only the Directory-qualified Message Delivery Notification address under Section 2.2.5. TX8 itself SHALL NOT carry instructions requesting another TX8.

### Human-Readable Content

The human-readable communication SHALL identify the originating transaction and Workflow Activity identifier, patient when applicable, terminal outcome, determination time, and Workflow Status meaning. It SHALL state “Package accepted” or “Package rejected”; a rejected outcome SHALL include a human-readable failure reason. Machine processing SHALL NOT be required to distinguish the outcomes.

The communication SHALL adequately describe the TX8 Workflow Activity and the information in the Structured Payload Package. It SHALL identify send-workflow-status, the TX8 Workflow Activity identifier, the originating transaction identifier and type, applicable Context identifiers, and the reporting organization and intended Information Recipient. Patient demographics and identifiers SHALL be surfaced when available and applicable; an identifier that could not be established SHALL NOT be invented.

The communication SHALL state whether the originating Payload was accepted/retained or rejected from the intended workflow, the determination time, and any applicable failure reason. It SHALL summarize the terminal Task status and identify the included Task and Provenance objects by title or description and media type. It SHOULD summarize the Provenance activity, responsible actor, activity time, and affected Payload or Transaction Instance. Additional secondary information objects, when supplied, SHOULD be identified by title or description and media type. The communication SHALL distinguish the reported processing outcome from Direct transport delivery status.

### Provenance Requirements

TX8 SHALL carry the required accept/reject Provenance Collection Bundle under Section 3.4, with coded performer, disposition occurrence time, assertion recorded time, and a logical target matching the carried originating identification snapshot. Additional attributable assertions MAY be included under Chapter 3.10; no separate receive assertion is required.

### Direct Message and Transport Requirements

TX8 SHALL apply the common Direct Delivery Notification and Workflow Status requirements defined in Chapter 3. A Direct final-destination delivery notification for the TX8 message reports transport delivery of TX8 itself; it does not alter or replace the terminal processing outcome that TX8 reports for the originating transaction.

## XD Metadata Guidance — HOW

TX8 applies the Chapter 3 canonical metadata model. SubmissionSet.purpose identifies send-workflow-status. SubmissionSet.contentTypeCode follows the primary snapshot typeCode: List from http://hl7.org/fhir/resource-types (XD CodeSystem OID 2.16.840.1.113883.4.642.4.2). Task.status and accept/reject Provenance communicate disposition; contentTypeCode does not classify the outcome. Patient identity is evaluated from the TX8 reporting perspective.

### SubmissionSet

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the contributing Organization identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

| **Metadata element** | **TX8 value / source**                                                                                                                                          | **Requirement**                                                                                                                                                                                                                     |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| uniqueId             | System-assigned                                                                                                                                                 | R; identifies this TX8 SubmissionSet.                                                                                                                                                                                               |
| intendedRecipient    | Authorized party intended to process this TX8                                                                                                                   | R. Identify the receiving Organization or provider role, consistently with Task recipient. The accumulated Workflow Status Update Endpoint supplies delivery destination, not recipient identity; one delivery per unique endpoint. |
| patientId            | Patient identifier known by the TX8 Information Source to be appropriate to the TX8 Information Recipient or mutually agreed exchange patient-identifier domain | C. Populate only when known. Do not copy an unrelated local identifier from either side merely to populate patientId.                                                                                                               |
| Patient Info         | Same representation and semantics as DocumentEntry.sourcePatientInfo; identifies the patient associated with the reported processing attempt                    | R when TX8 is patient-associated and the SubmissionSet pertains to one patient. Include even when patientId is known; for a patient-match failure, carry the Patient Info associated with the attempted match.                      |
| purpose              | send-workflow-status                                                                                                                                            | R; aligns with TX8 Workflow Activity Task.code.                                                                                                                                                                                     |
| contentTypeCode      | List from http://hl7.org/fhir/resource-types                                                                                                                    | Classifies the primary identification snapshot; disposition is Task.status and Provenance.activity.                                                                                                                                 |
| referenceIdList      | Applicable originating Context Instance identifiers                                                                                                             | O/RE as applicable.                                                                                                                                                                                                                 |
| sourceId             | Organization Identity OID of the actor contributing the TX8 SubmissionSet                                                                                       | R. This is the TX8 Information Source, which is normally the Information Recipient of the originating transaction.                                                                                                                  |

#### Reverse-Direction Patient Identity

TX8 is a new transaction. Patient-identity metadata is therefore evaluated from the perspective of the TX8 Information Source and Information Recipient. It SHALL NOT be populated by mechanically copying patientId, sourcePatientId, or sourceId from the originating transaction.

When the actor sending TX8 successfully matched the patient, its locally known patient identifier may be represented as DocumentEntry.sourcePatientId for TX8. If patient matching failed and the TX8 Information Source did not establish a local patient identity, it SHALL NOT manufacture a sourcePatientId. SubmissionSet Patient Info remains available to identify the demographics associated with the attempted match.

As with other MAP push transactions, patientId is populated only when the TX8 Information Source knows the identifier appropriate to the TX8 Information Recipient or a mutually agreed exchange patient-identifier domain.

#### Role-Reversal Example

Originating TX1: Organization A sends an Outpatient Visit Notification to Organization B. A is the Information Source and B is the Information Recipient. SubmissionSet.sourceId identifies A; DocumentEntry.sourcePatientId carries A's local patient identifier. patientId is populated only if A knows the identifier appropriate to B or the mutually agreed exchange domain. SubmissionSet Patient Info is present regardless.

Return TX8: Organization B reports the processing outcome to Organization A. B is now the Information Source and A is the Information Recipient. SubmissionSet.sourceId identifies B. If B successfully matched the patient, B's local identifier may appear as the TX8 DocumentEntry.sourcePatientId. TX8 patientId is populated only if B knows the identifier appropriate to A or the mutually agreed exchange domain. The TX8 correlation identifies the originating TX1 without preserving TX1's actor-role assignments.

Patient Not Found: if B cannot establish a patient match, B does not manufacture a local sourcePatientId. The failed TX8 still carries the SubmissionSet Patient Info associated with the attempted match and reports Task.status=failed, the Patient Not Found failure reason, and Provenance activity reject.

### Workflow Activity Task DocumentEntry

The reporting Task has its own DocumentEntry separate from the primary snapshot. Apply Section 2.2 to its identity, outcome status, correlation and no-recursion instructions.

### Primary DocumentEntry

The primary information object SHALL be a minimal FHIR R4 List snapshot. Use status=current, mode=snapshot, and no List.entry; narrative SHALL explain that original membership was omitted. Preserve original uniqueId, sourceId, submissionTime, purpose and applicable typed Context identifiers. Original entryUUID and title MAY be retained. Omit original patient, author, and intended-recipient references. Its local id/fullUrl SHALL differ from its preserved business identifier. Classify it as List using the resource-types CodeSystem. XD packages this same List as a separate application/fhir+xml file, not a second active RegistryPackage in METADATA.XML.

| **Metadata element** | **TX8 requirement**                                                                                                                                                                                 |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mimeType             | application/fhir+xml or application/fhir+json; use the representation selected for the package.                                                                                                     |
| classCode            | List from http://hl7.org/fhir/resource-types; XD uses its OID 2.16.840.1.113883.4.642.4.2.                                                                                                          |
| typeCode             | List; this classifies the identification snapshot, not the outcome.                                                                                                                                 |
| patientId            | C. Identifier known by the TX8 Information Source to be appropriate to the TX8 Information Recipient or mutually agreed exchange domain; do not mechanically copy from the originating transaction. |
| creationTime         | TX8 identification extract creation time; preserved original submissionTime remains List.date.                                                                                                      |
| sourceId             | TX8 SubmissionSet Source                                                                                                                                                                            |
| sourcePatientId      | C/RE. TX8 Information Source local patient identifier when a local identity was established; SHALL NOT be manufactured when patient matching failed.                                                |
| sourcePatientInfo    | RE when available. Patient demographics associated with the TX8 source patient identity using established XD semantics.                                                                             |

### Provenance DocumentEntry(s)

The outcome Provenance Collection Bundle is REQUIRED and SHALL have its own DocumentEntry or DocumentReference and membership. Its classCode and typeCode SHALL use DT-20261011-1 Provenance Information from DTTemporaryCodeCS. It SHALL carry accept when Task.status=completed or reject when Task.status=failed, using DTCodeSystem and ProvenanceActivityVS. Its coded performer SHALL identify the receiving Organization responsible for determining disposition. The target SHALL identify the whole originating package by the original business identifier and match exactly one carried snapshot; it SHALL NOT target the original Task, report Task, or report SubmissionSet.

For both XD and FHIR, Provenance.target SHALL contain type=List and the original Identifier.system/value, with no literal reference. OID-based uniqueId uses system=urn:ietf:rfc:3986 and value=urn:oid:\<original uniqueId\>. Supporting agents SHALL resolve inside the carrying Provenance Collection Bundle. Preserve occurredDateTime for disposition determination separately from recorded for assertion creation.

### Human-Readable DocumentEntry

Apply Chapter 3 metadata and content-preservation requirements. The human-readable DocumentEntry SHALL cover the terminal workflow outcome as specified in Section 2.3 and carry identical copies of the human-readable files supplied in MIME Part 1, as specified in Section 2.1.

### Secondary Data DocumentEntry(s)

No additional TX8-specific secondary data requirements are specified. Common Chapter 3 requirements apply without modification when secondary information objects are included.

## FHIR Metadata Guidance — HOW

Apply the common Chapter 3 XD-to-FHIR mapping to the same package-level and information-object semantics specified in Section 3. The representation does not create a different transaction. Use the FHIR XML or JSON representation selected for the package.

### SubmissionSet Representation

Represent SubmissionSet semantics in a FHIR List and information-object metadata in its referenced DocumentReferences using the common mapping. Preserve Section 3.1 identification, intended recipient, patient identity, Context, source, purpose, and outcome-classification requirements.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the current contributing Organization. dt-intendedRecipient identifies the same intended party as the Task recipient; a transport Endpoint SHALL NOT replace that party’s identity.

### Workflow Activity Task

Carry exactly one reporting Task as a separate native FHIR resource. Preserve TX8 identity, send-workflow-status code, terminal disposition, originating correlation, Context, and no-recursion instructions.

### Primary Payload Representation

Carry the Section 3.3 identification snapshot as a separate native List described by its own DocumentReference. The snapshot is not the report’s organizing List. Preserve the selected original fields and omit original membership.

### Provenance Collection Bundle(s)

Carry the Section 3.4 outcome Provenance Collection Bundle as a separate native Bundle with its own DocumentReference. Its assertion targets the carried snapshot by identifier. Agents resolve inside that bundle; nested entries are not peer entries of the outer package.

### Human-Readable Content

Preserve the human-readable coverage and identical TXT/HTML copies specified in Sections 2.1 and 2.3 using the common FHIR metadata representation.

### Secondary Data Resource(s)

Apply the common mapping to any secondary information objects. No additional TX8-specific secondary data requirements are specified.

## Context IG Guidance

Apply Chapter 3 and Sections 2.2.2–2.2.3 for Context preservation and originating transaction correlation.

## Technical Actor Functional Requirements — WHO DOES WHAT

The Content Creator, Message Sender, Message Receiver, and Content Consumer perform the following functions to create, deliver, correlate, and process the workflow status report.

### Sender Actor

The Sender Actor combines Content Creator and Message Sender functions. It creates and preserves the TX8 reporting objects, metadata, originating correlation identifiers, Context identifiers and required Provenance, and transmits to the eligible Workflow Status Update Endpoint(s) selected under Section 2.2.5. It SHALL verify TX8 Receiver capability using the Directory-discoverable CapabilityStatement and SHALL record an unsuccessful reporting obligation without dispatch if no eligible destination exists.

| **Actor**           | **Requirement category** | **Normative requirement**                                                                                                                                        |
|---------------------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TX8 Content Creator | Package Acceptance       | SHALL create Task.status=completed plus Provenance activity accept when successful reporting is required; MAY do so when successful reporting was not requested. |
| TX8 Content Creator | Package Rejection        | SHALL create Task.status=failed, an applicable failure reason, and Provenance activity reject for a defined reportable failure.                                  |
| TX8 Content Creator | Consistency              | SHALL ensure Task outcome, Provenance Activity, and represented observable behavior are semantically consistent.                                                 |

| **Actor**          | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                                                                                        |
|--------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TX8 Message Sender | Endpoint fan-out         | SHALL transmit the same outcome once to each eligible, deduplicated endpoint when the originating Task exists; without that Task, SHALL use only the Directory-qualified Message Delivery Notification address. SHALL NOT dispatch without an eligible TX8 Receiver destination; SHALL record unsuccessful reporting separately. |
| TX8 Message Sender | No recursion             | SHALL NOT request TX8 Workflow Status for TX8 itself.                                                                                                                                                                                                                                                                            |

### Receiver Actor

The TX8 Receiver Actor combines Message Receiver and Content Consumer functions. It receives and validates the TX8 report, correlates its terminal assertion with the originating SubmissionSet business identifier and applicable Context, and makes the outcome available to the appropriate participant. The actor that received the originating transaction determines its disposition and causes required TX8 reporting; this responsibility is distinct from the Receiver Actor processing TX8 itself.

| **Actor**            | **Requirement category** | **Normative requirement**                                                                                   |
|----------------------|--------------------------|-------------------------------------------------------------------------------------------------------------|
| TX8 Message Receiver | Receipt                  | SHALL receive and validate TX8 and make the terminal outcome available to the appropriate Content Consumer. |

| **Actor**                                   | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                |
|---------------------------------------------|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer of originating transaction | Outcome determination    | SHALL determine whether the originating Payload was accepted into the intended workflow or encountered a reportable rejection.                                                                                                                           |
| TX8 Content Consumer                        | Correlation              | SHALL correlate to the originating SubmissionSet business identifier and applicable Context Instance(s), irrespective of whether the originating package included a Task.                                                                                |
| Originating system                          | Expected TX8 monitoring  | SHALL close originating tracking as outcome unconfirmed and requiring follow-up after the applicable interval; a late TX8 resolves the original outcome while preserving timeout history. Timeout is not rejection, acceptance, or proof of non-receipt. |

## Transaction-Specific Processing — WHAT IS SPECIAL

The following rules govern reportable processing anomalies, intermediary terminal failures, reporting termination, and follow-up when an expected correlated report does not arrive.

### Common Anticipated Processing Anomalies

The following common anomaly handling specializes the original Metadata and Payloads Framework Section 3.4.2 (printed pages 50–51) using the Chapter 3 terminal Workflow Status mechanism. Evaluate the condition against the initiating transaction’s processing requirements, endpoint capabilities, and applicable authorization rules. Detection of an anomaly does not by itself establish rejection if the condition can be resolved and the requested processing succeeds. A defined terminal failure requiring Workflow Status SHALL produce a failed TX8 with the applicable machine-processable reason and reject Provenance, regardless of whether successful reporting was requested.

A defect in one included object may cause rejection of the entire package. The rejection reason SHOULD identify the affected object when known. Whole-package rejection does not assert that every document was individually evaluated or found defective.

<table>
<colgroup>
<col style="width: 26%" />
<col style="width: 73%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Anomaly / initial reason</strong></th>
<th><strong>Processing decision and reporting guidance</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Unauthorized sending entity<br />
sender-not-authorized</td>
<td>Determine whether the entity is authorized to participate in the declared use case. If lack of authorization prevents processing, report rejection. Explain the applicable authorization process and reference the endpoint capability declaration when available and appropriate.</td>
</tr>
<tr class="even">
<td>Unsupported declared use case<br />
unsupported-use-case</td>
<td>Determine whether the endpoint supports the declared use case and requested transaction. If it cannot perform the required activity, report rejection and explain the capability mismatch.</td>
</tr>
<tr class="odd">
<td>Noncompliant or unprocessable Payload<br />
payload-not-processable</td>
<td>Determine whether the package, metadata, required objects, and content satisfy the initiating transaction and declared endpoint capabilities. If a defect prevents successful processing, report rejection and identify the unmet requirement or processing limitation.</td>
</tr>
<tr class="even">
<td>Patient cannot be resolved<br />
patient-not-found</td>
<td>Evaluate patient resolution against the initiating transaction. A previously unknown patient is not automatically a failure when the workflow permits establishing that patient. If the required identity cannot be resolved or established and processing cannot succeed, report rejection; explain available registration or identity-resolution steps where appropriate. Do not manufacture patient identifiers.</td>
</tr>
<tr class="odd">
<td>Required established Context cannot be resolved<br />
context-not-found</td>
<td>Evaluate whether the supplied established Context is required to perform the initiating activity. If it cannot be resolved and this prevents processing, report rejection and identify the unresolved Context. Absence of an optional Context identifier alone is not a failure; do not create a clinical Context merely to report status.</td>
</tr>
</tbody>
</table>

The reason codes above are defined by the shared MAP Failure Reason CodeSystem and Extensible ValueSet binding in Section 2.2. Additional coding may express a failure not adequately represented by that ValueSet. Initiating Transaction Definition Section 7 supplies additional conditions or qualifications. Preserve originating correlation, transaction-relative patient identity, and the outcome/Provenance/observable-behavior consistency requirements. Unknown patient identity is not automatically failure when the initiating transaction permits identity establishment; absence of optional Context is not context-not-found.

### Intermediary Terminal Failure

When an Intermediary is authorized to determine a terminal processing or routing failure that prevents the originating transaction from reaching the intended downstream workflow, it SHALL produce a failed TX8 when the applicable originating transaction or framework rules require reporting. It SHALL assert reject Provenance at that processing boundary and resolve the TX8 destination using the Task-present or Task-absent routing rules in Section 2.2.5. If no eligible destination exists, it SHALL record the reporting failure without dispatch; the originating processing outcome remains independently determined.

### TX8 Terminates Workflow Status Reporting

Apply the no-recursion requirements in Section 2.2.4. TX8 reports one terminal outcome of the originating transaction. Delivery of that outcome to multiple accumulated endpoints does not create multiple outcomes. Direct delivery notification may still apply to TX8 itself, as specified in Section 2.5.

### Expected TX8 Response and Follow-Up

When TX8 reporting is expected because it was requested or otherwise required, apply the reporting interval in Chapter 3. The interval begins when the last Sender Actor within the Information Source Organization’s scope of control sends to a Routing Target associated with the Information Recipient Organization. Recipient-side routing, evaluation, and return reporting are included; additional recipient-side hops do not restart the clock. The default interval is 60 minutes unless an explicit use-case or Information Recipient-specific interval is established. If no correlated TX8 is received within the applicable reporting interval, the originating system SHALL close its transaction tracking context with the outcome unconfirmed and mark it as requiring follow-up. This administrative closure does not establish acceptance, rejection, or non-receipt and does not cancel required reporting. A late TX8 SHALL be correlated to the original transaction and used to resolve its recorded unconfirmed outcome; it SHALL NOT create a new originating Transaction Instance or erase the timeout and follow-up history. Missing or unreadable correlation information or a missing return endpoint may prevent a correlated report; the timeout does not identify the cause or require automatic retransmission. This rule applies to the expected report about an originating transaction, not to a report about TX8 itself. When no eligible TX8 destination can be resolved, the reporting actor SHALL record the unsuccessful reporting obligation and SHALL NOT attempt dispatch. This reporting failure does not change the independently determined disposition of the originating package.

## Relevant Examples — SHOW ME

The following illustrations represent alternative whole-package outcomes, not sequential updates. They cover both an originating package with a Workflow Activity Task and an originating package without one. In each case, correlate TX8 to the originating SubmissionSet business identifier, not to the existence of an originating Task. Package Acceptance uses Task.status=completed and Provenance activity accept; Package Rejection uses Task.status=failed, an applicable failure reason, and Provenance activity reject.

The XD and FHIR illustrations below describe equivalent representations of acceptance and rejection, not complete downloadable archives. Task-present case: an initiating TX1 includes a Task whose identifier agrees with the originating SubmissionSet business identifier; eligible accumulated status endpoints govern return routing. Task-absent case: an initiating TX2 or TX4 includes no Task; if TX8 reporting is required, the Message Delivery Notification Direct address is the sole eligible return endpoint, and only when its Directory-discoverable CapabilityStatement declares TX8 Receiver support. If capability is absent or cannot be discovered, record the reporting failure and do not dispatch. The TX8 report in either case contains exactly one TX8 reporting Task, its own SubmissionSet, the originating-package identification snapshot, and required outcome Provenance.

### Package Acceptance — XD Metadata

Illustrative XD outcome: Task.status=completed with Provenance activity accept represents acceptance/retention under the originating transaction requirements. Correlate to the originating transaction and apply the current TX8 identity perspective.

The illustrative outcome SHALL maintain agreement among Task status, coded failure reason when applicable, Provenance activity and observable acceptance/rejection behavior. The XD and FHIR representations preserve those same semantics.

### Package Acceptance — FHIR Metadata

Illustrative FHIR outcome: Task.status=completed with Provenance activity accept represents acceptance/retention under the originating transaction requirements. Correlate to the originating transaction and apply the current TX8 identity perspective.

The illustrative outcome SHALL maintain agreement among Task status, coded failure reason when applicable, Provenance activity and observable acceptance/rejection behavior. The XD and FHIR representations preserve those same semantics.

### Package Rejection — XD Metadata

Illustrative XD outcome: Task.status=failed, MAP failure reason patient-not-found, and Provenance activity reject. Do not manufacture a local sourcePatientId when no patient match was established. Correlate to the originating transaction and apply the current TX8 identity perspective.

The illustrative outcome SHALL maintain agreement among Task status, coded failure reason when applicable, Provenance activity and observable acceptance/rejection behavior. The XD and FHIR representations preserve those same semantics.

### Package Rejection — FHIR Metadata

Illustrative FHIR outcome: Task.status=failed, MAP failure reason patient-not-found, and Provenance activity reject. Do not manufacture a local sourcePatientId when no patient match was established. Correlate to the originating transaction and apply the current TX8 identity perspective.

The illustrative outcome SHALL maintain agreement among Task status, coded failure reason when applicable, Provenance activity and observable acceptance/rejection behavior. The XD and FHIR representations preserve those same semantics.

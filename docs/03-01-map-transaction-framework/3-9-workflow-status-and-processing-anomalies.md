---
title: "3.9 Workflow Status and Processing Anomalies"
---

# 3.9 Workflow Status and Processing Anomalies

TX8 send-workflow-status is a subsequent Shared Activity that communicates the terminal acceptance or rejection of the originating structured payload as a whole, including its Workflow Activity Task and all included information objects. This pattern does not report partial acceptance. TX8 is not a general-purpose intermediate workflow-progress protocol and is distinct from the clinical status of the patient or condition represented by the exchanged information.

Acceptance or rejection implies sufficient receipt to identify the structured payload and determine its workflow status. A separate receive Provenance assertion is not required in TX8. Unpacking alone does not establish acceptance into the intended workflow. Acceptance does not establish that every information object was imported or clinically reviewed, or that downstream services were delivered. For a referral, structured payload acceptance, clinical referral acceptance, and performance of the referred services are distinct decisions. Later inability to deliver services does not retroactively reject the accepted structured payload.

## Structured Payload Acceptance Reporting

structured payload acceptance SHALL be reported through TX8 when structured payload acceptance reporting was requested by the originating workflow. structured payload acceptance MAY be reported through TX8 even when structured payload acceptance reporting was not requested by the originating workflow. The absence of a request for structured payload acceptance reporting SHALL NOT be interpreted as a request to suppress Workflow Status reporting.

## Structured Payload Rejection Reporting

A defined processing failure requiring Workflow Status SHALL be reported through TX8 regardless of whether structured payload acceptance reporting was requested. The failed TX8 SHALL identify the applicable failure reason and SHALL assert the reject Provenance activity when the originating structured payload was rejected from the intended workflow. A defect in one included information object may cause rejection of the whole package.

Coded failure reason. A failed TX8 SHALL carry an applicable failure reason in Task.output.valueCodeableConcept, using an Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason). Codes defined by the failure-reason family of the consolidated DirectTrust CodeSystem SHALL use system http://objects.directtrust.org/standards/terminology/CodeSystem/DTCodeSystem. Task.output.type SHALL identify the output as “Framework failure reason”; this descriptive text is not a new terminology binding. Task.output.valueCodeableConcept.text and Task.statusReason.text SHALL explain the actual processing failure. When an applicable concept exists in the ValueSet it SHALL be used; an alternative coding may be supplied when no concept adequately expresses the failure.

The shared failure reasons are sender-not-authorized, unsupported-use-case, payload-not-processable, patient-not-found, and context-not-found. Select the reason appropriate to the actual failure and the applicable transaction requirements. A missing optional patient or Context value does not by itself establish a failure.

## Terminal Outcome Semantics

A TX8 terminal outcome describes acceptance or rejection of the originating package. The Task status and Provenance assertion SHALL express the same workflow status.

| **Outcome** | **FHIR Task status** | **Required Provenance Activity** | **Expected observable behavior** |
|----|----|----|----|
| structured payload acceptance | completed | accept | Entire originating structured payload accepted into the intended workflow; sufficient receipt implied; subsequent processing or service fulfillment not asserted. |
| structured payload rejection | failed | reject | Entire originating structured payload rejected from the intended workflow with a reason; sufficient receipt implied; no partial acceptance reported. |

A system asserting structured payload rejection SHALL demonstrate that the rejected information objects were not retained as accepted information in the Information Recipient’s workflow environment. This does not prohibit security logs, transient queues, quarantine, audit records, or legally required transport evidence.

The TX8 Task outcome, asserted Provenance Activity, and observable recipient behavior SHALL be consistent.

TX8 Task.status describes the originating structured payload’s workflow status, not success or failure of transmitting the report: completed indicates acceptance; failed indicates rejection. The single report Task is separate from TX8’s primary information object, the minimal identification snapshot of the originating SubmissionSet/List.

## Correlation and Multiple TX8 Deliveries

TX8 is a separate, subsequent Transaction Instance that SHALL correlate to the concluded originating Transaction Instance and applicable Context Instance(s). When more than one Workflow Status Update Endpoint has accumulated, the same reportable workflow status is delivered to each unique endpoint. Multiple TX8 deliveries of the same outcome do not represent multiple workflow outcomes.

The originating Transaction context concludes when the authorized Receiver Actor accepts or rejects the entire structured payload into the intended workflow. TX8 is a separate, subsequent Transaction Instance that reports that established disposition. Receipt of TX8 confirms the outcome to its recipients; it does not determine when the originating transaction concluded. Acceptance does not establish completion of subsequent clinical processing or service fulfillment.

TX8 SHALL carry a minimal identification snapshot of the originating SubmissionSet/List as its primary information object. The snapshot is an identification extract, not an unchanged copy of the original metadata or a second active SubmissionSet organizing TX8’s information objects. It SHALL preserve the originating SubmissionSet.uniqueId, sourceId, submissionTime, and purpose identifying the Shared Activity. Original entryUUID and title MAY be retained; applicable Context instance identifiers SHALL be retained when required for correlation. Original membership links SHALL be omitted. Patient, author, and intended-recipient resource references SHALL be omitted from this extract; this does not remove requirements applying independently to TX8’s own structured payload. TX8’s report SubmissionSet/List SHALL have its own distinct uniqueId.

The required accept or reject Provenance assertion SHALL identify the originating structured payload using its preserved SubmissionSet.uniqueId in Provenance.target.identifier. For an OID-based uniqueId, identifier.system SHALL be urn:ietf:rfc:3986 and identifier.value SHALL be urn:oid:\<originating-SubmissionSet.uniqueId\>. The Receiver Actor SHALL match that identifier to exactly one carried minimal identification snapshot. External retrieval SHALL NOT be required. Provenance.target SHALL remain present; its literal reference element SHALL be omitted for this TX8 target. The assertion SHALL NOT target TX8’s report SubmissionSet/List, its reporting Task, or the originating Workflow Activity Task.

For FHIR metadata, the identification snapshot SHALL be a List conforming to the dedicated MAP identification-snapshot profile specified with its encoding in Appendix D and the TX8 Transaction Definition. List.entry SHALL be absent. List.status and List.mode SHALL be populated according to that profile; they describe the identification snapshot, not acceptance or rejection. The narrative SHALL state that original membership information was intentionally omitted. The preserved originating business identifier SHALL remain distinct from the snapshot’s local resource identity.

For XD metadata, the identification snapshot SHALL be the same minimal FHIR R4 List serialized as application/fhir+xml, described by its own DocumentEntry and linked from TX8’s report SubmissionSet. It SHALL NOT appear as a second active SubmissionSet in METADATA.XML. Use List.status=current, List.mode=snapshot, omit List.entry, and preserve the selected originating identifiers, source, time, purpose, and applicable Contexts. Reference.type=List identifies this FHIR target; original clinical information objects are not retransmitted solely to establish the target.

For a TX8 sent by Organization B back to the original initiator, Organization A, B is the Information Source and A is the Information Recipient for TX8. When the same outcome is sent to another accumulated Workflow Status Update Endpoint, the Information Recipient for that TX8 is the party authorized and intended to process the status at that destination. A transport endpoint or forwarding service does not become the Information Recipient merely by receiving the Direct message. SubmissionSet.sourceId and patient-identity metadata SHALL be interpreted from the perspective of the current TX8 Transaction Instance; correlation separately identifies the originating Transaction Instance and applicable Context Instance(s).

## TX8 Terminates Workflow-Status Chaining

TX8 SHALL NOT request or require a subsequent TX8 Workflow Status transaction in response to itself. A TX8 Workflow Activity Task SHALL NOT request structured payload acceptance reporting and SHALL NOT identify Workflow Status Update Endpoints for the purpose of requesting another TX8. Direct final-destination delivery notification remains applicable to the TX8 Direct message when requested. The resulting pattern is: originating transaction → TX8 → optional Direct delivery notification for TX8 → stop.

## Common Processing Anomalies and Transaction-Specific Requirements

All MAP Transactions SHALL apply the common processing anomaly handling and terminal outcome reporting requirements defined in the TX8 send-workflow-status Transaction Definition. The common anomaly categories include an unauthorized sending entity, an unsupported declared use case, a structured payload that does not meet the declared use case or endpoint capabilities, inability to resolve the patient required for processing, and inability to resolve an established Context Instance required for processing.

The common anomaly categories SHALL use the shared failure-reason terminology and Extensible binding specified in Section 3.9.2. Unknown patient identity does not automatically establish patient-not-found when the transaction permits registration or establishment of identity. Absence of an optional Context identifier does not establish context-not-found. Required patient or Context identifiers SHALL NOT be fabricated to make a failed package appear processable.

Each initiating Transaction Definition SHALL define the processing required to perform its Shared Activity successfully. Its Section 7 SHALL specify any additional transaction-specific processing rules, anomaly conditions, or qualifications beyond the common handling defined in TX8. Whether a patient or Context resolution condition prevents successful processing SHALL be determined against those transaction requirements; an absent optional Context identifier does not, by itself, establish a processing failure.

When an anomaly results in a defined processing failure requiring Workflow Status, the Information Recipient SHALL report the terminal outcome through TX8 according to Section 3.9.2. The report SHALL identify the applicable failure reason and correlate to the originating Transaction Instance. The asserted outcome, Provenance Activity, and observable recipient behavior SHALL remain consistent with Section 3.9.3. Successful Direct delivery alone does not establish successful processing.

The TX8 Transaction Definition provides the common anomaly handling details and relevant XD and FHIR examples of structured payload acceptance and structured payload rejection. Other Transaction Definitions SHOULD reference those examples and use their own Section 8 for examples specific to the initiating Shared Activity. A subsequent, separately performed workflow activity has its own processing outcome; failure of that later activity does not change an already established successful outcome of the originating transaction.

## Workflow Status Update Endpoint Accumulation

At least one endpoint = SHALL. The transaction-initiating system SHALL identify at least one Workflow Status Update Endpoint to receive TX8 Workflow Status for the originating Transaction Instance.

Preserve existing endpoints = SHALL. Each subsequent Sender Actor SHALL preserve all Workflow Status Update Endpoints already associated with the originating Transaction Instance.

Add your own endpoint = MAY. An Intermediary Sender Actor MAY add its own Workflow Status Update Endpoint when that intermediary also needs to be informed of the eventual structured payload acceptance or structured payload rejection outcome. The intermediary SHALL apply the representation-update rules in Sections 3.5.2 and 3.5.3: preserve the shared Workflow Activity business identifier, carry the updated Task representation with a new Task.id, and update package membership, affected references, and applicable Provenance. The additional endpoint does not create a new logical Task or Transaction Instance.

The Content Creator MAY obtain the initial Workflow Status Update Endpoint from the supplied endpoint discovery information or explicit configuration. The selected endpoint SHALL be carried in the originating Workflow Activity Task. Each subsequent Sender Actor SHALL preserve the carried endpoints rather than depend on discovery to reconstruct them. When TX8 is required, Workflow Status SHALL be sent to each unique Workflow Status Update Endpoint accumulated for the originating Transaction Instance. Duplicate Direct addresses SHALL result in a single TX8 delivery to that address for the same reportable outcome.

## Missing Workflow Status and Follow Up

When workflow status reporting is requested or otherwise required, the expected interval SHALL start when the last Sender Actor acting within the Information Source Organization’s scope of control sends to a Routing Target associated with the Information Recipient Organization. Source-side preparation and intermediary hops before that handoff are outside the interval. Recipient-side routing, receipt, evaluation, and return of the workflow status report are within it; additional recipient-side hops SHALL NOT restart the clock. The default interval for this use case is 60 minutes unless an explicit use-case or Information Recipient-specific interval is established. Processing after acceptance is outside the reporting interval.

If no correlated TX8 is received within the applicable reporting interval, the originating system SHALL close its transaction tracking context with the outcome unconfirmed and mark it as requiring follow-up. This administrative closure does not establish acceptance, rejection, or non-receipt and does not cancel required reporting. A late TX8 SHALL be correlated to the original transaction and used to resolve its recorded unconfirmed outcome; it SHALL NOT create a new originating Transaction Instance or erase the timeout and follow-up history. Missing or unreadable correlation information or a missing return endpoint may prevent a correlated report; the timeout does not identify the cause. It SHALL NOT require automatic retransmission.

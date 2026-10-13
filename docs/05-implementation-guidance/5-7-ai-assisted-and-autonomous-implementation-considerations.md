---
title: "5.7 AI-Assisted and Autonomous Implementation Considerations"
---

# 5.7 AI-Assisted and Autonomous Implementation Considerations

Artificial intelligence (AI) and autonomous processing can increase the usefulness of information exchanged through Direct Messaging, particularly when clinically meaningful information is conveyed in narrative form. AI changes the relationship between narrative and computability while preserving the deterministic metadata, provenance, authority, accountability, privacy, and human oversight needed for trustworthy interoperability.

Implementations that employ autonomous or agentic capabilities should also apply the DirectTrust Core Principles for the Governance of Autonomous Systems. Those principles call for autonomous systems to be identifiable, bounded, auditable, stoppable, privacy-preserving, technically enforceable, and remediable. The DirectTrust publications page identifies the published principles: https://directtrust.org/resources/publications-formal-comments.

## AI-Assisted Content Creators and Content Consumers

AI assistance may support the grouped Sender Actor in classifying source information, selecting permitted information-object representations, preparing required metadata and terminology, assembling a Workflow Activity Task, associating Context Instances, creating XD or FHIR metadata, and packaging a Direct message. The Content Creator establishes at least the minimum Information Source information needed to initiate the transaction; the grouped Sender Actor completes the required information objects, Task, and Provenance. The division of work between Content Creator and Message Sender may vary by implementation. AI assistance does not relax the transaction requirements.

AI-assisted Content Consumers may use explicit exchange metadata to identify the Shared Activity, patient, Context, and requested workflow, while interpreting the included information objects. Narrative notes, summaries, birth plans, referrals, patient-authored information, and source forms can support processing without requiring the sender to pre-code every statement. Derived interpretations remain attributable to the processing system rather than being presented as original source assertions.

Use of AI does not alter the externally observable conformance requirements of a transaction, the capabilities asserted by an endpoint, or the obligation to preserve accurate identity, authority, provenance, and accountability.

## Deterministic Metadata and AI-Derived Meaning

Information that controls or correlates a transaction SHALL be represented explicitly when required by the specification. This includes transaction identity, patient identity, Routing Target and report endpoints, Context identifiers, structured payload identity, Task, Provenance, and authorization controls. AI inference cannot replace required deterministic values.

AI may be used to derive additional meaning from narrative information-object content. An implementation may, for example, identify a preferred pediatrician in a Birth Plan, classify the clinical relevance of an incoming narrative, or recognize that information is pertinent to a maternal-health workflow. Such derived meaning must not be represented as though it were an original structured assertion made by the Information Source.

## Assistance, Authority, and Autonomous Processing

AI may support functions such as classification, extraction, summarization, matching assistance, routing assistance, workflow recognition, and presentation. Implementers should distinguish assistance from authority. A capability authorized to summarize or recommend is not automatically authorized to alter a record, select a new Information Recipient, create a new clinical assertion, initiate a transaction, or otherwise change state.

When an AI-enabled component acts autonomously, its authority should be explicitly bounded. DirectTrust's governance principles distinguish supportive functions such as Recommend, Assist, Summarize, and Alert from agentic functions that independently Decide, Perform, Administer, or Prescribe. These categories should not share an undifferentiated permission set.

For Direct Messaging, delegated authority may be constrained by permitted transaction types, structured payload types, data access, destinations, tools, and effects. For example, a Mailroom Utility may be authorized to receive and classify send-admission-notification transactions and route their structured payloads to authorized workflows without being authorized to originate unrelated transactions or modify source clinical content.

## Identity, Authority, Accountability, and Provenance

An autonomous process should remain attributable to accountable human and organizational authority. Non-human actors, the systems on which they operate, and the humans or organizations responsible for their deployment should be identifiable according to the applicable trust framework. Authority should be least-privilege, bounded to the assigned goal, time-limited where appropriate, revocable, and enforced independently of the autonomous process. A responsible human should retain the ability to suspend, override, or terminate autonomous behavior.

AI processing makes accurate Provenance more important, not less. Implementations should preserve the distinction among the original Information Source, the Intermediary or Receiver Actor that processed the information, the technology component or autonomous process that performed a processing activity, and any new information derived from that activity.

Use the published activity codes and bindings required by the applicable Transaction Definition. Examples include creation, signing, assembly, transformation, transmission, receipt, acceptance, and rejection; these activity labels do not authorize locally invented wire codes. Trace derived information to its source and the activity that produced it. Transport delivery, receipt of the structured payload, acceptance or rejection into the workflow, and subsequent processing remain distinct observations.

## Logging, Privacy, Human Oversight, and Remediation

AI and autonomous activity should be logged sufficiently to establish accountability, reconstruct relevant events, and preserve provenance. At the same time, telemetry should minimize the collection, retention, and disclosure of sensitive and personal information to what is necessary for the applicable purpose. Logging should support independent review of consequential autonomous actions without creating an unnecessary secondary repository of clinical information.

Implementations should provide human review and correction or remediation when AI or autonomous processing produces an error or potentially harmful result. Examples include incorrect patient matching, erroneous routing, inappropriate transaction initiation, inaccurate extraction, or an incorrect workflow status assertion. Correction should preserve the evidence of the original assertion and the accountable correction activity.

## Example: AI-Enabled Mailroom Utility

Consider an FQHC that operates a Mailroom Utility for incoming and outgoing Direct information. The organization maintains a broad service that tracks outside visits for all primary-care patients and a narrower maternal-care service that tracks relevant events for patients receiving OB care.

| **Processing step** | **What should be explicit** | **What AI may assist with** | **Governance / provenance consideration** |
|----|----|----|----|
| Take delivery of the Direct message | Endpoint, use case, canonical transaction, structured payload metadata representation, return-routing controls | Prioritization or operational triage | An MDN establishes transport delivery, not structured payload receipt or acceptance. |
| Identify the patient and relevant contexts | Required patient and Context Instance identifiers | Matching assistance when deterministic identifiers are insufficient | Preserve identifiers and evidence used; do not silently convert an inference into source truth. |
| Determine applicable internal workflows | Canonical transaction and explicit workflow/context metadata when available | Recognize that the same event may be relevant to multiple authorized workflows | AI-assisted routing must operate within delegated authority. |
| Interpret information-object content | Original narrative remains available | Extract, classify, summarize, or highlight clinically relevant information | Derived assertions remain traceable to the original information object and AI activity. |
| Evaluate acceptance into the intended workflow | Authorized decision, requested Task, and applicable package requirements | Assist evaluation within delegated authority | TX8 reports package acceptance or rejection. Either implies sufficient receipt, not successful parsing or processing of every attachment. |
| Create or send downstream information | Explicitly authorized transaction and recipient | Draft or assemble content when authorized | Do not attribute AI-derived assertions to the original Information Source; record applicable provenance. |

The governing principle is straightforward: use explicit structure for information that controls interoperability behavior, preserve narrative and source information that already carries meaning, and use AI to increase the utility of that information without erasing responsibility, provenance, or human accountability.

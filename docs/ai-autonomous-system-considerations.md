---
title: AI and Autonomous System Considerations
---

# AI and Autonomous System Considerations

Artificial intelligence (AI) and autonomous processing can increase the usefulness of information exchanged through Direct Messaging, particularly when clinically meaningful information is conveyed in narrative form. This chapter describes how AI changes the relationship between narrative and computability while preserving the deterministic metadata, provenance, authority, accountability, privacy, and human oversight needed for trustworthy interoperability.

Implementations that employ autonomous or agentic capabilities should also apply the DirectTrust Core Principles for the Governance of Autonomous Systems. Those principles call for autonomous systems to be identifiable, bounded, auditable, stoppable, privacy-preserving, technically enforceable, and remediable.

## AI and Progressive Structuring

Historically, reliable automated processing often depended on converting clinically meaningful information into discrete coded data. AI-enabled processing changes that constraint. Narrative text can increasingly be classified, summarized, searched, extracted, and used to support workflow decisions.

AI-enabled processing therefore reduces dependence on coded data for semantic understanding; it does not eliminate the need for deterministic structure where information controls interoperability behavior. This distinction supports Progressive Structuring: add explicit structure where it creates dependable interoperability value, while allowing useful narrative to remain narrative when requiring additional coding would add burden without corresponding benefit.

## Deterministic Metadata and AI-Derived Meaning

Do not rely on AI inference for information that must deterministically control or correlate an interoperability transaction. Transaction identity, patient identity, endpoint routing, Context Instance identifiers, Payload identity, lifecycle state, provenance, authorization, workflow controls, and other metadata required for safe automated behavior should be represented explicitly when required by the transaction.

AI may be used to derive additional meaning from narrative Payload Content. An implementation may, for example, identify a preferred pediatrician in a Birth Plan, classify the clinical relevance of an incoming narrative, or recognize that information is pertinent to a maternal-health workflow. Such derived meaning must not be represented as though it were an original structured assertion made by the Information Source.

## AI-Assisted Information Processing

AI may support functions such as classification, extraction, summarization, matching assistance, routing assistance, workflow recognition, and presentation. Implementers should distinguish assistance from authority. A capability authorized to summarize or recommend is not automatically authorized to alter a record, select a new Information Recipient, create a new clinical assertion, initiate a transaction, or otherwise change state.

## Autonomous and Agentic Processing

When an AI-enabled component acts autonomously, its authority should be explicitly bounded. DirectTrust's governance principles distinguish supportive functions such as Recommend, Assist, Summarize, and Alert from agentic functions that independently Decide, Perform, Administer, or Prescribe. These categories should not share an undifferentiated permission set.

For Direct Messaging, delegated authority may be constrained by permitted transaction types, Payload types, data access, destinations, tools, and effects. For example, a Mailroom Utility may be authorized to receive and classify send-admission-notification transactions and route their Payloads to authorized workflows without being authorized to originate unrelated transactions or modify source clinical content.

## Identity, Authority, and Accountability

An autonomous process should remain attributable to accountable human and organizational authority. Non-human actors, the systems on which they operate, and the humans or organizations responsible for their deployment should be identifiable according to the applicable trust framework.

Authority should be least-privilege, bounded to the assigned goal, time-limited where appropriate, revocable, and enforced independently of the autonomous process. A responsible human should retain the ability to suspend, override, or terminate autonomous behavior.

## AI and Data Provenance

AI processing makes accurate Data Provenance more important, not less. Implementations should preserve the distinction among the original Information Source, the Intermediary or Receiver Actor that processed the information, the Technology Actor or autonomous process that performed a processing activity, and any new information derived from that activity.

Relevant provenance activities may include Create, Sign, Seal, Update, Assemble, Transform, Transmit, Receive, Void, Deprecate, and Entered-in-Error. When AI extracts, classifies, summarizes, assembles, or transforms information, the resulting information should remain traceable to its source and to the processing activity that produced it.

## Logging, Privacy, and Minimum Necessary Telemetry

AI and autonomous activity should be logged sufficiently to establish accountability, reconstruct relevant events, and preserve provenance. At the same time, telemetry should minimize the collection, retention, and disclosure of sensitive and personal information to what is necessary for the applicable purpose.

Logging should support independent review of consequential autonomous actions without creating an unnecessary secondary repository of clinical information.

## Human Oversight, Error Correction, and Remediation

Implementations should provide a path for human review when AI or autonomous processing produces an error or potentially harmful result. Correction, reversal where feasible, and remediation should be possible for outcomes such as incorrect patient matching, erroneous routing, inappropriate transaction initiation, incorrect extraction of narrative information, or an inaccurate workflow-status assertion.

## Example: AI-Enabled Mailroom Utility

Consider an FQHC that operates a Mailroom Utility for incoming and outgoing Direct information. The organization maintains a broad service that tracks outside visits for all primary-care patients and a narrower maternal-care service that tracks relevant events for patients receiving OB care.

| **Processing step** | **What should be explicit** | **What AI may assist with** | **Governance / provenance consideration** |
|----|----|----|----|
| Receive the Direct message | Endpoint, use case, canonical transaction, Payload Metadata representation, return-routing controls | Prioritization or operational triage | Receiving the Message is not the same as delivering the Payload to its intended workflow. |
| Identify the patient and relevant contexts | Required patient and Context Instance identifiers | Matching assistance when deterministic identifiers are insufficient | Preserve identifiers and evidence used; do not silently convert an inference into source truth. |
| Determine applicable internal workflows | Canonical transaction and explicit workflow/context metadata when available | Recognize that the same event may be relevant to both general ADT tracking and maternal care | AI-assisted routing must operate within delegated authority. |
| Interpret narrative Payload Content | Original narrative remains available | Extract, classify, summarize, or highlight clinically relevant information | Derived information must remain traceable to the original Payload and AI processing activity. |
| Deliver the Payload to intended workflow(s) | Workflow destination/state should be determinable by the receiving implementation | Assist selection among authorized workflows | A successful TX8 Workflow Status is the stronger assertion that the Payload reached its intended workflow. |
| Create or send downstream information | Explicitly authorized transaction and recipient | Draft or assemble content when authorized | Do not attribute AI-derived assertions to the original Information Source; record applicable provenance. |

This example illustrates the governing principle for this Use Case Guide: use explicit structure for information that controls interoperability behavior, and use AI to increase the utility of narrative and progressively structured information without erasing responsibility, provenance, or human accountability.

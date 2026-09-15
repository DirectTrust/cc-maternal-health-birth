---
title: 5. Outbound and Inbound Mailroom Processing
---

# 5. Outbound and Inbound Mailroom Processing

A useful implementation model separates clinical/content creation from Direct message transmission. The Content Creator prepares a transaction-ready package; the Message Sender transmits it. On receipt, the Message Receiver exposes the received package and controls to the Content Consumer, which performs semantic and workflow processing.

## 5.1 Outbound Content Creator Processing

Before handoff to the Message Sender, the Content Creator should obtain the source clinical/event content, preserve Information Source provenance, establish or retrieve applicable Context Instance identifiers, select the canonical transaction, determine or resolve the Information Recipient when authorized, determine whether persistent stateful work is being established, create a Task only when such work exists, generate the human-readable representation, manufacture Payload Metadata, assemble and validate the XDM package, and supply the Direct message-level routing/control instructions.

## 5.2 When a FHIR Task Is Needed

| **Task element** | **Guidance** |
|----|----|
| Task.identifier | Identifier of the logical Task. Remains stable across updates to a persistent Task. |
| Task.groupIdentifier | Originating Transaction Instance Identifier; for this guide, the originating SubmissionSet.uniqueId. |
| Task.status | State of the work. Bounded workflow-delivery Tasks normally return completed or failed. Persistent Tasks may progress through requested, received, accepted, in-progress, completed, failed, cancelled, and other valid R4 states. |
| Task.businessStatus | Business-specific workflow meaning, such as Payload Reached Intended Workflow or Payload Not Delivered to Intended Workflow. |
| Task.statusReason | Reason for the current status, especially failure, rejection, cancellation, or hold. |
| Task.intent | Required R4 intent; profile consistently for the applicable workflow pattern. |
| Task.code | Kind of work being performed, e.g., deliver-payload-to-intended-workflow for bounded TX8 processing. |
| Task.for | Patient or beneficiary. |
| Task.requester | Party requesting the work / originating Information Source as applicable. |
| Task.owner | Party responsible for performing the work / Information Recipient as applicable. |
| Task.authoredOn / lastModified | Creation and update times. |
| Task.input / output | Use sparingly for information genuinely consumed or produced by the work; do not duplicate the XDM package without need. |

## 5.3 Persistent Tasks and Bounded Workflow-Delivery Tasks

A persistent Task is created by the initiating Sender when the exchange establishes work whose lifecycle matters independently, such as a referral. A bounded workflow-delivery Task is created by the Receiver for TX8 when Workflow Status was requested and no persistent Task exists. The bounded Task may be born completed or failed. Resources referenced by either Task pattern should be represented as contained resources when practical.

## 5.4 Task Identity and Transaction Correlation

Task.identifier identifies the logical Task itself. Task.groupIdentifier carries the originating Transaction Instance Identifier, defined for this guide as the originating SubmissionSet.uniqueId. These identities SHALL NOT be conflated with Pregnancy Episode, Encounter, or other Context Instance identifiers.

## 5.5 Inbound Message Receiver and Content Consumer Processing

1\. Receive the Direct Message and make the human-readable MIME part available according to existing behavior.

2\. Open the XDM package and inspect the SubmissionSet metadata.

3\. Use SubmissionSet.contentTypeCode to determine the overall transaction.

4\. Locate a FHIR Task only when the transaction includes one or when processing TX8; routine notification transactions do not require an outbound Task.

5\. When a Task exists, use Task.identifier to identify the logical work item and Task.groupIdentifier to correlate it to the originating Transaction Instance.

6\. Use Task.for, Task.requester, and Task.owner to understand the patient/beneficiary, requesting party, and party expected to act.

7\. Process subsequent DocumentEntries as the clinical, event-notification, and supporting modules associated with the transaction.

8\. For persistent work, correlate later updates using the same Task.identifier while Task.status changes. For bounded TX8 workflow-delivery Tasks, interpret the terminal status together with businessStatus and statusReason as profiled by TX8.

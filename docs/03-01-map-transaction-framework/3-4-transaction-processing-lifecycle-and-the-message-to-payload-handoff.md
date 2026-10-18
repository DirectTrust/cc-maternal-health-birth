---
title: "3.4 Transaction Processing Lifecycle and the Message to Payload Handoff"
---

# 3.4 Transaction Processing Lifecycle and the Message to Payload Handoff

The common transaction processing lifecycle is: CREATED → PACKAGED → SENT → DELIVERED → RECEIVED → ACCEPTED or REJECTED; ACCEPTED → PROCESSED

Each processing cycle assigns grouped Sender Actor and Receiver Actor responsibilities. The Message Receiver takes delivery of the Direct message; the Content Consumer receives its structured payload and determines whether the entire structured payload can be accepted into the intended workflow. A workflow status report communicates acceptance or rejection as a separate Shared Activity. Provenance records capture relevant, independently attributable activities across the lifecycle. Relevant transaction Provenance available at structured payload finalization SHALL be shared when required by the applicable Transaction Definition; other permitted Provenance supporting the distributed workflow MAY be shared. Later activities may be recorded locally and communicated through subsequent transactions, including workflow status reports.

The message to payload handoff separates transport delivery from application processing. A dispatched final-destination MDN is evidence that the message reached its final destination. It does not establish that the Content Consumer received the structured payload or accepted the structured payload. Receipt and acceptance or rejection of the structured payload are distinct activities even when one system performs them in immediate succession.

Workflow status reports acceptance or rejection of the entire structured payload into the intended workflow. Either status implies that the Content Consumer received sufficient information to identify the structured payload and determine its workflow status; it does not imply that every information object was successfully parsed or processed. If insufficient information is available to identify the structured payload or determine its workflow status, a correlated report may not be possible. If no correlated workflow status report is received within the expected interval, the originating system SHALL close its tracking context as outcome unconfirmed and mark it for follow-up according to Section 3.9; absence of a report SHALL NOT be interpreted as evidence of acceptance, rejection, or non-receipt.

| **Activity** | **Technical Actor responsibility** |
|----|----|
| Create the information objects | Content Creator creates at least the minimum Information Source information needed to initiate the transaction. The grouped Sender Actor completes preparation of the primary information object, any additional required or permitted information objects, relevant Provenance information, and any Workflow Activity Task required or included. Preparation MAY include obtaining existing information objects. These responsibilities MAY be divided between Content Creator and Message Sender according to the implementation. |
| Package the structured payload | Grouped Sender Actor assembles the information objects and required metadata into the structured payload and constructs the Direct message MIME structure that carries it together with the human-readable communication. Packaging responsibilities MAY be divided between Content Creator and Message Sender according to the implementation. |
| Send the Direct message | Message Sender completes construction and transmits the Direct message. |
| Take delivery of the Direct message | Message Receiver takes delivery at the intended destination; the dispatched final-destination MDN provides delivery evidence. |
| Receive the structured payload | Content Consumer obtains the structured payload from the delivered message for evaluation. When recorded separately, the receive Provenance activity documents this receipt. |
| Accept or reject the structured payload | Content Consumer determines whether the entire structured payload, including any included Workflow Activity Task and its information objects, is accepted or rejected into the intended workflow according to the applicable use-case and Task requirements. The accept or reject Provenance activity records that workflow status. |
| Process the information objects | After structured payload acceptance, Content Consumer performs the requested activities using the included information objects according to the use-case and Task requirements. Acceptance does not establish that this subsequent processing has completed. |

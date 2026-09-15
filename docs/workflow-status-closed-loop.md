---
title: 6. Workflow Status and Closed-Loop Signaling
---

# 6. Workflow Status and Closed-Loop Signaling

When a transaction requests workflow-status reporting, the receiving implementation needs to distinguish message delivery from workflow acceptance and processing. TX8 send-workflow-status communicates workflow-level state associated with the established Context Instance. Routine status reporting can be requested using the Direct-X workflow-status-requested metadata parameter defined by the applicable transaction specification. Defined processing anomalies may require TX8 even when routine status was not requested.

A Receiver Actor on the initiating message leg can become the Sender Actor for the TX8 response. That technology-role reversal does not change the responsible Information Source or Information Recipient roles associated with the underlying exchange.

## 6.1 Direct Message Delivery and the Meaning of Final Destination

Direct final-destination delivery is a messaging-layer assertion. It confirms that the Direct message reached the Final Destination as defined by the applicable Direct messaging and edge implementation. The term Final Destination is intentionally implementation-dependent: the point at which delivery can be asserted varies according to how the Message Receiver obtains received messages and where the receiving mailbox or edge boundary is implemented.

Direct specifies expected behavior across the Message Sender, Message Sender HISP, Message Receiver HISP, and Message Receiver, with related Direct specifications describing Message Notifications and edge-protocol behavior. Depending on the implementation, Final Destination may correspond to successful delivery through an SMTP edge, availability through an IMAP-accessible mailbox, successful transfer through an XDR edge, or successful handoff through another supported API or receiving interface. A HISP-hosted mailbox and an edge-hosted mailbox can therefore establish the delivery boundary differently.

A successful Final Destination Delivery Notification does not, by itself, establish that the Payload was parsed, matched to the correct patient, correlated with the appropriate Context Instance, accepted by the intended application, routed to the intended workflow, or acted upon by a Content Consumer.

## 6.2 Workflow Status Provides a Stronger Assurance

A Workflow-Status response provides a stronger interoperability assertion: it means that the Payload of the Message has reached its intended workflow. It is therefore not merely another message-delivery acknowledgment. The Receiver Actor has processed the received message far enough to recognize the Payload and place or route that Payload into the workflow for which the exchange was intended.

This distinction can be summarized as follows: Message Delivery confirms arrival of the Message at its Final Destination. Workflow Status confirms arrival of the Payload into its intended workflow.

For example, a successful Direct delivery notification may establish that a message reached an FQHC receiving environment or Mailroom Utility. A successful Workflow-Status response can provide the additional assurance that the outpatient-visit-notification Payload reached the FQHC workflow responsible for tracking outside care. If the Payload cannot be matched, correlated, interpreted, or routed to its intended workflow, that outcome is a workflow-processing matter rather than evidence that Direct message delivery failed.

## 6.3 Requesting and Returning Workflow Status

Routine Workflow Status is requested using x-direct-workflow-status-requested. The request does not require a Task in the initiating Payload. If no persistent Task was established, the Receiver creates a bounded workflow-delivery Task and returns it using TX8. If a persistent Task was established, an update to that same logical Task may fulfill the request when the state demonstrates that the Payload reached its intended workflow.

Defined processing anomalies may require TX8 even when routine workflow-status reporting was not requested. A Receiver Actor on the initiating message leg can become the Sender Actor for the TX8 response. That technology-role reversal does not change the responsible Information Source or Information Recipient roles associated with the underlying exchange.

---
title: "4.9 Direct Message Delivery and Structured Payload Workflow Status"
---

# 4.9 Direct Message Delivery and Structured Payload Workflow Status

Direct message delivery and structured payload workflow status are separate observations. A dispatched final-destination MDN establishes that the Direct message reached its intended destination. It does not establish that the Content Consumer received the structured payload, accepted it into the intended workflow, or completed the requested processing.

A Direct message may be delivered successfully while its structured payload is subsequently rejected. A successful MDN and a TX8 reporting rejection can therefore both be correct.

When Final Destination Delivery Notification is supported, describe the receiving or edge boundary sufficiently for a partner to understand what successful delivery means. Disposition-Notification-To remains a transport-level mechanism and is distinct from the endpoint used for workflow-status communication.

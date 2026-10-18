## 4.9 Direct Message Delivery and Structured Payload Workflow Status

Direct message delivery and structured payload workflow status are separate observations. A dispatched final-destination MDN establishes that the Direct message reached its intended destination. It does not establish that the Content Consumer received the structured payload, accepted it into the intended workflow, or completed the requested processing.

A Direct message may be delivered successfully while its structured payload is subsequently rejected. A successful MDN and a TX8 reporting rejection can therefore both be correct.

Direct Message Delivery Notifications and TX8 Workflow Status Updates SHALL remain distinct mechanisms. A Message Delivery Notification reports the disposition of the Direct message, whereas a TX8 Workflow Status Update reports the processing outcome of the originating structured payload.

Support for TX8 SHALL be determined from the receiving endpoint’s CapabilityStatement, discovered through the DirectTrust Directory. The presence of a SERV_DESC value SHALL NOT independently establish TX8 support.

When the originating structured payload contains a Workflow Activity Task, the workflow-status routing instructions applicable to that Task SHALL govern the selection of Workflow Status Update Endpoints.

When the originating structured payload does not contain a Workflow Activity Task and TX8 reporting is required, the Direct address established for Message Delivery Notifications SHALL be the sole eligible Workflow Status Update Endpoint, provided that its CapabilityStatement declares support for receiving TX8 (send-workflow-status).

If no eligible Workflow Status Update Endpoint can be resolved, the receiving system SHALL record the TX8 reporting obligation as unsuccessful because no usable destination is available. The system SHALL NOT attempt to dispatch TX8 without a resolved destination.

Failure to dispatch TX8 SHALL NOT, by itself, alter the processing outcome of the originating Transaction Instance.

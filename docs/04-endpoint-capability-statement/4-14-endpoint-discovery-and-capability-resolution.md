## 4.14 Endpoint Discovery and Capability Resolution

The DirectTrust Directory SHALL be the authoritative source for discovering an endpoint’s CapabilityStatement. Each conforming endpoint SHALL have a CapabilityStatement discoverable through information published in the DirectTrust Directory.

The endpoint’s CapabilityStatement SHALL be the authoritative declaration of the transactions, Technical Actor Roles, information objects, and other capabilities supported by that endpoint.

Directory attributes, including SERV_DESC, MAY provide human-readable descriptions of endpoint capabilities. Such attributes SHALL NOT substitute for the CapabilityStatement or independently establish support for a transaction.

An implementation resolving a destination for a MAP transaction SHALL use the destination endpoint’s Directory-discoverable CapabilityStatement to determine whether the endpoint declares the capabilities required to receive that transaction.

When TX8 routing falls back to the Direct address established for Message Delivery Notifications because the originating structured payload contains no Workflow Activity Task, that address SHALL be considered eligible only when its Directory-discoverable CapabilityStatement declares TX8 Receiver support (send-workflow-status, supportsReceive=true).

If the CapabilityStatement cannot be discovered or does not establish the required receiving capability, the endpoint SHALL NOT be considered an eligible destination for that transaction.

| **Mechanism**                | **Question answered**                                                                                                                    |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Endpoint Discovery           | Which authorized Routing Target can carry this transaction toward the Information Recipient?                                             |
| Endpoint CapabilityStatement | Which use cases, transactions, Technical Actor Roles, exchange options, and workflow status responsibilities does this endpoint support? |

A Content Creator SHALL resolve the destination endpoint’s CapabilityStatement using information published in the DirectTrust Directory. Discovery identifies candidate destinations; the CapabilityStatement establishes their declared capabilities.

Workflow Status Update Endpoints are distinct from the Routing Target of the originating Direct message and from Disposition-Notification-To; their Direct addresses MAY differ. When a Workflow Activity Task is present, its applicable workflow-status routing instructions govern endpoint selection. When Task is absent and TX8 reporting is required, only the Message Delivery Notification address may be used, and only if its Directory-discoverable CapabilityStatement declares TX8 Receiver support.

Confirm each proposed destination’s receiving capabilities using its Directory-discoverable CapabilityStatement. The SERV_DESC attribute does not establish capability independently. A Routing Target’s ability to relay a Direct message does not establish authority to determine the structured payload’s workflow status.

---
title: "4.14 Endpoint Discovery and Capability Resolution"
---

# 4.14 Endpoint Discovery and Capability Resolution

Endpoint Discovery and CapabilityStatement serve related but different purposes. Discovery identifies candidate destinations. The CapabilityStatement describes what an identified endpoint actually supports.

| **Mechanism** | **Question answered** |
|----|----|
| Endpoint Discovery | Which authorized Routing Target can carry this transaction toward the Information Recipient? |
| Endpoint CapabilityStatement | Which use cases, transactions, Technical Actor Roles, exchange options, and workflow status responsibilities does this endpoint support? |

A Content Creator SHOULD use authorized endpoint-resolution information available in its environment. Discovery resources may be local, shared, or externally maintained; this guide does not require the DirectTrust Directory as the sole source. Discovery service descriptions can narrow candidate endpoints, while the CapabilityStatement provides the richer endpoint-specific declaration used for configuration and conformance assessment.

Workflow Status Update Endpoints are distinct from the Routing Target of the originating Direct message and from Disposition-Notification-To; their Direct addresses MAY differ. The originating Task SHALL carry the required Workflow Status Update Endpoints. Discovery may establish these endpoints before package finalization; it does not replace their inclusion in the Task. Reporting SHALL preserve accumulated report recipients, send to every indicated endpoint, and deduplicate identical Direct addresses.

Confirm that each report destination supports the applicable use case and TX8 in the Receiver Actor role. A Routing Target’s ability to relay a Direct message does not establish authority to determine the structured payload’s workflow status. Where the DirectTrust Aggregated Directory is used, the SERV_INFO field SHOULD expose the URL of the published Endpoint Capability Statement so partners can resolve its detailed declarations.

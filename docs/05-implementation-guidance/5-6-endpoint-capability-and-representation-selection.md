---
title: "5.6 Endpoint Capability and Representation Selection"
---

# 5.6 Endpoint Capability and Representation Selection

A Direct address used as an identity-bound identifier identifies a party within the applicable trust context. A Direct address used as an Endpoint supplies a means of communication. The same address MAY serve both purposes, but using it for one does not establish its use for the other. The Routing Target is the address selected for the current Direct message and may differ from the Information Recipient’s own address.

The Information Recipient remains the party for whom the Shared Activity is intended when the Routing Target belongs to an Intermediary or a shared organizational workflow endpoint. Endpoint selection SHALL reflect the intended recipient and required transaction capabilities; an address alone establishes neither a participation role nor authority to accept or reject the structured payload.

## Endpoint Semantics and Capability

A discovery process can locate the Information Recipient’s organizational affiliation and an endpoint designated for the use case. For example, Dr. Smith may have an individual Direct address while the organization provides a preferred endpoint for the required notifications. Applicable routing rules select that organizational endpoint as the Routing Target. If no suitable organizational endpoint is available, the individual address may be used when its capabilities and the applicable rules support the exchange. Retain the Information Recipient’s identity separately from the Routing Target. Where the DirectTrust Aggregated Directory is used, publish the Endpoint Capability Statement URL through SERV_INFO as described in Chapter 4. Chapter 4 specifies capability and discovery requirements.

Resolve the Information Recipient and an authorized Routing Target before constructing representation-specific metadata. The Endpoint Capability Statement declares supported transactions, Technical Actor Roles, metadata representations, information-object options, and workflow status responsibilities. Select a mutually supported metadata representation using Chapter 4’s preference rules, and confirm JSON or XML support where applicable. TX8 normally uses the originating transaction’s metadata representation unless an explicitly established agreement specifies otherwise.

Capability declarations are testable assertions. A declared transaction, Technical Actor Role, and exchange-option combination asserts support for the corresponding functional requirements. Every conforming endpoint declares send-workflow-status with both Sender Actor and Receiver Actor capabilities. Routing or relay capability alone does not authorize an intermediary to accept or reject a structured payload for the Information Recipient Organization.

## Workflow Status Update Endpoints

A Workflow Status Update Endpoint is a Direct address designated to receive a correlated workflow status report for an originating Transaction Instance. It differs from the Routing Target for the outgoing Direct message and the Disposition-Notification-To address used for transport reporting. An organization MAY use one report endpoint across use cases or different endpoints for different use cases. Chapter 3 specifies how the endpoint set is carried and accumulated; Chapter 4 addresses capability-based discovery.

Intermediaries preserve the designated endpoint set and may add their own authorized report endpoints. The authorized reporting system sends the correlated workflow status report to every distinct designated endpoint. An Intermediary may make the terminal acceptance or rejection decision only when authorized for the applicable workflow; taking delivery or forwarding alone does not establish that authority.

## Workflow Status Monitoring Across Organizational Boundaries

The expected workflow status reporting interval starts when the last Intermediary or Sender Actor working on behalf of the Information Source Organization sends to a Routing Target associated with the Information Recipient Organization. Preparation and source-side hops before that organizational handoff are outside the interval. Recipient-side routing, receipt, evaluation, and return of the workflow status report are within it; additional recipient-side hops do not restart the clock.

The default interval for this use case is one hour, unless an explicit use-case or Information Recipient-specific interval is established. Transport MDNs support monitoring of message delivery along the route. A dispatched final-destination MDN establishes delivery of the Direct message, not receipt or acceptance of the structured payload into its intended workflow. Subsequent processing after acceptance is outside the workflow status reporting interval.

If no correlated workflow status report is received within the expected interval, the originating system SHOULD flag the Transaction Instance for follow-up. Absence of a report SHALL NOT be interpreted as evidence of structured payload acceptance, rejection, or non-receipt. Insufficient information to recover the originating SubmissionSet identifier or return endpoint may prevent a correlated report. Chapter 3 and TX8 specify the reporting boundary and requirements.

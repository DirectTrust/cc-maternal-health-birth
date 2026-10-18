## 4.10 TX8 Workflow Status Capability

Support for TX8 (send-workflow-status) SHALL be declared separately for the Sender and Receiver Technical Actor Roles in the endpoint’s CapabilityStatement.

An endpoint that supports TX8 as a Sender SHALL declare supportsSend=true. An endpoint that supports TX8 as a Receiver SHALL declare supportsReceive=true. An endpoint SHALL NOT be required to declare either capability solely because it supports the cc-maternal-health-birth Implementation Guide.

The CapabilityStatement discoverable through the DirectTrust Directory SHALL be the authoritative source for determining TX8 support. Directory SERV_DESC information MAY summarize this support for human inspection but SHALL NOT independently establish TX8 capability.

When an endpoint is required to send TX8 for a particular Transaction Instance, it SHALL apply the workflow-status routing requirements defined in Chapter 3.9.7. An endpoint SHALL NOT dispatch TX8 to a destination whose CapabilityStatement does not declare TX8 Receiver support.

A Transaction Definition MAY impose additional TX8 capability requirements on endpoints implementing that transaction.

TX8 has its own SubmissionSet/List and exactly one Workflow Activity Task. Its primary information object is a minimal identification snapshot of the originating SubmissionSet/List. Required accept or reject Provenance is carried in a separate Collection Bundle information object and identifies that originating package. The snapshot omits original membership links and resource references that would otherwise require retransmission of the original information objects. Detailed encoding and reference-resolution requirements are specified in Chapter 3, Appendix D, and the TX8 Transaction Definition.

| **Structured payload workflow status** | **Task**  | **Provenance activity** |
|----------------------------------------|-----------|-------------------------|
| Accepted into the intended workflow    | completed | accept                  |
| Rejected from the intended workflow    | failed    | reject                  |

The TX8 Task status and accept or reject Provenance activity SHALL agree. completed reports acceptance of the originating structured payload; failed reports its rejection, rather than failure to deliver the report. Either outcome implies sufficient receipt to identify the package and determine its workflow status. A separate receive Provenance assertion is not required solely to express that implied receipt. Acceptance does not establish completion of subsequent processing, acceptance of a clinical referral, or delivery of the requested services. Rejection does not prohibit operational logs, quarantine, audit records, or legally required evidence.

An endpoint SHALL identify whether it makes the authorized acceptance or rejection decision, relays a report, or receives reports for follow-up. TX8 is the end of workflow-status reporting: no TX8 is sent in response to a TX8, although transport MDNs remain applicable.

Where TX8 reporting is required for a particular originating Transaction Instance, the expected reporting interval is 60 minutes unless an explicit use-case or recipient-specific agreement establishes another interval. Monitoring begins when the last sender acting for the Information Source Organization sends to a Routing Target associated with the Information Recipient Organization. Subsequent recipient-side intermediary handling and return of the correlated report fall within that interval; prior source-side hops and processing after acceptance do not reset or extend it.

When a correlated workflow status report is required but none is received within the expected interval, the originating system SHOULD flag the transaction for follow-up. Absence of a report SHALL NOT be interpreted as evidence of acceptance, rejection, or non-receipt. If insufficient information can be recovered to identify the package or its report destinations, a correlated report may not be possible.

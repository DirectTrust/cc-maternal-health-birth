---
title: "4.10 TX8 Workflow Status Capability"
---

# 4.10 TX8 Workflow Status Capability

TX8 send-workflow-status reports acceptance or rejection of the entire originating structured payload into the intended workflow. Every conforming endpoint SHALL support sending and receiving TX8. These capabilities do not establish that every intermediary is authorized to determine acceptance or rejection; the decision belongs to the Receiver Actor authorized to act for the Information Recipient Organization.

TX8 has its own SubmissionSet/List and exactly one Workflow Activity Task. Its primary information object is a minimal identification snapshot of the originating SubmissionSet/List. Required accept or reject Provenance is carried in a separate Collection Bundle information object and identifies that originating package. The snapshot omits original membership links and resource references that would otherwise require retransmission of the original information objects. Detailed encoding and reference-resolution requirements are specified in Chapter 3, Appendix D, and the TX8 Transaction Definition.

| **Structured payload workflow status** | **Task**  | **Provenance activity** |
|----------------------------------------|-----------|-------------------------|
| Accepted into the intended workflow    | completed | accept                  |
| Rejected from the intended workflow    | failed    | reject                  |

The TX8 Task status and accept or reject Provenance activity SHALL agree. completed reports acceptance of the originating structured payload; failed reports its rejection, rather than failure to deliver the report. Either outcome implies sufficient receipt to identify the package and determine its workflow status. A separate receive Provenance assertion is not required solely to express that implied receipt. Acceptance does not establish completion of subsequent processing, acceptance of a clinical referral, or delivery of the requested services. Rejection does not prohibit operational logs, quarantine, audit records, or legally required evidence.

An endpoint SHALL identify whether it makes the authorized acceptance or rejection decision, relays a report, or receives reports for follow-up. TX8 is the end of workflow-status reporting: no TX8 is sent in response to a TX8, although transport MDNs remain applicable.

The expected reporting interval is 60 minutes unless an explicit use-case or recipient-specific agreement establishes another interval. Monitoring begins when the last sender acting for the Information Source Organization sends to a Routing Target associated with the Information Recipient Organization. Subsequent recipient-side intermediary handling and return of the correlated report fall within that interval; prior source-side hops and processing after acceptance do not reset or extend it.

If no correlated workflow status report is received within the expected interval, the originating system SHOULD flag the transaction for follow-up. Absence of a report SHALL NOT be interpreted as evidence of acceptance, rejection, or non-receipt. If insufficient information can be recovered to identify the package or its report destinations, a correlated report may not be possible.

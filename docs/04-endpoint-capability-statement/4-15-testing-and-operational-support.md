## 4.15 Testing and Operational Support

Publish practical onboarding and support information suitable for implementers and trading partners. Conformance testing SHALL evaluate an endpoint against the transactions, Technical Actor Roles, and information-object capabilities declared in its CapabilityStatement, together with any additional requirements imposed by the applicable Transaction Definitions.

Testing SHALL verify that the endpoint’s CapabilityStatement is discoverable through information published in the DirectTrust Directory. Directory attributes such as SERV_DESC SHALL NOT be used as substitutes for the CapabilityStatement when determining declared capabilities.

Testing of Workflow Activity Task support SHALL distinguish transactions that require a Task from originating transactions for which Task inclusion is optional.

TX8 Sender Actor and Receiver Actor capabilities SHALL be tested independently when declared. An endpoint SHALL NOT fail conformance testing solely because it does not declare TX8 support, unless TX8 is required by an applicable Transaction Definition or Technical Actor Role.

Where TX8 reporting is required for an originating structured payload without a Workflow Activity Task, testing SHALL verify that the Message Delivery Notification address is used as the sole Workflow Status Update Endpoint only when its Directory-discoverable CapabilityStatement declares TX8 Receiver support.

Testing SHALL also verify that, when no eligible TX8 destination can be resolved, the reporting obligation is recorded as unsuccessful and no TX8 dispatch is attempted.

Failure to dispatch TX8 SHALL NOT, by itself, cause the originating Transaction Instance to be reported as unsuccessful.

For the DirectTrust Payload Testing Tool, a separately labeled target configuration may plan Sender Actor and Receiver Actor coverage for TX1–TX5 and TX7–TX8; TX6 remains a native IHE query and does not acquire Direct actor capabilities. Conformance results SHALL be based on verified implemented capabilities, not aspirational target flags.

| **Publish when available**     | **What to provide**                                                     |
|--------------------------------|-------------------------------------------------------------------------|
| Test Endpoint / Direct Address | Clearly distinguish test from production.                               |
| Testing Process                | Prerequisites, test cases, conformance steps, or onboarding process.    |
| Onboarding Requirements        | Configuration prerequisites that materially affect exchange.            |
| Technical Support              | Contact or support process for interoperability issues.                 |
| Operational Constraints        | Hours, maintenance windows, size limits, or other material constraints. |
| Revision Information           | Date and, when useful, version/history.                                 |

Test planning follows the capability-selection chain in Section 4.1. Verify declared combinations, conditional TX8 reporting obligations, temporal monitoring where reporting is expected, report correlation, the no-Task Directory-qualified fallback, and the inability to dispatch TX8 when no eligible destination exists. Preserve the distinction between transport delivery, package acceptance or rejection, and subsequent processing.

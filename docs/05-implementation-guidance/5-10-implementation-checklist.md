## 5.10 Implementation Checklist

Use this checklist with the applicable Transaction Definition and endpoint declarations. Each question checks a distinct implementation responsibility.

| **Check**           | **Implementation question**                                                                                                                             |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Transaction         | Did we select the correct reusable Shared Activity from the catalog?                                                                                    |
| Endpoint            | Does the Routing Target declare the required Receiver Actor capability and exchange options, while preserving the Information Recipient identity?       |
| Workflow Activity   | Does the Task express the requested action, correlation, Context, and TX8 routing instructions required by the framework?                               |
| Information objects | Do the information objects preserve source content, clinical snapshot time, required human-readable copies, and permitted representations?              |
| Metadata            | Is deterministic metadata explicit, semantically correct, and consistent across the package?                                                            |
| Provenance          | Are required activities recorded in independent Provenance Collection Bundles with attribution and resolvable targets?                                  |
| Transport           | Are MDN message delivery and structured payload workflow status handled separately?                                                                     |
| Processing          | Can the authorized Receiver Actor decide package acceptance or rejection and then perform the accepted Task without conflating those outcomes?          |
| TX8                 | Do snapshot correlation, Task status, accept/reject Provenance, endpoints, and reporting interval agree? Are missing reports flagged without inference? |
| AI                  | If AI is used, are derived meaning, delegated authority, provenance, privacy, oversight, and remediation handled explicitly?                            |


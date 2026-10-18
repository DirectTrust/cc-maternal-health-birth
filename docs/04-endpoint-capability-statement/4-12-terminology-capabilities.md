## 4.12 Terminology Capabilities

Publish terminology capabilities when an implementation choice affects successful exchange. Do not reproduce required ValueSets merely to duplicate the specification. Identify optional subsets or coded choices when a partner must know them to construct or process a transaction.

| **Terminology area**                            | **What to publish**                                                                                        |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| Document types                                  | Supported codes when an implemented subset is permitted.                                                   |
| Event types                                     | Supported registration, admission, discharge, outpatient, birth, or other event types where choices exist. |
| Native IHE query options (outside Direct scope) | Categories the endpoint can evaluate when Request by Category is supported.                                |
| Other constrained ValueSets                     | Optional or endpoint-specific subsets that materially affect interoperability.                             |

Capability declarations SHOULD reference the published DirectTrust CodeSystems and ValueSets rather than create endpoint-local duplicates. The consolidated DirectTrust CodeSystem is http://objects.directtrust.org/standards/terminology/CodeSystem/DTCodeSystem (OID 1.3.6.1.4.1.41179.4.1.1). Existing CodeSystems, including MetadataTypeCS, remain applicable where retained by the terminology package. Use the system and code specified by the applicable binding, including the accept and reject Provenance activities.

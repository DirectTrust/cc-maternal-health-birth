## 4.8 Information Object and Human-Readable Communication Capabilities

The DirectTrust Directory SHALL be the authoritative source for discovering an endpoint’s CapabilityStatement. Each conforming endpoint SHALL have a CapabilityStatement discoverable through information published in the DirectTrust Directory.

The Endpoint CapabilityStatement SHALL be the authoritative declaration of the transactions, Technical Actor Roles, information objects, and other capabilities supported by that endpoint.

The SERV_DESC attribute in the DirectTrust Directory MAY provide a human-readable summary of endpoint capabilities. It SHALL NOT substitute for the Endpoint CapabilityStatement, and its contents SHALL NOT independently establish support for a transaction or Technical Actor Role.

An endpoint SHALL declare support for the information objects required by the Transaction Definitions and Technical Actor Roles it implements. A Workflow Activity Task SHALL be supported when required by an applicable Transaction Definition. Otherwise, inclusion of a Workflow Activity Task in an originating structured payload is optional. Receiving and validating an optional Task as a package component is distinct from interpreting or executing its workflow instructions; a receiver SHALL meet the specific processing obligations of each Technical Actor Role it declares. A Task does not independently confer TX8 capability.

An endpoint SHALL NOT infer that a Workflow Activity Task is present solely because the structured payload contains a SubmissionSet.

| **Capability area**                             | **Examples of what to declare**                                                                         |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Event notifications                             | Supported HL7 V2 event types and versions.                                                              |
| Clinical documents                              | Supported document types and codes when an implemented subset is permitted.                             |
| FHIR workflow resources                         | Required resources and supported optional resource representations; required content remains mandatory. |
| Native IHE query options (outside Direct scope) | Supported Request by Type, Request by Category, categories, and other query choices.                    |
| Human-readable content                          | Supported MIME representations or material presentation constraints.                                    |

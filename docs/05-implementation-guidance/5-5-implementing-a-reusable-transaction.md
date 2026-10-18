## 5.5 Implementing a Reusable Transaction

A Transaction Definition is not a standalone specification that repeats the entire framework. Chapter 3 defines the common grammar once. The Transaction Definition specializes that grammar for one Shared Activity. Implementers SHALL therefore apply the Transaction Definition together with Chapter 3 and the endpoint capability requirements in Chapter 4.

| **Transaction Definition section**                            | **Implementation use**                                                                                                                 |
|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| 1\. Transaction Overview — WHY                                | Confirm that the selected Shared Activity matches the intended exchange.                                                               |
| 2\. Direct Message and Structured Payload Requirements — WHAT | Apply information-object, Task, human-readable content, Provenance (2.4), and transport requirements.                                  |
| 3\. XD Metadata Guidance — HOW                                | Apply transaction-specific requirements when XD/XDM represents structured payload metadata.                                            |
| 4\. FHIR Metadata Guidance — HOW                              | Apply the same metadata semantics when FHIR represents structured payload metadata.                                                    |
| 5\. Context IG Guidance                                       | Apply specified Context IG guidance; retain TBD where the definition reserves this section.                                            |
| 6\. Technical Actor Functional Requirements — WHO DOES WHAT   | Apply Section 6.1 Sender Actor and Section 6.2 Receiver Actor functional and Provenance requirements.                                  |
| 7\. Transaction-Specific Processing — WHAT IS SPECIAL         | Apply additional transaction-specific rules. Common anomaly handling and workflow status reporting are specified in Chapter 3 and TX8. |
| 8\. Relevant Examples                                         | Use illustrative snippets and patterns without depending on versioned whole-sample filenames.                                          |


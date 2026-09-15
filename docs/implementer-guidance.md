---
title: Implementer Guidance
---

# Implementer Guidance

*cc-maternal-health-birth*

Purpose. This document provides implementation-oriented guidance for applying the architectural principles used by the cc-maternal-health-birth Use Case. It consolidates and reworks the CDA construction, identifier-handshake, Data Provenance, Context Instance, document-lifecycle, XFRM derivation, and Workflow Task design material developed with the Mimi Shell example artifacts. The Use Case Guide remains the primary description of objectives, actors, and transactions; transaction-specific files remain authoritative for exact payload, metadata, and element-level conformance requirements.

## 1. How to Use This Guidance

The educational appendices explain concepts implementers need to understand. This document focuses on how those concepts should influence implementation behavior and artifact construction. It does not replace the transaction-specific specifications. Where a transaction file defines a more specific requirement, that transaction-specific requirement governs the transaction.

## 2. Preserve Responsibility and Data Provenance

Accurate Data Provenance depends on distinguishing responsibility for information from the technology functions performed during exchange. The Information Source is the responsible party supplying the information. An Intermediary can receive, route, assemble, transform, or retransmit that information without becoming the Information Source. Likewise, receipt by an Intermediary does not make the Intermediary the intended Information Recipient.

An Intermediary adds provenance through the activities it performs; it does not replace upstream provenance. Implementations should preserve upstream provenance and add provenance sufficient to identify subsequent activities and responsible participants.

| **Provenance activity** | **Implementation meaning** |
|----|----|
| Create | Create a new information object or assertion. |
| Sign | Record or apply an authentication/attestation act according to the applicable artifact and document-family rules; the technical signature mechanism does not by itself determine legal significance. |
| Seal | Apply an organizational/system cryptographic integrity or provenance assurance where supported; a seal does not by itself make the sealing service the clinical authenticator. |
| Update | Change an existing information collection while maintaining the appropriate logical-document or workflow identity. |
| Assemble | Collect existing information modules into a package or new whole without implying that all source content was newly authored. |
| Transform | Create a derived representation whose semantics or scope differ from the source representation. |
| Transmit | Send information to the next message-processing endpoint. |
| Receive | Receive information from a prior message-processing endpoint. |
| Void | Make an artifact or assertion no longer valid for use according to the applicable lifecycle rules. |
| Deprecate | Mark an artifact or representation as superseded or no longer preferred/current while preserving its historical identity. |
| Entered-in-Error | Identify information as having been created or recorded in error without rewriting provenance to make the erroneous artifact appear never to have existed. |

### 2.1 Intermediaries and Derived Information

When an Intermediary performs a semantic transformation, the resulting artifact needs provenance that tells both stories: where the underlying information came from and what the Intermediary did to create the derived artifact. TX3 send-birth-notification is the clearest example. A data utility may Receive a newborn A01, resolve the maternal relationship, Transform or Assemble the relevant information into a maternal-subject Birth Notification CDA, and Transmit it onward. The Birthing Provider remains the Information Source of the underlying birth information; the Intermediary is the Content Creator and Sender Actor for the derived transaction leg.

---
title: "Terms and Definitions"
---

# T Terms and Definitions

_Use common language throughout the guide._

Chapter T defines the exchange and document terminology used throughout this guide. Appendix A, Understanding Standardized Clinical Documents, provides the detailed document model and maternal-health document-type catalog. Chapter 3 and the applicable Transaction Definitions specify implementation requirements.

## T.1 Exchange Terminology and Language Usage

Use the following terms consistently to distinguish the complete transported message, the structured payload carried within it, and the individual information objects it contains.

| **Term** | **Meaning and use** |
|----|----|
| Direct message | The complete transported message: headers, MIME structure, human-readable communication, and structured payload. Use this term when discussing message construction, transmission, transport delivery, or message-level controls. |
| Structured payload | The complete package carried in MIME Part 2: the FHIR Collection Bundle or IHE XDM package. It includes metadata, the Workflow Activity Task, the primary information object, additional permitted information objects, relevant Provenance, and copies of the human-readable files. This is the whole object accepted or rejected into the intended workflow. Use this term throughout lifecycle and acceptance discussions. |
| Information object | An individual item carried within the structured payload, such as a CDA document, HL7 Version 2 message, Workflow Activity Task, or Provenance Collection Bundle. Use this term when describing individual contents, including the primary information object and additional information objects. |

Language usage rule. Use Direct message, structured payload, and information object for the three distinct levels above. Use package when discussing assembly, physical packaging, or completeness. Qualify attachment to identify its packaging level: the structured payload is a MIME attachment to the Direct message, while a document within it is an included information object. Do not use transaction content, message payload, payload package, or structured payload package as interchangeable names for the structured payload.

The structured payload carries copies of the human-readable files also supplied in MIME Part 1. The human-readable communication and structured payload are therefore distinct message parts with deliberately preserved human-readable content. Chapter 3 defines the common MIME requirements.

Unless otherwise defined in this guide, terminology follows the definitions established in the DirectTrust Metadata and Payloads Framework (Part I).

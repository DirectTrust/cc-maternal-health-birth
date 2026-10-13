---
title: "Appendices"
---

# Appendices

_Find supporting concepts and technical mappings._

The appendices provide supporting concepts and technical mappings for applying the MAP Framework to Care Coordination for Maternal Health – Birth. They complement Chapters 1 and 2’s use-case objectives and transactions, Chapter 3’s common requirements, Chapter 4’s endpoint capabilities, and Chapter 5’s implementation guidance.

### Appendices List

Use the following table to select the appendix relevant to your task. Apply its guidance together with Chapter 3 and the applicable Transaction Definition. Conceptual explanations and illustrative examples do not replace normative requirements; Appendix D’s technical packaging and mapping rules are applied with those requirements.

| **Appendix** | **Use it to understand** | **Relationship to implementation** |
|----|----|----|
| [Appendix A — Understanding Standardized Clinical Documents](/07-appendices/appendix-a-understanding-standardized-clinical-documents) | Clinical document classification, identity, scope, lifecycle, clinical time, source preservation, Minimally Structured Documents, Progressive Structuring, and the maternal-health document-type catalog. | Explains the complete document model and provides the use-case LOINC and category reference tables, applied with Chapter 3’s bindings and the applicable Transaction Definition. |
| [Appendix B — Understanding Identity, Context, and Status](/07-appendices/appendix-b-understanding-identity-context-and-status) | Patient and organization identity, assigning authorities, Context Instances, encounters, status, and the identifier handshake. | Supports patient matching and transaction correlation while keeping identifiers for patients, encounters, Context Instances, and workflow activities distinct. |
| [Appendix C — Understanding XD Classification Metadata](/07-appendices/appendix-c-understanding-xd-classification-metadata) | The distinct purposes of classCode and typeCode on DocumentEntry, and contentTypeCode on SubmissionSet. | Explains how information-object classification differs from structured payload purpose, supporting application of the metadata requirements and terminology bindings in Chapter 3. |
| [Appendix D — FHIR Collection Bundle Packaging](/07-appendices/appendix-d-fhir-collection-bundle-packaging) | FHIR Collection Bundle structure and its mapping to XD SubmissionSet and DocumentEntry metadata. | Supports equivalent structured payload semantics across XD and FHIR, including membership, information-object references, Provenance Collection Bundles, and the originating package identification snapshot carried by workflow status reports. |
| [Appendix E — Understanding Document Lifecycle and Status](/07-appendices/appendix-e-understanding-document-lifecycle-and-status) | Document-status concepts and CDA/FHIR crosswalk; R4 backport encodings and representative lifecycle scenarios. | Distinguishes clinical document status from metadata availability, transport disposition, and MAP workflow status. |

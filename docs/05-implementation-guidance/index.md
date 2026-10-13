---
title: "Implementation Guidance"
---

# 5 Implementation Guidance

_Apply the framework and verify endpoint behavior._

cc-maternal-health-birth via the Direct Standard® Version 1.0 • Last Updated 2026-10-13

Chapter 5 applies the common MAP implementation guidance to help implementers configure, construct, exchange, and test transactions for Care Coordination for Maternal Health – Birth. It brings together the objectives and participants in Chapters 1 and 2, the common Transaction Framework in Chapter 3, and the endpoint capabilities in Chapter 4. Progressive Structuring, source preservation, and appropriately governed AI assistance support implementation without weakening identity, authority, accountability, or deterministic exchange controls.

Implementation is easier when the concepts underneath the requirements are explicit. This chapter identifies the foundational ideas that recur across the use case, explains why they matter, and directs implementers to deeper learning modules when more detail is needed. This conceptual orientation complements the practical guidance that follows; it is not a replacement for the normative specification or the appendices.

## 5.1 How This Collection Fits Together

Chapters 1 and 2 apply the Use Case Framework to the objectives, participants, and workflows of this use case. The MAP Reusable Transaction Catalog identifies the defining specifications for selected transactions. Chapter 3 supplies their common requirements; Chapter 4 identifies endpoint-specific capabilities; this chapter explains how to apply and test those requirements together. TX3 provides the use-case-specific birth notification, while TX6 remains an out-of-scope query placeholder. Other transactions are reusable specifications associated with their defining guides.

The implementation foundations are integrated into this chapter. They explain the conceptual background that helps an implementer understand why the architecture is designed as it is. The four appendices provide deeper learning and reference material. Readers can use them selectively; their guidance is applied together with the common framework and transaction requirements.

| **Learning module** | **Use it when you need to understand…** | **Relationship to implementation** |
|----|----|----|
| Appendix A — Understanding Clinical Documents as Information Collections | document classification, information-collection scope, authorship/authentication, lifecycle, clinical time, and derivation | Supports correct construction and interpretation of clinical information objects. |
| Appendix B — Understanding Identity, Context, and Status | patient and organization identity, assigning authorities, Context Instances, encounters, status, and identifier handshake | Supports correct correlation and prevents identifiers for different things from being conflated. |
| Appendix C — Understanding XD Classification Metadata | the distinct purposes of DocumentEntry.classCode, DocumentEntry.typeCode, and SubmissionSet.contentTypeCode | Provides the conceptual model needed to apply XD metadata requirements correctly. |
| Appendix D — FHIR Collection Bundle Packaging | the FHIR Collection Bundle representation and its mapping to collection-level and entry-level metadata | Specifies FHIR packaging and XD-to-FHIR mappings applied with Chapter 3 and the Transaction Definitions. |

### Information Collections Have Identity, Scope, Provenance, and Lifecycle

A clinical document is more than a file format. It is an information collection created for a purpose, with an identity, a scope, responsible participants, clinically meaningful time, and a lifecycle. Those distinctions matter whenever information is versioned, transformed, assembled, authenticated, or exchanged. Without them, technically valid artifacts can tell the wrong provenance or lifecycle story.

Appendix A develops this model in depth, including Species, Genus, and Family; whole information collections; CDA header semantics; clinical versus lifecycle time; logical document identity; XFRM derivation; authentication; and related document-construction concepts.

### Identity, Context, and Status Answer Different Questions

Interoperability requires more than knowing who the patient is. Implementations also need to know which clinical or workflow context information belongs to, which encounter or activity is involved, which organization assigned an identifier, and what state the work or context is in. These are related questions, but they are not interchangeable.

Appendix B provides the deeper model for identity layers, assigning authority, identifier types, Context Instances, status, and the progressive identifier handshake that occurs as information moves across organizations.

### Metadata Classifies Different Aspects of the Exchange

Metadata fields that all appear to “classify” information often answer different questions. Correct implementation depends on understanding those semantic boundaries rather than treating metadata values as interchangeable labels. This is especially important in XD, where collection-level purpose and document-level classification serve different roles.

Appendix C explains the classification model in depth. Chapter 3 and the applicable Transaction Definition remain authoritative for the current requirements and values used in a transaction.

### Representation Is Not the Same as Meaning

The same exchange intent may be represented using different packaging and metadata technologies. Implementers need to preserve the transaction semantics, information identity, provenance, context, and recipient expectations while applying the rules of the selected representation. A representation should not silently redefine the Shared Activity.

Appendix D explains FHIR Collection Bundle packaging and the XD-to-FHIR mapping. Apply it together with Chapter 3 and the applicable Transaction Definition, preserving information identity, membership, Context, and workflow status semantics across representations.

### Responsibility and Provenance Must Survive Exchange

Technology roles do not automatically become information-responsibility roles. An Intermediary can receive, route, assemble, transform, or retransmit information without becoming the original Information Source. Implementations should preserve upstream provenance and add provenance for the activities they actually perform rather than overwriting the story of where the information came from.

Appendix A provides deeper document-oriented treatment of authorship, authentication, transformation, and lifecycle. The current Transaction Framework and Transaction Definitions specify the provenance that must be represented for particular exchanges.

Each Provenance information object is a separate FHIR Collection Bundle containing one or more Provenance resources. The structured payload may carry multiple such bundles, each with its own DocumentEntry/DocumentReference metadata and SubmissionSet/List membership. An intermediary can add independently attributable assertions without modifying bundles supplied by others. Required and permitted activities are specified in Section 2.4 and assigned to grouped Actors in Section 6 of the applicable Transaction Definition.

Share the required Provenance for activities occurring during the transaction, and permitted additional assertions useful to the distributed workflow. Assertions available at package finalization may travel in that structured payload; later activities may be recorded locally or communicated in subsequent transactions. Include targeted information objects and apply Appendix D’s reference rules; do not assume that a nested Bundle can resolve an outer target through implicit scope.

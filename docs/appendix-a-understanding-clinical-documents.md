---
title: "Appendix A: Understanding Clinical Documents as Information Collections"
---

# Appendix A: Understanding Clinical Documents as Information Collections

*Educational Appendix for cc-maternal-health-birth*

Purpose. This appendix provides a concise conceptual model for understanding clinical documents as meaningful information collections. It explains how a document is classified, how smaller meaningful wholes can exist within larger wholes, and how the scope and clinical time anchor of a document are determined. Detailed construction requirements are provided separately in Implementer Guidance.

## A.1 Document Classification: Species, Genus, and Family

Clinical documents can be classified at different levels of specificity for different interoperability purposes. The animal-kingdom analogy of Species, Genus, and Family provides a useful way to keep these dimensions distinct.

| **Dimension** | **What it tells the implementer** | **Primary CDA representation** |
|----|----|----|
| Species - Specific Document Type | What specific kind of information collection is this? The selected type conveys expectations about why the document was made, its subject-matter domain, and the role/provenance generally associated with that document type. | ClinicalDocument/code; most specific appropriate LOINC Document Ontology code. |
| Genus - Document Structural Archetype | What structural model does the document assert conformance to, and therefore what kinds of structured content can be expected? | Document-level templateId. |
| Family - Broader Document Classification | To what broader collection or collections does this document belong for discovery and workflow purposes? | sdtc:category; a document may belong to more than one Family. |

Example. A Maternal Discharge Summary has Species 92576-8 Maternal Discharge Summary. Its Genus is the applicable C-CDA Discharge Summary document template. Its Family classifications can include Maternal Health (10162-6) and other broader categories appropriate to the document.

## A.2 Documents as Whole Information Collections

A clinical document is a whole collection of information created to fulfill a defined information objective. A larger longitudinal or comprehensive document can contain content that is also meaningful as a smaller whole with independent exchange value.

The existence of a meaningful nested whole does not require an implementation to create and persist every possible smaller document. The encompassing document can remain the maintained source whole until there is a reason to materialize a sub-set for independent exchange.

## A.3 XFRM Sub-Set Document Derivation

When a meaningful sub-set is materialized for independent exchange, it becomes a clinical document in its own right. The derived document is not merely a fragment of the source file. It has its own document identity, classification, provenance story, clinical scope, and lifecycle.

XFRM expresses derivation: the new document was transformed from the source document. It does not mean that the source and derived documents are versions of the same logical document.

## A.4 Sub-Set Document Examples

### Antepartum Summary - Multiple Meaningful Wholes Within a Longitudinal Whole

An Antepartum Summary is an evolving longitudinal information collection for a pregnancy. It can encompass information that is independently meaningful as an Obstetrics Progress Note, Pregnancy History and Physical Evaluation, Diagnostic Imaging Study, or other document Species. The Antepartum Summary can remain the maintained longitudinal whole; a smaller document is materialized only when there is an exchange reason to send that whole independently.

### Postpartum Summary - Deriving an Encounter-Specific Whole

A Postpartum Summary can serve as the maintained longitudinal information collection for the postpartum period. A particular postpartum encounter is also a meaningful whole. When that encounter needs to be exchanged independently, an encounter-specific Postpartum Visit Note can be derived from the summary and classified according to the semantics of the encounter-specific information collection.

## A.5 Information Collection Scope

Document classification and derivation answer what a document is and how it relates to other documents. Information Collection Scope answers a different question: what establishes the boundaries of the information collection?

| **Scope** | **Educational definition** | **Clinical anchor** |
|----|----|----|
| Encounter Summary / Encounter Note | The encounter itself establishes the beginning and end of the information collection. The document summarizes the patient state established during or at completion of one visit or stay. | The encounter, ordinarily anchored to completion of the visit/stay. |
| Episode of Care / Longitudinal Summary | An explicitly established Episode of Care Context Instance establishes the boundaries of the information collection. It may span one or many encounters; a one-visit episode remains episode-scoped when the episode context, rather than the encounter alone, defines the whole. | The clinically meaningful snapshot point of the evolving episode summary. |
| Patient Summary | A point-in-time summary of the patient's health history over a span of time up to the represented snapshot. | The point represented by the summary. |
| Patient Record | A more comprehensive longitudinal collection of patient information accumulated over time. | The record's longitudinal scope; not reduced to one encounter. |

Implementer test. Ask what establishes the boundaries of the information collection. If the encounter itself establishes the beginning and end of the whole, the document is encounter-scoped. If an explicitly established episode context establishes those boundaries, the document is episode-scoped even when that episode happens to contain only one encounter.

## A.6 The CDA Header Should Tell the Same Story

The CDA Header should accurately communicate the scope and clinical meaning of the information collection. An Encounter Summary should identify the encounter that supplies its context and temporal anchor. A longitudinal or Episode of Care Summary should not invent an episode-wide encompassingEncounter merely to express longitudinal scope.

## A.7 Clinical Time Is Not Document-Lifecycle Time

ClinicalDocument/effectiveTime anchors the document to the clinically relevant point represented by the information collection. It is distinct from authoring, authentication, signing, transmission, and other document-lifecycle times.

For an Encounter Summary, the clinically relevant point is ordinarily the endpoint of the completed visit or stay. For an evolving longitudinal or Episode of Care Summary, the clinical anchor is the point represented by that version of the summary.

## A.8 Authentication Is Part of the Document Lifecycle

Authentication is a document-lifecycle activity distinct from authorship, document custody, assembly, transformation, transmission, and the clinical time represented by the document. Authoring identifies who created or contributed information. Authentication records an attestation to the document. A digital signature is a technical mechanism that can provide cryptographic assurance of an authentication act or exchanged artifact. The legal significance of a signature is determined by the governing document-family, organizational, payer/program, or jurisdictional rules.

A signature mechanism should not be confused with the semantic role of the signer. An electronic signature and a digital signature performed as part of one authentication act do not necessarily represent two separate authentication events. Likewise, a system that assembles, transforms, or transmits an authenticated document does not become its authenticator merely because it handled or generated the exchanged representation.

## A.9 Maternal Health Example

An Obstetrics Progress Note and an Antepartum Summary may contain overlapping facts without being redundant. The Progress Note represents one prenatal encounter. The Antepartum Summary represents the evolving pregnancy episode. They are different meaningful wholes with different Information Collection Scope and header stories.

## A.10 Where to Find Implementation Rules

This appendix is educational. Requirements for assigning document identity, re-evaluating header participants, recording XFRM lineage, preserving source-form content, asserting templates, and maintaining document lifecycle are provided in the Implementer Guidance and the applicable transaction-specific specifications.

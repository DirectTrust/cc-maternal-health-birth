---
title: "Appendix A: Understanding Standardized Clinical Documents"
---

# Understanding Standardized Clinical Documents

<span class="smallcaps">Understand document identity scope and clinical time.</span>

Appendix A explains standardized clinical documents as meaningful information collections within the MAP Framework. It connects document classification, scope, identity, derivation, authentication, and clinical time with the requirements in Chapter 3 and the implementation guidance in Chapter 5. Standardization establishes shared expectations for a document’s meaning, structure, metadata, and exchange; it does not require every clinical statement to be discretely coded. Minimally Structured Documents can meet those expectations while preserving human-readable source information. Apply these concepts together with the applicable Transaction Definition when preparing or consuming clinical information objects.

## Document Classification: Species, Genus, and Family

Clinical documents have distinct Document Type, Document Template/Profile, and Document Category dimensions. These correspond to Species, Genus, and Family. Chapter T defines the conceptual terms and maps them to XD, CDA, FHIR Composition, and FHIR DocumentReference fields. Use the conceptual terms consistently while retaining exact field names for implementation requirements.

This Implementation Guide distinguishes three complementary dimensions of document classification. Species identifies the specific clinical document type and is represented by ClinicalDocument/code using the most specific appropriate LOINC Document Ontology code. Genus identifies the structural document archetype asserted by the applicable document-level templateId. Family identifies one or more broader collections used for discovery and workflow classification and is represented using sdtc:category. These dimensions answer different questions and should not be conflated.

| **Dimension**                     | **What it tells the implementer**                                                                                                                                                                                              | **Primary CDA representation**                                                 |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Species — Document Type           | What specific kind of information collection is this? The selected type conveys expectations about why the document was made, its subject-matter domain, and the role/provenance generally associated with that document type. | ClinicalDocument/code; most specific appropriate LOINC Document Ontology code. |
| Genus — Document Template/Profile | What structural model does the document assert conformance to, and therefore what kinds of structured content can be expected?                                                                                                 | Document-level templateId.                                                     |
| Family — Document Category        | To what broader collection or collections does this document belong for discovery and workflow purposes?                                                                                                                       | sdtc:category; a document may belong to more than one Family.                  |

For example, this guide uses 92576-8, Maternal discharge summary – recommended IHE set, for a Maternal Discharge Summary. Its structural archetype is identified by the applicable asserted document template. Broader classifications follow Chapter 3’s mappings. Where 10162-6 is used, it denotes Pregnancy History (LOINC: Pregnancy History). The clinical section code and its use as a broader document classification are separate applications of the code.

## Minimally Structured Documents and Progressive Structuring

A Minimally Structured Document preserves a human-readable Source Form within a standardized clinical document and adds the dependable structure required by the applicable document and exchange specifications. The following methodology distinguishes information completeness from the computability of its structured representation.

### Progressive Structuring Design Methodology

Progressive Structuring is the design methodology at the heart of Minimally Structured Documents. It distinguishes whether available information can be exchanged completely from how much has been represented as standardized structured data. The approach preserves the Source Form within the exchanged document and progressively enriches its structured representation as implementation capability, data quality, and demonstrated value increase. Human-readable narrative remains useful to people and can support machine interpretation, including AI-assisted processing, without requiring every statement to be translated into discrete codes.

Deterministic structure is applied where it provides dependable interoperability value while preserving narrative and Source Form information. Content Consumers with suitable capabilities may derive additional computable information after exchange. Derived information remains distinguishable from source-authored information and is attributable to the activity that produced it.

### Information completeness does not have to wait for structured data maturity

A Minimally Structured Document preserves the human-readable information available in the source EHR for that document Species. Carrying this Source Form with the clinical document gives Information Recipients access to the available source information even when some of it has not been represented as standardized structured data. This supports clinicians, administrative users, and systems capable of interpreting the source representation.

An exchanged document can preserve the available information while varying in the completeness and quality of its structured representation. The Source Form preserves the information story; structured data supplies an additional computable representation. This approach does not waive required metadata, required content, or the conformance requirements of a claimed document template or profile.

### Structured-data quality becomes a measurable attribute rather than a gate to exchange

The document's declared Genus establishes expectations about the structural model and the kinds of structured content that should be present. How completely and accurately a particular document instance fulfills those expectations can therefore be evaluated as a qualitative attribute of the document. A document with limited structured content and a document with extensive, accurate structured content can both communicate the underlying source information; they differ in the degree to which a recipient can reliably process that information computationally without interpreting the Source Form.

Participants can exchange useful information, measure the quality of the structured representation, and progressively improve computability. Programs may establish higher structured-data quality expectations and incentives as capabilities mature. Each exchanged document still meets the requirements of its declared template or profile; progressive improvement does not justify an inaccurate conformance claim.

### Example: Rewarding computability without blocking communication

For example, a payer program receiving a Pregnancy Notification and Risk Assessment document could define measurable quality levels based on the structured content expected for the document's declared Genus. A document that includes the complete Source Form but relatively little accurate structured data can still communicate the pregnancy notification and risk information to the recipient. A document that also contains a more complete and accurate structured representation can receive a higher quality assessment and, where the program chooses, qualify for a greater incentive payment. In this model, payment can reward the quality of computability without making computability a prerequisite for communication.

### Utilizing Standardized Document Classification: Species, Genus, and Family

The document-classification model in this appendix supports this approach. Species, represented by the document type code (XD typeCode), identifies the information collection exchanged. Genus identifies the structural archetype the document asserts it follows and the resulting expectations for computable content. Family supports broader discovery and workflow classification. XD classCode carries the broad classification specified by the exchange requirements. Where that classification reflects a structural convention rather than a Family, it is not automatically a Document Category equivalent; keep its declared mapping explicit. The Source Form preserves the information for the Species, while Progressive Structuring improves how well an instance fulfills the computable expectations of its declared Genus.

Standardized classification helps distinguish information completeness from structured-data quality. Digital information exchange can begin with a permitted representation that preserves the source information, and computability can improve deliberately over time. Any assertion that the document conforms to a particular template or profile remains subject to that specification’s requirements.

### Source Form and Structured Clinical Content

The following comparison shows how a Source Form can be preserved within CDA while structured clinical content is progressively added. Each representation has its own capabilities; the presence of a structured body does not establish that every clinical statement has a coded representation.

| **Representation**                        | **Source information**                                     | **Structured clinical content**                                                              |
|-------------------------------------------|------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Source Form PDF                           | Human-readable source information                          | Depends on the source form; no CDA clinical entries implied                                  |
| CDA with nonXMLBody                       | Source Form carried in the document body                   | Structured CDA header; no structuredBody entries                                             |
| CDA with structuredBody and Source Form   | Source Form carried in a Source Form section               | Additional sections and entries as required or permitted by the declared template or profile |
| CDA with structured narrative and entries | Human-readable narrative presents the clinical information | Coded entries support processing; coverage depends on the template and instance              |

## Documents as Whole Information Collections

A clinical document is a whole collection of information created to fulfill a defined information objective. A larger longitudinal or comprehensive document can contain content that is also meaningful as a smaller whole with independent exchange value.

The existence of a meaningful nested whole does not require an implementation to create and persist every possible smaller document. The encompassing document can remain the maintained source whole until there is a reason to materialize a subset for independent exchange.

## XFRM Subset Document Derivation

When a meaningful subset is materialized for independent exchange, it becomes a clinical information object in its own right. It has its own document identity, classification, attributable Provenance, clinical scope, and lifecycle. Its content remains traceable to the maintained source collection.

An XFRM relationship expresses document transformation lineage. It does not establish that the source and derived documents are versions of the same logical document. Record the source identity and the derivation activity, and apply the transformation and relatedDocument requirements of the applicable CDA profile and Transaction Definition.

A new derived document receives its own document identifier. A later version of the same logical document preserves that logical identity using the applicable setId and versionNumber rules while receiving the required version-specific identifier. Derivation and replacement are different relationships; neither should be inferred solely from overlapping content.

## Subset Document Examples

The following examples distinguish a maintained encompassing collection from a smaller collection prepared for independent exchange. Overlapping facts do not make the two documents the same logical information object.

### Antepartum Summary - Multiple Meaningful Wholes Within a Longitudinal Whole

An Antepartum Summary is an evolving longitudinal information collection for a pregnancy. It can encompass information that is independently meaningful as an Obstetrics Progress Note, Pregnancy History and Physical Evaluation, Diagnostic Imaging Study, or other document Species. The Antepartum Summary can remain the maintained longitudinal whole; a smaller document is materialized only when there is an exchange reason to send that whole independently.

### Postpartum Summary - Deriving an Encounter-Specific Whole

A Postpartum Summary can serve as the maintained longitudinal information collection for the postpartum period. A particular postpartum encounter is also a meaningful whole. When that encounter needs to be exchanged independently, an encounter-specific Postpartum Visit Note can be derived from the summary and classified according to the semantics of the encounter-specific information collection.

## Information Collection Scope

Document classification and derivation answer what a document is and how it relates to other documents. Information Collection Scope answers a different question: what establishes the boundaries of the information collection?

| **Scope**                              | **Educational definition**                                                                                                                                                                                                                                                        | **Clinical anchor**                                                       |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Encounter Summary / Encounter Note     | The encounter itself establishes the beginning and end of the information collection. The document summarizes the patient state established during or at completion of one visit or stay.                                                                                         | The encounter, ordinarily anchored to completion of the visit/stay.       |
| Episode of Care / Longitudinal Summary | An explicitly established Episode of Care Context Instance establishes the boundaries of the information collection. It may span one or many encounters; a one-visit episode remains episode-scoped when the episode context, rather than the encounter alone, defines the whole. | The clinically meaningful snapshot point of the evolving episode summary. |
| Patient Summary                        | A point-in-time summary of the patient's health history over a span of time up to the represented snapshot.                                                                                                                                                                       | The point represented by the summary.                                     |
| Patient Record                         | A more comprehensive longitudinal collection of patient information accumulated over time.                                                                                                                                                                                        | The record's longitudinal scope; not reduced to one encounter.            |

Implementer test. Ask what establishes the boundaries of the information collection. If the encounter itself establishes the beginning and end of the whole, the document is encounter-scoped. If an explicitly established episode context establishes those boundaries, the document is episode-scoped even when that episode happens to contain only one encounter.

## The CDA Header Should Tell the Same Story

The CDA header should communicate the scope and clinical meaning of the information collection accurately. An encounter-scoped document identifies the encounter supplying its context and temporal anchor. A longitudinal or episode summary should not invent an episode-wide encompassingEncounter. Carry the established Context Instance identifiers using the header structures required by Chapter 3, including inFulfillmentOf/order for this guide’s Context identifiers.

## Clinical Time Is Not Document-Lifecycle Time

CDA defines ClinicalDocument/effectiveTime as the time the document first came into being. For a transformation of an existing document in another format, CDA preserves the original document’s creation time. This guide applies the clinical snapshot convention in Chapter 3: the shared representation preserves the time and information of the existing clinical document rather than substituting a later assembly or transmission time.

For an encounter summary, this guide ordinarily anchors the clinical snapshot to the completed visit or stay. For an evolving longitudinal or episode summary, the anchor identifies the point represented by that version. Authoring, authentication, signing, assembly, and transmission times describe distinct activities and must remain distinguishable.

For example, a discharge summary represents the patient’s state at discharge. If the shared representation is assembled on demand nine days later, it must retain the discharge snapshot; observations obtained after discharge must not silently enter that snapshot. Assembly time is recorded separately through the applicable participant or Provenance information. Acceptance into a recipient workflow and subsequent processing occur later still.

When CDA represents an existing document in another format, preserve the source document’s authored information and time. A scanned form dated October 15 and converted into CDA on January 1 retains the original document’s effective time; January 1 describes the conversion or assembly activity. Structured entries and sections must not introduce clinical facts absent from the source form or attribute another party’s additions to the original author.

Appendix E distinguishes Document Status from metadata availability and transaction workflow status. TX8 is a separate, conditional reporting transaction; its presence or absence does not determine a document’s clinical status. Its crosswalk addresses CDA sdtc:statusCode, FHIR Composition.status, and DocumentReference.docStatus without assuming exact equivalence.

## Authentication Is Part of the Document Lifecycle

Authentication is a document-lifecycle activity distinct from authorship, document custody, assembly, transformation, transmission, and the clinical time represented by the document. Authoring identifies who created or contributed information. Authentication records an attestation to the document. A digital signature is a technical mechanism that can provide cryptographic assurance of an authentication act or exchanged artifact. The legal significance of a signature is determined by the governing document-family, organizational, payer/program, or jurisdictional rules.

A signature mechanism should not be confused with the semantic role of the signer. An electronic signature and a digital signature performed as part of one authentication act do not necessarily represent two separate authentication events. Likewise, a system that assembles, transforms, or transmits an authenticated document does not become its authenticator merely because it handled or generated the exchanged representation.

An authenticated source document retains its original authorship and authentication story when exchanged. Separately attributable transformation or assembly activities may be represented through Provenance. In the structured payload, each Provenance information object is a separate Collection Bundle containing one or more assertions, with its own metadata and membership. Required and permitted activities and target-resolution rules are specified in Chapter 3, Appendix D, and the applicable Transaction Definition.

## Maternal Health Example

An Obstetrics Progress Note and an Antepartum Summary may contain overlapping facts without being redundant. The Progress Note represents one prenatal encounter. The Antepartum Summary represents the evolving pregnancy episode. They are different meaningful wholes with different Information Collection Scope and header stories.

## Maternal Health Document Type Catalog

The following tables identify document types and broader category codes used in this maternal-health guide. Document-level templateId assertions identify the structural Genus and are specified by the applicable CDA implementation guidance. The specific type, broader categories, and asserted template serve distinct purposes. Document labels describe their use in this guide; apply the published terminology and Chapter 3’s bindings for coded metadata.

Use Pregnancy History as the display label for 10162-6 throughout this guide. This label applies whether the code identifies a Pregnancy History section or is used in a broader document-classification mapping. Those applications remain distinct.

### Outside Pregnancy

<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 22%" />
<col style="width: 23%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Broader category codes</strong></th>
<th><strong>Document type code</strong></th>
<th><strong>Document label</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>10162-6<br />
11506-3</td>
<td>89224-0</td>
<td>Gynecology Progress Note</td>
<td>A Gynecology encounter during a period of time that is not associated with pregnancy, or post-partum care.<br />
<br />
A specialized Progress note with information relevant to a GYN visit as the type of Service/type of encounter. It is typically written by an OB/GYN type of provider.</td>
</tr>
<tr class="even">
<td>10162-6<br />
34117-2</td>
<td>89221-6</td>
<td>Gynecology History and Physical Note</td>
<td>A Gynecology encounter where an H&amp;P is performed during a period of time that is not associated with pregnancy, or post-partum care.<br />
<br />
A specialized History and Physical note with information relevant to a GYN visit as the type or service/type of encounter. It includes information regarding a full history and physical examination.</td>
</tr>
<tr class="odd">
<td>10162-6<br />
34133-9</td>
<td>89237-2</td>
<td>Gynecology Flowsheet</td>
<td>Summarizes key vital signs and diagnostic testing over a span of time that is not associated with pregnancy, or post-partum care.<br />
<br />
A specialized Continuity of Care note with information relevant to a Gynecology as the type or service/type of encounter.</td>
</tr>
</tbody>
</table>

### Pregnancy

<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 22%" />
<col style="width: 23%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Broader category codes</strong></th>
<th><strong>Document type code</strong></th>
<th><strong>Document label</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>10162-6</td>
<td>89470-9</td>
<td>Obstetrics Summary</td>
<td>Summary includes multiple episodes of care for each pregnancy.<br />
<br />
This type of document includes information about one or more episodes of care spanning pregnancy, birth, and post-partum for one or more pregnancies. A very summarized version of this type of document is what would go in the Pregnancy History section (10162-6) of a "Patient Summary" kind of document.</td>
</tr>
<tr class="even">
<td>10162-6<br />
34133-9</td>
<td>57055-6</td>
<td>Antepartum Summary</td>
<td>Summary of episode of care for one pregnancy - encompasses the H&amp;P and subsequent Progress Notes, and the initial Notification of Pregnancy information, Risk Factors, Plan of Care, and Education Notes.</td>
</tr>
<tr class="odd">
<td>10162-6<br />
34117-2</td>
<td>34117-2</td>
<td>History and Physical Note</td>
<td></td>
</tr>
<tr class="even">
<td>10162-6</td>
<td>78711-9</td>
<td>Obstetrics and Gynecology Flowsheet</td>
<td>Episode of Care as bounded by time or pregnancy episode.<br />
<br />
Organizes the key Test Results and Vital Signs (included in core sections), and other Observations which may have been gathered prior to the pregnancy, but are considered relevant for this pregnancy. This is not part of the H&amp;P.</td>
</tr>
<tr class="odd">
<td>10162-6</td>
<td>89238-0</td>
<td>Obstetrics Flowsheet</td>
<td>A defined grid of observations organized over the course of the pregnancy. <br />
Example:  Content As defined by ACOG<br />
Example: Content As defined by IHE  Page 121.<br />
<br />
Organizes the key Test Results and Vital Signs (included in core sections), and other Observations over the course of the entire pregnancy. This is not part of the H&amp;P.<br />
ACOG Calls this the "Antepartum Record". It includes ACOG Forms A to G.</td>
</tr>
<tr class="even">
<td>10162-6</td>
<td>92016-5</td>
<td>Pregnancy Notification &amp; Risk Factors</td>
<td></td>
</tr>
<tr class="odd">
<td>10162-6</td>
<td>90767-5</td>
<td>Pregnancy Status Summary</td>
<td></td>
</tr>
<tr class="even">
<td>10162-6</td>
<td>71482-4</td>
<td>Risk Assessment Summary</td>
<td>A summarization of maternal pregnancy risk factors.<br />
<br />
A summarization of information used to assess pregnancy risk factors.</td>
</tr>
<tr class="odd">
<td>10162-6</td>
<td>89233-1</td>
<td>Obstetrics Progress Note</td>
<td>The note from an encounter during a pregnancy.</td>
</tr>
<tr class="even">
<td>10162-6<br />
18748-4</td>
<td>18748-4 (or more specific types)</td>
<td>Diagnostic imaging study</td>
<td>Diagnostic Imaging Ultrasound Report</td>
</tr>
<tr class="odd">
<td>10162-6<br />
11502-2</td>
<td>11502-2 (or more specific types)</td>
<td>Laboratory Report</td>
<td>Diagnostic Testing Laboratory Results Report</td>
</tr>
<tr class="even">
<td>10162-6</td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Obstetrics plan of care at the point in time when the document is created.</td>
</tr>
<tr class="odd">
<td>10162-6</td>
<td>34895-3</td>
<td>Education Information</td>
<td>List of the provided Obstetrics education that has been provided.</td>
</tr>
<tr class="even">
<td>10162-6</td>
<td>89234-9</td>
<td>Obstetrics Referral</td>
<td>The referral to request birth services for a patient who has received prenatal care elsewhere.</td>
</tr>
<tr class="odd">
<td>10162-6</td>
<td>57079-6</td>
<td>Birth Plan</td>
<td>Patient preferences regarding various aspects of the birth intervention.</td>
</tr>
<tr class="even">
<td>BIRTH</td>
<td>DT-Birth</td>
<td>Birth Notification</td>
<td>Birth Notification document. Temporary document-type code pending assignment of a LOINC Document Ontology code.</td>
</tr>
</tbody>
</table>

### Birth

<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 22%" />
<col style="width: 23%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Broader category codes</strong></th>
<th><strong>Document type code</strong></th>
<th><strong>Document label</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>10162-6<br />
15508-5<br />
67851-6</td>
<td>92575-0</td>
<td>Labor and Delivery Admission Note</td>
<td>The beginning of a birth encounter (Type of Service is an Admission.)</td>
</tr>
<tr class="even">
<td>10162-6<br />
15508-5<br />
34117-2</td>
<td>57056-4</td>
<td>Labor and Delivery History and Physical Note</td>
<td>The history and physical information gathered at the beginning of a birth encounter. This can be a section within an Admission note, or it can be produced as a document on its own. This information can be "fed by" the history and physical information gathered during the Antepartum period.</td>
</tr>
<tr class="odd">
<td>10162-6<br />
15508-5<br />
11504-8</td>
<td>89457-6</td>
<td>Obstetric Surgical Operation Note</td>
<td>Within the context of a Maternal Discharge Summary, this other document type could be referenced or a section using this LOINC Code might contain summary information from the surgical procedure (i.e. c-section) and then include an external document reference entry.</td>
</tr>
<tr class="even">
<td>10162-6<br />
15508-5<br />
34133-9</td>
<td>57057-2</td>
<td>Labor and Delivery Summary</td>
<td>This document is produced at the end of a labor and delivery episode and if there are multiple encounters (i.e. ED--&gt;Hospital (birthing ward) --&gt;NICU at specialty hospital.  The system that makes this document is the system that is used at the conclusion of the birth.) It includes summarization of the Obstetrics Surgical note if/where appropriate. It may include summarization of the specialized information in the Maternal and fetal medicine discharge summary.</td>
</tr>
<tr class="odd">
<td>10162-6<br />
18776-5</td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Postpartum plan of care.</td>
</tr>
<tr class="even">
<td>10162-6<br />
15508-5<br />
18842-5</td>
<td>92576-8</td>
<td>Maternal Discharge Summary</td>
<td>This is produced at the end of a birth encounter and only has information about the mother and baby(ies) at the end of an encounter. This is an enhanced Discharge Summary (18842-5, 10162-6).<br />
<br />
If you started in the ED and they transferred you to the birthing ward, then this type of summary summarizes the ED Encounter. It would then be encompassed by the summary produced at the end of the next encounter that goes into completing the birth event. Includes a post-partum treatment plan which has additional observations such as: scheduled date of first post-partum visit with their provider. Lactation Consultation, Intention for breast feeding; SDOH issues.<br />
Needs to include a Post Partum Care Plan which includes:<br />
Working on potential treatments and goals <br />
Scheduled initial postpartum visit<br />
optional possible treatments<br />
at home monitoring for hypertension<br />
optional postpartum physical therapy<br />
Recovery goals for c-section</td>
</tr>
<tr class="odd">
<td>10162-6<br />
15508-5<br />
18842-5</td>
<td>97702-5</td>
<td>Maternal and Fetal Medicine Discharge summary</td>
<td>Summarized an encounter for the mother and baby(ies) at the end of that encounter. This document contains more specialized or enhanced information than a Maternal Discharge Summary (18842-5, and 92576-8 in addition to all of these document types have category 10162-6 ).<br />
<br />
The end of a birth encounter with complications that may have needed additional information to be gathered.</td>
</tr>
</tbody>
</table>

### Postpartum

<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 22%" />
<col style="width: 23%" />
<col style="width: 36%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Broader category codes</strong></th>
<th><strong>Document type code</strong></th>
<th><strong>Document label</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>10162-6<br />
18776-5</td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Postpartum plan of care.</td>
</tr>
<tr class="even">
<td>10162-6<br />
34133-9</td>
<td>112590-5</td>
<td>Postpartum Summary</td>
<td>Episode of Care as bounded by time or postpartum period. Type of Service is postpartum care and monitoring.</td>
</tr>
<tr class="odd">
<td>10162-6<br />
11506-3</td>
<td>68608-9</td>
<td>Postpartum Visit Note</td>
<td>An encounter during the postpartum period.<br />
Type of Service is postpartum care and monitoring. IHE Definition: <br />
The Postpartum Visit Summary (PPVS) describes the content and format of the summary document that will be used to complete the pregnancy care record. PPVS captures any episode of treatment occurring during the postpartum period. This includes any care the woman receives after she has been discharged from the hospital/birthing facility, up to and including the postpartum visit. The routine postpartum visit, usually occurring six-weeks after birth, completes the obstetric care record.</td>
</tr>
</tbody>
</table>

## Where to Find Implementation Rules

Chapter 3 provides the common requirements for document identity, Context, classification, clinical snapshots, human-readable content, and Provenance. Chapter 5 explains how to implement and test them. Apply the relevant Transaction Definition for the exchanged information objects, asserted profiles, required activities, and Sender Actor and Receiver Actor responsibilities.

### Collection relationship

This appendix provides conceptual guidance within the implementation guide. Appendix B explains identity, Context, and status; Appendix C explains XD classification; Appendix D supplies FHIR structured payload packaging and mappings. The applicable specifications determine normative conformance requirements; these concepts help implementers apply them consistently.

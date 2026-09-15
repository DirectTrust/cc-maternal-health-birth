---
title: "Use Case Overview: cc-maternal-health-birth"
---

# Use Case Overview: cc-maternal-health-birth

This Interoperability Implementation Guide establishes a messaging workflow using Direct Secure Messaging and IHE Query protocols to support care coordination for maternal health care supporting pregnancy and birth. The implementation guide is used by organizations (data sharing partners) to specify the message payload and metadata expectations which define a set of transactions which accomplish the intended workflow required to support pregnancy notification, care coordination across an episode of pregnancy care through birth and postpartum care.

## Use Case Context

The Maternal Health – Birth use case demonstrates how the Direct Standard® can support continuity of care across pregnancy, labor and delivery, postpartum care, payer engagement, and future public health workflows. It applies the DirectTrust Metadata and Payloads Framework and other available standards defined by HL7 and IHE to define interoperable transaction patterns, payloads, metadata, and actor responsibilities needed to improve document-based exchange throughout the maternal episode of care.

## Problem

Maternal healthcare involves numerous care transitions across independent organizations. Clinical information is often fragmented across EHR systems, resulting in delays, duplicate testing, manual record retrieval, and incomplete information during critical clinical decisions. This implementation guide addresses those interoperability challenges using standardized, event-driven document exchange.

## Idea

Direct Secure Messaging is widely deployed throughout the U.S. healthcare ecosystem. Rather than requiring new infrastructure, this guide leverages existing Direct capabilities, standardized metadata, and workflow triggers to move the right information to the right participants at the right time. The IHE document query infrastructure enables organizations that participate in national networks to request and retrieve needed information.

## Solution

This guide defines a consistent set of transaction patterns, payloads, metadata requirements, and actor responsibilities that support maternal health care coordination. The resulting workflows automate information exchange while preserving interoperability across organizations and technology vendors. Although some of the information exchange scenarios are currently out of scope, the potential exists to address a wide range of information sharing scenarios.

### Summary of Information Exchange Objectives

Information Exchange Objectives describe the interoperability outcomes this Implementation Guide is designed to support. An objective states what participating systems and organizations need to accomplish through information exchange without prescribing a single workflow for accomplishing it.

Scenarios are specific examples that demonstrate how one or more Information Exchange Objectives can be achieved through a particular sequence of actors, transactions, clinical documents, notifications, and workflow events. The example artifact package associated with this guide provides a maternal-health journey that illustrates how the specifications can be applied in practice.

| **Objective ID** | **Technical Use Case Name and Description** | **In-scope or Out-of-scope** |
|----|----|----|
| O1 | Provide Notification of Pregnancy and Risk Factors | In-scope |
| O2 | Provide Referral/Orders for Birth Services | In-scope |
| O3 | Provide Antepartum Summary Information Across Care Settings | In-scope |
| O4 | Enable Postpartum Planning Across Care Settings | In-scope |
| O5 | Improve Patient Matching When Key Information Changes | In-scope |
| O6 | Communicate Workflow Status For Improved Orchestration | In-scope |
| O7 | Capture and Preserve Accurate Data Provenance | In-scope |
| O8 | Provide Continuity of Care for Newborn |  |
| O9 | Provide Public Health/Vital Records Information |  |
| O10 | Enable Quality Reporting |  |
| O11 | Support Research |  |
| O12 | Enable Secure Information Exchange with Patients and Family Members or other patient-authorized Individuals or Organizations |  |

**O7 - Capture and Preserve Accurate Data Provenance.** Information exchange must preserve the provenance of information received from upstream sources while capturing additional provenance for activities performed by downstream participants and Intermediaries. The responsible Information Source must remain distinguishable from Technology Actors that create, sign, seal, update, assemble, transform, transmit, receive, void, deprecate, or mark information as entered-in-error. An Intermediary adds provenance through the activities it performs; it does not become the Information Source merely because it receives, processes, transforms, assembles, or retransmits information.

## Value Proposition

Consistent use of these transaction specifications improves continuity of care, reduces administrative burden, supports better clinical decisions, decreases redundant testing, strengthens payer and provider coordination, and advances maternal health outcomes.

## Key Beneficiaries

Primary beneficiaries include mothers and families, prenatal providers, hospitals, postpartum providers, pediatric providers, payers, health information exchanges, EHR vendors, and public health organizations.

## Technical Feasibility

The solution builds on mature and widely implemented standards including Direct Secure Messaging, HL7 V2 ADT, C-CDA, and IHE XDM/XDR. No new transport infrastructure is required.

## In Scope

Version 1.0 focuses on document-based exchange for maternal health document types and the event, query, patient-update, and workflow-confirmation transactions needed to coordinate pregnancy, birth, and postpartum care. Processing workflows support Minimally Structured CDA Documents and the transaction patterns identified in Chapter 2, including Direct push transactions and IHE document query. The Implementation Guide utilizes transaction patterns established in Event Notifications via the Direct Standard and Patient Update Notification via the Direct Standard.

## Out of Scope

FHIR metadata packaging, Context IG metadata packaging, newborn-focused workflows, public health/vital records exchange, quality reporting, research workflows, and additional transaction patterns remain outside the scope of this version unless explicitly identified elsewhere in the guide.

## Principles

Key principles at play in this Implementation Guide include:

### Human Readability

The principle of human readability expresses the commitment to ensure that all information exchange conveys information in a manner which humans can access and understand, so as to utilize and govern over its use. Data shared in a machine processable format must also be accompanied by human readable information designed to summarize and present key information needed for human review and comprehension.

### Progressive Interoperability

The design philosophy of Progressive Interoperability is grounded in principles that balance innovation with pragmatism. This philosophy provides a sustainable roadmap for organizations at every stage of interoperability maturity, assuring the value of receiving structured data is recognized before the burden of producing it is born. It recognizes that sustainable progress is achieved through a sequence of manageable improvements that collectively transform an ecosystem over time.

- *Value matters, not volume.* The objective is not to maximize structured data—it’s to maximize the value of what can be achieved with the structured data that is supplied.

- *Evolve with deliberation, not exuberance.* We need to meet stakeholders where they are and improve through deliberate, incremental change. Like orthodontic treatments that improve your smile, lasting transformation comes from a series of purposeful adjustments that steadily move toward a well-defined destination. Crooked teeth can’t be straightened in a single crank. It takes purposeful pressure at the right level, applied over time.

- *Preserve the story while making it more usable.* The clinical narrative of a document remains the authoritative information source. How the source information is represented is inherently part of its context and meaning. The fidelity and authenticity of the source form is essential to preserve information as it is shared. The structured data that accompanies a document is not the “truth”, it’s a biproduct devised to improve access and increase computer processing possibilities.

#### **Progressive Structuring Design Methodology**

Progressive Structuring is the design methodology at the heart of Minimally Structured Documents. It separates two concerns that are often treated as though they were the same: whether the available information can be exchanged completely, and how much of that information has been represented as standardized structured data. Rather than requiring an all-or-nothing choice between a fully structured representation and an unstructured document, the approach begins by preserving the source form of the information within a structured CDA document and then progressively enriches the structured representation as implementation maturity, data quality, and demonstrated business value increase.

#### **Information completeness does not have to wait for structured-data maturity**

A Minimally Structured Document is designed so that limitations in a source system's structured-data capability do not become a barrier to accurate information exchange. The Source Form Document preserves the human-readable representation of the information available in the source EHR for that particular document Species. By carrying that source representation with the exchanged clinical document, the sender can provide Information Recipients - including clinicians, administrative users, and AI-enabled solutions capable of interpreting the source representation - with access to the information that was available to the sender even when some or all of that information has not yet been represented accurately as standardized structured data.

This distinction allows an exchanged document to be informationally complete while still varying in the quality and completeness of its structured representation. The Source Form preserves the information story. The structured data provides an additional computable representation of that story.

#### **Structured-data quality becomes a measurable attribute rather than a gate to exchange**

The document's declared Genus establishes expectations about the structural model and the kinds of structured content that should be present. How completely and accurately a particular document instance fulfills those expectations can therefore be evaluated as a qualitative attribute of the document. A document with limited structured content and a document with extensive, accurate structured content can both communicate the underlying source information; they differ in the degree to which a recipient can reliably process that information computationally without interpreting the Source Form.

This creates a pathway for progressive improvement without making perfect structure a prerequisite for participation. Implementers can exchange useful information first, measure the quality of the structured representation, and progressively improve computability over time. Programs can establish higher structured-data quality expectations as the ecosystem matures and can use incentives to reward implementations that provide more complete and accurate computable data.

#### **Example: rewarding computability without blocking communication**

For example, a payer program receiving a Pregnancy Notification and Risk Assessment document could define measurable quality levels based on the structured content expected for the document's declared Genus. A document that includes the complete Source Form but relatively little accurate structured data can still communicate the pregnancy notification and risk information to the recipient. A document that also contains a more complete and accurate structured representation can receive a higher quality assessment and, where the program chooses, qualify for a greater incentive payment. In this model, payment can reward the quality of computability without making computability a prerequisite for communication.

#### **Relationship to Species, Genus, and Family**

The document-classification model described later in this chapter provides useful vocabulary for this approach. Species identifies what information collection is being exchanged. Genus identifies the structural archetype the document asserts it follows and therefore establishes expectations for computable content. Family supports broader discovery and workflow classification. The Source Form preserves the available information for the Species, while Progressive Structuring improves how well the individual document instance fulfills the computable expectations of its declared Genus.

This makes structured-data quality independently observable: an implementation can distinguish information completeness from structured-data quality rather than treating a document as either interoperable or non-interoperable. Progressive Structuring therefore supports an adoption model in which complete information exchange can begin early and computability can improve deliberately over time.

Figure 1. Conceptualizing Minimally Structured Document Architecture

This illustration shows the progression from a pdf document that has no structured data to an Unstructured Document which has a structured header but no structured data in the body, as opposed to a Fully Structured Document which has a structured header and every bit of the informational content of the document is represented.

![Figure 1. Conceptualizing Minimally Structured Document Architecture](/images/use-case-overview/1.svg)

## Terms

Unless otherwise defined in this guide, terminology follows the definitions established in the DirectTrust Metadata and Payloads Framework (Part I).

This Implementation Guide clarifies how clinical documents used for maternal-health care coordination are typed, structurally characterized, and classified for discovery and workflow.

### Document Classification - Species, Genus, and Family

This Implementation Guide distinguishes three complementary dimensions of document classification. Species identifies the specific clinical document type and is represented by ClinicalDocument/code using the most specific appropriate LOINC Document Ontology code. Genus identifies the structural document archetype asserted by the applicable document-level templateId. Family identifies one or more broader collections used for discovery and workflow classification and is represented using sdtc:category. These dimensions answer different questions and should not be conflated.

The Maternal Health subject-matter category (10162-6) is used as a Family classification for document types relevant to this use case. A document may carry more than one Family classification when multiple broader categories apply. Appendix A, Understanding Clinical Documents as Information Collections, provides the educational model, examples, nesting concepts, XFRM sub-set derivation, and Information Collection Scope guidance.

### Document Types

The following tables identify the specific document Species used by this Implementation Guide and the Family categories associated with them. The document-level templateId assertions that establish structural Genus are specified with the CDA implementation guidance for the applicable document representations.

**NOT PREGNANT**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 22%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr>
<th><strong>Categories</strong></th>
<th><strong>LOINC Type</strong></th>
<th><strong>LOINC Display</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>10162-6</p>
<p>11506-3</p></td>
<td>89224-0</td>
<td>Gynecology Progress Note</td>
<td><p>A Gynecology encounter during a period of time that is not associated with pregnancy, or post-partum care.</p>
<p>A specialized Progress note with information relevant to a GYN visit as the type of Service/type of encounter. It is typically written by an OB/GYN type of provider.</p></td>
</tr>
<tr>
<td><p>10162-6</p>
<p>34117-2</p></td>
<td>89221-6</td>
<td>Gynecology History and Physical Note</td>
<td><p>A Gynecology encounter where an H&amp;P is performed during a period of time that is not associated with pregnancy, or post-partum care.</p>
<p>A specialized History and Physical note with information relevant to a GYN visit as the type or service/type of encounter. It includes information regarding a full history and physical examination.</p></td>
</tr>
<tr>
<td><p>10162-6</p>
<p>34133-9</p></td>
<td>89237-2</td>
<td>Gynecology Flowsheet</td>
<td><p>Summarizes key vital signs and diagnostic testing over a span of time that is not associated with pregnancy, or post-partum care.</p>
<p>A specialized Continuity of Care note with information relevant to a Gynecology as the type or service/type of encounter.</p></td>
</tr>
</tbody>
</table>

**PREGNANCY**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 22%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr>
<th><strong>Categories</strong></th>
<th><strong>LOINC Type</strong></th>
<th><strong>LOINC Display</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>10162-6</td>
<td>89470-9</td>
<td>Obstetrics Summary</td>
<td><p>Summary includes multiple episodes of care for each pregnancy.</p>
<p>This type of document includes information about one or more episodes of care spanning pregnancy, birth, and post-partum for one or more pregnancies. A very summarized version of this type of document is what would go in the Maternal Health section (10162-6) of a "Patient Summary" kind of document.</p></td>
</tr>
<tr>
<td><p>10162-6</p>
<p>34133-9</p></td>
<td>57055-6</td>
<td>Antepartum Summary</td>
<td>Summary of episode of care for one pregnancy - encompasses the H&amp;P and subsequent Progress Notes, and the initial Notification of Pregnancy information, Risk Factors, Plan of Care, and Education Notes.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>34117-2</p></td>
<td>34117-2</td>
<td>History and Physical Note</td>
<td></td>
</tr>
<tr>
<td>10162-6</td>
<td>78711-9</td>
<td>Obstetrics and Gynecology Flowsheet</td>
<td><p>Episode of Care as bounded by time or pregnancy episode.</p>
<p>Organizes the key Test Results and Vital Signs (included in core sections), and other Observations which may have been gathered prior to the pregnancy, but are considered relevant for this pregnancy. This is not part of the H&amp;P.</p></td>
</tr>
<tr>
<td>10162-6</td>
<td>89238-0</td>
<td>Obstetrics Flowsheet</td>
<td><p>A defined grid of observations organized over the course of the pregnancy. </p>
<p>Example:  Content As defined by ACOG</p>
<p>Example: <a href="https://www.ihe.net/uploadedFiles/Documents/PCC/IHE_PCC_Suppl_CDA_Content_Modules.pdf">Content As defined by IHE </a> Page 121.</p>
<p>Organizes the key Test Results and Vital Signs (included in core sections), and other Observations over the course of the entire pregnancy. This is not part of the H&amp;P.</p>
<p>ACOG Calls this the "Antepartum Record". It includes ACOG Forms A to G. </p>
<p>Sample Document (Form C includes vital signs and Form D includes key labs and diagnostic imaging): <a href="https://confluence.hl7.org/download/attachments/453915763/ACOG%20Antepartum%20Record.pdf?version=1&amp;modificationDate=1780490297751&amp;api=v2">ACOG Antepartum Record.pdf</a></p></td>
</tr>
<tr>
<td>10162-6</td>
<td>92016-5</td>
<td>Pregnancy Notification &amp; Risk Factors</td>
<td></td>
</tr>
<tr>
<td>10162-6</td>
<td>90767-5</td>
<td>Pregnancy Status Summary</td>
<td></td>
</tr>
<tr>
<td>10162-6</td>
<td>71482-4</td>
<td>Risk Assessment Summary</td>
<td><p>A summarization of maternal pregnancy risk factors.</p>
<p>A summarization of information used to assess pregnancy risk factors.</p>
<p>Sample Document: <a href="https://confluence.hl7.org/download/attachments/453915763/Notification-of-Pregnancy-and-Risk-Screening-November-2025.pdf?version=1&amp;modificationDate=1780490406157&amp;api=v2">Notification-of-Pregnancy-and-Risk-Screening-November-2025.pdf</a></p></td>
</tr>
<tr>
<td>10162-6</td>
<td>89233-1</td>
<td>Obstetrics Progress Note</td>
<td>The note from an encounter during a pregnancy.</td>
</tr>
<tr>
<td>10162-6</td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Obstetrics plan of care at the point in time when the document is created.</td>
</tr>
<tr>
<td>10162-6</td>
<td>34895-3</td>
<td>Education Information</td>
<td>List of the provided Obstetrics education that has been provided.</td>
</tr>
<tr>
<td>10162-6</td>
<td>89234-9</td>
<td>Obstetrics Referral</td>
<td>The referral to request birth services for a patient who has received prenatal care elsewhere.</td>
</tr>
<tr>
<td>10162-6</td>
<td>57079-6</td>
<td>Birth Plan</td>
<td>Patient preferences regarding various aspects of the birth intervention.</td>
</tr>
<tr>
<td>BIRTH</td>
<td>DT-Birth</td>
<td>Birth Notification</td>
<td>Birth Notification document. Temporary document-type code pending assignment of a LOINC Document Ontology code.</td>
</tr>
</tbody>
</table>

**BIRTH**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 22%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr>
<th><strong>Categories</strong></th>
<th><strong>LOINC Type</strong></th>
<th><strong>LOINC Display</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>67851-6</p></td>
<td>92575-0</td>
<td>Labor and Delivery Admission Note</td>
<td>The beginning of a birth encounter (Type of Service is an Admission.)</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>34117-2</p></td>
<td>57056-4</td>
<td>Labor and Delivery History and Physical Note</td>
<td>The history and physical information gathered at the beginning of a birth encounter. This can be a section within an Admission note, or it can be produced as a document on its own. This information can be "fed by" the history and physical information gathered during the Antepartum period.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>11504-8</p></td>
<td>89457-6</td>
<td>Obstetric Surgical Operation Note</td>
<td>Within the context of a Maternal Discharge Summary, this other document type could be referenced or a section using this LOINC Code might contain summary information from the surgical procedure (i.e. c-section) and then include an external document reference entry.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>34133-9</p></td>
<td>57057-2</td>
<td>Labor and Delivery Summary</td>
<td>This document is produced at the end of a labor and delivery episode and if there are multiple encounters (i.e. ED--&gt;Hospital (birthing ward) --&gt;NICU at specialty hospital.  The system that makes this document is the system that is used at the conclusion of the birth.) It includes summarization of the Obstetrics Surgical note if/where appropriate. It may include summarization of the specialized information in the Maternal and fetal medicine discharge summary.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>18776-5</p></td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Postpartum plan of care.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>18842-5</p></td>
<td>92576-8</td>
<td>Maternal Discharge Summary</td>
<td><p>This is produced at the end of a birth encounter and only has information about the mother and baby(ies) at the end of an encounter. This is an enhanced Discharge Summary (18842-5, 10162-6).</p>
<p>If you started in the ED and they transferred you to the birthing ward, then this type of summary summarizes the ED Encounter. It would then be encompassed by the summary produced at the end of the next encounter that goes into completing the birth event. Includes a post-partum treatment plan which has additional observations such as: scheduled date of first post-partum visit with their provider. Lactation Consultation, Intention for breast feeding; SDOH issues.</p>
<p>Needs to include a Post Partum Care Plan which includes:</p>
<ul>
<li><p>Working on potential treatments and goals </p></li>
<li><p>Scheduled initial postpartum visit</p></li>
<li><p>optional possible treatments</p>
<ul>
<li><p>at home monitoring for hypertension</p></li>
</ul></li>
<li><p>optional postpartum physical therapy</p>
<ul>
<li><p>Recovery goals for c-section </p></li>
</ul></li>
</ul></td>
</tr>
<tr>
<td><p>10162-6</p>
<p>15508-5</p>
<p>18842-5</p></td>
<td>97702-5</td>
<td>Maternal and Fetal Medicine Discharge summary</td>
<td><p>Summarized an encounter for the mother and baby(ies) at the end of that encounter. This document contains more specialized or enhanced information than a Maternal Discharge Summary (18842-5, and 92576-8 in addition to all of these document types have category 10162-6 ).</p>
<p>The end of a birth encounter with complications that may have needed additional information to be gathered.</p></td>
</tr>
</tbody>
</table>

**POSTPARTUM**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 22%" />
<col style="width: 54%" />
</colgroup>
<thead>
<tr>
<th><strong>Categories</strong></th>
<th><strong>LOINC Type</strong></th>
<th><strong>LOINC Display</strong></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>10162-6</p>
<p>18776-5</p></td>
<td>18776-5</td>
<td>Care Plan</td>
<td>The Postpartum plan of care.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>34133-9</p></td>
<td>112590-5</td>
<td>Postpartum Summary</td>
<td>Episode of Care as bounded by time or postpartum period. Type of Service is postpartum care and monitoring.</td>
</tr>
<tr>
<td><p>10162-6</p>
<p>11506-3</p></td>
<td>68608-9</td>
<td>Postpartum Visit Note</td>
<td><p>An encounter during the postpartum period.</p>
<p>Type of Service is postpartum care and monitoring. IHE Definition: </p>
<p>The Postpartum Visit Summary (PPVS) describes the content and format of the summary document that will be used to complete the pregnancy care record. PPVS captures any episode of treatment occurring during the postpartum period. This includes any care the woman receives after she has been discharged from the hospital/birthing facility, up to and including the postpartum visit. The routine postpartum visit, usually occurring six-weeks after birth, completes the obstetric care record.</p>
<p>Work needed to define the Postpartum Care Plan</p>
<p>based on this ACOG Form <a href="https://confluence.hl7.org/download/attachments/453915763/ACOG-PPDS.pdf?version=1&amp;modificationDate=1780491857892&amp;api=v2">ACOG-PPDS.pdf</a></p></td>
</tr>
</tbody>
</table>

## Foundational Concepts and Supporting Guidance

The document types defined above are used within a broader information architecture that distinguishes document classification, Information Collection Scope, Established Context Instances, workflow state, and Data Provenance. The main Use Case Guide introduces these concepts only to the degree needed to understand the maternal-health objectives and transactions.

Appendix A - Understanding Clinical Documents as Information Collections provides concise educational material on document classification, content nesting, XFRM sub-set documents, Encounter Summaries, Episode of Care/Longitudinal Summaries, Patient Summaries, and clinical temporal anchoring.

Appendix B - Understanding Identity, Context, and Status explains patient identity, assigning authority, longitudinal clinical Context Instances, workflow Context Instances, encounter Context Instances, and the distinction between context identity and lifecycle status.

Implementer Guidance provides the more prescriptive application guidance for CDA construction, Data Provenance, identifier preservation, Context Instance representation, XFRM derivation, document lifecycle, Intermediary processing, and FHIR Task use for persistent and bounded workflow-status processing.

The transaction-specific specification files define the exact Direct-X headers, XDM SubmissionSet and DocumentEntry metadata, workflow-status Task and payload requirements where applicable, and element-level conformance designations used for each transaction.

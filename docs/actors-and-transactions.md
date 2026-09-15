---
title: Actors and Transactions Overview
---

# Actors and Transactions Overview

This chapter establishes a consistent actor model for describing the responsible parties that supply, receive, and facilitate information exchange; the technology those parties employ; and the business roles they perform within this use case. It distinguishes Information Exchange Actor Roles from Technology Actor Roles and Business Actor Roles so that responsibility and provenance are not confused with the systems, apps, and devices used to perform technical functions. A foundational distinction is also made between Organizational Entities, which operate in an organizational or professional capacity, and Individual Entities, which operate in a personal capacity.

## Information Exchange Actor Roles

Information Exchange Actor Roles identify the responsible parties participating in an information exchange. These roles describe responsibility for supplying information, receiving information, or facilitating its exchange; they do not identify the technology used to perform those functions. A responsible party may be an Organizational Entity or an Individual Entity, and the same responsible party may perform different Information Exchange Actor Roles in different transactions. Distinguishing these roles is important for understanding provenance and accountability when information passes through one or more Intermediaries.

| **Information Exchange Actor Role** | **Definition** | **Examples** |
|----|----|----|
| Information Source | The responsible party that supplies information for an information exchange. The Information Source may be an Organizational Entity or an Individual Entity. It is the party from which the information is supplied for purposes of the exchange and may employ one or more Technology Actors to create, assemble, package, transmit, or otherwise enable the exchange. | An OB Provider supplying an Antepartum Summary; a Birthing Provider supplying an admission or discharge notification; a Payer supplying coverage-related information; a Patient supplying information in a personal capacity. |
| Information Recipient | The responsible party for whom information is intended in an information exchange. The Information Recipient may be an Organizational Entity or an Individual Entity and may employ one or more Technology Actors to receive, process, present, store, or otherwise enable use of the exchanged information. | A Birthing Provider receiving an Antepartum Summary; an OB Provider receiving a discharge notification; a Payer receiving pregnancy information; a Patient receiving information in a personal capacity. |
| Intermediary | A responsible party that facilitates an information exchange between an Information Source and an Information Recipient without being the Information Source or intended Information Recipient for that exchange. An Intermediary may employ Technology Actors as a Receiver Actor for one message-processing leg and as a Sender Actor for another; recipient discovery, routing, assembly, transformation, or retransmission does not change the Information Source or Information Recipient roles. The Intermediary SHALL preserve upstream provenance and add provenance for the activities it performs. | A health information exchange or maternal health data utility facilitating exchange between participating organizations. |

**Data Provenance principle.** Business responsibility follows the information; Technology Actor roles follow each message-processing leg. This distinction supports O7 Capture and Preserve Accurate Data Provenance by allowing Create, Sign, Seal, Update, Assemble, Transform, Transmit, Receive, Void, Deprecate, and Entered-in-Error Provenance Activities to be attributed accurately without incorrectly replacing the Information Source.

## Technology Actor Roles

| **Technology Actor Role** | **Definition** | **Examples** |
|----|----|----|
| System | A technology environment operated by or on behalf of a responsible party that provides a collection of capabilities used to create, manage, process, store, send, or receive information in support of that party's activities. | An Electronic Health Record (EHR) used by a healthcare provider; a Business Services Platform used by a payer or other organization. |
| App | A software application used by a responsible party to perform a particular set of functions. An App may operate independently or may integrate with a System used by the responsible party. | A Personal Health Record (PHR) used by an Individual Entity; a specialized clinical or administrative service used by an Organizational Entity that may or may not integrate with its EHR or Business Services Platform. |
| Device | A hardware component that incorporates System or App capabilities enabling it to collect, create, process, store, send, or receive information for a responsible party which may be an Organizational Entity or Individual Entity. | A clinical device used on behalf of an Organizational Entity; a patient-operated or mobile device used by an Individual Entity. |

## Business Actor Roles

Technology Actors are systems, applications, devices, services, or other technology components employed by a Business Actor to perform technical functions that enable information exchange. A Technology Actor acts on behalf of a responsible party and is not, by itself, the Information Source, Information Recipient, or Intermediary. Separating Technology Actors from Information Exchange Actor Roles makes it possible to clarify which party is responsible for the exchange, and which technical component performs a particular function.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>Entity Type</strong></th>
<th><strong>Definition</strong></th>
<th><strong>Examples from the Mimi Shell Scenario<br />
(included with this Implementation Guide)</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Organizational Entity</td>
<td>An organization, or personnel acting in a professional capacity on behalf of an organization, that acts as a responsible party. Personnel acting within an organizational or professional role are treated as Organizational Entities for purposes of identifying responsibility, including a practitioner acting through their own sole proprietorship or other professional organization.</td>
<td>Health Services of North Texas (HSNT); Texas Health Presbyterian Hospital Denton; Wellpoint Texas STAR; THSA-TX-HIE; Denton Community Birth Support Program; Workforce Solutions for North Central Texas; Simone Heps acting professionally as Mimi's OB/GYN; Dr. Carter acting professionally as Mimi's hospital provider; Daria Deonne acting professionally through the doula program.</td>
</tr>
<tr>
<td>Individual Entity</td>
<td>A responsible party operating in a personal capacity, either on its own behalf or because of a personal relationship or personal authority involving another person. An Individual Entity may be a singular human being or a set of human beings, such as a family, when the responsible party operates in a personal rather than professional capacity. A human being acting in a professional or organizational capacity is not an Individual Entity for purposes of that activity.</td>
<td>Mimi Shell acting on her own behalf; Thomas Curic acting as Mimi's partner and support person; Mimi's family considered collectively when operating in a personal capacity.</td>
</tr>
</tbody>
</table>

**FOUNDATIONAL PRINCIPLE:** The distinction between an Organizational Entity and an Individual Entity is based on the capacity in which the Responsible Party is acting—not on whether the Responsible Party happens to be a singular human being or a set of human beings. A human being acting in a professional capacity is represented as an Organizational Entity because the Organization they work for is ultimately the Responsible Party. A human being acting in a personal capacity is represented as an Individual Entity because that person alone is the Responsible Party. Similarly, a set of human beings considered a Family represents a collection of Individual Entities because a family operates in a personal capacity, not a professional capacity.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>Organizational Entity Business Actor Role</strong></th>
<th><strong>Definition</strong></th>
<th><strong>Examples from the Mimi Shell Scenario<br />
(included with this Implementation Guide)</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>OB Provider</td>
<td>An Organizational Entity responsible for providing obstetric care during pregnancy and related maternal care.</td>
<td>Health Services of North Texas (HSNT/NTHS), where Mimi receives prenatal care; Simone Heps acts professionally as Mimi's OB/GYN on behalf of this Organizational Entity.</td>
</tr>
<tr>
<td>Birthing Provider</td>
<td>An Organizational Entity responsible for providing labor, delivery, and related inpatient maternal care.</td>
<td>Texas Health Presbyterian Hospital Denton; Dr. Carter and other hospital personnel act professionally on behalf of this Organizational Entity.</td>
</tr>
<tr>
<td>Primary Care Provider</td>
<td>An Organizational Entity responsible for providing primary care.</td>
<td>The provider organization through which Alicia Gould serves as Mimi's PCP.</td>
</tr>
<tr>
<td>Payer</td>
<td>An Organizational Entity responsible for administering or providing health coverage and related services.</td>
<td>Wellpoint Texas STAR, Mimi's Medicaid STAR plan.</td>
</tr>
<tr>
<td>Imaging Provider</td>
<td>An Organizational Entity responsible for providing diagnostic imaging services.</td>
<td>The imaging provider used for Mimi's pregnancy-related diagnostic ultrasound services.</td>
</tr>
<tr>
<td>Laboratory Provider</td>
<td>An Organizational Entity responsible for providing laboratory services.</td>
<td>The laboratory organization performing Mimi's prenatal laboratory testing.</td>
</tr>
<tr>
<td>Health Information Exchange / Intermediary</td>
<td>An Organizational Entity responsible for facilitating information exchange between Information Sources and Information Recipients.</td>
<td>THSA-TX-HIE, which receives event information, determines appropriate destinations, and facilitates exchange to participating recipients.</td>
</tr>
<tr>
<td>Community or Support Services Provider</td>
<td>An Organizational Entity responsible for providing community, social, doula, childcare, workforce, or other support services associated with a person's care or circumstances.</td>
<td>Denton Community Birth Support Program, through which Daria Deonne provides professional doula services; Workforce Solutions for North Central Texas Child Care Services.</td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>Individual Entity Business Actor Role</strong></th>
<th><strong>Definition</strong></th>
<th><strong>Examples from the Mimi Shell Scenario<br />
(included with this Implementation Guide)</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Patient</td>
<td>An Individual Entity acting in a personal capacity with respect to their own health, healthcare, or health information.</td>
<td>Mimi Shell.</td>
</tr>
<tr>
<td>Family Member</td>
<td>An Individual Entity acting in a personal capacity because of a familial relationship to the patient.</td>
<td>Mimi's children and other family members participating in her care or support in a personal capacity.</td>
</tr>
<tr>
<td>Partner or Support Person</td>
<td>An Individual Entity acting in a personal capacity to support the patient because of a personal relationship.</td>
<td>Thomas Curic, Mimi's partner and designated support person.</td>
</tr>
<tr>
<td>Personal Caregiver</td>
<td>An Individual Entity acting in a personal capacity to assist or care for another individual rather than as personnel of an organization.</td>
<td>A family member or other personally selected caregiver, when applicable.</td>
</tr>
<tr>
<td>Personal Representative</td>
<td>An Individual Entity acting in a personal capacity with authority to act for or represent another individual in matters relevant to the exchange.</td>
<td>A person authorized to act for Mimi in a personal capacity, if applicable.</td>
</tr>
</tbody>
</table>

## Transaction Summary

The following table summarizes the transactions identified for this use case. Each transaction is assigned a local transaction identifier (TX1, TX2, etc.) for reference within this derivative implementation guide. These identifiers are local to this guide and do not establish globally defined transaction identifiers. The Exchange Pattern column distinguishes event notification, document push, document discovery, patient update, and workflow communication patterns. Chapter 3 provides the normative transaction-level requirements and references the modular transaction specifications.

| **Tx** | **Transaction Pattern Name** | **Exchange Pattern** | **Payload Name** | **Description** | **In-scope or Out-of-scope** |
|----|----|----|----|----|----|
| TX1 | send-outpatient-visit-notification | Direct Push / Event Notification | Outpatient Visit Notification | Send notification that an outpatient maternal-health encounter has occurred or completed, in human-readable and machine-processable form. | In-scope |
| TX2 | send-admission-notification | Direct Push / Event Notification | Patient Registration; Hospital Admission; ED Admission | Send notification of a registration or admission event relevant to the maternal-health use case, in human-readable and machine-processable form. | In-scope |
| TX3 | send-birth-notification | Direct Push / Event Notification | Birth Notification CDA | Send a derived maternal-subject Birth Notification after a newborn admission/registration event is detected and the newborn is successfully associated with the maternal patient. The newborn is represented as linked related-subject information. The transaction supports maternal continuity and postpartum workflow while preserving the provenance of the underlying newborn admission event. | In-scope |
| TX4 | send-discharge-notification | Direct Push / Event Notification | Hospital Discharge; ED Discharge | Send notification of a discharge event relevant to the maternal-health use case, in human-readable and machine-processable form. | In-scope |
| TX5 | send-documents | Direct Push / Document Exchange | Maternal Health Documents | Send one or more maternal-health documents to support pregnancy notification and risk assessment, referral/orders, antepartum, birth, postpartum, and continuity-of-care information sharing. | In-scope |
| TX6 | query-for-documents | IHE Query / Document Discovery | Maternal Health Documents | Request document metadata about available maternal-health documents of a specific type or about documents belonging to the Maternal Health document family/category. | In-scope |
| TX7 | send-patient-update | Direct Push / Patient Update | Updated Patient Information | Send updated patient information that may affect patient matching for parties with which information has previously been shared. | In-scope |
| TX8 | send-workflow-status | Direct Push / Workflow Communication | FHIR Task | Communicate workflow state for an established context, including successful acceptance into the intended workflow, in-progress processing, completion when applicable, or an expected workflow anomaly. The communication may also carry information needed to signal completion of one longitudinal context and transition to another. | In-scope |

## Objective-to-Transaction Matrix

The table below reverses the perspective of the earlier objective-centered matrix. Each row begins with a reusable transaction and shows which in-scope Chapter 1 Objectives (O1-O7) employ it. This makes the reusable nature of the transaction set easier to see: some transactions are objective-specific event signals, some carry or retrieve clinical content across several objectives, and send-workflow-status provides a cross-cutting mechanism for coordinating workflow state.

| **Tx** | **Transaction Pattern** | **O1** | **O2** | **O3** | **O4** | **O5** | **O6** | **O7** |
|----|----|----|----|----|----|----|----|----|
| TX1 | send-outpatient-visit-notification |  |  | X |  |  |  | X |
| TX2 | send-admission-notification |  |  | X |  |  |  | X |
| TX3 | send-birth-notification |  |  |  | X |  |  | X |
| TX4 | send-discharge-notification |  |  |  | X |  |  | X |
| TX5 | send-documents | X | X | X | X |  |  | X |
| TX6 | query-for-documents |  |  | X | X |  |  | X |
| TX7 | send-patient-update |  |  |  |  | X |  | X |
| TX8 | send-workflow-status | X | X | X | X | X | X | X |

What the table reveals. The transaction set is intentionally reusable rather than one-transaction-per-objective. TX1-TX4 are event signals; TX5 and TX6 supply or discover clinical information; TX7 maintains patient identity and matching information; and TX8 communicates workflow/context state. O7 is intentionally cross-cutting: every transaction must capture and preserve accurate Data Provenance appropriate to the activities performed. The matrix therefore shows both transaction composition for O1-O6 and a provenance obligation spanning the full transaction set.

## Actor Transaction Diagrams

The following sections show how the reusable TX transactions are composed to meet the in-scope Information Exchange Objectives defined in Chapter 1. Existing diagrams are retained where they still illustrate a useful exchange pattern. Where the expanded transaction set requires a new or revised diagram, a labeled placeholder identifies the intended diagram so the surrounding explanatory text can be completed now without implying that the older figure fully represents the current transaction model.

### O1 - Provide Notification of Pregnancy and Risk Factors

This Objective primarily composes TX5 send-documents with TX8 send-workflow-status. The OB Provider or Primary Care Provider sends the Pregnancy Notification and Risk Assessment information to the Payer, either directly or through an Intermediary. TX8 can establish and subsequently communicate the state of the associated workflow Context Instance so the parties can distinguish successful delivery from successful acceptance into the intended business workflow and can later communicate completion or another terminal state.

**Two-Actor Option**

![O1 - Provide Notification of Pregnancy and Risk Factors: Two-Actor Option](/images/actors-and-transactions/1.png)

**Three-Actor Option**

![O1 - Provide Notification of Pregnancy and Risk Factors: Three-Actor Option](/images/actors-and-transactions/2.png)

### O2 - Provide Referral/Orders for Birth Services

This Objective primarily composes TX5 send-documents with TX8 send-workflow-status. The referring OB Provider sends the referral/order and supporting maternal-health information to the Birthing Provider. TX8 provides the workflow mechanism for establishing the referral Context Instance and communicating acceptance, progress, completion, failure, or other relevant state needed to close the referral loop.

**Two-Actor Option**

![O2 - Provide Referral/Orders for Birth Services: Two-Actor Option](/images/actors-and-transactions/3.png)

**Three-Actor Option**

![O2 - Provide Referral/Orders for Birth Services: Three-Actor Option](/images/actors-and-transactions/4.png)

### O3 - Provide Antepartum Summary Information Across Care Settings

This Objective illustrates how event signals, document exchange, document discovery, and workflow status can be composed. TX1 send-outpatient-visit-notification and TX2 send-admission-notification can signal clinically relevant events. TX5 send-documents supports proactive delivery of the Antepartum Summary, while TX6 query-for-documents supports discovery when the receiving setting needs to retrieve current maternal-health information. TX8 can correlate and communicate the state of the applicable workflow Context Instance.

::: info Diagram placeholder
O3 Event-Triggered Antepartum Exchange using TX1/TX2 + TX5/TX6 + TX8
:::

**Two-Actor Option (Unsolicited)**

![O3 - Provide Antepartum Summary Information Across Care Settings: Two-Actor Option (Unsolicited)](/images/actors-and-transactions/5.png)

**Two-Actor Option (Triggered)**

![O3 - Provide Antepartum Summary Information Across Care Settings: Two-Actor Option (Triggered)](/images/actors-and-transactions/6.png)

**Three-Actor Option (Unsolicited or Triggered)**

![O3 - Provide Antepartum Summary Information Across Care Settings: Three-Actor Option (Unsolicited or Triggered)](/images/actors-and-transactions/7.png)

### O4 - Enable Postpartum Planning Across Care Settings

This Objective uses event notifications to signal transitions in the birth and postpartum journey and document transactions to provide the information needed for continuity of care. TX3 send-birth-notification can signal that the birth has occurred; TX4 send-discharge-notification can signal completion of the birthing stay; TX5 send-documents can proactively deliver maternal discharge, postpartum planning, or related information; and TX6 query-for-documents can be used when information must be discovered or retrieved. TX8 can communicate workflow state and, when applicable, information needed to signal completion of one longitudinal context and transition to another.

::: info Diagram placeholder
O4 Birth-to-Postpartum Transition using TX3 + TX4 + TX5/TX6 + TX8
:::

**Two-Actor Option**

![O4 - Enable Postpartum Planning Across Care Settings: Two-Actor Option](/images/actors-and-transactions/8.png)

**Three-Actor Option**

![O4 - Enable Postpartum Planning Across Care Settings: Three-Actor Option](/images/actors-and-transactions/9.png)

### O5 - Improve Patient Matching When Key Information Changes

This Objective is centered on TX7 send-patient-update. A participant that becomes aware of a material change to patient identity or demographic information can communicate the updated information to another participant with which information has previously been shared. TX8 may be used when workflow-state communication is needed to confirm that the update was accepted into the intended workflow or to communicate an anomaly requiring attention.

::: info Diagram placeholder
O5 Patient Update Exchange using TX7 (with TX8 when workflow status is required)
:::

The diagram illustrates two supported exchange patterns. Provider-to-provider, an organization may send the patient update directly via Direct to another care provider. Through a data utility, a provider may send an HL7 V2 Patient Update notification to a state or regional data utility, which identifies other organizations caring for the patient and distributes the updated information to them using the send-patient-update Direct transaction. In either pattern, the goal is the same: use what was previously known to identify the patient, then use the new information to update the patient’s record.

![O5 - Improve Patient Matching When Key Information Changes](/images/actors-and-transactions/10.png)

### O6 - Communicate Workflow Status for Improved Orchestration

TX8 send-workflow-status is the cross-cutting transaction used to communicate the state of an established workflow or Context Instance. It can communicate successful acceptance into the intended workflow, in-progress processing, completion, failure, or another expected workflow anomaly. It can also carry information needed to signal that one longitudinal context has completed or is being completed and that another context should begin. Because TX8 is reusable across Objectives, the diagram for this section illustrates the general pattern rather than a single clinical content exchange.

::: info Diagram placeholder
O6 General Workflow Status / Context Lifecycle Pattern using TX8
:::

![O6 - Communicate Workflow Status for Improved Orchestration: General Pattern](/images/actors-and-transactions/11.png)

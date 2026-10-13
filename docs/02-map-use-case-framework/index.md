---
title: "Actors and Transactions Overview"
---

# 2 Actors and Transactions Overview

_Understand the actors and transaction architecture._

The MAP Use Case Framework connects the Information Exchange Objectives in Chapter 1 with responsible parties, capacities, business roles, Transaction Participation Roles, and workflows. This chapter identifies those participants and the technology capabilities they employ, then shows how reusable Shared Activities from the MAP Reusable Transaction Catalog (MAP RTC) support the objectives. Chapter 3 supplies the common Transaction Framework; each Transaction Definition applies it to a Shared Activity. Chapters 4 and 5 address capability discovery and implementation guidance.

## 2.1 Responsible Parties Capacities and Business Roles

Responsible parties participate in a professional or personal capacity and perform business roles such as OB Provider, Birthing Provider, Payer, or Patient. The following tables distinguish the capacity in which a party acts from its relationship to care or services. A business role does not determine whether the party initiates or receives a particular transaction.

The distinction between an Organizational Entity and an Individual Entity depends on the capacity in which the Responsible Party acts. A person acting professionally on behalf of an organization is represented as an Organizational Entity for that activity; a person acting personally is represented as an Individual Entity. This includes professionals acting through their own professional organization or sole proprietorship. A family acting personally represents a collection of Individual Entities, rather than a professional organization.

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 41%" />
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

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 41%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>Organizational Entity Business Role</strong></th>
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
<col style="width: 25%" />
<col style="width: 41%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>Individual Entity Business Role</strong></th>
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

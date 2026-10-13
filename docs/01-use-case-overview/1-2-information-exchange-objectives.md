---
title: "1.2 Information Exchange Objectives"
---

# 1.2 Information Exchange Objectives

Information Exchange Objectives describe the interoperability outcomes this Implementation Guide is designed to support. An objective states what participating systems and organizations need to accomplish through information exchange without prescribing a single workflow for accomplishing it.

Scenarios are specific examples that demonstrate how one or more Information Exchange Objectives can be achieved through a particular sequence of actors, transactions, clinical documents, notifications, and workflow events. The example artifact package associated with this guide provides a maternal-health journey that illustrates how the specifications can be applied in practice.

| **Objective ID** | **Information Exchange Objective** | **In-scope or Out-of-scope** |
|----|----|----|
| O1 | Provide Notification of Pregnancy and Risk Factors | In-scope |
| O2 | Provide Referral/Orders for Birth Services | In-scope |
| O3 | Provide Antepartum Summary Information Across Care Settings | In-scope |
| O4 | Enable Postpartum Planning Across Care Settings | In-scope |
| O5 | Improve Patient Matching When Key Information Changes | In-scope |
| O6 | Communicate Workflow Status For Improved Orchestration | In-scope |
| O7 | Capture and Preserve Accurate Data Provenance | In-scope |
| O8 | Provide Continuity of Care for Newborn | Out of scope |
| O9 | Provide Public Health/Vital Records Information | Out of scope |
| O10 | Enable Quality Reporting | Out of scope |
| O11 | Support Research | Out of scope |
| O12 | Enable Secure Information Exchange with Patients and Family Members or other patient-authorized Individuals or Organizations | Not specified |

O7 – Capture and Preserve Accurate Data Provenance. Information exchange preserves the provenance of information received from upstream sources and captures independently attributable activities performed by downstream participants and Intermediaries. The Information Source remains distinguishable from the Technical Actors that create, sign, seal, update, assemble, transform, transmit, receive, void, deprecate, or mark information as entered in error. An Intermediary does not become the Information Source merely by performing those activities. Relevant transaction Provenance available at structured payload finalization is shared according to the applicable Transaction Definition. Each Provenance information object is a separate FHIR Collection Bundle containing one or more Provenance resources; additional participants can add their own bundles without rewriting earlier assertions. Later activities may be recorded locally and communicated through subsequent transactions, including workflow status reports. Other Provenance that supports the distributed workflow may also be shared. Required and permitted activities are specified per transaction, and the information objects targeted by shared Provenance are carried in the same structured payload.

## Key Beneficiaries

Primary beneficiaries include mothers and families, prenatal providers, hospitals, postpartum providers, pediatric providers, payers, health information exchanges, EHR vendors, and public health organizations.

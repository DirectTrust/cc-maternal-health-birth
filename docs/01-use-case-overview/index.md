---
title: "Use Case and Information Exchange Objectives"
---

# 1 Use Case and Information Exchange Objectives

_Understand the need and the value proposition._

Chapter 1 applies the common MAP Use Case Framework to establish the objectives and value proposition of Care Coordination for Maternal Health – Birth. It explains the need for information sharing and the principles supporting complete, human-readable exchange and progressive computability. Chapter 2 identifies participants, workflows, and reusable transactions; Chapter 3 applies their common transaction requirements. Appendix A explains standardized clinical documents in detail.

## 1.1 Care Coordination Maternal Health – Birth Use Case (cc-maternal-health-birth)

The Maternal Health – Birth use case supports continuity of care across pregnancy, labor and delivery, postpartum care, and payer engagement. It applies the DirectTrust Metadata and Payloads (MAP) Framework and standards defined by HL7 and IHE to establish interoperable exchanges throughout the Perinatal Context. Public health exchanges and additional newborn-focused workflows are outside the scope of this version.

### Problem

Maternal healthcare involves numerous care transitions across independent organizations. Clinical information is often fragmented across EHR systems, resulting in delays, duplicate testing, manual record retrieval, and incomplete information during critical clinical decisions. This implementation guide addresses those interoperability challenges using standardized, event-driven document exchange.

### Idea

The approach uses Direct Secure Messaging, standardized metadata, and workflow triggers to move information to the relevant participants. IHE document query protocols support document discovery and retrieval where participating organizations provide those capabilities.

### Solution

The MAP Use Case Framework organizes participants, Information Exchange Objectives, and workflows. This guide composes reusable transactions from the MAP RTC and defines their maternal-health application. The MAP Transaction Framework in Chapter 3 establishes common requirements; individual Transaction Definitions apply them to a Shared Activity. TX3, Send Birth Notification, is specialized for this use case. TX6 is a placeholder for document queries performed outside Direct. Other transactions provide reusable notification, document exchange, patient matching information update, and workflow status capabilities.

### Value Proposition

Consistent implementation of these transactions supports continuity of care, reduces manual retrieval and administrative work, and helps care teams make decisions using shared information. It can also reduce duplicate testing and improve coordination between providers and payers.

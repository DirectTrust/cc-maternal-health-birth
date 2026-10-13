---
title: "2.2 Transaction Participants and Participation Roles"
---

# 2.2 Transaction Participants and Participation Roles

Transaction Participants are the responsible parties participating in a Shared Activity. Their roles in a Transaction Instance are Information Source, Information Recipient, or Intermediary. These are distinct from business roles and the Technical Actor Roles implemented by their systems. A participation role does not by itself establish authority or permission to act. A Routing Target is an address selected for a message, not a fourth participation role.

| **Transaction Participation Role** | **Definition** | **Examples** |
|----|----|----|
| Information Source | The responsible party that supplies information for an information exchange. The Information Source may be an Organizational Entity or an Individual Entity. It is the party from which the information is supplied for purposes of the exchange and may employ one or more technology components implementing Technical Actor Roles to create, assemble, package, transmit, or otherwise enable the exchange. | An OB Provider supplying an Antepartum Summary; a Birthing Provider supplying an admission or discharge notification; a Payer supplying coverage-related information; a Patient supplying information in a personal capacity. |
| Information Recipient | The responsible party for whom information is intended in an information exchange. The Information Recipient may be an Organizational Entity or an Individual Entity and may employ one or more technology components implementing Technical Actor Roles to receive, process, present, store, or otherwise enable use of the exchanged information. | A Birthing Provider receiving an Antepartum Summary; an OB Provider receiving a discharge notification; a Payer receiving pregnancy information; a Patient receiving information in a personal capacity. |
| Intermediary | A responsible party facilitating an exchange on behalf of the Information Source Organization, Information Recipient Organization, or both. Its systems may perform Receiver Actor functions on one leg and Sender Actor functions on another. Routing or retransmission does not change original authorship or automatically make the Intermediary the Information Source or Information Recipient. A separately initiated Shared Activity has its own Transaction Instance and participation roles. The Intermediary preserves upstream Provenance and records its own relevant activities according to the applicable transaction requirements. | A health information exchange or maternal health data utility facilitating exchange between participating organizations. |

## Actor Identity Provenance and Responsibility

Information provenance, workflow authority, SubmissionSet contribution, and transport responsibility may belong to the same party or different parties. The exchange SHALL preserve sufficient identity and Provenance to distinguish responsible parties and the capacities in which they act. Original authorship remains attributable to its author when another party assembles, packages, or transmits an information object. A later transaction, including TX8, establishes its own participation roles without rewriting the original authorship.

| **Identity or responsibility** | **Meaning** |
|----|----|
| Information Source | The Transaction Participant initiating or supplying information for the current Shared Activity. This transaction-relative role is distinct from original artifact authorship; it commonly coincides with the Workflow Requester. |
| Clinical Content Author | The party responsible for authoring a clinical or business information object. Authorship and original Provenance remain with that object when another party assembles or sends a structured payload. |
| Workflow Requester | The party requesting the transaction-defined action, represented by Task.requester. Keep this identity distinct from the structured payload contributor and the party operating the Message Sender when they differ. |
| SubmissionSet Contributor | The organization contributing the current structured payload. Its organizational identity and the SubmissionSet source identifier are represented according to Chapter 3 and Appendix D. These identities are distinct from the information object author and Workflow Requester; the same organization may fulfill these responsibilities. |
| Party operating the Message Sender | The responsible party whose technology performs message transmission on a processing leg. Message Sender is a Technical Actor Role; transmission alone does not make its operator the Workflow Requester or artifact author. |
| Information Recipient | The Transaction Participant for whom the Shared Activity is intended. Systems acting on its behalf implement Receiver Actor capabilities to take delivery of the Direct message, receive the structured payload, and make or support the authorized acceptance or rejection decision. |

The Workflow Requester SHALL be represented by an appropriate actor resource referenced by Task.requester. The referenced actor MAY carry multiple identifiers appropriate to its identity domains, including an established Organization Identity OID and, when appropriate, a Direct Address asserted as an identity-bound identifier using the applicable DirectTrust identity OID.

The Clinical Content Author, Workflow Requester, SubmissionSet Contributor, and party operating the Message Sender MAY be different organizations. When an intermediary or delegated service assembles or transmits information on behalf of another party, the applicable identities and Provenance SHALL remain distinguishable.

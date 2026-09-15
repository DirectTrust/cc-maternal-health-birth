---
title: 4. Identifier and Context Management
---

# 4. Identifier and Context Management

## 4.1 Preserve Identifier Namespace and Assigning Authority

Every identifier must remain associated with the namespace or assigning authority that issued it. When another organization stores or retransmits that identifier, preserve the original authority rather than representing the identifier as locally assigned.

## 4.2 Keep Identity Layers Distinct

Patient identity, longitudinal clinical context, workflow context, and encounter context solve different correlation problems. Do not overload one identifier to stand for another. When multiple identifiers are carried, preserve enough type and authority information for the receiver to understand what each identifier identifies.

## 4.3 Established Context Instances

A Context Instance is an explicitly established, identifiable clinical or workflow context. A document can be associated with a Context Instance, but the document and the Context Instance are not the same object. Context identity should remain stable while documents, messages, and status assertions about that context evolve.

## 4.4 Identity Is Separate from Status

The Context Instance Identifier answers which workflow or clinical context is being discussed. Lifecycle status answers what is happening within that context. Preserve the identifier while status changes; do not mint a new Context Instance merely because the workflow moves from requested to accepted, in-progress, completed, failed, or another defined state.

## 4.5 Identifier Handshake Across Organizations

In a multi-organization journey, each organization may establish its own patient identifier and encounter identifiers while also retaining identifiers received from partners. The exchange should progressively accumulate useful cross-references without erasing the assigning authority or confusing patient identity with episode/workflow identity. The Mimi Shell artifacts demonstrate this handshake between prenatal and birthing organizations.

## 4.6 Patient, Beneficiary, Member, and Coverage Identifiers

Implementations should not treat an “insurance number” as a single generic identifier concept. Select and represent an identifier according to what it identifies and the role it performs in the exchange: the person/patient, a government-program beneficiary, a covered member, a subscriber, a coverage relationship, a group, or a plan. The section in which an identifier is carried does not change its underlying semantics, namespace, identifier type, or assigning authority.

An identifier useful for patient matching may be represented in the CDA Header as a patient identifier and may also be carried in the Payers Section when it is relevant to the coverage story. Repeating the same identifier in those two contexts does not convert it into a different identifier type. Conversely, a payer-assigned Member Number should not be represented as though it were an enterprise patient identifier merely because it identifies the same human being.

| **Identifier role** | **What it identifies** | **Typical CDA use** | **Identifier-type guidance** |
|----|----|----|----|
| Patient / person identifier | The person within a healthcare or enterprise identity namespace. | CDA Header recordTarget/patientRole/id; may also be repeated in payer content when relevant. | Use the identifier type established for that namespace, such as MR or PN; do not relabel it MB merely because it appears in coverage content. |
| Government-program beneficiary identifier | The person as identified by a government healthcare program. | CDA Header when useful for identity matching and/or Payers Section when relevant to the benefit. | Use the established program-specific identifier type, such as MC for Medicare or MA for Medicaid, when applicable. |
| Member identifier | The insured/member under payer-administered coverage. | Payers Section. | MB (Member Number) is appropriate for a payer-assigned member number; payer profiles may define additional member-identifier types. |
| Subscriber identifier | The subscriber to whom coverage is issued. | Payers Section. | Preserve subscriber semantics; do not assume it is identical to the member identifier. |
| Plan identifier | The health benefit/insurance plan. | Payers Section. | Identifies the plan, not the person; do not use a person/member identifier type merely because the plan covers that person. |
| Group identifier | The employer, benefit, or other coverage grouping. | Payers Section. | Identifies the coverage group and remains distinct from member, subscriber, and plan identifiers. |

### 4.6.1 VA

VA illustrates why identifier role and identifier location must be kept separate. The VA Integration Control Number (ICN) is an enterprise person identifier and should retain its person-identifier semantics when carried in either the CDA Header or payer-related content. Current VA interoperability guidance uses the VA enterprise namespace urn:oid:2.16.840.1.113883.4.349 for the ICN and characterizes the ICN as PN (Person Number).

An EDIPI, when known and appropriate to the exchange, may be represented as an additional patient/person identifier in the CDA Header. Implementers should use an authoritative DoD/VA namespace and identifier type established for EDIPI rather than inventing one. This guidance does not assign an EDIPI OID where an authoritative namespace has not been established by the applicable implementation specification.

VA plan information belongs in the Payers Section as plan information. A VA Plan ID identifies the plan rather than the Veteran. When a specific VA Community Care workflow instructs an implementer to use the ICN in an insured-ID field, the ICN may also be carried in the coverage representation, but its underlying person-identifier semantics should be preserved unless the governing VA specification explicitly defines different semantics.

### 4.6.2 Medicare

For Medicare, distinguish the Medicare beneficiary identifier from identifiers assigned by a Medicare Advantage or other payer-administered plan. A Medicare Beneficiary Identifier (MBI) identifies the Medicare beneficiary; HL7 identifier terminology provides MC (Patient's Medicare number) for this role. When useful for patient matching, the MBI may be represented as an additional patient identifier in the CDA Header and may also appear in the Payers Section when relevant to the Medicare benefit.

A Medicare Advantage plan may separately assign a Member Number, and the plan itself has a separate plan identity. These should remain distinct: Medicare beneficiary identity, payer member identity, and plan identity are different identifier roles even when they all participate in the same coverage story.

### 4.6.3 Medicaid

Medicaid beneficiary identity is generally administered through a state Medicaid program. HL7 identifier terminology provides MA (Patient Medicaid number). The identifier namespace/assigning authority should identify the state program that issued the identifier rather than treating “Medicaid” as one undifferentiated national assigning authority.

When Medicaid benefits are administered through a managed-care organization, distinguish the state Medicaid beneficiary identifier from the managed-care organization's Member Number and from the managed-care plan identifier. For example, a Texas Medicaid beneficiary identifier can retain MA semantics while a Wellpoint STAR Member Number uses member-number semantics and the STAR plan is represented separately as a plan.

### 4.6.4 Commercial Insurance

For commercial insurance, a payer-assigned Member Number is naturally represented as a member identifier; MB (Member Number) is the standard HL7 identifier type commonly used for this purpose. Implementations should still distinguish the Member Number from subscriber identifiers, group numbers, plan identifiers, and identifiers of the payer organization itself.

When a payer defines a member identifier that is unique across multiple lines of business, the applicable payer or implementation-guide terminology may provide a more specific identifier type. Implementers should follow that governing profile rather than collapsing all payer identifiers into MB.

### 4.6.5 CDA Representation Principle

The governing rule is: identifier semantics come from what the identifier identifies, its namespace/assigning authority, and its identifier type—not from the section or element in which the identifier happens to be carried. Moving or repeating an identifier between the CDA Header and Payers Section does not change its identity semantics.

Implementers should therefore preserve the original identifier value, namespace/assigning authority, and type; represent plan, group, subscriber, and member identifiers separately when they identify different things; and avoid creating a generic “insurance number” abstraction that erases those distinctions.

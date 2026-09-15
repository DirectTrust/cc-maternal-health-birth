---
title: "Appendix B: Understanding Identity, Context, and Status"
---

# Appendix B: Understanding Identity, Context, and Status

*Educational Appendix for cc-maternal-health-birth*

Purpose. This appendix explains the distinct identities that can coexist in a maternal-health exchange and why identity must be separated from lifecycle status. It is educational rather than a detailed namespace or payload-construction specification.

## B.1 The Identity Layers

| **Layer** | **What is identified** | **Why it matters** |
|----|----|----|
| Person / Patient Identity | The individual whose information is being exchanged, within an assigning authority's namespace. | Supports patient matching while preserving the authority that issued each identifier. |
| Longitudinal Clinical Context | An explicitly established clinical context that persists across related activity, such as a Pregnancy Episode. | Provides a stable identity for grouping information that belongs to the same clinical episode. |
| Workflow Context | An explicitly established task, referral, request, or other workflow context. | Allows activity and status messages to be correlated to the same workflow instance. |
| Encounter Context | A specific visit or stay. | Identifies the encounter that supplies context for encounter-bound information. |

## B.2 Identity Is Not Status

A Context Instance Identifier answers which context is being discussed. Status answers what is happening within that context. The identity should remain stable while lifecycle state changes. Treating status as though it were another identifier makes correlation and provenance less reliable.

## B.3 Context Instance Type Is Part of the Meaning

A Context Instance identifier is meaningful only when its type is also understood. The combination of the coded Context Instance Type and the identifier establishes what kind of context the identifier represents. Examples include a Pregnancy Episode, Referral, Task, or Encounter.

## B.4 Contexts Can Coexist

A single clinical document or transaction can participate in more than one context without conflating their meanings. An encounter-specific document can identify the encounter that supplies its immediate clinical context while also carrying the identifier for the broader Pregnancy Episode to which the encounter belongs.

## B.5 Assigning Authority Must Be Preserved

Organizations may assign different patient identifiers to the same person. When an identifier is exchanged and retained by another organization, the original assigning authority remains part of that identifier's meaning. The receiving organization does not reissue the identifier in its own namespace.

## B.7 Identifier Type Must Also Be Preserved

An identifier is not completely understood from its value and assigning authority alone. Where an identifier type is known and applicable, that type should also be preserved. Identifier type communicates what role the identifier performs within its assigning namespace.

This is especially important for coverage-related identifiers. A state Medicaid beneficiary identifier and a managed-care payer Member Number may both relate to the same person and the same coverage story, but they identify the person in different roles and are issued by different authorities. They should not be treated as interchangeable identifiers.

For example, a Texas Medicaid beneficiary identifier may use MA (Patient Medicaid Number), while a Wellpoint Texas STAR Member Number uses MB (Member Number). The STAR plan itself has a separate plan identifier. Carrying these identifiers in a Payers Section does not change their underlying identifier semantics.

## B.7 Knowing an Identifier Does Not Imply Managing the Identity

An information system may know and maintain identifiers that were assigned to a person by other organizations or identity domains. Possession of such an identifier does not make the system the assigning authority for that identifier, nor does it imply that the assigning organization manages the record in which the identifier appears.

A patient-maintained Personal Health Record (PHR), for example, may retain medical record numbers by which the patient is known at different healthcare organizations. Those identifiers remain identifiers assigned by those organizations. The PHR preserves the identifier value and assigning authority so the information can later support patient matching and identity reconciliation.

In CDA, multiple identifiers for the record target may be represented using repeated recordTarget/patientRole/id elements. Each identifier should preserve the identity domain or assigning authority responsible for it. The presence of an organization-assigned patient identifier does not, by itself, mean that the organization should be represented as patientRole/providerOrganization.

| What the CDA conveys | Interpretation |
|----|----|
| patientRole/id assigned by Organization A | Organization A knows this person by this identifier. |
| Another patientRole/id assigned by Organization B | Organization B knows the same person by another identifier. |
| A PHR carries both identifiers | The PHR knows both identities; it did not necessarily assign either one. |
| patientRole/providerOrganization | A separate assertion about the organizational context of the patient role; it should not be inferred merely because an organization-assigned identifier is present. |

## B.8 Identifier Accumulation Is Part of the Handshake

The identifier handshake does not require a system to discard one identity when another becomes known. Interoperating systems can progressively accumulate identifiers while preserving the provenance and assigning authority of each.

**Exchange identifiers; do not reassign them.**

If System A learns an identifier assigned by System B, System A should preserve System B's identifier namespace and value. System A may associate that identifier with identities it already knows, but it should not transform the learned identifier into its own namespace.

This principle generalizes beyond patient identity. A Referral Recipient can know and reuse a Referral Initiator's Context Instance Identifier without becoming its assigning authority. An Order Placer can later learn an Order Filler's operational Order Identifier without turning it into a placer-assigned identifier.

**Interoperability expands the set of identifiers known by participants without changing who assigned those identifiers or what they identify.**

## B.9 Mimi Shell PHR Example

On February 16, 2026, Mimi Shell creates a new version of her patient-maintained Patient Care Summary in her PHR after recording the result of a self-administered home pregnancy test. Because Mimi already has care relationships with healthcare organizations, her PHR may know an MRN assigned to her by one of those organizations. The PHR may carry that MRN as one of Mimi's recordTarget/patientRole/id values while preserving the healthcare organization as the assigning authority for that identifier.

Carrying such an identifier does not make that healthcare organization the author, custodian, managing organization, or source of Mimi's Patient Care Summary. For this patient-maintained PHR document, patientRole/providerOrganization is omitted. Her existing OB/GYN and primary care relationships may instead be represented as care-team information.

The February 16 Patient Care Summary also does not yet carry a Pregnancy Episode Context Instance Identifier merely because Mimi recorded a positive home pregnancy test. At that point she has not yet contacted her clinician to request the initial pregnancy appointment, and the subsequent clinical Pregnancy Episode workflow has not yet been established.

## B.10 The Identifier Handshake

The maternal-health journey illustrates an identifier handshake across organizations. The prenatal organization can establish its patient identifier and the Pregnancy Context. The birthing organization can establish a different patient identifier and, later, an encounter identifier. As information is exchanged, each organization can retain cross-references while preserving the assigning authority and the type of each identifier.

| **Journey step** | **Identity effect** |
|----|----|
| Prenatal care begins | Prenatal organization establishes its patient identifier and the Pregnancy Context Instance. |
| Hospital registration / pre-arrival activity | Birthing organization establishes or confirms its own patient identifier and can retain the prenatal identifier as an external cross-reference. |
| Admission / birth encounter | A specific encounter identity is established in addition to the continuing patient and Pregnancy Context identities. |
| Subsequent exchange | Artifacts carry the identifiers appropriate to what they represent, allowing patient, episode, workflow, and encounter information to be correlated without collapsing them into one identifier. |

## B.11 Workflow Context and FHIR Task

When an exchange establishes persistent stateful work, a FHIR Task can identify and track that work. Task.identifier identifies the logical Task and remains stable as Task.status changes. Context Instance identifiers such as Pregnancy Episode and Encounter identifiers remain distinct from the Task identity.

The SubmissionSet carries the information package. A Task, when one exists, carries the identity, state, and responsibility of the work item. Context Instance Identifiers independently identify the clinical or business contexts to which the information belongs.

## B.12 Where to Find Implementation Rules

Detailed rules for namespace governance, assigning authorities, identifier preservation, CDA context representation, Task elements, XDM metadata, status transitions, and workflow correlation are provided in Implementer Guidance and the transaction-specific specifications.

## B.13 Generalized Identifier Handshake for Orders and Referrals

The identifier handshake applies not only to patient identity, but also to stateful workflows such as orders and referrals. A robust exchange can preserve an identifier established by the request initiator while also learning and retaining identifiers later assigned by the request responder. These identifiers describe different things and should not overwrite one another.

| Identifier | Established by | Meaning |
|----|----|----|
| Context Instance Identifier | Order Placer / Referral Initiator | Persistent identity of the order/referral workflow context. |
| Task identifier | Party establishing the logical Task | Identity of the stateful work item whose Task.status changes over time. |
| Transaction Instance Identifier | Creator of each SubmissionSet | Identity of one particular message/package exchange; SubmissionSet.uniqueId. |
| Order / Referral Business Identifier | Operational system that creates the order/referral record | Local business identifier for the order/referral in that organization's system. |

## B.14 Initiator and Responder Roles Do Not Reverse

The role names describe the parties' relationship to the established workflow, not the direction of the current message. The Order Placer / Referral Initiator remains the initiator when the Order Filler / Referral Recipient sends a response. Likewise, the responder remains the responder when sending status or outcome information.

This stability allows identifiers to retain provenance. An identifier originally assigned by the initiator remains an initiator-assigned identifier when returned by the responder. A new identifier assigned by the responder remains responder-assigned when it is subsequently stored and reused by the initiator.

**IHE 360X precedent.** 360X requires the Referral Initiator to establish a unique referral identifier and reuse it throughout the referral exchange. The Referral Recipient reuses the initiator-provided patient identifier in subsequent communications and may additionally provide another patient identifier. This is a useful precedent for preserving identifier roles rather than swapping them when message direction changes.

## B.15 Context Identity, Transaction Correlation, and Workflow Status

A Workflow Status response may need to answer two different correlation questions: which persistent workflow is this about, and which received transaction prompted this immediate response? The Context Instance Identifier answers the first question. The originating SubmissionSet.uniqueId answers the second.

For the first response to a newly received request, carrying both is particularly valuable. The responder can reuse the initiator's Context Instance Identifier and also return the originating Transaction Instance Identifier to show that the specific received payload reached the intended workflow. Later status messages may rely primarily on the persistent Context Instance Identifier and Task identity; the original transaction identifier may or may not remain necessary.

## B.16 When the Responder Creates Its Own Order or Referral Identifier

Receiving a request and creating an operational record are separate events. At receipt, the responder may know only the initiator's Context Instance Identifier, Task identity, and originating Transaction Instance Identifier. When the responder's operational system creates the actual order/referral record, it can assign its own local business identifier. That new identifier can then be communicated back without replacing the initiator-established context.

| Stage | Initiator context | Transaction correlation | Responder business ID |
|----|----|----|----|
| Request sent | Established | New SubmissionSet.uniqueId | Not yet known |
| Request received | Reused unchanged | Originating SubmissionSet.uniqueId returned for workflow-status correlation | May be absent |
| Operational order/referral created | Reused unchanged | May still be retained | Responder assigns local order/referral ID |
| Later status/outcome | Reused unchanged | Optional when no longer needed | Responder ID can be returned and retained by initiator |

## B.17 CDA Representation of a Context Instance

For the CDA examples in this project, an established Context Instance is represented in ClinicalDocument/inFulfillmentOf/order. order/id carries the Context Instance Identifier and order/code carries the Context Instance Type. The project does not use an SDTC identifier-type extension in this location.

\<inFulfillmentOf\>\
\<order\>\
\<id root="\[initiator context namespace\]" extension="\[context instance\]"/\>\
\<code code="\[context-type-code\]" displayName="Referral"/\>\
\</order\>\
\</inFulfillmentOf\>

## B.18 Mimi Shell Identifier Example

The Mimi Shell synthetic examples apply the generalized rules using purpose-specific child arcs beneath synthetic organization roots. These assignments are examples for this project, not externally registered production OIDs.

| Identifier class | Mimi / NTHS example | Interpretation |
|----|----|----|
| NTHS base | 2.25.300482169457150407075386186229743407818 | Synthetic NTHS organization namespace |
| Patient | .1 | NTHS patient/MRN identity |
| Document | .2 | Document id and setId |
| Section | .3 | Section identity |
| Entry | .4 | Structured entry identity |
| Context Instance | .5 | Persistent clinical/workflow context |
| Encounter | .6 | NTHS encounter identity |
| Order / Referral Business Identifier | .7 | NTHS local operational order/referral identity |
| Mimi Pregnancy Episode | ...818.5 / c31e0ce4-ca7b-4e8d-a4db-f475642bce6e | Specific Pregnancy Episode Context Instance |
| IHE testing patient ID | 1.3.6.1.4.1.21367.13.20.1000 / IHERED-3007 | External testing identifier retained in its own assigning system |

## B.19 Practical Implementer Rules

• Do not use one identifier to stand for patient, workflow context, Task, transaction, encounter, and operational order/referral identity.

• Preserve the identifier value, namespace/assigning authority, and identifier type when an identifier crosses organizational boundaries.

• Keep the initiator-established Context Instance Identifier stable throughout the workflow.

• Do not change identifier roles merely because the direction of a message reverses.

• Use SubmissionSet.uniqueId to correlate a Workflow Status response to the specific transaction/package that prompted it when that correlation is needed.

• When the responder later creates its own operational order/referral identifier, communicate it as an additional identifier rather than replacing the established Context Instance Identifier.

• For CDA Context Instances, use inFulfillmentOf/order/id for the Context Instance Identifier and order/code for the Context Instance Type.

• For the Mimi Shell namespace convention, use .7 only for locally assigned Order/Referral business identifiers; .5 remains the Context Instance namespace.

## B.20 Authentication Identity and Signature Provenance

Authentication has identity and provenance just as identifiers do. When an authenticated document is exchanged, assembled, or transformed, preserve the identity of the person who performed the authentication rather than attributing that act to the system or organization that later handled the artifact. A useful companion to the identifier rule “Exchange identifiers; do not reassign them” is: Preserve authentication; do not reattribute it.

Authentication, signature technology, and legal significance answer different questions. An authenticator identifies an attestation act. A cryptographic digital signature can provide technical assurance of that act or of the exchanged artifact. Whether a signer is legally authenticating the document is determined by the applicable governing rule and should not be inferred solely from the presence or type of signature.

Mimi Shell example. When Mimi completes and signs the Obstetric Medical History form supplied by her OB practice, Mimi is the subject, author, and authenticator of the information. Health Services of North Texas is the custodian after receiving and maintaining the completed form, and the NTHS EHR may assemble the CDA representation. The EHR's assembly activity does not replace or reattribute Mimi's authentication. Under the default convention, legalAuthenticator is not asserted unless a governing document-family or policy rule specifically requires it.

## B.21 Design Precedent

IHE 360 Exchange Closed Loop Referral (360X), Rev. 1.2, provides a useful precedent for this generalized handshake. It requires the Referral Initiator to provide and reuse a unique referral identifier throughout a referral exchange, requires the Referral Recipient to reuse the patient identifier provided by the Referral Initiator, and permits the Referral Recipient to additionally communicate another patient identifier. The cc-maternal-health-birth guidance generalizes this preservation principle to Context Instance, Task, transaction, and locally assigned order/referral identities.

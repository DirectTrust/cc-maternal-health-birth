---
title: "Appendix B: Understanding Identity Context and Status"
---

# Understanding Identity Context and Status

<span class="smallcaps">Preserve identity while Context and workflow states change.</span>

Appendix B explains the identity and Context concepts used in the MAP Framework and applies them to Care Coordination for Maternal Health – Birth. It distinguishes patient, Context Instance, encounter, workflow, transaction, and operational identifiers; preserves their assigning authorities; and separates identity from status. Chapter 3 specifies common identifier and correlation requirements, Chapter 4 addresses endpoint capabilities, and the applicable Transaction Definition establishes the information needed for each Shared Activity.

Chapter T defines Document Type, Document Category, Document Lifecycle, and Document Status. Appendix E provides the CDA/FHIR document-status reference. Document Status, metadata availability, and MAP workflow status describe different objects and SHALL NOT be substituted for one another.

## The Identity Layers

The following layers distinguish who the information concerns from the clinical and workflow contexts to which it belongs. An exchange may carry several of these identities together.

| **Layer**                     | **What is identified**                                                                                         | **Why it matters**                                                                             |
|-------------------------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Person / Patient Identity     | The individual whose information is being exchanged, within an assigning authority's namespace.                | Supports patient matching while preserving the authority that issued each identifier.          |
| Longitudinal Clinical Context | An explicitly established clinical context that persists across related activity, such as a Perinatal Episode. | Provides a stable identity for grouping information that belongs to the same clinical episode. |
| Workflow Context              | An explicitly established task, referral, request, or other workflow context.                                  | Allows activity and status messages to be correlated to the same workflow instance.            |
| Encounter Context             | A specific visit or stay.                                                                                      | Identifies the encounter that supplies context for encounter-bound information.                |

## Identity Is Not Status

A Context Instance Identifier answers which context is being discussed. Status answers what is happening within that context. The identity should remain stable while lifecycle state changes. Treating status as though it were another identifier makes correlation and Provenance less reliable.

## Context Instance Type Is Part of the Meaning

A Context Instance Identifier is meaningful when its coded type is understood. The type and identifier together establish the kind of context and the particular instance. Examples include a Perinatal Episode, referral, request, and encounter. In this guide, Perinatal Context encompasses the established pregnancy, birth, and postpartum episode; it remains distinct from a Pregnancy History document classification.

## Contexts Can Coexist

A single clinical document or transaction can participate in more than one context without conflating their meanings. An encounter-specific document can identify the encounter that supplies its immediate clinical context while also carrying the identifier for the broader Perinatal Episode to which the encounter belongs.

## Assigning Authority Must Be Preserved

Organizations may assign different patient identifiers to the same person. When an identifier is exchanged and retained by another organization, the original assigning authority remains part of that identifier's meaning. The receiving organization does not reissue the identifier in its own namespace.

## Codes Classify; Identifiers Identify

MAP uses the terms code and identifier deliberately. A code classifies an instance as a member of a category; an identifier distinguishes one particular instance from other instances. These functions should not be conflated.

Context Instance Type Code. This code classifies the kind of Context Instance. Distinct Perinatal Episodes can use the same Perinatal Context type code while carrying different instance identifiers. Apply the published DTContextTypeCodeVS binding in Chapter 3, preserving the selected CodeSystem identity; the ValueSet includes DirectTrust and applicable IHE concepts. The type code is a classification, rather than an instance identifier.

Context Instance Identifier. The Context Instance Identifier identifies one particular instance of the classified context. Mimi Shell's Perinatal Episode and another patient's Perinatal Episode can share the same Context Instance Type Code while carrying different Context Instance Identifiers.

Identifier Type Code. An Identifier Type Code classifies the kind of identifier being carried, such as a Medical Record Number, Member ID, or Visit Number. It describes the identifier itself; it does not classify the clinical or workflow context identified by that identifier.

| **Term**                    | **What it does**                                                   | **Example**                                  |
|-----------------------------|--------------------------------------------------------------------|----------------------------------------------|
| Context Instance Type Code  | Classifies what kind of Context Instance this is.                  | Perinatal Episode                            |
| Context Instance Identifier | Identifies this particular Context Instance.                       | Mimi's specific Perinatal Episode identifier |
| Identifier Type Code        | Classifies what kind of identifier an identifier is.               | MRN, Member ID, Visit Number (VN)            |
| Assigning Authority         | Identifies the authority responsible for the identifier namespace. | THPH/TRW encounter namespace                 |

Design rule: Codes classify; identifiers identify.

## Identifier Type Must Also Be Preserved

An identifier is not completely understood from its value and assigning authority alone. Where an identifier type is known and applicable, that type should also be preserved. Identifier type communicates what role the identifier performs within its assigning namespace.

This is especially important for coverage-related identifiers. A state Medicaid beneficiary identifier and a managed-care payer Member Number may both relate to the same person and the same coverage story, but they identify the person in different roles and are issued by different authorities. They should not be treated as interchangeable identifiers.

For example, a Texas Medicaid beneficiary identifier may use MA (Patient Medicaid Number), while a Wellpoint Texas STAR Member Number uses MB (Member Number). The STAR plan itself has a separate plan identifier. Carrying these identifiers in a Payers Section does not change their underlying identifier semantics.

## Knowing an Identifier Does Not Imply Managing the Identity

An information system may know and maintain identifiers that were assigned to a person by other organizations or identity domains. Possession of such an identifier does not make the system the assigning authority for that identifier, nor does it imply that the assigning organization manages the record in which the identifier appears.

A patient-maintained Personal Health Record (PHR), for example, may retain medical record numbers by which the patient is known at different healthcare organizations. Those identifiers remain identifiers assigned by those organizations. The PHR preserves the identifier value and assigning authority so the information can later support patient matching and identity reconciliation.

In CDA, multiple identifiers for the record target may be represented using repeated recordTarget/patientRole/id elements. Each identifier should preserve the identity domain or assigning authority responsible for it. The presence of an organization-assigned patient identifier does not, by itself, mean that the organization should be represented as patientRole/providerOrganization.

| **What the CDA conveys**                          | **Interpretation**                                                                                                                                                  |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| patientRole/id assigned by Organization A         | Organization A knows this person by this identifier.                                                                                                                |
| Another patientRole/id assigned by Organization B | Organization B knows the same person by another identifier.                                                                                                         |
| A PHR carries both identifiers                    | The PHR knows both identities; it did not necessarily assign either one.                                                                                            |
| patientRole/providerOrganization                  | A separate assertion about the organizational context of the patient role; it should not be inferred merely because an organization-assigned identifier is present. |

## Identifier Accumulation Is Part of the Handshake

The identifier handshake does not require a system to discard one identity when another becomes known. Interoperating systems can progressively accumulate identifiers while preserving the Provenance and assigning authority of each.

Exchange identifiers; do not reassign them.

If System A learns an identifier assigned by System B, System A should preserve System B's identifier namespace and value. System A may associate that identifier with identities it already knows, but it should not transform the learned identifier into its own namespace.

This principle generalizes beyond patient identity. A Referral Recipient can know and reuse a Referral Initiator's Context Instance Identifier without becoming its assigning authority. An Order Placer can later learn an Order Filler's operational Order Identifier without turning it into a placer-assigned identifier.

Interoperability expands the set of identifiers known by participants without changing who assigned those identifiers or what they identify.

## Mimi Shell PHR Example

On February 16, 2026, Mimi Shell creates a new version of her patient-maintained Patient Care Summary in her PHR after recording the result of a self-administered home pregnancy test. Because Mimi already has care relationships with healthcare organizations, her PHR may know an MRN assigned to her by one of those organizations. The PHR may carry that MRN as one of Mimi's recordTarget/patientRole/id values while preserving the healthcare organization as the assigning authority for that identifier.

Carrying such an identifier does not make that healthcare organization the author, custodian, managing organization, or source of Mimi's Patient Care Summary. For this patient-maintained PHR document, patientRole/providerOrganization is omitted. Her existing OB/GYN and primary care relationships may instead be represented as care-team information.

The February 16 Patient Care Summary also does not yet carry a Perinatal Episode Context Instance Identifier merely because Mimi recorded a positive home pregnancy test. At that point she has not yet contacted her clinician to request the initial pregnancy appointment, and the subsequent clinical Perinatal Episode workflow has not yet been established.

## The Identifier Handshake

The maternal-health journey illustrates an identifier handshake across organizations. The prenatal organization can establish its patient identifier and the Perinatal Context. The birthing organization can establish a different patient identifier and, later, an encounter identifier. As information is exchanged, each organization can retain cross-references while preserving the assigning authority and the type of each identifier.

| **Journey step**                             | **Identity effect**                                                                                                                                                                              |
|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prenatal care begins                         | Prenatal organization establishes its patient identifier and the Perinatal Context Instance.                                                                                                     |
| Hospital registration / pre-arrival activity | Birthing organization establishes or confirms its own patient identifier and can retain the prenatal identifier as an external cross-reference.                                                  |
| Admission / birth encounter                  | A specific encounter identity is established in addition to the continuing patient and Perinatal Context identities.                                                                             |
| Subsequent exchange                          | Artifacts carry the identifiers appropriate to what they represent, allowing patient, episode, workflow, and encounter information to be correlated without collapsing them into one identifier. |

## Workflow Context and FHIR Task

A FHIR Task, when included, expresses the requested Shared Activity and may track persistent stateful work where the applicable transaction defines that behavior. An initiating Workflow Activity Task is optional (0..1) unless the applicable Transaction Definition requires it. TX8 is different: its reporting Task is required. Perinatal and encounter Context identifiers remain separate semantic identities.

The SubmissionSet (or profiled FHIR SubmissionSet List) organizes the structured payload and is required independently of any initiating Task. SubmissionSet.uniqueId / List.identifier establishes the workflow-unit business identity. SubmissionSet.purpose is required independently of Task. When a Task is included, its designated Task.identifier matches the SubmissionSet business identifier, and Task.code matches SubmissionSet.purpose in both code and code system. This alignment does not make the Task and SubmissionSet/List the same object.

Within a continuing Transaction context, the SubmissionSet/List retains its business identity independently of whether a Task is included. An intermediary may add applicable Provenance or revise package membership without initiating a new Shared Activity. When a Task is present, an intermediary may also add an eligible Workflow Status Update Endpoint to an updated representation of the same logical Task while preserving prior endpoints and identifiers.

| **Identity**                                | **Representation**                                                                          | **Intermediary handling**                                                                                                  |
|---------------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Shared Workflow Activity business identity  | SubmissionSet.uniqueId; corresponding List.identifier; Task.identifier when Task is present | Preserved unchanged and aligned throughout the Transaction context.                                                        |
| SubmissionSet/List metadata object identity | SubmissionSet.entryUUID / List.id                                                           | New identifier for an updated representation.                                                                              |
| Task resource object identity               | Task.id                                                                                     | New identifier when an updated Task representation is carried; its Task.identifier when Task is present remains unchanged. |
| Direct message identity                     | Message-ID                                                                                  | New identifier for each newly constructed Direct message.                                                                  |

For example, A initiates a structured workflow unit with a SubmissionSet/List and, optionally, a Task. B adds applicable Provenance and updates package membership while preserving the SubmissionSet business identifier. If the Task is present and B is eligible to receive the eventual workflow status, B can add its endpoint while preserving existing Task-carried endpoints. If no initiating Task is present, B cannot invent Task-carried endpoints; the limited Chapter 3 fallback routing rule applies if TX8 reporting is required.

The originating Transaction context concludes when the authorized Receiver Actor accepts or rejects the entire structured payload into the intended workflow. Where required by the originating transaction and exchange agreement, TX8 is a separate, subsequent Transaction Instance that reports that established disposition. Receipt of TX8 confirms the outcome to its recipients; it does not determine when the originating transaction concluded. Acceptance does not establish completion of subsequent clinical processing or service fulfillment. TX8 correlates the disposition using the preserved originating SubmissionSet.uniqueId and the carried identification snapshot. TX8 retains its own distinct report workflow-unit identity.

Only when TX8 reporting is required and a reporting interval applies, a missing correlated TX8 is tracked as an unconfirmed outcome requiring appropriate follow-up. The absence of TX8 does not prove acceptance, rejection, or non-receipt. A late TX8, if received, is correlated with the original SubmissionSet business identifier and does not create a new originating transaction. Where no eligible reporting destination can be established, the reporting obligation is recorded as unsuccessful and no TX8 is dispatched; the originating processing outcome is unchanged.

The id/identifier distinction here applies to representations carried in MAP packages. It does not prescribe changing the logical resource id for an ordinary update to the same resource on a FHIR server, where meta.versionId can distinguish server-maintained versions. Representation identifiers alone do not describe what changed; Provenance and transaction correlation preserve that history.

For an originating transaction, SubmissionSet.purpose identifies the requested Shared Activity; when an initiating Task is included, Task.code uses the same code and code system. TX8 is a separate Shared Activity with its own SubmissionSet/List and report Task; its Task.code identifies send-workflow-status. TX8 carries a minimal identification snapshot of the originating SubmissionSet/List as its primary information object. Its completed or failed status reports acceptance or rejection of that original structured payload, rather than the status of later clinical work or failure to transmit the report.

## Generalized Identifier Handshake for Orders and Referrals

The identifier handshake applies not only to patient identity, but also to stateful workflows such as orders and referrals. A robust exchange can preserve an identifier established by the request initiator while also learning and retaining identifiers later assigned by the request responder. These identifiers describe different things and should not overwrite one another.

| **Identifier**                       | **Established by**                                        | **Meaning**                                                                                                                               |
|--------------------------------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Context Instance Identifier          | Order Placer / Referral Initiator                         | Persistent identity of the order/referral workflow context.                                                                               |
| Task identifier                      | Party establishing the logical Task                       | Identity of the requested workflow activity, aligned with SubmissionSet.uniqueId when Task is present.                                    |
| Transaction Instance Identifier      | Party establishing the structured workflow unit           | SubmissionSet.uniqueId for the independently processable workflow unit. A transport hop alone does not create a new Transaction Instance. |
| Order / Referral Business Identifier | Operational system that creates the order/referral record | Local business identifier for the order/referral in that organization's system.                                                           |

## Persistent Workflow Roles and Transaction-Specific Roles

Order Placer / Referral Initiator and Order Filler / Referral Recipient describe enduring business relationships within the established workflow. Those relationships remain stable when a response is sent. Information Source, Information Recipient, Sender Actor, and Receiver Actor are assigned from the perspective of the transaction currently being performed: for a separately initiated TX8, the reporting party is its Information Source and the report recipient is its Information Recipient.

This stability allows identifiers to retain Provenance. An identifier originally assigned by the initiator remains an initiator-assigned identifier when returned by the responder. A new identifier assigned by the responder remains responder-assigned when it is subsequently stored and reused by the initiator.

IHE 360X precedent. 360X requires the Referral Initiator to establish a unique referral identifier and reuse it throughout the referral exchange. The Referral Recipient reuses the initiator-provided patient identifier in subsequent communications and may additionally provide another patient identifier. This is a useful precedent for preserving identifier roles rather than swapping them when message direction changes.

## Context Identity, Transaction Correlation, and Workflow Status

Correlation answers distinct questions. A Context Instance Identifier identifies the persistent clinical or business context. The originating SubmissionSet.uniqueId identifies the structured workflow unit whose acceptance or rejection is reported. When required and generated, TX8 also has its own SubmissionSet/List and required reporting Task identity, separate from the originating identifier retained in its snapshot.

Each correlated TX8 preserves the originating SubmissionSet.uniqueId in the carried identification snapshot and its accept or reject Provenance target. Context identifiers are retained when needed for correlation. Reports sent to multiple Workflow Status Update Endpoints describe the same originating package outcome. Later clinical progress or service-fulfillment communications follow their own transaction requirements; they are not implied by TX8 acceptance.

## When the Responder Creates Its Own Order or Referral Identifier

Receipt of a structured payload, acceptance into the intended workflow, and creation of an operational order or referral record are distinct events. Before the operational record exists, the Receiver Actor may know only the initiating Context identifier, workflow-unit identity, and information objects. When an operational system creates its own record, it may assign a local business identifier and communicate it through the applicable subsequent transaction without replacing the initiating Context identifier.

| **Stage**                          | **Initiator context** | **Transaction correlation**                                                         | **Responder business ID**                              |
|------------------------------------|-----------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------|
| Request sent                       | Established           | New SubmissionSet.uniqueId                                                          | Not yet known                                          |
| Request received                   | Reused unchanged      | Originating uniqueId retained for the correlated TX8                                | May be absent                                          |
| Operational order/referral created | Reused unchanged      | May still be retained                                                               | Responder assigns local order/referral ID              |
| Later clinical status or outcome   | Reused unchanged      | Determined by its own transaction; TX8 always correlates to the originating package | Responder ID can be returned and retained by initiator |

## CDA Representation of a Context Instance

This guide represents an established CDA Context Instance in ClinicalDocument/inFulfillmentOf/order. order/id carries the Context Instance Identifier and order/code carries its coded type, using the Chapter 3 binding and preserving the CodeSystem identity. An SDTC identifier-type extension is not used for this purpose in this location. The following illustrative snippet uses placeholders; it does not assign production identifiers or codes.

\<inFulfillmentOf xmlns="urn:hl7-org:v3"\>  
\<order\>  
\<id root="\[context namespace OID\]"  
extension="\[context instance value\]"/\>  
\<code code="\[context type code\]"  
codeSystem="\[code system OID\]"  
displayName="\[context type display\]"/\>  
\</order\>  
\</inFulfillmentOf\>

## Mimi Shell Identifier Example

The following Mimi Shell example preserves the purpose-specific namespace convention used by the synthetic source material. These assignments illustrate separate identities; they do not establish externally registered production OIDs. Production namespaces require their own governance and validation.

| **Identifier class**                 | **Mimi / NTHS example**                         | **Interpretation**                                               |
|--------------------------------------|-------------------------------------------------|------------------------------------------------------------------|
| NTHS base                            | 2.25.300482169457150407075386186229743407818    | Synthetic NTHS organization namespace                            |
| Patient                              | .1                                              | NTHS patient/MRN identity                                        |
| Document                             | .2                                              | Document id and setId                                            |
| Section                              | .3                                              | Section identity                                                 |
| Entry                                | .4                                              | Structured entry identity                                        |
| Context Instance                     | .5                                              | Persistent clinical/workflow context                             |
| Encounter                            | .6                                              | NTHS encounter identity                                          |
| Order / Referral Business Identifier | .7                                              | NTHS local operational order/referral identity                   |
| Mimi Perinatal Episode               | ...818.5 / c31e0ce4-ca7b-4e8d-a4db-f475642bce6e | Specific Perinatal Episode Context Instance                      |
| IHE testing patient ID               | 1.3.6.1.4.1.21367.13.20.1000 / IHERED-3007      | External testing identifier retained in its own assigning system |

## Practical Implementer Rules

Apply the following principles with the normative representation and binding rules of Chapter 3. They preserve identifier meaning as information crosses organizational boundaries.

• Distinguish patient, Context, encounter, workflow-unit, and operational order/referral identities. Preserve the required SubmissionSet/List business identifier; when an initiating Task is present, align its designated Task.identifier with that identifier.

• Preserve the identifier value, namespace or assigning authority, and applicable identifier type across organizational boundaries.

• Keep an established Context Instance Identifier stable throughout the workflow unless an applicable specification explicitly defines an identity change.

• Preserve enduring business roles and identifier attribution when a response is sent; assign participation and Technical Actor Roles for each transaction’s own perspective.

• Correlate every TX8 with the originating SubmissionSet.uniqueId carried in its identification snapshot. Keep the TX8 report’s own workflow-unit identity distinct.

• Communicate a responder’s later operational order/referral identifier as an additional identifier; retain the established Context identity.

• For CDA Context identifiers, apply inFulfillmentOf/order/id and order/code as specified in Chapter 3.

• In the illustrative Mimi Shell convention, .7 denotes local Order/Referral business identifiers and .5 denotes Context identifiers; these example assignments are not production namespace requirements.

## Authentication Identity and Signature Provenance

Authentication has identity and Provenance just as identifiers do. When an authenticated document is exchanged, assembled, or transformed, preserve the identity of the person who performed the authentication rather than attributing that act to the system or organization that later handled the artifact. A useful companion to the identifier rule “Exchange identifiers; do not reassign them” is: Preserve authentication; do not reattribute it.

Authentication, signature technology, and legal significance answer different questions. An authenticator identifies an attestation act. A cryptographic digital signature can provide technical assurance of that act or of the exchanged artifact. Whether a signer is legally authenticating the document is determined by the applicable governing rule and should not be inferred solely from the presence or type of signature.

Mimi Shell example. When Mimi completes and signs the Obstetric Medical History form supplied by her OB practice, Mimi is the subject, author, and authenticator of the information. Health Services of North Texas is the custodian after receiving and maintaining the completed form, and the NTHS EHR may assemble the CDA representation. The EHR's assembly activity does not replace or reattribute Mimi's authentication. Under the default convention, legalAuthenticator is not asserted unless a governing document-family or policy rule specifically requires it.

## Design Precedent

IHE 360 Exchange Closed Loop Referral (360X), Rev. 1.2, provides a useful precedent for this generalized handshake. It requires the Referral Initiator to provide and reuse a unique referral identifier throughout a referral exchange, requires the Referral Recipient to reuse the patient identifier provided by the Referral Initiator, and permits the Referral Recipient to additionally communicate another patient identifier. The cc-maternal-health-birth guidance generalizes this preservation principle to Context Instance, Task, transaction, and locally assigned order/referral identities.

## Workflow Status Update Endpoints and Transport Separation

A transaction may use different Direct addresses for transport notifications, original-message routing, and workflow status reports. Disposition-Notification-To serves transport MDNs; Workflow Status Update Endpoints identify report destinations; the Routing Target identifies where the current Direct message is sent.

TX8 reporting is conditional on the applicable originating transaction, exchange agreement, and failure-handling rules; it is not a universal Sender Actor or Receiver Actor requirement. If an initiating Task is present, preserve and deduplicate eligible Task-carried Workflow Status Update Endpoints and verify TX8 Receiver capability through the DirectTrust Directory-discovered CapabilityStatement. If no Task is present, the only permitted fallback is the Direct address used for Message Delivery Notifications, and only when the Directory-discovered CapabilityStatement declares TX8 Receiver support. With no eligible destination, record unsuccessful reporting and do not dispatch TX8; do not alter the originating processing outcome. Directory service-description text alone is not capability evidence. See Chapter 3 §§3.5 and 3.9 and Chapter 4.

## Distinguishing Content, Workflow, Submission, and Transport Roles

Keep distinct the authorship of the clinical information, the party requesting the Shared Activity, the organization contributing the SubmissionSet, the Technical Actor transmitting the current Direct message, and the Information Recipient. One organization may perform several functions, but a transport or packaging activity does not transfer original authorship. Provenance records the activities actually performed.

| **Question**                                | **Primary representation**                                                                                                               |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Who created the information?                | Authorship and Provenance of the information object, such as CDA author/representedOrganization or applicable HL7 V2 source information. |
| Who is requesting the workflow activity?    | Task.requester.                                                                                                                          |
| Who contributed the SubmissionSet?          | SubmissionSet.sourceId; the contributing entity for the current SubmissionSet, distinct from clinical authorship.                        |
| Who transmitted this message leg?           | Message Sender within the grouped Sender Actor, transport evidence, and applicable Provenance.                                           |
| Who is expected to process the information? | Information Recipient and the Receiver Actor authorized to perform the transaction-defined activity.                                     |

A Direct address may identify a party within the applicable trust framework and may also be designated as a communication endpoint. These uses remain distinct. Task.requester identity does not automatically establish a Workflow Status Update Endpoint or the Routing Target.

### Identity Bound Direct Addresses and Routing Targets

A Direct Address may serve as an identity-bound identifier of an actor within the DirectTrust trust framework. Separately, a Direct Address may be designated as an endpoint for a particular communication purpose. MAP preserves these semantics even when the same Direct Address happens to serve both purposes.

A Routing Target may be an intermediary or an organizational endpoint chosen under use-case rules rather than the Information Recipient’s individual Direct address. Workflow Status Update Endpoints identify where the correlated report must go and are explicitly carried in the Task; they are not inferred from Task.requester, the Routing Target, or Disposition-Notification-To. Routing capability alone does not establish authority to accept or reject a structured payload for the Information Recipient Organization.

## Where to Find Implementation Rules

Apply Chapter 3 for common identifier, patient matching, Context, Task, metadata, and workflow status requirements; Chapter 4 for endpoint discovery and capabilities; and Chapter 5 for implementation and testing guidance. Appendix A explains document identity and clinical time. Appendix D and the applicable Transaction Definition specify representation and reference-resolution details.

### Collection relationship

This appendix explains identity, Context, and status concepts. Appendix A supplies the clinical-document model, Appendix C explains XD classification, and Appendix D provides FHIR packaging and mappings. Apply those references together with Chapter 3, Chapter 4, and the relevant Transaction Definition. Conceptual examples do not replace normative requirements.

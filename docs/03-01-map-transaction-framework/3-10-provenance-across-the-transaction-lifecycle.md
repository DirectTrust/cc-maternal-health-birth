---
title: "3.10 Provenance Across the Transaction Lifecycle"
---

# 3.10 Provenance Across the Transaction Lifecycle

Provenance is not a serial stage after Content Consumer processing. Independently attributable provenance assertions are created as provenance-significant activities occur across the lifecycle. Each actor asserts only activities it can authoritatively assert.

The activity expresses what happened; the Provenance target identifies the object to which it happened. Receive records receipt and does not itself assert acceptance. Accept records acceptance into the intended workflow; reject records rejection with a reason. For TX8, one accept or reject assertion SHALL identify the entire originating structured payload through its preserved SubmissionSet.uniqueId, matched to the carried minimal identification snapshot as specified in Section 3.9.4. Receipt sufficient for that workflow status is implied. Separate per-document acceptance or rejection assertions are not required by this whole-package pattern.

ProvenanceActivityVS (http://objects.directtrust.org/standards/terminology/ValueSet/ProvenanceActivityVS), version 3.0.0, contains the complete activity inventory below: fifteen DirectTrust activities and six activities reused from other code systems. The table preserves exact codes and source display names; meanings are concise explanations. External codes and their source displays SHALL be preserved. ValueSet membership does not make an externally defined code a DirectTrust code.

Source code systems used in the inventory are: DT = http://objects.directtrust.org/standards/terminology/CodeSystem/DTCodeSystem (version 1.0.0); HL7 = http://terminology.hl7.org/CodeSystem/v3-DataOperation; ISO = http://terminology.hl7.org/CodeSystem/iso-21089-lifecycle. These identifiers, rather than the ValueSet URI, identify the selected code’s system.

| **Code** | **Source display** | **Meaning** | **Source** |
|----|----|----|----|
| CREATE | create | Bring an information object into existence. | HL7 |
| NULLIFY | nullify | Change an Act’s status to nullified, treating it as though it never existed. | HL7 |
| disclose | Disclose Record Lifecycle Event | Release or transfer record content, provide access to it, or otherwise divulge it. | ISO |
| amend | Amend (Update) Record Lifecycle Event | Change record content already held in persistent storage. | ISO |
| transform | Transform/Translate Record Lifecycle Event | Change the form, format, or language of record content. | ISO |
| transmit | Transmit Record Lifecycle Event | Send record content from one system or location to another. | ISO |
| receive | Receive | Receipt of the target by an actor or managed environment, sufficient for evaluation; does not assert acceptance, import, or service fulfillment. | DT |
| register | Register | Registration of the target in a registry, repository, or other managed information environment. | DT |
| replace | Replace | Replacement of one target by another; distinct from obsolescence and nullification. | DT |
| retrieve | Retrieve | Retrieval of the target from a repository or other managed information environment. | DT |
| seal | Seal | Application of a seal or equivalent integrity or authenticity mechanism to the target. | DT |
| store | Store | Storage of the target. | DT |
| import | Import | Incorporation of the target data or information into a system or managed information environment; distinct from receipt and acceptance. | DT |
| append | Append | Addition or addendum to the target without changing existing information. | DT |
| sign | Sign | Signing of the target by an identified signer. | DT |
| deliver | Deliver | Delivery of the target to its intended delivery destination; does not assert workflow acceptance. | DT |
| assemble | Assemble | Assembly of the target from its constituent content and applicable metadata or relationships; the target identifies whether this is a document or transaction package. | DT |
| accept | Accept | Acceptance of the target into the intended workflow for the processing specified by the originating transaction. For MAP TX8, the target is the whole originating SubmissionSet/List, including its Task and all included information objects. Receipt sufficient to determine disposition is implied. Does not assert import, clinical review, or fulfillment of downstream services. | DT |
| reject | Reject | Rejection of the target from the intended workflow, with an explanation. For MAP TX8, the target is the whole originating SubmissionSet/List, including its Task and all included information objects; no partial acceptance is asserted. Receipt sufficient to determine disposition is implied. Does not assert that every object was individually evaluated. | DT |
| notarize | Notarize | Notarization of the signature identified by the target. | DT |
| witness | Witness | Witnessing of the signature identified by the target. | DT |

The activity code describes what occurred, not an Activity Status or Document Status. A completed provenance assertion may record an unsuccessful attempt. In particular, amend is a provenance activity and does not require use of amended as a document-status concept. The applicable Transaction Definition selects required and permitted activities from this inventory; it does not require every activity in every exchange.

A Provenance assertion records an activity that occurred, the information objects affected, the participating agents, and the relevant times. Provenance Activities are recorded retrospectively and are not tracked as having a prospective lifecycle status. Provenance.occurred\[x\] describes when the activity occurred; Provenance.recorded describes when the assertion was recorded. An assertion may describe an unsuccessful attempt as well as a successful activity.

A Provenance Agent is a person, organization, device, or other represented actor participating in the recorded activity with attributable responsibility. Several agents may participate in one activity, and one agent may participate in several activities. Participation in an activity is distinct from the agent’s identity, professional function, Transaction Participation Role, and Technical Actor capabilities.

In FHIR R4, Provenance.agent.who identifies the participating person, device, or organization; agent.type identifies the participation type; agent.role may describe the agent’s function or security role; and agent.onBehalfOf identifies the party represented when applicable. The fifteen participation types in ProvenanceAgentTypeVS belong in agent.type; they are not a list of professions or values for agent.role. Agents and their supporting references SHALL resolve within the carrying Provenance Collection Bundle under Appendix D.6.

ProvenanceAgentTypeVS (http://objects.directtrust.org/standards/terminology/ValueSet/ProvenanceAgentTypeVS), version 3.0.0, contains the following fifteen participation types: twelve from HL7 and three from DirectTrust. The source abbreviations have the same meaning as in the activity inventory, except that HL7 here identifies http://terminology.hl7.org/CodeSystem/provenance-participant-type. Source codes and displays are preserved; meanings are concise explanations.

| **Code** | **Display** | **Participation meaning** | **Source** |
|----|----|----|----|
| enterer | Enterer | Enters data into the originating system, such as a scribe or transcriptionist. | HL7 |
| performer | Performer | Principally carries out the recorded activity. | HL7 |
| author | Author | Originates or substantially changes the information and bears responsibility for it. | HL7 |
| editor | Editor | Changes, corrects, or enhances existing information; specializes Author. | HL7 |
| verifier | Verifier | Checks the correctness and appropriateness of the activity. | HL7 |
| legal | Legal Authenticator | Authenticates content and accepts legal responsibility for it; specializes Verifier. | HL7 |
| attester | Attester | Attests to the accuracy of the information. | HL7 |
| informant | Informant | Reports information contributing to the artifact. | HL7 |
| custodian | Custodian | Is accountable for maintaining an accurate copy of the original record. | HL7 |
| assembler | Assembler | A device independently extracts existing information to generate a new artifact. | HL7 |
| transformer | Transformer | A device independently extracts and transforms existing information; specializes Assembler. | HL7 |
| composer | Composer | A device an author uses to record new information and combine it with selected existing information. | HL7 |
| witness-agent | Witness | An agent that directly observed the Provenance Activity and can attest that the activity occurred, but did not principally perform the activity. | DT |
| recorder | Recorder | An agent that recorded the assertion that the Provenance Activity occurred, but did not necessarily perform or directly observe the activity. | DT |
| notary | Notary | An agent that participated in the activity in the legally or officially authorized capacity of a notary. | DT |

For example, a practitioner who signs a document may be the performer of sign, with the represented organization recorded in onBehalfOf where applicable. Another person may participate as witness-agent. A system that records the assertion may participate as recorder without claiming it performed or directly observed the signing. A notary is identified by notary when participating in that authorized capacity.

The activity witness and agent type witness-agent are different codes answering different questions: the activity states what happened, while the agent type states how an agent participated. Likewise, notarize identifies an activity and notary identifies an agent’s participation. A recorder is not automatically the performer, and onBehalfOf does not by itself establish authorization or delegation of signing rights.

FHIR R4 element definitions: https://hl7.org/fhir/R4/provenance-definitions.html. External activity definitions: https://terminology.hl7.org/6.5.0/CodeSystem-v3-DataOperation.html and https://terminology.hl7.org/6.5.0/CodeSystem-iso-21089-lifecycle.html.

Provenance Collection Bundles SHALL use the defined temporary classification code DT-20261011-1, Provenance Information, until an applicable standard classification is established. The code SHALL use http://objects.directtrust.org/standards/terminology/CodeSystem/DTTemporaryCodeCS in FHIR Coding.system and its assigned CodeSystem OID in XD coded metadata.

| **Lifecycle point** | **Illustrative provenance activities related to lifecycle points** |
|----|----|
| Created | Creation, derivation, or transformation evidence may become known before package finalization. |
| Packaged | assemble may record structured payload assembly when it occurs. |
| Sent | transmit records sending the structured payload. Delivery occurs later and is distinct. |
| Delivered | deliver may record final-destination delivery of the message. Delivery evidence does not establish payload receipt or structured payload acceptance. |
| Received | receive may record structured payload receipt; accept or reject records the workflow status decision. |
| Accepted or Rejected; later Processed | accept or reject records structured payload acceptance or rejection. store, transform, or other activities may record subsequent processing. |

Relevant transaction Provenance available at structured payload finalization SHALL be shared when required by the applicable Transaction Definition. Additional permitted Provenance supporting the distributed workflow MAY be included. Activities occurring after finalization cannot be inserted retrospectively into an already transmitted structured payload; they may be recorded locally and communicated through a subsequent transaction. TX8 SHALL carry its required accept or reject assertion in a Provenance Collection Bundle.

Each Provenance information object SHALL be a separate FHIR Collection Bundle containing 1..\* Provenance resources. A structured payload MAY contain 0..\* such information objects, subject to its Transaction Definition’s requirements. Each bundle SHALL have its own DocumentEntry or DocumentReference and SubmissionSet membership. An actor MAY add a new independently attributable bundle without modifying bundles supplied by other actors. Assertions SHALL identify their activities, responsible agents, times, and targets; multiple targets MAY be associated with one activity when appropriate. Preserving an upstream assertion does not mean that a later actor endorses or reasserts it.

Each shared Provenance target information object SHALL be carried in the same structured payload. For TX8 acceptance or rejection, the minimal identification snapshot of the originating SubmissionSet/List satisfies this requirement; original membership links and original clinical information objects are not retransmitted solely to establish that target. Each Provenance Collection Bundle SHALL carry the supporting resources needed by its assertions or use the applicable carried-resource mappings in Appendix D. A Provenance resource SHALL NOT reference a contained actor inside another information object. TX8 target references SHALL use the logical identifier rule in Section 3.9.4 in both XD and FHIR representations. A nested Collection Bundle does not make its entries peer entries of the outer Bundle. References concerning other information objects SHALL follow the applicable identifier, version, and resolution rules in Appendix D and the Transaction Definition.

Each Transaction Definition SHALL identify required and permitted Provenance activities in Section 2.4 and assign their creation, preservation, and sharing responsibilities in Section 6. Sender and Receiver Actors SHALL assert only activities they can authoritatively attribute. Each distinct activity SHALL be represented by its own Provenance assertion; receive, accept, and reject SHALL NOT be combined into a single activity code.

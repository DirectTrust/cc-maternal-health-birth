---
title: "3.3 Technical Actor Roles and Accountability"
---

# 3.3 Technical Actor Roles and Accountability

Transaction Participants are the responsible parties defined in Chapter 2. Technical Actor Roles describe the functional capabilities a system implements to support a MAP Transaction as its initiator or recipient. The grouped Sender Actor combines Content Creator and Message Sender capabilities; the grouped Receiver Actor combines Message Receiver and Content Consumer capabilities. Provenance Activities describe what actually occurred and are distinct from both participation roles and technical capabilities.

## Three Independent Accountability Lenses

The following table separates the participant’s position, the system’s capabilities, and evidence of activities that occurred.

| **Lens** | **Question answered** | **Meaning** |
|----|----|----|
| Transaction Participation Role | WHICH PARTY AND POSITION? | The responsible party’s position in the current exchange; defined in Chapter 2. |
| Technical Actor Role | WHAT CAPABILITY? | The functional capabilities a system implements to support the transaction as initiator or recipient. |
| Provenance Activity | WHAT HAPPENED? | An activity that actually occurred, attributable to the responsible party and targeted information. |

These distinctions remain independent. A participation role does not by itself establish authorization. Implementing a Technical Actor Role does not prove a Provenance Activity occurred, and changing a technical function does not by itself change the party’s Transaction Participation Role.

## Technical Actor Roles and Grouping

Message Sender and Message Receiver retain their functional responsibilities defined by Direct. MAP adds Content Creator and Content Consumer responsibilities and groups them with the Direct actors to describe the capabilities needed at each end of the transaction.

| **Technical Actor Role** | **Common responsibility** |
|----|----|
| Content Creator | Creates at least the minimum Information Source information needed to initiate the transaction. Completes preparation of information objects, metadata, any applicable Task, Provenance, and structured payload together with the Message Sender; internal responsibilities MAY be divided according to the implementation. |
| Message Sender | Completes preparation and packaging responsibilities assigned within the grouped Sender Actor, constructs and transmits the Direct message to the selected Routing Target. |
| Message Receiver | Takes delivery of and validates the Direct message and makes its payload, metadata, message controls and transport evidence available for receiver-side processing. |
| Content Consumer | Receives the structured payload, evaluates its acceptance or rejection into the intended workflow, and performs subsequent processing of information objects according to the applicable requirements. |

Grouped Sender Actor = Content Creator + Message Sender. Grouped Receiver Actor = Message Receiver + Content Consumer. These grouped Technical Actors describe the combined capabilities a system implements at the initiator and recipient ends, respectively. Grouping does not require separate applications or prescribe internal system architecture.

## Relationship Between Transaction Participants and Technical Actors

Chapter 2 defines Transaction Participation Roles; they are not redefined here. A responsible party participates in a transaction, while its system implements the Technical Actor Roles needed for that participation. The mapping below describes this relationship without assigning authorship or authority solely from a technical function.

| **Transaction participation** | **System capabilities** |
|----|----|
| Information Source at the initiator end | Grouped Sender Actor: Content Creator + Message Sender. |
| Information Recipient at the recipient end | Grouped Receiver Actor: Message Receiver + Content Consumer. |
| Intermediary on a processing leg | Receiver Actor capabilities for an incoming leg and Sender Actor capabilities for an outgoing leg, as applicable; a separately initiated Shared Activity establishes its own participation roles. |

For example, an OB organization is the Information Source for a TX5 and acts in the business role of OB Provider. Its EHR implements Sender Actor capabilities. The hospital is the Information Recipient and its system implements Receiver Actor capabilities. When the hospital initiates a TX8 report, it becomes the Information Source for that new transaction and its system implements Sender Actor capabilities. Original document authorship remains unchanged.

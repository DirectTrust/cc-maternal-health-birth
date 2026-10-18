---
title: "3.2 Transaction Model and Identifiers"
---

# 3.2 Transaction Model and Identifiers

A MAP Transaction is defined by its Shared Activity and the participating parties. The following subsections explain how to distinguish a Transaction from a message or processing step, identify an individual Transaction Instance, and interpret identifiers and roles from that instance’s perspective.

## A Transaction Is a Two-Party Shared Activity

A MAP Transaction describes more than transmission of a message. The Transaction is the shared action performed by two parties; the functional requirements of its actors define the complementary responsibilities required to perform that action.

## Transaction Identity Follows the Shared Activity

A new Direct message, processing link, technical boundary, or change in Technical Actor function does not by itself create a new Transaction. A subsequent separately authorized workflow action involving the same, copied, or derived information is a new Transaction.

## Transaction Instance and Transport Correlation

The SMTP Message-ID identifies and correlates an individual Direct message. It is not the workflow activity identifier. Each independently processable workflow unit is identified by its SubmissionSet business identifier and may complete or fail independently.

## Each Transaction Instance Establishes Its Own Perspective

Each Transaction Instance is interpreted from the perspective of its own Shared Activity and participating parties. Information Source, Information Recipient, sender, and receiver describe roles within that Transaction Instance; they are not permanent attributes of an organization. A related transaction establishes its own role assignments, even when it carries information about a preceding transaction.

For example, when Organization A sends TX1 to Organization B, A is the Information Source and B is the Information Recipient. When B subsequently sends TX8 Workflow Status back to A, B is the Information Source for TX8 and A is the Information Recipient for TX8. The grouped Sender Actor and Receiver Actor functions likewise apply to the transaction currently being performed. Correlation links TX8 to TX1 without carrying the TX1 role assignments forward.

A related transaction does not transfer responsibility for the original clinical information or rewrite its Provenance. An Intermediary does not become the Information Source merely by forwarding or transforming information. The party making a new workflow status assertion is the Information Source for that separately performed Shared Activity. Section 3.6.1 illustrates the metadata perspectives; Sections 3.9.4 and 3.9.5 define TX8 correlation and its stopping rule.

Metadata follows the current transaction perspective.

Information Source and Information Recipient are roles for the current MAP Transaction Instance, as described in Section 3.2.4. They do not remain permanently attached to an organization because that organization initiated an earlier related transaction. Each subsequent transaction assigns the roles according to its own Shared Activity. SubmissionSet.sourceId identifies the source of the current SubmissionSet. Correlation to an originating transaction preserves the workflow relationship; it does not freeze the originating transaction roles.

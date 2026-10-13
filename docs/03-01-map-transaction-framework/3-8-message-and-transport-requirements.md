---
title: "3.8 Message and Transport Requirements"
---

# 3.8 Message and Transport Requirements

Direct message headers and MIME packaging carry the structured workflow package together with its human-readable communication. This section defines the common header and transport requirements, preserves equivalent human-readable content within the package, and distinguishes message delivery notifications from workflow status reporting.

The Information Recipient is the party for whom the Shared Activity is intended. The Routing Target is the address selected for the current Direct message; it MAY be an organizational workflow endpoint or an Intermediary address rather than the Information Recipient’s own Direct address. Routing SHALL follow the applicable use-case and endpoint-capability rules. An endpoint selected for transport does not by itself establish authority to accept or reject the structured payload.

## MAP Message Header Metadata - Direct Transport Requirements

The Direct message carries transport identifiers and delivery-notification controls. These fields describe the message transport and are distinct from the Workflow Activity identifier and workflow status instructions.

| **Element** | **Common purpose** |
|----|----|
| Message-ID | Identifies the individual Direct message and supports transport-level correlation, including MDNs. Distinct from the Transaction Instance / Workflow Activity Identifier. |
| Content-Type | Defines the multipart/mixed Direct message and MIME boundary. |
| Disposition-Notification-To | Identifies the return endpoint for requested Direct transport disposition notifications. |
| Disposition-Notification-Options | Requests/configures applicable Direct disposition-notification behavior. |

## MAP Message Header Metadata - XD Edge Transport Requirements

When a MAP transaction uses XD metadata and is transmitted as an XDM package using the Direct XDR/XDM Edge Protocol, the Direct message Subject SHALL begin with XDM/1.0/DDM. Additional human-readable subject content MAY follow the required prefix. When the FHIR Metadata option is used, this Subject line convention SHALL NOT be used. The Subject line requirement applies to the Direct message carrying the XDM package and is not a MAP workflow-routing or transaction-identification mechanism.

## MAP Message Header Metadata - Additional Requirements

MAP adds the following message header metadata to support recognition, routing, and processing of the structured payload.

<table style="width:100%;">
<colgroup>
<col style="width: 26%" />
<col style="width: 10%" />
<col style="width: 28%" />
<col style="width: 11%" />
<col style="width: 23%" />
</colgroup>
<thead>
<tr>
<th><strong>MAP header</strong></th>
<th><strong>Cardinality</strong></th>
<th><strong>ValueSet or fixed value</strong></th>
<th><strong>Binding strength</strong></th>
<th><strong>Purpose and application rule</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>x-direct-metadata-payload-versionIdentifier</td>
<td>1..1</td>
<td>1</td>
<td>Fixed value</td>
<td>Framework version governing interpretation and processing. The fixed framework version is 1.</td>
</tr>
<tr>
<td>x-direct-metadataTypeCode</td>
<td>1..1</td>
<td>DirectTrust Metadata Type<br />
http://objects.directtrust.org/standards/terminology/ValueSet/MetadataTypeVS</td>
<td>Extensible</td>
<td>Early recognition/routing based on structured payload metadata representation. SHALL identify the metadata representation actually used for the transaction. The value SHALL follow the Extensible binding to MetadataTypeVS and SHALL be consistent with a metadata representation supported by the receiving endpoint. For XD metadata use urn:dt-org:dsm:map:SMTP+XD:1.0; for FHIR metadata use urn:dt-org:dsm:map:SMTP+FHIR:1.0.</td>
</tr>
<tr>
<td>x-direct-useCase</td>
<td>1..1</td>
<td>cc-maternal-health-birth</td>
<td>Fixed value</td>
<td>Early use-case-aware routing to the appropriate Content Consumer Processor. Identifies this use case.</td>
</tr>
<tr>
<td>x-direct-purposeOfUse</td>
<td>0..*</td>
<td>TREATMENT</td>
<td>Fixed value</td>
<td>Broad network-level reporting/measurement of exchange purpose without Payload inspection. When purposeOfUse is populated for treatment exchange in this use case, use TREATMENT. The header remains optional; this fixed value does not assert treatment for an unrelated purpose.</td>
</tr>
</tbody>
</table>

These MAP message metadata requirements are common to TX1-TX8 whenever the transaction uses Direct messaging. Individual Transaction Definitions SHALL state only transaction-specific deviations or additional requirements. The Direct message header SHALL NOT use x-direct-workflow-status-requested. The request for structured payload acceptance reporting and the Workflow Status Update Endpoint(s) belong to the Workflow Activity Task. Disposition-Notification-To remains a transport-level return address for Direct disposition reporting and SHALL NOT be interpreted as a Workflow Status Update Endpoint.

## Common MIME Packaging and Human Readable Content Preservation

Every MAP Transaction conveyed through Direct messaging SHALL use an outer multipart/mixed message containing at least two MIME parts. MIME Part 1 SHALL be a multipart/alternative human-readable communication. It SHALL contain exactly one text/plain .txt file and MAY contain additional text/html .html alternatives presenting the same communication. The text/plain representation SHALL precede the optional alternatives within multipart/alternative.

MIME Part 2 SHALL contain the structured payload defined by the applicable Transaction Definition. The Transaction Definition specifies its transaction-specific information objects and packaging representation. These common human-readable preservation requirements apply whether structured payload metadata uses the XD or FHIR Metadata option.

The structured payload in MIME Part 2 SHALL contain copies of every human-readable file included in MIME Part 1: the required .txt file and every optional .html alternative supplied there. Each packaged copy SHALL have the same file content as its corresponding outer representation. A separately generated summary, a link to the outer MIME part, or a machine-processable source object does not satisfy this requirement. The package metadata SHALL identify the included human-readable objects using the selected metadata representation.

Some Content Consumers retain or pass onward only the structured payload and discard the other outer MIME parts. Including the same human-readable files inside the package preserves access to the communication when this occurs. Human readability SHALL therefore be preserved both in the outer message and within the structured payload; the optional status of an HTML alternative does not make its packaged copy optional once that alternative is supplied in MIME Part 1.

The grouped Sender Actor SHALL include and validate the required human-readable copies in the structured payload and construct the outer MIME parts with the same file content. These responsibilities MAY be divided between Content Creator and Message Sender according to the implementation. The applicable Transaction Definition specifies the human-readable content coverage and transaction-specific information objects.

## Direct Message Delivery Notification and Workflow Status Updates

Direct final-destination delivery notifications and workflow status reports provide different assurances. A dispatched final-destination MDN establishes delivery of the Direct message to its intended transport destination. A workflow status report communicates acceptance or rejection of the entire structured payload into the intended workflow. It does not report completion of subsequent processing. MDNs use Disposition-Notification-To; workflow status reports use the Workflow Status Update Endpoints carried with the Workflow Activity Task. Those addresses MAY differ.

A successful final-destination MDN SHALL NOT be interpreted as evidence that the Information Recipient successfully parsed, patient-matched, context-correlated, accepted, retained, routed, or processed the structured payload in its intended workflow.

---
title: "Transaction Definitions"
---

# Reusable Transaction Catalog

_Create a growing body of reusable capabilities._

The MAP RTC identifies reusable Shared Activities and their defining specifications. TX1–TX8 are local labels for navigation within this guide; the applicable transaction-type code identifies the Shared Activity for interoperable exchange. The maternal-health workflows compose these transactions rather than redefine each notification or document exchange. Chapter 3 establishes the common requirements and Transaction Definition structure.

## Reusable Transactions

The defining specifications below establish the organization of reusable transaction requirements. This guide defines TX3 and supplies maternal-health requirements for the reused transactions. TX6 is a non-Direct query placeholder. Apply the defining Transaction Definition together with the maternal-health requirements in this guide.

<table style="width:100%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 28%" />
<col style="width: 27%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th><strong>TX</strong></th>
<th><strong>Shared Activity and defining specification</strong></th>
<th><strong>Primary or relevant information objects</strong></th>
<th><strong>Maternal-health application</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>TX1</td>
<td>send-outpatient-visit-notification<br />
Event Notifications via Direct</td>
<td>Outpatient visit notification (HL7 V2)</td>
<td>Send notification that an outpatient maternal-health encounter has occurred or completed, in human-readable and machine-processable form.</td>
</tr>
<tr>
<td>TX2</td>
<td>send-admission-notification<br />
Event Notifications via Direct</td>
<td>Registration or admission notification (HL7 V2)</td>
<td>Send notification of a registration or admission event relevant to the maternal-health use case, in human-readable and machine-processable form.</td>
</tr>
<tr>
<td>TX3</td>
<td>send-birth-notification<br />
Care Coordination for Maternal Health – Birth</td>
<td>Maternal Health Birth Notification (CDA)</td>
<td>Communicate newborn birth information to the mother’s care team through the specialized maternal-health birth notification document.</td>
</tr>
<tr>
<td>TX4</td>
<td>send-discharge-notification<br />
Event Notifications via Direct</td>
<td>Hospital or ED discharge notification (HL7 V2)</td>
<td>Send notification of a discharge event relevant to the maternal-health use case, in human-readable and machine-processable form.</td>
</tr>
<tr>
<td>TX5</td>
<td>send-documents<br />
Send Documents via Direct</td>
<td>Primary CDA document and permitted additional documents</td>
<td>Send one or more maternal-health documents to support pregnancy notification and risk assessment, referral/orders, antepartum, birth, postpartum, and continuity-of-care information sharing.</td>
</tr>
<tr>
<td>TX6</td>
<td>query-for-documents<br />
Care Coordination for Maternal Health – Birth — placeholder</td>
<td>Documents discovered and retrieved through query protocols</td>
<td>Represent document request and retrieval exchanges outside Direct; not a specified Direct transaction.</td>
</tr>
<tr>
<td>TX7</td>
<td>send-patient-update<br />
Update Patient Matching Information via Direct</td>
<td>Patient update A08, or Change List with an updated Patient resource</td>
<td>Send updated patient information that may affect patient matching for parties with which information has previously been shared.</td>
</tr>
<tr>
<td>TX8</td>
<td>send-workflow-status<br />
Workflow Status via Direct</td>
<td>Originating SubmissionSet/List information object; report Task and Provenance accompany it</td>
<td>Report acceptance or rejection of the entire originating structured payload into its intended workflow. Acceptance does not establish subsequent processing or service completion.</td>
</tr>
</tbody>
</table>

---
title: "2.6 Actor Transaction Diagrams"
---

# 2.6 Actor Transaction Diagrams

The diagrams show representative Direct exchanges using two participants or an Intermediary. Participant identities, permitted routes, information objects, and triggering conditions are established by the applicable workflow and Transaction Definition. Each TX8 reports the workflow status of an originating Direct transaction. Query exchanges represented by TX6 use their own protocols outside Direct.

## O1 Provide Notification of Pregnancy and Risk Factors

The OB Provider or Primary Care Provider supplies Pregnancy Notification and Risk Assessment documents to the Payer through TX5. TX8 reports acceptance or rejection of the entire structured payload into the intended workflow, separately from transport delivery and later payer processing.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-1.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

## O2 Provide Referral or Orders for Birth Services

The referring OB Provider sends the referral/order and supporting documents to the Birthing Provider using TX5. TX8 reports structured payload acceptance or rejection. Acceptance of that payload is distinct from acceptance of the clinical referral and from whether the requested services are performed.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-2.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

## O3 Provide Antepartum Summary Information Across Care Settings

TX1 outpatient visit notifications and TX2 registration or admission notifications can trigger sharing. TX5 supplies the Antepartum Summary proactively or following a relevant event; TX6 represents query discovery and retrieval outside Direct. The diagram shows the resulting Direct document exchange and workflow status report. Event notifications have their own applicable workflow status reports.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-3.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

## O4 Enable Postpartum Planning Across Care Settings

TX3 communicates birth information to the mother’s care team, and TX4 communicates discharge. TX5 supplies maternal discharge and postpartum planning documents; TX6 permits document discovery outside Direct. The diagram shows a representative document exchange. Each applicable originating Direct transaction has its own TX8; the report does not itself create or change the longitudinal Perinatal Context.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-4.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

## O5 Improve Patient Matching When Key Information Changes

TX7 communicates patient demographic or identifier changes relevant to matching to each relevant Information Recipient. The prior information supports matching; the primary update information object expresses the requested changes. Coverage and eligibility changes are outside this narrowly scoped transaction. A qualifying update to multiple recipients produces distinct TX7 Transaction Instances and independently correlated TX8 reports. No TX7 means no corresponding TX8.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-5.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

The diagram illustrates two supported exchange patterns. Provider-to-provider, an organization may send the patient update directly via Direct to another care provider. Through a data utility, a provider may send an HL7 V2 Patient Update notification to a state or regional data utility, which identifies other organizations caring for the patient and distributes the patient matching information updates to them using the send-patient-update Direct transaction. In either pattern, the goal is the same: use what was previously known to identify the patient, then use the new information to update the patient’s record.

## O6 Communicate Workflow Status for Improved Orchestration

TX8 reports acceptance or rejection of the entire originating structured payload, including its Task and information objects, into the intended workflow. Either status implies sufficient receipt to identify and evaluate the payload; it does not imply that every information object was parsed or processed. A TX8 is never sent in response to a TX8.

Direct exchange and workflow status return

![](/images/02-map-use-case-framework/2-6-actor-transaction-diagrams-6.png)

The direct and intermediary routes are alternatives. The TX8 return path is illustrative: the authorized reporting system sends the correlated report to every designated Workflow Status Update Endpoint, which may include the Information Source and participating Intermediaries. A return route is not required to reverse the outbound hops.

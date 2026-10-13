---
title: "5.4 Implementation Roadmap"
---

# 5.4 Implementation Roadmap

Begin with the Shared Activity and select the applicable catalog transaction. Identify the transaction participants and grouped Sender Actor and Receiver Actor responsibilities; resolve the Routing Target and its declared capabilities; prepare the information objects, Workflow Activity Task, Context, metadata, and Provenance; then package and transmit the Direct message. The authorized Receiver Actor evaluates the entire structured payload and reports acceptance or rejection into the intended workflow. Processing after acceptance follows the use-case and Task requirements.

Construct MIME Part 1 as multipart/alternative with the required text/plain human-readable communication and optional HTML alternatives. MIME Part 2 carries the structured payload. That package SHALL contain identical copies of the supplied human-readable files, as required by Chapter 3, so that the information remains available when a Content Consumer retains only the structured payload.

| **Step** | **Implementation question** |
|----|----|
| 1\. Select the Shared Activity | Select the reusable transaction that expresses the requested activity. |
| 2\. Assign participants and Technical Actors | Identify Information Source, Information Recipient, Intermediaries, and grouped Sender Actor and Receiver Actor responsibilities. |
| 3\. Resolve the Routing Target and capabilities | Confirm the authorized destination, use case, transaction, Receiver Actor capability, and supported exchange options. |
| 4\. Prepare workflow controls | Establish Task, patient identity, Context, correlation, purpose, and required Workflow Status Update Endpoints. |
| 5\. Prepare information objects and metadata | Preserve source content and clinical time; prepare required information objects, metadata, and Provenance Collection Bundles. |
| 6\. Package and transmit | Apply XD or FHIR packaging, human-readable copies, reference rules, and Direct transport requirements. |
| 7\. Evaluate the structured payload | The authorized Receiver Actor identifies and validates the whole package and determines acceptance or rejection into the intended workflow. |
| 8\. Report workflow status and perform accepted work | Send required correlated TX8 reports to the indicated endpoints. After acceptance, perform the requested processing under the use-case requirements. |

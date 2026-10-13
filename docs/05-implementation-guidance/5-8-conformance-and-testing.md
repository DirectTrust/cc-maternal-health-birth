---
title: "5.8 Conformance and Testing"
---

# 5.8 Conformance and Testing

Conformance requires observable behavior as well as syntactically valid artifacts. Begin with the declared capability chain: Endpoint → Use Case → Transaction → Technical Actor Role → Supported Exchange Options → Workflow Status Responsibilities. Exercise the declared combinations, package completeness, metadata semantics, reference resolution, correlation, report timing, and acceptance or rejection behavior separately from processing after acceptance.

Test workflow status reporting independently from transport delivery. TX8 carries its own SubmissionSet/List and one report Task, a minimal identification snapshot of the originating SubmissionSet/List as the primary information object, and required accept or reject Provenance in a separate Collection Bundle. completed means acceptance of the original structured payload; failed means rejection. The report does not assert completion of subsequent clinical work. No TX8 is generated for a TX8.

Measure the expected reporting interval from the last sender acting for the Information Source Organization sending to a Routing Target associated with the Information Recipient Organization. The default is 60 minutes unless an explicit use-case or recipient-specific agreement sets another interval. Preserve all indicated Workflow Status Update Endpoints and deduplicate identical Direct addresses. Missing correlated reports trigger follow-up; they do not establish acceptance, rejection, or non-receipt.

| **Test area** | **What to verify** |
|----|----|
| Capability | Declared transactions, Technical Actor Roles, exchange options, and required TX8 capability agree with implemented behavior. |
| Message and transport | Direct headers and MIME structure are correct. MDN delivery evidence remains distinct from workflow status. |
| Structured payload and metadata | Information objects, one Workflow Activity Task, human-readable copies, identity, Context, correlation, cardinalities, membership, and references meet the applicable requirements. |
| Processing | Whole-package acceptance or rejection is distinct from subsequent requested processing and clinical service fulfillment. |
| Provenance | Independent Provenance Collection Bundles retain attributable assertions and resolve targets using the specified rules; required and permitted activities are checked. |
| TX8 | Originating snapshot identity, report Task status, accept/reject activity, failure reason, endpoint set, timing, and observable workflow status agree. |

---
title: "3.11 Putting the Framework Together"
---

# 3.11 Putting the Framework Together

Transaction processing, workflow status, and Provenance describe complementary aspects of an exchange. Lifecycle states describe progress reached, workflow status reports communicate acceptance or rejection into the intended workflow, and Provenance provides independently attributable evidence of activities across the lifecycle.

| **Dimension** | **What it describes** |
|----|----|
| Transaction processing | CREATED → PACKAGED → SENT → DELIVERED → RECEIVED → ACCEPTED or REJECTED; ACCEPTED → PROCESSED. |
| Workflow Status | Acceptance or rejection of the entire structured payload into its intended workflow, communicated through a correlated workflow status report. Subsequent processing is distinct. |
| Provenance | Independently attributable evidence accumulating as activities occur before, during, and after the transaction processing path. |

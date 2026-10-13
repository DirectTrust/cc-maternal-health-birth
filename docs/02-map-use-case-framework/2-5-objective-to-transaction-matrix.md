---
title: "2.5 Objective-to-Transaction Matrix"
---

# 2.5 Objective-to-Transaction Matrix

Each row identifies a reusable transaction and the in-scope Chapter 1 objectives it supports. O7, accurate Data Provenance, applies across the exchanges; the applicable Transaction Definition specifies required and permitted activities. O6 is supported through workflow status reports for originating Direct transactions. A non-Direct TX6 exchange follows its query protocol and does not acquire a TX8 requirement merely by appearing in this matrix.

| **Tx** | **Transaction Pattern** | **O1** | **O2** | **O3** | **O4** | **O5** | **O6** | **O7** |
|----|----|----|----|----|----|----|----|----|
| TX1 | send-outpatient-visit-notification |  |  | X |  |  |  | X |
| TX2 | send-admission-notification |  |  | X |  |  |  | X |
| TX3 | send-birth-notification |  |  |  | X |  |  | X |
| TX4 | send-discharge-notification |  |  |  | X |  |  | X |
| TX5 | send-documents | X | X | X | X |  |  | X |
| TX6 | query-for-documents |  |  | X | X |  |  | X |
| TX7 | send-patient-update |  |  |  |  | X |  | X |
| TX8 | send-workflow-status | X | X | X | X | X | X | X |

The objectives combine event notifications, document exchange, document discovery, patient matching information updates, and workflow status reports. TX8 communicates acceptance or rejection into the intended workflow; it does not report completion of subsequent document filing, referral evaluation, or service delivery.

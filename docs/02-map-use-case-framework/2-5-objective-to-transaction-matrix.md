---
title: "2.5 Objective-to-Transaction Matrix"
---

# 2.5 Objective-to-Transaction Matrix

Each row identifies a transaction, its RTC or New classification, and the in-scope Chapter 1 objectives it supports. O7, accurate Data Provenance, applies across the exchanges; the applicable Transaction Definition specifies required and permitted activities. O6 is supported through workflow status reports for originating Direct transactions. A non-Direct TX6 exchange follows its query protocol and does not acquire a TX8 requirement merely by appearing in this matrix.

| **Transaction Name** | **RTC or New** | **TXn** | **O1** | **O2** | **O3** | **O4** | **O5** | **O6** | **O7** |
|---|---|---|---|---|---|---|---|---|---|
| send-outpatient-visit-notification | RTC | TX1 |  |  | X |  |  |  | X |
| send-admission-notification | RTC | TX2 |  |  | X |  |  |  | X |
| send-birth-notification | New | TX3 |  |  |  | X |  |  | X |
| send-discharge-notification | RTC | TX4 |  |  |  | X |  |  | X |
| send-documents | RTC | TX5 | X | X | X | X |  |  | X |
| query-for-documents | New | TX6 |  |  | X | X |  |  | X |
| send-patient-update | RTC | TX7 |  |  |  |  | X |  | X |
| send-workflow-status | RTC | TX8 | X | X | X | X | X | X | X |

The objectives combine event notifications, document exchange, document discovery, patient matching information updates, and workflow status reports. TX8 communicates acceptance or rejection into the intended workflow; it does not report completion of subsequent document filing, referral evaluation, or service delivery.

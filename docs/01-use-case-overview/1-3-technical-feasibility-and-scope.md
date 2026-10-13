---
title: "1.3 Technical Feasibility and Scope"
---

# 1.3 Technical Feasibility and Scope

## Technical Feasibility

The approach uses Direct Secure Messaging, HL7 Version 2, CDA, FHIR R4, and IHE XD/XDM packaging and metadata. It separates transport delivery, structured payload acceptance into the intended workflow, and subsequent processing of the included information objects. Systems can exchange useful information at different stages of structured-data maturity while meeting the applicable transaction and conformance requirements.

## In Scope

This version covers the maternal-health workflows identified in Chapter 2, including Direct notifications and document exchange, patient matching information updates, workflow status reports, and document discovery through the TX6 query placeholder. It supports Minimally Structured Documents and information objects expressed using HL7 Version 2, CDA, or FHIR when permitted by the applicable Transaction Definition. Reusable transactions are organized through the MAP RTC; this guide supplies their maternal-health clinical, Context, participant, and routing requirements.

## Out of Scope

Newborn-focused clinical workflows beyond the maternal-health exchanges explicitly identified in this guide, public health and vital records exchange, quality reporting, research, and additional transaction patterns are outside the scope of this version. TX6 represents query exchanges outside Direct; a Direct document-request transaction is not specified here. Chapter 2 identifies the applicable transactions, and Chapter 5 provides implementation guidance for their conformance artifacts and examples.

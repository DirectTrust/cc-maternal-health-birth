---
title: "4.7 Metadata Representation Selection"
---

# 4.7 Metadata Representation Selection

For an originating transaction, select the Information Recipient, resolve an authorized Routing Target, obtain the endpoint’s CapabilityStatement, and confirm the use case, transaction, Receiver Actor capability, and supported exchange options. Select an applicable metadata representation before constructing and sending the Direct message. The Routing Target may be an intermediary or an organization’s use-case endpoint rather than the Information Recipient’s individual Direct address.

If exactly one applicable representation is supported, use it. If multiple are supported and one is preferred, use the preference unless an applicable agreement or explicit configuration selects another supported representation. If multiple are supported and no preference is declared, use a deterministic rule established by implementation policy or agreement. Listing order does not create an implicit preference. A Content Creator MAY allow an authorized testing or configuration override, but the selected representation SHALL be supported by the destination endpoint.

For TX8, the response SHALL use the metadata representation used by the originating transaction unless an explicitly established capability or transaction agreement specifies otherwise. The incoming transaction is evidence for this exchange; it does not establish an organization-wide preference for unrelated exchanges.

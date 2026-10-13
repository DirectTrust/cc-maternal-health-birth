---
title: "4.13 Intended Workflow"
---

# 4.13 Intended Workflow

For each supported inbound transaction, the Information Recipient SHALL describe the intended clinical or business workflow. Naming only a mailbox, queue, interface, transport endpoint, or Routing Target is insufficient. Capability declarations SHALL distinguish an intermediary’s routing or processing functions from authority to accept or reject the structured payload on behalf of the Information Recipient Organization.

The intended workflow declaration complements transaction and information-object capabilities. Workflow status identifies acceptance or rejection into that workflow; a workflow status report communicates that status. Subsequent processing and service fulfillment follow their applicable use-case requirements.

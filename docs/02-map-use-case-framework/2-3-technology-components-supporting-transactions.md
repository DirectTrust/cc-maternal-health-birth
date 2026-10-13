---
title: "2.3 Technology Components Supporting Transactions"
---

# 2.3 Technology Components Supporting Transactions

Systems, applications, devices, and services are technology components employed by responsible parties. Technical Actor Roles describe the functional capabilities those components implement to support a transaction as its initiator or recipient. Chapter 3 defines Content Creator, Message Sender, Message Receiver, and Content Consumer, including the grouped Sender Actor and Receiver Actor.

| **Technology component** | **Definition** | **Examples** |
|----|----|----|
| System | A technology environment operated by or on behalf of a responsible party that provides a collection of capabilities used to create, manage, process, store, send, or receive information in support of that party's activities. | An Electronic Health Record (EHR) used by a healthcare provider; a Business Services Platform used by a payer or other organization. |
| App | A software application used by a responsible party to perform a particular set of functions. An App may operate independently or may integrate with a System used by the responsible party. | A Personal Health Record (PHR) used by an Individual Entity; a specialized clinical or administrative service used by an Organizational Entity that may or may not integrate with its EHR or Business Services Platform. |
| Device | A hardware component that incorporates System or App capabilities enabling it to collect, create, process, store, send, or receive information for a responsible party which may be an Organizational Entity or Individual Entity. | A clinical device used on behalf of an Organizational Entity; a patient-operated or mobile device used by an Individual Entity. |

Content Creator and Message Sender form the grouped Sender Actor; Message Receiver and Content Consumer form the grouped Receiver Actor. Responsibilities may be divided within each group according to the implementation. The grouped Sender Actor completes the information objects, Workflow Activity Task, metadata, relevant Provenance, structured payload, and Direct message. The grouped Receiver Actor takes delivery, receives the structured payload, and supports its evaluation and processing according to the applicable requirements.

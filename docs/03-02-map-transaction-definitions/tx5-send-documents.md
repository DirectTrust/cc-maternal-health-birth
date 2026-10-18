# TX5: send-documents

<span class="smallcaps">Reusable Transaction Definition</span>

## Transaction Overview — WHY

TX5 exchanges documents for processing by an intended receiving workflow. The following requirements define its scope, transaction identity, and relationship to the common MAP framework.

### Purpose and Scope

The send-documents transaction exchanges one or more documents of any applicable type for an authorized receiving workflow. This guide illustrates its use for pregnancy notification, birth-services referral, antepartum information sharing, and continuity of care. Document content and representation requirements follow the applicable document specifications and receiving endpoint capabilities.

TX5 supports unsolicited document communication, a response to a solicited document request, referral initiation, and an update within an existing referral workflow. A closed-loop referral pattern MAY be supported by composing document exchanges and subsequent workflow activities; it is not required for every TX5.

Each independently processable workflow unit SHALL contain one designated primary document and zero or one Workflow Activity Task. Any number of additional documents MAY accompany the primary document as secondary information objects supporting the same requested activity. Separately requested activities SHALL use separately identified workflow units under Chapter 3.

Maternal-health examples include the following document types:

- Pregnancy Notification and Risk Assessment

- Pregnancy Notification

- Pregnancy Risk Assessment

Other applicable maternal-health CDA documents may be exchanged using this transaction, including a Birth Order Referral with the mother’s Birth Plan as supporting content. The selected clinical document specification governs its content; TX5 defines exchange and processing requirements.

### Transaction Identity

The canonical transaction code is send-documents. TX5 is a local editorial label assigned by the cc-maternal-health-birth Use Case Guide for readability and navigation; it is not the interoperable transaction identifier. The canonical transaction code is intended to remain stable and reusable across use cases.

SubmissionSet.purpose SHALL carry the DTCodeSystem code send-documents independently of Task presence. When a Workflow Activity Task is included, Task.code SHALL carry the same code and code system. The CDA document type and clinical workflow purpose do not replace the transaction identity. Primary identifies the principal information artifact for the activity, not a fixed file position in the package.

### Framework Relationship

This definition specializes Chapter 3’s common MAP Transaction Framework. Common packaging, transport, patient identity, Context, correlation, Workflow Status, and Provenance requirements apply together with the TX5 requirements below.

Clinical Content Author/Source, Workflow Requester / Information Source (Task.requester), SubmissionSet Source (SubmissionSet.sourceId), Transaction Sender, and Information Recipient are distinct roles. A single organization MAY fill several roles. Implementations SHALL preserve the distinction when different parties perform them.

## Message and Payload Requirements — WHAT

The TX5 message carries a structured payload and human-readable communication. The following requirements define its contents, requested activity, reporting instructions, and transport representation.

### Payload Packaging Structure

The TX5 Structured Payload Package SHALL contain the required metadata, zero or one Workflow Activity Task, the primary document, and copies of all human-readable communication files supplied in MIME Part 1. Apply Chapter 3 Section 3.8.4 for multipart/mixed, the multipart/alternative human-readable part, and identical-copy preservation. XD or FHIR metadata represents the same package semantics.

Apply Chapter 3 Sections 3.7.5–3.7.6 and Appendix D for package completeness. All required payload and supporting references SHALL resolve within the transmitted Structured Payload Package. Review reports and inspection views outside that package do not supply required transmitted resources. Supporting patient, actor and endpoint resources do not acquire additional DocumentEntries merely because they support a reference.

For XD, supporting resources required by the Task SHALL be contained in that Task and local fragment references SHALL resolve within it. Independently submitted information objects use the applicable package-local references; references into another object’s contained resources and nested containment SHALL NOT be used. A Provenance Collection Bundle carries its own assertions and required supporting agents under Appendix D. For FHIR metadata, Task supporting resources are peer entries in the outer Collection Bundle; resources inside a Provenance Collection Bundle remain entries of that separate Bundle. Apply Chapter 3 and Appendix D security-label and serialization requirements.

#### Message-Level Payload Packaging Structure

| **Message MIME-part** | **Conf.** | **Package object**                                      | **Content MIME type** |
|-----------------------|-----------|---------------------------------------------------------|-----------------------|
| MIME Part 1           | R         | Human-readable healthcare communication                 | text/plain            |
| MIME Part 1           | O         | Human-readable alternative(s)                           | text/html             |
| MIME Part 2           | R         | Structured Payload Package — XD or FHIR metadata option | application/zip       |

#### Structured Payload Package Contents

| **Conf.** | **Package object**                            | **Content MIME type / representation**                             | **Requirement**                                                                                                                             |
|-----------|-----------------------------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| R         | XDM/FHIR SubmissionSet/List                   | Selected metadata representation                                   | Package-level metadata; apply Chapter 3 and Section 3.1.                                                                                    |
| R         | XDM/FHIR DocumentEntries/DocumentReferences   | Selected metadata representation                                   | Metadata describing all included information objects.                                                                                       |
| O         | Workflow Activity Task Resource               | application/fhir+xml or application/fhir+json                      | Zero or one Task per independently processable workflow unit; when included, use the selected package representation and apply Section 2.2. |
| R         | Primary document                              | Actual document media type                                         | Principal document for the requested activity; Section 3.3 supplies the CDA mapping when applicable.                                        |
| O         | Secondary document(s) / information object(s) | text/xml for accompanying CDA; actual media type for other objects | Support the same activity; apply Section 3.6. Each included secondary object requires document type coding under Section 3.6.               |
| O         | Optional Provenance Collection Bundle         | application/fhir+xml or application/fhir+json                      | Optional illustrative assertions; when included, use Chapter 3 and Appendix D Provenance Collection Bundle packaging.                       |
| R         | Human-readable healthcare communication       | text/plain                                                         | Identical copy of the MIME Part 1 TXT file; coverage is specified in Section 2.3.                                                           |
| C         | Human-readable alternative(s)                 | text/html                                                          | Identical copies of every HTML alternative supplied in MIME Part 1; HTML remains optional at message level.                                 |

### Workflow Activity Task

When a Workflow Activity Task is included in an initiating send-documents exchange, Task.code SHALL carry the DTCodeSystem code send-documents and SHALL match SubmissionSet.purpose in both code and code system. The Task expresses the requested processing activity in the applicable Use Case. Task.code.text SHALL make the approved Task Action Precept explicit: “Process the information in the Payload in the intended workflow.” Task absence SHALL NOT change the TX5 transaction identity or required document processing.

When included, the Workflow Activity Task SHALL be a separate information object from the primary document. It identifies the requested processing activity and its applicable Context and reporting instructions. For a referral or document-request response, the relevant clinical document and established Context convey the workflow meaning whether or not a Task is present.

| **Task concept**                           | **TX5 requirement**                                                                                                                                                                                    |
|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Task.code                                  | C (when Task included). DTCodeSystem code send-documents.                                                                                                                                              |
| Task action precept                        | C (when Task included). Process the information in the Payload in the intended workflow.                                                                                                               |
| Task identifier / SubmissionSet.uniqueId   | C (when Task included). Task.identifier matches the SubmissionSet business identifier; SubmissionSet identity exists independently.                                                                    |
| Task.for                                   | Patient identity when applicable and known; consistent with the CDA and package.                                                                                                                       |
| Context                                    | Applicable Context Instance Identifiers of any supported type, when known and authorized.                                                                                                              |
| Transaction correlation                    | Identify any related request or earlier transaction required to interpret this activity, separately from its own identifier.                                                                           |
| Whole-payload acceptance reporting request | C (when Task included). Applicable reporting instructions do not create universal TX8 capability or reporting obligations.                                                                             |
| Workflow Status Update Endpoint(s)         | C (when Task included and TX8 reporting applies). Use eligible Task-carried destinations. With no Task, only the Directory-CapabilityStatement-qualified MDN address is eligible when TX8 is required. |

#### Workflow Activity Identification

SubmissionSet.uniqueId SHALL identify the logical TX5 Transaction Instance independently of Task presence. When a Task is present, its designated Task.identifier SHALL identify the same logical activity. The CDA document instance identifier SHALL remain distinct from the Transaction Instance identifier. A later referral update or response has its own transaction identity even when it references the same established referral Context.

#### Context Instance Association

Carry applicable Context Instance Identifiers when known and authorized, including referral, order, request, perinatal, encounter, and other supported context types. Preserve the relevant identifiers when responding within or updating an existing Context. Do not substitute a Context identifier for patient identity. The Content Consumer SHALL gather and maintain all Context Instance Identifiers supplied in the SubmissionSet referenceIdList, preserving each identifier’s value, assigning authority, and context type. It SHALL use those identifiers to associate the received information with the applicable contexts and SHALL carry the relevant identifiers in subsequent information exchanges concerning those same contexts. This applies to referrals, orders, requests, and any other supplied Context type; a context type code alone does not identify a Context Instance.

#### Transaction Correlation

Apply Chapter 3 correlation requirements. Distinguish the current TX5 Transaction Instance, the primary CDA document instance, the established workflow Context, and any originating request or previous transaction. A responding TX8 SHALL correlate to this TX5 Transaction Instance. A referral update is a new transaction in the same clinical workflow, not another delivery of the initiating transaction.

#### Workflow Status Instructions

When a Workflow Activity Task is present, its applicable workflow-status instructions SHALL be distinguished from transport-level disposition routing. Disposition-Notification-To identifies the Direct Message Delivery Notification address and SHALL NOT by itself establish TX8 receiving capability. TX8 support and any reporting obligation are conditional under Chapter 3, Chapter 4, and the TX8 Transaction Definition.

When TX8 reporting is required and the originating Task is present, apply its workflow-status routing instructions, preserve applicable accumulated report destinations, deduplicate identical Direct addresses, and verify each destination’s TX8 Receiver capability using its Directory-discoverable CapabilityStatement. When the originating Task is absent, the Direct address established for Message Delivery Notifications is the sole eligible TX8 destination, and only if its Directory-discoverable CapabilityStatement declares send-workflow-status supportsReceive=true. SERV_DESC does not independently establish that capability. If no eligible destination is resolved, record the unsuccessful TX8 reporting obligation and SHALL NOT dispatch TX8. Failure to dispatch TX8 SHALL NOT, by itself, change the originating TX5 processing outcome. Successful whole-package reporting is conditional; defined reportable failures follow the applicable Chapter 3 and TX8 requirements.

The originating Transaction context concludes when the authorized Receiver Actor determines acceptance or rejection of the entire structured payload. When required or otherwise permitted, TX8 is a separate, subsequent transaction communicating that disposition. If a correlated TX8 is expected but does not arrive within the Chapter 3 reporting interval, the originating system SHALL close its tracking context as outcome unconfirmed and requiring follow-up; timeout does not establish acceptance, rejection, or non-receipt. A late TX8 resolves the original unconfirmed outcome while preserving timeout and follow-up history and does not create a new originating transaction.

When a TX8 report is sent, it SHALL carry an accept or reject Provenance assertion for the entire originating SubmissionSet/List, identified by its preserved business identifier and matched to the carried minimal identification snapshot under Chapter 3 and the TX8 definition. Provenance.agent.type SHALL carry performer from http://terminology.hl7.org/CodeSystem/provenance-participant-type. Provenance.agent.who SHALL identify the receiving Organization associated with the endpoint that received TX5 and responsible for determining its disposition, rather than the Endpoint resource itself.

The Content Creator MAY establish Task-carried Workflow Status Update Endpoints when a Task is present, using authorized configuration and Directory-discoverable CapabilityStatement information. When Task is absent, it SHALL NOT invent or reconstruct one merely to enable TX8. Eligibility of the no-Task Message Delivery Notification fallback is established only by the destination’s Directory-discoverable CapabilityStatement.

### Human-Readable Content

The human-readable communication SHALL adequately describe the requested Workflow Activity and the information included in the package. It summarizes key document metadata and workflow meaning; it need not reproduce the complete CDA narrative. The CDA’s own human-readable content remains part of the clinical document and SHALL remain available through applicable document-rendering capabilities.

| **Information to surface**                   | **TX5 human-readable coverage**                                                                                                                                                                                                                     |
|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Requested activity                           | Identify send-documents, the requested processing action, and whether the communication is unsolicited, a response to a request, referral initiation, or an update. Include the current SubmissionSet business identifier.                          |
| Patient                                      | Patient name, date of birth, administrative sex, identifiers and assigning authorities, and relevant available demographics supporting recognition or matching.                                                                                     |
| Primary document identity and classification | Document title and type, document instance identifier, CDA format/template identification when available, media type, and the document’s role as the primary artifact.                                                                              |
| Document and service timing                  | Document effective time and applicable encounter/service period. Identify authoring or authentication times separately when supplied; do not equate them automatically with the clinical effective time.                                            |
| Author, source, and recipient                | Clinical author and represented organization, responsible Information Source and intended recipient, and relevant custodian/authentication information when supplied. Preserve clinical-source and transport-role distinctions.                     |
| Context and relationships                    | Applicable Context Instance Identifiers of any supplied supported type; related request, document, or transaction identifiers needed to interpret the exchange.                                                                                     |
| Confidentiality and document state           | Available confidentiality label and clinically relevant document version or preliminary/completed state supported by the document and its applicable profile. Do not invent status from absence of a signature.                                     |
| Secondary objects                            | SHOULD identify each secondary object by title/description and media type, with enough explanation to show how it supports the activity. For secondary CDA documents, summarize key metadata rather than repeating their full narrative.            |
| Workflow Status instructions                 | When applicable, state whether successful whole-package reporting is requested and identify eligible TX8 destinations. Distinguish Task-present routing from the Directory-qualified no-Task MDN fallback and from transport disposition reporting. |
| Optional Provenance Collection Bundle        | When included, SHOULD summarize activity, responsible actor/organization, time, and affected object or transaction. Distinguish clinical authorship, package assembly, sending, receipt, and subsequent clinical activities.                        |

Required coverage SHALL be surfaced when present in the CDA, package metadata, or Workflow Activity Task; unavailable values SHALL NOT be invented. Plain text MAY use labeled lines or a simple table. An optional HTML view MAY use the document-metadata rendering stylesheet. The human-readable package communication and any full CDA rendering serve different purposes.

### Provenance Requirements

Initiating Provenance is OPTIONAL. When supplied, each independently attributable Provenance information object SHALL be a FHIR Collection Bundle containing its assertions and required supporting agents, classified DT-20261011-1, Provenance Information, from DTTemporaryCodeCS. Apply Chapter 3 Section 3.10 and Appendix D for activities, participation types, targets, and resolution. No additional initiating assertion is required by this definition. When TX8 is sent, it SHALL carry whole-package accept or reject Provenance, with coded performer identifying the receiving Organization responsible for the disposition.

### Direct Message and Transport Requirements

Final Destination is intentionally implementation-dependent. Depending on the receiving architecture and edge protocol, successful delivery may be established through SMTP, an IMAP/mailbox arrangement, XDR, a custom API, or another supported receiving interface. A successful Final Destination Delivery Notification does not establish that the Payload was parsed, matched, routed, accepted, or delivered into its intended business workflow.

Apply Chapter 3 Sections 3.8.1–3.8.5 for message headers, representation identification, XD edge transport, common MIME packaging, and delivery notifications. The XD Subject convention SHALL NOT be used for the FHIR metadata option. SubmissionSet.purpose carries transaction identity independently of an optional Task. When Task is present, it carries applicable successful-reporting instructions; obsolete x-direct-transaction and x-direct-workflow-status-requested headers SHALL NOT be used.

## XD Metadata Guidance — HOW

XD is the fully specified representation of Payload Metadata for this transaction. The requirements in this section define the package-level and payload-object metadata semantics used as the source requirements for alternative metadata representations.

The following tables specialize common Chapter 3 semantics for CDA document exchange. CDA bindings depend on the applicable document profile and available authoritative source data; do not manufacture clinical classifications or metadata. IHE PCC Medical Document Binding guidance is a supporting mapping reference: https://wiki.ihe.net/index.php/PCC_TF-2/Bindings .

### SubmissionSet

| **Conf.** | **Metadata element** | **Value / source**                                                             | **TX5 guidance**                                                                                                            |
|-----------|----------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| R         | uniqueId             | TX5 SubmissionSet business identifier                                          | Identifies the logical TX5 Transaction Instance independently of Task; when Task is present, its identifier matches.        |
| R         | availabilityStatus   | urn:oasis:names:tc:ebxml-regrep:StatusType:Approved                            | Apply the base XD representation.                                                                                           |
| R         | submissionTime       | System-generated submission time                                               | Package submission time, distinct from CDA clinical effective time.                                                         |
| R         | intendedRecipient    | Intended Information Recipient identity, distinct from the Routing Target      | Apply Chapter 3 recipient and transport semantics.                                                                          |
| RE/R2     | patientId            | Identifier appropriate to the Information Recipient or agreed exchange domain  | Populate only when known. Do not substitute a sender-local CDA identifier.                                                  |
| R         | Patient Info         | Patient demographics using DocumentEntry.sourcePatientInfo representation      | Required for a single-patient SubmissionSet, even when patientId is known; derive from authoritative CDA patient data.      |
| R         | author               | Organization initiating the Shared Activity, optionally a person acting for it | Distinguish from CDA clinical author; include Direct telecom when applicable.                                               |
| R         | sourceId             | Established Organization Identity OID of the SubmissionSet Source              | Identify the contributing source; reuse Task.requester organization identity only when the roles coincide.                  |
| R         | purpose              | send-documents                                                                 | Required DTCodeSystem send-documents independently of Task. If Task is included, Task.code matches in code and code system. |
| RE/R2     | contentTypeCode      | Primary DocumentEntry.typeCode                                                 | Identify package content, not the transaction code.                                                                         |
| O         | title                | Title describing the document package                                          | Reflect the primary document and relevant package purpose; no fixed discharge-notification title.                           |
| O         | description          | Concise package description                                                    | Describe the primary document and relevant supporting objects.                                                              |
| O         | referenceIdList      | Applicable established Context Instance identifiers                            | Perinatal, Visit, Request, and referral Context when known and applicable; use current Chapter 3 representation.            |
| O         | limitedMetadata      | As permitted by the base profile                                               | No additional TX5 fixed value.                                                                                              |
| R         | entryUUID            | System-assigned registry object UUID                                           | Identifies this SubmissionSet registry object.                                                                              |
| O         | slot/@name           | Permitted extension content                                                    | List contained object UUIDs only when permitted by the selected packaging approach.                                         |

MAP package-level extensions used by TX5 include purpose, Patient Info, and applicable Context identifiers as defined in Chapter 3. Sender-local patient identity belongs in DocumentEntry.sourcePatientId; it SHALL NOT be placed in SubmissionSet.patientId or another package field solely to fill an unavailable recipient identifier.

The SubmissionSet SHALL have exactly one author identifying the Organization initiating the requested Shared Activity, optionally identifying a person acting for that Organization. This package authorship is distinct from the contributing Organization identified by sourceId and from the authors of submitted artifacts. The Content Creator SHALL isolate the package author; clinical artifact authors SHALL be preserved.

### Workflow Activity Task DocumentEntry

When a Workflow Activity Task is included, carry its separate DocumentEntry using application/fhir+xml or application/fhir+json as selected for the package. No Task DocumentEntry is present when Task is absent. Apply Chapter 3 resource classification and metadata rules. The Task DocumentEntry remains separate from the primary CDA DocumentEntry.

### Primary DocumentEntry

The Primary DocumentEntry SHALL contain the designated primary document. Its document specification determines content, classification, and format, while send-documents remains the transaction identity. The following table provides the CDA-specific mapping when the primary document is CDA. Other document representations use their applicable mappings under Chapter 3.

For CDA documents, DocumentEntry.creationTime SHOULD use the time of the version-appropriate Assembler or Composer participant identifying creation of the exchanged representation. If that participant or its time is absent, ClinicalDocument/effectiveTime SHALL supply the fallback when available. Do not invent a missing time or replace it with transaction time. Preserve ClinicalDocument/effectiveTime and its source meaning in the document. Encounter start and completion SHALL map separately to serviceStartTime and serviceStopTime when supplied. This MAP population rule explicitly qualifies the usual ClinicalDocument/effectiveTime-to-creationTime crosswalk; the derivation SHALL identify which source was used.

| **Conf.** | **Metadata element**       | **Value / source**                                                           | **TX5 guidance**                                                                                                                       |
|-----------|----------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| R         | entryUUID                  | System-assigned registry identifier                                          | Distinct from document and workflow identifiers.                                                                                       |
| R/X       | URI                        | Package-local document location                                              | Apply the selected XDM option.                                                                                                         |
| R         | uniqueId                   | CDA ClinicalDocument/id                                                      | Preserve document instance identity using the applicable XD identifier encoding.                                                       |
| R         | mimeType                   | application/cda+xml                                                          | Registered CDA media type; preserve original CDA XML bytes.                                                                            |
| RE/R2     | formatCode                 | Applicable CDA content-profile format code                                   | Use the declared profile/template binding; no V2 notification format code.                                                             |
| RE/R2     | languageCode               | CDA ClinicalDocument/languageCode                                            | Document language when available.                                                                                                      |
| RE/R2     | classCode                  | Clinical document class                                                      | Derive an appropriate classification consistent with the document; never send-documents.                                               |
| R         | typeCode                   | CDA ClinicalDocument/code                                                    | Actual clinical document type, using the applicable terminology mapping.                                                               |
| O         | title                      | CDA ClinicalDocument/title                                                   | Preserve the individual document title; it need not equal the package title.                                                           |
| O         | referenceIdList            | Applicable document Context identifiers                                      | May be a narrower subset of package Context.                                                                                           |
| RE/R2     | patientId                  | Recipient-appropriate or agreed-domain identity                              | Apply the same patient-identity strategy as the SubmissionSet.                                                                         |
| RE/R2     | sourcePatientId            | CDA recordTarget/patientRole/id                                              | Preserve the source clinical patient identity with assigning authority.                                                                |
| RE/R2     | sourcePatientInfo          | CDA recordTarget/patientRole demographics                                    | Patient name, birth date, sex, address, and identifiers as available.                                                                  |
| RE/R2     | creationTime               | CDA Assembler/time or Composer/time; ClinicalDocument/effectiveTime fallback | Use Chapter 3 Section 3.6.4. Preserve the source instant and identify which timestamp supplied it; keep encounter boundaries separate. |
| RE/R2     | author                     | CDA clinical author(s) and represented organization(s)                       | Do not replace clinical authorship with the sender or treating-facility shortcut.                                                      |
| R         | author.role                | Applicable mapped author participation role                                  | Use available authoritative role data and Chapter 3 semantics; no fixed TF role for all CDA documents.                                 |
| O         | author.specialty           | Available authoritative author/provider classification                       | Apply current Chapter 3 role-versus-specialty distinctions; do not invent a specialty.                                                 |
| O         | serviceStartTime           | CDA documentationOf/serviceEvent effective-time start                        | Use the applicable profile binding and supplied period.                                                                                |
| O         | serviceStopTime            | CDA documentationOf/serviceEvent effective-time end                          | Populate when supplied and applicable.                                                                                                 |
| RE/R2     | practiceSettingCode        | Authoritative clinical practice-setting classification                       | Consistent with document content and Chapter 3 terminology semantics.                                                                  |
| RE/R2     | confidentialityCode        | CDA ClinicalDocument/confidentialityCode                                     | Preserve the applicable classification and authorized handling.                                                                        |
| RE/R2     | healthcareFacilityTypeCode | Authoritative facility/setting classification                                | Use the applicable content-profile binding and available source data.                                                                  |
| O         | limitedMetadata            | As permitted by the base profile                                             | No additional TX5 fixed value.                                                                                                         |
| R         | objectType                 | urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1                                | Apply the XD registry object representation.                                                                                           |
| O         | Slot/@name                 | Permitted extensions                                                         | Use only base-profile or Chapter 3 permitted extensions.                                                                               |
| R/O       | hash                       | Calculated hash of the document bytes                                        | Apply the selected base-profile option.                                                                                                |
| R/O       | size                       | Document size in bytes                                                       | Apply the selected base-profile option.                                                                                                |
| R         | sourceId                   | TX5 SubmissionSet Source identity                                            | Apply Chapter 3’s source identity semantics independently of CDA clinical author.                                                      |

ClinicalDocument/id identifies the document instance. Where setId, versionNumber, or relatedDocument information is available, preserve its meaning when identifying versions or relationships; it is not a substitute for the current document instance identifier. A package title, source, or recipient may differ from the corresponding clinical document information without changing the document’s authorship or identity.

### Provenance DocumentEntry(s)

Provenance is OPTIONAL in the initiating TX5 package. Implementers are not required to generate the illustrative records described below. When Provenance is supplied, carry independently attributable assertions in a Provenance Collection Bundle using Chapter 3 and Appendix D packaging and target-resolution rules. Classify the Bundle using DT-20261011-1, Provenance Information, from DTTemporaryCodeCS. CDA header authorship and authentication remain document provenance; additional FHIR Provenance does not replace the CDA header.

The following examples illustrate possible Provenance records and do not create additional obligations. Include an assertion only when the activity and attribution are supported. A Content Creator transmitting existing documents does not become their clinical Author.

| Possible activity | Target                              | Possible agent participation                            | Illustrative use                                                                                                  |
|-------------------|-------------------------------------|---------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Create            | Individual document                 | Author                                                  | Supported original authorship, such as the clinician’s referral or the patient’s personal Birth Plan.             |
| Sign              | Individual signed document          | Applicable signing participation type                   | Supported signing event; preserve existing authentication information.                                            |
| Assemble          | Generated document representation   | Assembler                                               | Generation of a shareable representation from an existing clinical record, preserving the clinical snapshot.      |
| Transform         | Transformed document representation | Transformer                                             | An actual supported transformation, rather than packaging alone.                                                  |
| Assemble          | TX5 SubmissionSet/List              | Applicable participation type for the assembling system | Assembly of documents, Task, and accompanying objects into the structured payload.                                |
| Transmit          | TX5 structured payload              | Performer                                               | An actual transmission event known at Provenance finalization; do not assert a planned transmission as completed. |

Activities occurring after outgoing payload finalization cannot be inserted retrospectively into that transmitted TX5. The receiver may maintain additional processing Provenance locally and share it through an applicable subsequent exchange. The TX8 accept or reject assertion, when reported, remains separate from these optional initiating assertions.

### Human-Readable DocumentEntry

Apply Section 2.3 coverage and Chapter 3 preservation requirements. Include the identical TXT communication and every supplied HTML alternative from MIME Part 1. Classify these as human-readable communication objects rather than as the primary CDA’s clinical document type.

### Secondary Data DocumentEntry(s)

Additional CDA documents and other supporting objects MAY accompany the primary document when they support the same requested activity. Each SHALL retain its own identity, title, media type, classification, source, and applicable Context metadata. Apply the CDA guidance in Section 3.3 to each secondary CDA document and the relevant representation requirements to other object types. Secondary status in the package does not diminish a document’s clinical meaning or authorship.

Each secondary information object SHALL have a populated DocumentEntry.typeCode and coding system appropriate to its classification. Clinical documents use an applicable standard document type code, such as LOINC Document Ontology, or an explicitly assigned DirectTrust temporary code where no suitable standard code has been established. Non-document information objects use the applicable Chapter 3 resource or information-object classification. A filename, title, media type, or secondary designation does not substitute for classification.

## FHIR Metadata Guidance — HOW

When FHIR is used to represent Payload Metadata, implementers SHALL apply the same metadata requirements, coding, and semantics specified in the XD Metadata Guidance, using Appendix D — FHIR Collection Bundle Packaging. SubmissionSet metadata is represented in a FHIR List Resource, and corresponding XD DocumentEntry metadata is represented in FHIR DocumentReference Resources referenced by the List. This is an alternative representation of the same Payload Metadata, not a different metadata model.

### SubmissionSet Representation

Apply the common mapping to Section 3.1 package semantics. The current SubmissionSet List SHALL conform to the MAP SubmissionSet List profile (http://objects.directtrust.org/standards/fhir/StructureDefinition/map-submissionset-list) and carry its required purpose extension identifying send-documents. Preserve content classification, patient matching data, source, intended recipient, identifiers, and Context independently of optional Task presence. When a Task is included, Task.code SHALL match SubmissionSet.purpose in code and code system.

Apply Appendix D: List.source uses a permitted FHIR R4 target, with ihe-authorOrg on List.source identifying the initiating author Organization; Organization is not a direct List.source target. ihe-sourceId identifies the current contributing Organization. dt-intendedRecipient identifies the same intended party as the Task recipient; a transport Endpoint SHALL NOT replace that party’s identity.

### Workflow Activity Task

When a Workflow Activity Task is included, carry it separately from the primary CDA and apply Section 2.2 and Chapter 3 to its identifier, requested activity, patient, Context, correlation, and applicable Workflow Status instructions. No Task is required when the originating TX5 package omits it.

### Primary Payload Representation

Selecting FHIR metadata does not convert the submitted clinical documents into FHIR clinical document resources. Preserve each document’s bytes and represent its metadata through the common DocumentReference mapping. Section 3.3 provides the CDA mapping when CDA is exchanged; other representations follow their applicable bindings.

### Provenance Collection Bundle(s)

Apply Section 3.4 and Chapter 3 to each optional Provenance Collection Bundle. Assertions and their supporting resources are entries of that carrying Bundle; they do not become peer entries of the outer metadata Bundle merely through nesting. Preserve independent attribution and the applicable carried-target resolution rules.

### Human-Readable Content

Preserve Sections 2.1, 2.3, and 3.5 content coverage and identical human-readable copies using the common FHIR metadata representation.

### Secondary Data Resource(s)

Represent each secondary object and its metadata using the common mapping. A secondary CDA document remains CDA; identify its own title, document type, patient, Context, and media type. Each secondary object’s DocumentReference.type SHALL carry the same required document type coding specified in Section 3.6, including its coding system.

## Context IG Guidance

Apply the Context Instance identification, preservation, and correlation requirements in Chapter 3 and Sections 2.2.2 and 7 of this definition.

## Technical Actor Functional Requirements — WHO DOES WHAT

The Content Creator, Message Sender, Message Receiver, and Content Consumer perform the following functions to assemble, exchange, and process TX5. Acceptance depends on patient resolution and association of all included documents with the resolved chart.

### Sender Actor

The Sender Actor combines Content Creator and Message Sender functions. It creates and preserves the information objects, metadata, Context identifiers, optional Task and applicable Provenance, then packages and transmits the message.

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 19%" />
<col style="width: 59%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Actor</strong></th>
<th><strong>Requirement category</strong></th>
<th><strong>Normative requirement</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Content Creator</td>
<td>Payload creation</td>
<td>SHALL assemble the primary document and accompanying information objects, an optional separate Workflow Activity Task, metadata, and human-readable communication. Preserve existing documents and their clinical authorship; creating an exchange package does not require authoring a new clinical document.</td>
</tr>
<tr class="even">
<td>Content Creator</td>
<td>Preservation of the clinical snapshot and assembly time</td>
<td><p>When generating or assembling a document retrospectively or on demand, the Content Creator SHALL preserve the information applicable to the clinical encounter, event, or period being documented. Later observations SHALL NOT replace values applicable to that snapshot. Later corrections or additions, when included, SHALL be clearly identified and retain their applicable timestamps.</p>
<p>When releasing an existing document from an EHR’s internal representation into CDA, the Content Creator SHALL preserve the original document’s effective time and clinical snapshot. The Assembler participant’s time SHALL identify when the CDA representation was assembled. When transmitting an existing CDA document without transformation, the Content Creator SHALL preserve its recorded document and assembly times.</p>
<p>Apply Chapter 3 Section 3.6.4, Clinical Snapshot and Document Assembly Time.</p></td>
</tr>
</tbody>
</table>

| **Actor**      | **Requirement category** | **Normative requirement**                                                                                                                                                 |
|----------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Message Sender | Transmission             | SHALL package and transmit using Chapter 3 and TX5 requirements, preserving source content and, when a Task is present, applicable accumulated Workflow Status endpoints. |

### Receiver Actor

The Receiver Actor combines Message Receiver and Content Consumer functions. It validates receipt, resolves required patient and Context associations, determines whole-package disposition, and applies TX8 reporting only when required under Chapter 3 and the applicable transaction rules.

| **Actor**        | **Requirement category** | **Normative requirement**                                                                                   |
|------------------|--------------------------|-------------------------------------------------------------------------------------------------------------|
| Message Receiver | Receipt                  | SHALL receive and validate the message and make the Payload and metadata available to the Content Consumer. |

| **Actor**             | **Requirement category** | **Normative requirement**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Content Consumer      | Processing               | The Content Consumer SHALL resolve the patient under the receiving endpoint’s declared patient-resolution policy and associate all documents included in the structured payload with that patient’s chart before accepting the payload. The declared policy MAY permit establishing a new patient chart when no sufficiently confident match to an existing chart is available, subject to applicable use-case requirements. If the patient cannot be resolved under that policy, or any included document cannot be associated with the resolved chart, the entire payload SHALL be rejected. No partial acceptance is reported. The Content Consumer SHALL gather and maintain all Context Instance Identifiers supplied in the SubmissionSet referenceIdList, preserving each identifier’s value, assigning authority, and context type. It SHALL use those identifiers to associate the received information with the applicable contexts and SHALL carry the relevant identifiers in subsequent information exchanges concerning those same contexts. This applies to referrals, orders, requests, and any other supplied Context type; a context type code alone does not identify a Context Instance. |
| Information Recipient | Workflow Status          | SHALL determine terminal processing outcome and apply Chapter 3/TX8 conditional reporting. Successful reporting is required only when applicable; defined reportable failures follow the applicable reporting rules. If no eligible TX8 destination exists, record unsuccessful reporting without dispatch; that failure does not change the TX5 processing outcome.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Transaction-Specific Processing — WHAT IS SPECIAL

When a received transaction results in a defined terminal failure requiring TX8, apply the Extensible binding to MAPFailureReasonVS (http://objects.directtrust.org/standards/fhir/ValueSet/map-failure-reason) specified in Chapter 3 Section 3.9.2. Use a shared applicable code with an explanation; optional missing information does not alone establish rejection. Local filtering or preparation failures before this transaction is issued SHALL NOT be reported as rejection of a nonexistent transaction.

### CDA Processing and Supporting Documents

Apply common anomaly handling in Chapter 3 Section 3.9.6 and TX8. A CDA defect, unsupported required document profile, missing required primary document, or unresolved metadata/content inconsistency is reportable when it prevents the requested processing and results in a defined terminal failure. Determine processing against declared capabilities and the applicable content specification; the absence of optional CDA entries or optional metadata alone SHALL NOT establish rejection.

Evaluate all included documents as one requested workflow unit. A document may be optional to include, but once included it SHALL be associated with the resolved patient’s chart before whole-package acceptance. A defect that prevents association of any included document prevents acceptance of the entire payload. Explain the affected object when known. Missing optional objects that were not included do not by themselves cause rejection.

### Unsolicited Communication and Solicited Response

An unsolicited TX5 communicates documents for an authorized receiving workflow without requiring a prior request. A solicited response SHALL preserve the relevant established Context Instance Identifiers and necessary originating-request correlation. In both cases, acceptance requires the patient resolution and document-to-chart association specified in Section 6.4. Additional processing associated with a supplied Context MAY occur after TX5 concludes. This guide specifies no particular expectations for that further processing unless expressly stated for the applicable use case. Subsequent exchanges have their own Transaction Instance and workflow-unit business identities while retaining the relevant Context Instance Identifiers. Acceptance of a document package does not establish fulfillment or closure of a referral, order, request, or other continuing Context.

### Continuing Contexts and Subsequent Exchanges

TX5 MAY initiate a referral or communicate documents associated with an existing referral, order, request, or other Context. Each exchange has its own SubmissionSet business identifier and Transaction Instance, with zero or one Workflow Activity Task. Preserve applicable Context Instance Identifiers and relevant prior-activity correlation. The documents and accompanying context information convey whether the exchange initiates or updates a continuing workflow.

A closed-loop referral pattern may use subsequent transactions to communicate clinical decisions, progress, or outcomes. Additional processing associated with a supplied Context MAY occur after TX5 concludes; this guide specifies no particular expectations for it unless expressly stated for the applicable use case. Subsequent exchanges have their own Transaction Instance identities while retaining the relevant Context Instance Identifiers. Acceptance of a document package does not establish fulfillment or closure of a referral, order, request, or other continuing Context. When TX8 reporting applies, it communicates only acceptance or rejection of the individual TX5 exchange.

## Relevant Examples — SHOW ME

These standalone narrative illustrations explain CDA document exchange independently of any complete sample package. XD and FHIR metadata preserve the same CDA documents and workflow semantics. TX8 Section 8 illustrates common successful processing and rejection.

### Unsolicited Pregnancy Document Communication

A prenatal practice sends a Pregnancy Notification and Risk Assessment CDA as the primary artifact, or sends the corresponding Pregnancy Notification or Pregnancy Risk Assessment document appropriate to the activity. SubmissionSet.purpose identifies send-documents independently of whether a Task is included. Applicable Perinatal Context and human-readable document metadata identify what was sent and why; no prior document request is required. When TX8 reporting is required, apply Task-present routing or the Directory-qualified no-Task fallback.

### Response to a Solicited Document Request

A recipient requests an antepartum document for an established workflow. The responding organization sends that CDA as the primary document in a new TX5 Transaction Instance, with an optional Workflow Activity Task, preserving applicable established Request and Perinatal Context and correlation to the request. The requesting organization can associate the response without confusing the request identifier with the CDA document identifier or current TX5 SubmissionSet business identifier.

### Birth Order Referral with a Supporting Birth Plan

A prenatal practice initiates a Birth Order Referral to a birth facility. The Birth Order CDA is the primary information artifact; the mother’s Birth Plan is a secondary document supporting the same activity. The package may contain one separate Workflow Activity Task, metadata for both documents, and the required human-readable communication. The communication explains the referral request, identifies the Birth Order and Birth Plan with their titles and media types, and surfaces the applicable patient and established referral/request Context.

The receiving endpoint resolves the patient under its declared policy and associates both the Birth Order Referral and Birth Plan with the resolved chart before accepting the package. If resolution fails under that policy, the whole package is rejected with patient-not-found. If either document cannot be associated with the chart, the package is rejected with an applicable failure reason. When TX8 reporting is required, the returning TX8 SHALL carry an accept or reject Provenance assertion for the entire originating SubmissionSet/List, identified by its preserved business identifier and matched to the carried minimal identification snapshot under Chapter 3 and the TX8 definition. Provenance.agent.type SHALL carry performer from http://terminology.hl7.org/CodeSystem/provenance-participant-type. Provenance.agent.who SHALL identify the receiving Organization associated with the endpoint that received TX5 and responsible for determining its disposition, rather than the Endpoint resource itself. Further referral processing MAY occur, but this guide currently specifies no particular expectations for it. Subsequent exchanges concerning the referral SHALL carry its Referral Context Instance Identifier.

### Document Updates within Continuing Contexts

A subsequent organization sends an applicable update or outcome document in a new TX5, preserving the relevant established Context Instance Identifiers and prior-activity correlation. This applies to referrals, orders, requests, and other contexts. Each TX5 has its own whole-package processing disposition, with TX8 reporting only when applicable. Continuing workflow progress or closure is expressed through the exchanged information, not inferred from transport delivery or TX8 acceptance.

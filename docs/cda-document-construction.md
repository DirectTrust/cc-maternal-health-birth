---
title: 3. CDA Document Construction
---

# 3. CDA Document Construction

## 3.1 Start by Defining the Header Story

Before constructing or revising a CDA document, determine what information collection the document represents and what story the header must tell. Identify the document Species, Genus, Family, Information Collection Scope, responsible Information Source, authoring role, custodian, relevant Context Instances, clinical temporal anchor, lifecycle state, and any derivation relationship.

## 3.2 Authorship, Custody, Authentication, and Provenance

Do not use a technical transformation step to overwrite the provenance of the clinical information. CDA author, custodian, authenticator, legalAuthenticator, serviceEvent performers, and other participants should be populated according to the role each participant actually played. A system or Intermediary that transforms or assembles an artifact may need to be represented in transformation or device provenance without being misrepresented as the original clinical author or authenticator.

### 3.2.1 Authentication Participation

For this guidance, authenticator is the default CDA participation used to record a documented human authentication or signature act. A document may carry multiple authenticator participations when multiple people independently attest to it. Do not populate an authenticator merely because a person authored content, reviewed information without authenticating it, or because a system assembled, transformed, transmitted, or stored the document.

### 3.2.2 Legal Authenticator Is a Profile-Driven Exception

Do not infer legalAuthenticator merely because a document has been electronically or digitally signed. Use legalAuthenticator only when an applicable document-family specification, jurisdictional requirement, payer or program rule, organizational policy, or other governing requirement explicitly calls for the legally authenticating participant to be represented using that CDA participation. A more specific governing rule takes precedence over this default convention.

### 3.2.3 Authentication Role Is Separate from Signature Technology

Authentication identifies an attestation act. Digital signature provides technical assurance. Legal significance is determined by governing policy. An electronic signature and a cryptographic digital signature performed as part of the same authentication act should not be represented as two separate authentication events merely because two technologies are involved. When a later authorized person or service applies a cryptographic signature or provenance seal before exchange, preserve the earlier clinical authentication and represent the later assurance activity according to the applicable digital-signature or provenance mechanism.

### 3.2.4 Preserve Authentication Through Assembly and Transformation

Assembly or transformation does not reattribute authentication. When a signed source form or other authenticated artifact is converted into CDA, preserve the identity of the person who performed the source authentication when that authentication is carried forward. The EHR, device, service, or Intermediary performing the conversion is represented through the appropriate assembler, device, transformation, or other provenance participation; it does not become an authenticator solely because it generated the CDA representation.

## 3.3 Encounter-Bound Versus Longitudinal Documents

For an Encounter Summary, componentOf/encompassingEncounter identifies the encounter that supplies the clinical context and temporal anchor. For an Episode of Care or Longitudinal Summary, do not invent an episode-wide encompassingEncounter. Represent the established longitudinal Context Instance using the applicable context mechanism and use ClinicalDocument/effectiveTime as the clinically meaningful snapshot point represented by that document version. A one-visit Episode of Care remains episode-scoped when the explicitly established Episode Context, rather than the encounter alone, defines the boundaries of the information collection.

## 3.4 Clinical Time and Lifecycle Time

ClinicalDocument/effectiveTime represents clinically relevant time, not merely the time a file was generated, signed, transmitted, or stored. Authoring and authentication times should represent those lifecycle activities. Avoid using one timestamp to stand in for multiple different provenance activities.

## 3.5 Logical Document Identity and Versioning

Repeated versions of the same logical document retain the same setId, receive a new ClinicalDocument/id for each document instance, and advance versionNumber according to the document lifecycle rules. A derived XFRM sub-set document is not a new version of its source document; it receives its own logical-document identity and version lineage.

## 3.6 XFRM Sub-Set Derivation

When materializing a meaningful sub-set for independent exchange, assign a new ClinicalDocument/id and a new setId for the derived logical document. Record the source-to-derived relationship using the applicable XFRM relatedDocument relationship. Re-evaluate the derived document's Species, Genus, Family, author, custodian, authentication, serviceEvent, encounter context, Context Instances, clinical temporal anchor, and human-readable narrative according to the derived information collection's own semantics. Authentication should not be copied mechanically from the source. Determine whether a source authentication is being preserved as provenance, whether the derived document has been newly authenticated, or both, and represent each act according to its actual meaning.

## 3.7 Source Form and Progressive Structuring

A Minimally Structured Document should preserve the available human-readable Source Form Document so that limitations in structured-data maturity do not block accurate information exchange. The structured body can be progressively enriched while the source representation preserves the information story available to the sender. Structured-data quality should be treated as a measurable attribute of the document's declared Genus rather than as a prerequisite for exchange.

## 3.8 Template Assertions

Assert document-level and section/entry templates only when the artifact actually conforms to their requirements. Template assertions communicate structural expectations; they should not be used merely as labels. When a derived document changes scope or Species, re-evaluate the applicable template assertions rather than copying them mechanically from the source.

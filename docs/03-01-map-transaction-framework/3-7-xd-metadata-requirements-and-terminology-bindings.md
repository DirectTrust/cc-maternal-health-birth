---
title: "3.7 XD Metadata Requirements and Terminology Bindings"
---

# 3.7 XD Metadata Requirements and Terminology Bindings

MAP uses standard XD/XDS SubmissionSet metadata and intentionally adds package-level information where an authorized receiver or intermediary needs it to identify, correlate, route, patient-match, or safely process a workflow unit without first opening an arbitrary clinical information object. When all DocumentEntries in a SubmissionSet pertain to a single patient, MAP requires package-level Patient Info as defined below. Every MAP-added SubmissionSet Slot used by a Transaction SHALL be explicitly called out in that Transaction Definition.

## Inventory Scope and Conformance

These inventories cover every standard IHE SubmissionSet and DocumentEntry attribute, author subfields, and the MAP additions defined here. They apply to Direct/XDM file packaging; other XD transactions retain their own profile-specific requirements. R = required; RE = required when known/available (IHE R2); O = optional; C = required under the stated condition. Cardinalities are populated occurrences; conditional fields become mandatory when the row condition applies. A Transaction Definition may strengthen these requirements and specifies their application to Task, primary, Provenance, human-readable, and secondary objects.

The inventories describe metadata attributes, not arbitrary XML infrastructure properties or unrestricted local extensions. Author subfield cardinalities apply per author. sourcePatientInfo has one package-level demographic set encoded as multiple Slot values; DocumentEntry lists its individual demographic field values. XD patientId is a single identifier in the selected recipient/exchange domain; additional source identifiers belong in the promoted MAP sourcePatientId Slot.

Source references: IHE ITI TF Volume 3, Tables 4.2.3.2-1 and 4.2.3.3-1 (field definitions), Table 4.3.1-3 (XDM optionality), and Section 4.2.3.1.6 (extra metadata). https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html and https://profiles.ihe.net/ITI/TF/Volume3/ch-4.3.html. RE expresses the required-if-known baseline; MAP conditional requirements are defined in these inventories; extension Slots are defined in Section 3.7.4.

## SubmissionSet Metadata Inventory

The SubmissionSet inventory identifies the package-level fields used to describe the workflow unit, its participants, patient information, and context.

| **Metadata field** | **Conf.** | **Cardinality** | **MAP extension** | **Meaning and population rule** | **XD encoding** |
|----|----|----|----|----|----|
| entryUUID | R | 1..1 | No | Metadata entry identity; distinct from uniqueId. | @id |
| uniqueId | R | 1..1 | No | SubmissionSet Workflow Activity identifier; matches designated Task.identifier. | ExternalIdentifier |
| sourceId | R | 1..1 | No | Organization Identity OID of the contributor of this SubmissionSet; apply the current transaction perspective. | ExternalIdentifier |
| submissionTime | R | 1..1 | No | Time the creating entity assembled the SubmissionSet; not clinical encounter time. | Slot: submissionTime |
| contentTypeCode | RE | 0..1 | No | Package classification; principal DocumentEntry typeCode unless the TX Definition specifies otherwise. | Classification |
| purpose | R | 1..1 | Yes | Shared Activity; aligns with Task.code and the common binding. | MAP Slot: urn:dt-org:dsm:map:purpose |
| patientId | C | 0..1 | No | Required when a recipient/exchange-domain patient identifier is known. Do not substitute the source local ID. | ExternalIdentifier |
| sourcePatientId | C | 0..\* | Yes; promoted | For a single-patient package, include known Information Source patient IDs, with assigning authorities. | MAP Slot: urn:dt-org:dsm:map:sourcePatientId |
| sourcePatientInfo | C | 0..1 set | Yes; promoted | Required when all DocumentEntries concern one patient, even when patientId is known; preserve source demographic semantics. | MAP Slot: urn:dt-org:dsm:map:sourcePatientInfo |
| referenceIdList | C | 0..\* | Yes; promoted | Include established Context identifiers required by the TX Definition; preserve CXi type and authority. | MAP Slot: urn:dt-org:dsm:map:referenceIdList |
| author | R | 1..1 | No | Exactly one package author identifies the Organization initiating the requested Shared Activity and MAY identify a person acting for that Organization. The Content Creator SHALL isolate this author from other artifact authors. Author Organization and contributing source Organization are distinct roles, even when the same Organization fulfills both. | Author Classification |
| author.authorPerson | RE | 0..1 / author | No | Known individual author; XCN encoding. | Author Slot: authorPerson |
| author.authorInstitution | R | 1..1 / author | No | Organization initiating the requested Shared Activity; exactly one institution, encoded as XON. May be accompanied by an author person acting for that Organization. | Author Slot: authorInstitution |
| author.authorRole | RE | 0..\* / author | No | Known activity-specific author function; common binding. | Author Slot: authorRole |
| author.authorSpecialty | RE | 0..\* / author | No | Known specialty; common binding. | Author Slot: authorSpecialty |
| author.authorTelecommunication | RE | 0..\* / author | No | Known contact information, including Direct where applicable; XTN encoding. | Author Slot: authorTelecommunication |
| intendedRecipient | RE | 0..\* | No | Intended organizations/persons; not automatically every transport intermediary. | Slot: intendedRecipient |
| title | O | 0..1 | No | Human-readable collection/workflow-unit title. | Name |
| comments | O | 0..1 | No | Additional package explanation. | Description |
| availabilityStatus | O | 0..1 | No | SubmissionSet status: Approved when supplied; distinct from workflow status or Task.status. | @status |
| homeCommunityId | O | 0..1 | No | Established community ID when relevant; not the source organization OID. | @home |
| limitedMetadata | O | 0..1 flag | No | Use only to indicate applicable metadata-limited treatment; not a generic missing-field flag. | Classification |

FHIR mapping. These tables specify XD metadata for MAP Direct/XDM packaging. Appendix D, FHIR Collection Bundle Packaging, defines the corresponding FHIR elements, IHE MHD extensions, and mappings for MAP extensions. Metadata semantics and transaction requirements remain consistent across representations.

FHIR SubmissionSet source organization mapping. When FHIR metadata is selected, SubmissionSet.sourceId SHALL be represented by exactly one List-level extension with URL https://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-sourceId. Its valueIdentifier.value SHALL contain the established Organization Identity OID of the entity contributing the current SubmissionSet, expressed as urn:oid:\<OID\>. This uses the IHE MHD sourceId mapping; a separate MAP source-organization extension SHALL NOT substitute for it.

Author and source roles. List.source represents the author who or device that defined the List contents. In FHIR R4 its allowed reference targets are Practitioner, PractitionerRole, Patient and Device; it SHALL NOT directly reference an Organization. When the author organization is represented through the IHE mapping, the optional extension https://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-authorOrg SHALL be placed on List.source and carry a valueReference to the author Organization. The author organization and the contributing source identified by ihe-sourceId are distinct roles; their identities MAY coincide when the same organization actually performs both roles.

Transaction perspective. The ihe-sourceId value SHALL identify the source of the current MAP Transaction Instance. In TX8 it identifies the entity contributing the return Workflow Status SubmissionSet, rather than automatically copying the sourceId of the originating transaction. This mapping applies across the Transaction Definitions that use FHIR SubmissionSet metadata.

IHE mapping reference: Mobile access to Health Documents (MHD), SubmissionSet Minimal profile, https://profiles.ihe.net/ITI/MHD/StructureDefinition-IHE.MHD.Minimal.SubmissionSet.html, and sourceId example, https://profiles.ihe.net/ITI/MHD/List-ex-minimalSubmissionSet.json.html. These sources were reviewed in publication 4.2.5-comment, based on FHIR R4. Adoption of this sourceId mapping does not by itself assert conformance to every constraint of an MHD SubmissionSet profile.

## DocumentEntry Metadata Inventory

The DocumentEntry inventory identifies the metadata fields describing each included information object, its identity, classification, authorship, clinical times, and package location.

| **Metadata field** | **Conf.** | **Cardinality** | **MAP extension** | **Meaning and population rule** | **XD encoding** |
|----|----|----|----|----|----|
| entryUUID | R | 1..1 | No | Metadata entry identity; distinct from uniqueId. | @id |
| uniqueId | R | 1..1 | No | Artifact identity assigned by its creator; preserve an established identifier. | ExternalIdentifier |
| objectType | R | 1..1 | No | Stable DocumentEntry for a packaged file; UUID urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1. | @objectType |
| mimeType | R | 1..1 | No | Actual IANA media type of the described object. For every primary or secondary CDA document, SHALL be application/cda+xml. See Section 3.5.4 and Appendix D. | @mimeType |
| URI | R | 1..1 | No | Relative XDM package locator that resolves to the actual file. | Slot: URI |
| hash | R | 1..1 | No | SHA-1 hash of the exact packaged bytes. | Slot: hash |
| size | R | 1..1 | No | Byte count of the same packaged file. | Slot: size |
| title | O | 0..1 | No | Human-readable artifact title. | Name |
| comments | O | 0..1 | No | Additional explanation about the artifact. | Description |
| classCode | RE | 0..1 | No | Broad object classification; common binding or artifact-specific fixed value applies. Document Category alignment is governed by the declared exchange policy; see Chapter T. | Classification |
| typeCode | R | 1..1 | No | Specific information-object type; standard LOINC code or explicitly defined temporary code. SHALL NOT be omitted or replaced by a Shared Activity code. For clinical documents, this is Document Type as defined in Chapter T. | Classification |
| formatCode | RE | 0..1 | No | Established technical format/profile; omit when unknown. | Classification |
| confidentialityCode | RE | 0..\* | No | Applicable security/privacy classifications; do not assume N universally. | Classification(s) |
| languageCode | RE | 0..1 | No | Known human language of the character content. | Slot: languageCode |
| creationTime | RE | 0..1 | No | CDA: Assembler/Composer time; effectiveTime fallback. HL7 V2: MSH-7. Preserve source meaning under Section 3.6.4. | Slot: creationTime |
| serviceStartTime | RE | 0..1 | No | Known start of the service documented by the artifact. | Slot: serviceStartTime |
| serviceStopTime | RE | 0..1 | No | Known end of that service. | Slot: serviceStopTime |
| eventCodeList | O | 0..\* | No | Clinical acts/events documented by the artifact; not the MAP transaction code. | Classification(s) |
| healthcareFacilityTypeCode | RE | 0..1 | No | Facility type associated with the documented activity; common binding applies. | Classification |
| practiceSettingCode | RE | 0..1 | No | Clinical practice setting associated with the documented activity. | Classification |
| patientId | C | 0..1 | No | Required when the recipient/exchange patient ID is known; consistent with SubmissionSet.patientId. | ExternalIdentifier |
| sourcePatientId | RE | 0..1 | No | Patient ID in the local source domain of the described information. | Slot: sourcePatientId |
| sourcePatientInfo | RE | 0..\* fields | No | Source patient demographics, using IHE PID-field encoding. | Slot: sourcePatientInfo |
| referenceIdList | C | 0..\* | No | Context identifiers required for this artifact by the TX Definition; CXi encoding. | Slot: referenceIdList |
| author | RE | 0..\* | No | Known human/device author of the artifact; distinguish package author from artifact author. | Author Classification |
| author.authorPerson | RE | 0..1 / author | No | Known individual author; XCN encoding. | Author Slot: authorPerson |
| author.authorInstitution | RE | 0..\* / author | No | Known associated institution(s); XON encoding. | Author Slot: authorInstitution |
| author.authorRole | RE | 0..\* / author | No | Known activity-specific author function; common binding. | Author Slot: authorRole |
| author.authorSpecialty | RE | 0..\* / author | No | Known specialty; common binding. | Author Slot: authorSpecialty |
| author.authorTelecommunication | RE | 0..\* / author | No | Known contact information, including Direct where applicable; XTN encoding. | Author Slot: authorTelecommunication |
| legalAuthenticator | O | 0..1 | No | Established artifact legal authenticator; do not infer attestation from packaging. | Slot: legalAuthenticator |
| availabilityStatus | O | 0..1 | No | DocumentEntry availability status when supplied; distinct from workflow status or Task.status. | @status |
| homeCommunityId | O | 0..1 | No | Established community ID when relevant; not the source organization OID. | @home |
| repositoryUniqueId | O | 0..1 | No | Established repository OID if relevant; do not invent one for a ZIP. | Slot: repositoryUniqueId |
| limitedMetadata | O | 0..1 flag | No | Use only to indicate applicable metadata-limited treatment; not a generic missing-field flag. | Classification |

FHIR mapping. These tables specify XD metadata for MAP Direct/XDM packaging. Appendix D, FHIR Collection Bundle Packaging, defines the corresponding FHIR elements, IHE MHD extensions, and mappings for MAP extensions. Metadata semantics and transaction requirements remain consistent across representations.

## MAP Extension Slots and Membership Associations

MAP establishes the exact, case-sensitive Slot names urn:dt-org:dsm:map:sourcePatientId, urn:dt-org:dsm:map:sourcePatientInfo, urn:dt-org:dsm:map:referenceIdList, and urn:dt-org:dsm:map:purpose. These are metadata-field identifiers defined by this IG, not codes requiring a terminology CodeSystem or ValueSet. Each Slot SHALL occur at most once in its SubmissionSet; repeating content SHALL be carried in its ValueList.

The three promoted fields SHALL preserve the corresponding IHE DocumentEntry semantics and value encodings: sourcePatientId uses CX, sourcePatientInfo uses IHE sourcePatientInfo PID-field encoding, and referenceIdList uses CXi with the established Context TypeCode binding. Their promotion does not make them standard IHE SubmissionSet attributes. purpose SHALL carry the Shared Activity as an IHE Coded String (code with CodeSystem OID); the applicable terminology binding remains in the SubmissionSet terminology binding table in Section 3.7.6. Exact CodeSystem OID identification is required for that encoding; a ValueSet URI SHALL NOT be substituted. A receiver SHALL use these MAP fields according to this IG rather than assume that a generic IHE receiver processes extra metadata.

Membership and correlation. Each included DocumentEntry SHALL be linked to its SubmissionSet by a HasMember Association with SubmissionSetStatus Original. These are Association metadata, not additional SubmissionSet fields. The designated Task.identifier and SubmissionSet.uniqueId identify the same activity. The Task carries originating/related transaction correlation; this inventory does not establish an additional unqualified transactionInstanceId Slot.

## Common Terminology Binding Rules

The following tables identify the ValueSet or fixed value for coded metadata. All ValueSet bindings in these tables are Extensible: when a listed ValueSet contains a concept appropriate to the information being represented, a code from that ValueSet SHALL be used. A code from another code system MAY be used only when the needed concept is not represented. Where alternatives are listed, this rule applies to their combined membership; a code from any listed ValueSet is acceptable. An outside code SHALL retain its code system identity and SHALL NOT be presented as a member of a listed ValueSet.

Fixed value means that the specified literal SHALL be used under the stated condition. It is a constraint label in these tables, rather than a FHIR binding strength. A ValueSet binding governs values when an element is populated; it does not change the element’s cardinality. These common bindings apply to both XD and FHIR representations. A use case or Transaction Definition MAY establish a fixed code for a particular field or artifact under its applicable binding, and SHALL state that restriction explicitly.

Canonical ValueSet URIs identify the bound sets. The code system URI or OID identifies the terminology of the selected code and SHALL be preserved in the applicable representation; a ValueSet URI SHALL NOT be used as the code system. Identifiers, dates, free text, hash, size, and URI fields retain their existing datatype and derivation requirements and are not terminology bindings.

The terminology package provides the CodeSystems, ValueSets, and OID assignments used by this guide. Transaction Types, Task Input types, failure reasons, patient-change concepts, and DirectTrust Provenance activities use the consolidated DirectTrust CodeSystem (http://objects.directtrust.org/standards/terminology/CodeSystem/DTCodeSystem; OID 1.3.6.1.4.1.41179.4.1.1). Previously established DirectTrust CodeSystems, including Context TypeCodes, remain separate. Use the CodeSystem OID in XD coded strings and its canonical URI in FHIR Coding.system; a ValueSet identifier SHALL NOT substitute for either.

## SubmissionSet Terminology Bindings

The following bindings apply to package-level metadata describing the Shared Activity, package classification, and applicable Context Instances.

<table style="width:97%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 21%" />
<col style="width: 23%" />
<col style="width: 35%" />
</colgroup>
<thead>
<tr>
<th><strong>Metadata element</strong></th>
<th><strong>ValueSet or fixed value</strong></th>
<th><strong>Binding strength</strong></th>
<th><strong>Application rule</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>purpose</td>
<td>DirectTrust Transaction Types<br />
http://objects.directtrust.org/standards/terminology/ValueSet/TransactionTypesVS</td>
<td>Extensible</td>
<td>Identifies the Shared Activity. SHALL align with Workflow Activity Task.code. A Transaction Definition specifies the activity code; it is not an information-object classification.</td>
</tr>
<tr>
<td>contentTypeCode</td>
<td>LOINC Document Ontology<br />
http://loinc.org/vs/loinc-document-ontology</td>
<td>Extensible</td>
<td>Identifies package classification. Unless a Transaction Definition states otherwise, use the typeCode of the principal DocumentEntry. Use a LOINC DO code when the appropriate concept exists.</td>
</tr>
<tr>
<td>referenceIdList ContextInstance TypeCode</td>
<td>DirectTrust Context TypeCode Value Set<br />
http://objects.directtrust.org/standards/terminology/ValueSet/DTContextTypeCodeVS</td>
<td>Extensible</td>
<td>Identifies the kind of established Context Instance; the associated identifier identifies the instance. Apply the same type semantics in the Task and corresponding metadata.</td>
</tr>
<tr>
<td>availabilityStatus</td>
<td>urn:oasis:names:tc:ebxml-regrep:StatusType:Approved</td>
<td>Fixed value</td>
<td>Applies to the XD SubmissionSet status. The FHIR representation preserves the corresponding package semantics using its defined mapping.</td>
</tr>
</tbody>
</table>

## DocumentEntry Terminology Bindings

The following bindings classify the included information objects and describe their authors, clinical settings, and context.

<table style="width:97%;">
<colgroup>
<col style="width: 16%" />
<col style="width: 21%" />
<col style="width: 23%" />
<col style="width: 35%" />
</colgroup>
<thead>
<tr>
<th><strong>Metadata element</strong></th>
<th><strong>ValueSet or fixed value</strong></th>
<th><strong>Binding strength</strong></th>
<th><strong>Application rule</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>classCode</td>
<td>LOINC Document Ontology<br />
http://loinc.org/vs/loinc-document-ontology</td>
<td>Extensible</td>
<td>Select the broader classification appropriate to the information object. Do not substitute a MAP transaction code for an information-object class. Document Category alignment is governed by the declared exchange policy; see Chapter T.</td>
</tr>
<tr>
<td>typeCode</td>
<td>LOINC Document Ontology<br />
http://loinc.org/vs/loinc-document-ontology</td>
<td>Extensible</td>
<td>Select the specific type of information object. A Transaction Definition may establish a fixed code. Retain an explicitly defined DirectTrust temporary code where LOINC DO lacks the needed concept. For clinical documents, this is Document Type as defined in Chapter T.</td>
</tr>
<tr>
<td>formatCode</td>
<td>IHE FormatCode ValueSet<br />
http://ihe.net/fhir/ihe.formatcode.fhir/ValueSet/formatcode<br />
<br />
DirectTrust FormatCode ValueSet<br />
http://objects.directtrust.org/standards/terminology/ValueSet/DTFormatCodeVS</td>
<td>Extensible</td>
<td>Use a code for the actual technical format and applicable content profile. A code from either listed set is acceptable. Transaction Definitions specify applicable format codes for their artifacts.</td>
</tr>
<tr>
<td>languageCode</td>
<td>Common Languages<br />
http://hl7.org/fhir/ValueSet/languages</td>
<td>Extensible</td>
<td>Represent the actual language using the applicable BCP 47 language tag. Do not derive a fixed language solely from the use case.</td>
</tr>
<tr>
<td>authorRole</td>
<td>Care Team Member Function<br />
http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1099.30</td>
<td>Extensible</td>
<td>Represents the patient- or act-specific function when known. Do not substitute professional occupation or specialty for that function.</td>
</tr>
<tr>
<td>authorSpecialty</td>
<td>NUCC Provider Taxonomy<br />
http://hl7.org/fhir/ValueSet/provider-taxonomy<br />
<br />
C80 Practice Setting Codes (SNOMED CT Medical Specialty)<br />
http://hl7.org/fhir/ValueSet/c80-practice-codes</td>
<td>Extensible</td>
<td>A code from either ValueSet is acceptable. Preserve the code system of each supplied specialty. Multiple applicable specialties may be carried.</td>
</tr>
<tr>
<td>practiceSettingCode</td>
<td>C80 Practice Setting Codes (SNOMED CT Medical Specialty)<br />
http://hl7.org/fhir/ValueSet/c80-practice-codes</td>
<td>Extensible</td>
<td>Describes the clinical practice setting associated with creation of the information. Preserve its distinction from author function and facility type.</td>
</tr>
<tr>
<td>confidentialityCode</td>
<td>Confidentiality<br />
http://terminology.hl7.org/ValueSet/v3-Confidentiality</td>
<td>Extensible</td>
<td>Use the classification applicable to the source information. N is not a universal default; a use case may explicitly establish a fixed value where appropriate.</td>
</tr>
<tr>
<td>healthcareFacilityTypeCode</td>
<td>ServiceDeliveryLocationRoleType<br />
http://terminology.hl7.org/ValueSet/v3-ServiceDeliveryLocationRoleType<br />
<br />
Healthcare Service Location Type Combined<br />
http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1267.31<br />
<br />
CMS Place of Service Codes<br />
http://terminology.hl7.org/ValueSet/CMSPlaceOfServiceCodes</td>
<td>Extensible</td>
<td>A code from any of these three ValueSets is acceptable. Describe the facility or service location applicable to the clinical activity; retain the selected code system.</td>
</tr>
<tr>
<td>referenceIdList ContextInstance TypeCode</td>
<td>DirectTrust Context TypeCode Value Set<br />
http://objects.directtrust.org/standards/terminology/ValueSet/DTContextTypeCodeVS</td>
<td>Extensible</td>
<td>Use the common ContextInstance type binding. Applicable instance identifiers SHALL remain consistent with the Task and SubmissionSet declarations.</td>
</tr>
</tbody>
</table>

The LOINC Document Ontology binding applies to information-object classification, including non-CDA artifacts where the concept is appropriate. Temporary classification codes explicitly identified by a Transaction Definition remain permitted when the needed concept is not represented in LOINC DO. Terminology binding does not change the source-derivation rules or authorize fabricated clinical metadata.

Terminology references: LOINC’s published Document Ontology ValueSet is documented at https://loinc.org/kb/api/fhir/valueset. FHIR R4 binding semantics are defined at https://hl7.org/fhir/R4/terminologies.html. The author-function and facility-type ValueSets retain the canonical identities of the sets identified in the Document Categories worksheet; dated terminology-server links are access locations rather than replacement canonical identifiers.

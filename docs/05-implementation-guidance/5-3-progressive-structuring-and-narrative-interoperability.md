## 5.3 Progressive Structuring and Narrative Interoperability

Progressive Structuring preserves source meaning while adding the structure required for dependable exchange. It applies to the information objects within a structured payload and does not waive transaction, template, or profile requirements.

### Progressive Structuring and Source Preservation

Useful information should not be excluded from exchange merely because it has not reached the highest available degree of structure. The framework therefore treats structuring as something applied where it creates interoperability value. A Minimally Structured Document can preserve the human-readable source information while additional structure and metadata are added progressively.

This foundation is important to the implementation approach in this chapter: structure the exchange, preserve the information, and allow Content Consumers — including appropriately governed AI-assisted consumers — to interpret what they can. Deterministic exchange controls such as identity, routing, transaction identity, provenance, authorization, and established context should still be represented explicitly when the specification requires them.

Reliable interoperability does not require every piece of useful information to be converted into discrete coded data before it can be exchanged. The exchange itself needs sufficient deterministic structure to identify and route the transaction, identify or match the patient, correlate applicable Context Instances, establish the requested Shared Activity, preserve provenance, and support safe automated behavior. The clinical or business information carried by the structured payload can remain in the form best suited to communicating its meaning.

Historically, reliable automated processing often depended on converting clinically meaningful information into discrete coded data. AI-assisted processing changes that constraint. Narrative text can increasingly be classified, summarized, searched, extracted, and used to support workflow decisions. Progressive Structuring therefore adds explicit structure where it creates dependable interoperability value while allowing useful narrative to remain narrative when additional coding would add burden without corresponding benefit.

### The Minimally Structured Document as an Interoperability Strategy

The Minimally Structured Document is not merely a fallback for systems that cannot produce highly structured content. It is a deliberate interoperability strategy: preserve the native human-readable information, add the minimum dependable structure needed to identify and exchange it safely, and progressively enrich the computable representation when doing so produces demonstrated value.

This approach can lower the barrier to participation for smaller EHRs and other systems with limited development resources. A system does not need to reproduce the structured-data capabilities of the largest EHR platforms before it can participate meaningfully in exchange. If it can create or preserve useful information, associate the deterministic metadata required by the transaction, package it correctly, transmit it securely, and preserve provenance, the receiving environment can apply additional processing capabilities according to its own maturity.

Structured content SHALL preserve the contextual integrity of its source form. A CDA representing a patient-authored Birth Plan, for example, must not add clinical facts that the patient did not include in the source. Clinical information added by another party requires distinct attribution and an appropriate information object; it must not be attributed to the original author. Required exchange metadata remains explicit without expanding the authored clinical content.

Clinical snapshot time and assembly time are different. When an existing clinical document is assembled into a shareable form later, preserve the information known at its clinical effective time. Subsequent observations must not silently enter the earlier snapshot. Record assembly separately as required by Chapter 3 and the applicable Transaction Definition.

### Information Object Representation Is Not an Interoperability Maturity Ranking

An information object may be represented as HL7 Version 2, CDA, FHIR, a Minimally Structured Document, or another form permitted by the applicable Transaction Definition and supported by the Receiver Actor. These representations have different strengths and constraints. The implementation question is whether the information object preserves the needed information and can be exchanged, correlated, and processed according to the transaction requirements. The structured payload packages these information objects and their metadata; the Direct message transports that package together with human-readable communication.

Structure the exchange; preserve the information; let Content Consumers interpret what they can. This principle allows Direct to move useful information between systems without forcing every sender to solve every downstream computability problem before exchange can occur.


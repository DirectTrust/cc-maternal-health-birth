## 4.2 MAP Endpoint CapabilityStatement Profile

The Endpoint Capability Statement SHALL be a FHIR R4 CapabilityStatement conforming to the MAP Endpoint CapabilityStatement Profile. CapabilityStatement.kind SHALL be instance, CapabilityStatement.fhirVersion SHALL be 4.0.1, and implementation SHALL identify the deployed implementation. The profile canonical URL is http://objects.directtrust.org/standards/fhir/StructureDefinition/map-endpoint-capabilitystatement.

The profile uses CapabilityStatement.messaging as the FHIR R4 container for endpoint declarations supporting Direct-based exchange. This use does not assert that Direct messages follow the FHIR messaging protocol. MAP extensions declare use-case support, transaction capabilities, metadata representation support and preference, correlated-response behavior, identifier capabilities, terminology capabilities, and intended workflow.

Structured elements and extensions are authoritative for machine processing. text.div SHALL provide a useful human-readable rendering of the same declarations and SHALL NOT contradict the structured content.

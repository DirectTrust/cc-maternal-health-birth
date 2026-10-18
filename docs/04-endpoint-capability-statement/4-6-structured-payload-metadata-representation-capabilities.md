## 4.6 Structured Payload Metadata Representation Capabilities

Structured payload metadata representation is distinct from the representations of its information objects. Carrying a FHIR resource does not by itself establish support for FHIR metadata. Declare Sender Actor and Receiver Actor support independently for each supported MetadataTypeCS code. When multiple applicable representations are supported for originating transactions, the endpoint SHOULD identify its preferred representation. FHIR exchange declarations SHALL also identify supported JSON and XML serializations. Membership in the metadata ValueSet does not waive the structured payload requirements of an applicable transaction.

| **Display label**   | **MetadataTypeCS code**          | **Sender Actor** | **Receiver Actor** | **Notes**                                          |
|---------------------|----------------------------------|------------------|--------------------|----------------------------------------------------|
| XD Metadata         | urn:dt-org:dsm:map:SMTP+XD:1.0   | Yes / No         | Yes / No           | XD/XDM metadata                                    |
| FHIR Metadata       | urn:dt-org:dsm:map:SMTP+FHIR:1.0 | Yes / No         | Yes / No           | FHIR R4; declare JSON and/or XML support           |
| Context IG Metadata | urn:dt-org:dsm:map:SMTP+CIG:1.0  | Yes / No         | Yes / No           | Only where applicable transaction guidance permits |
| Basic SMTP Metadata | urn:dt-org:dsm:map:SMTP:1.0      | Yes / No         | Yes / No           | Does not establish structured payload conformance  |

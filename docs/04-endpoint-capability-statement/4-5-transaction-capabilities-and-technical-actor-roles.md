## 4.5 Transaction Capabilities and Technical Actor Roles

Declare each supported transaction using its canonical coded identity from the published DirectTrust terminology. TX numbers are navigation labels and SHALL NOT replace the interoperable transaction identity. Declare supportsSend and supportsReceive independently for Sender Actor and Receiver Actor capabilities.

Catalog membership does not establish implementation support. query-for-documents (TX6) represents native IHE document query interactions, outside the Direct message-exchange scope of this chapter. TX6 SHALL NOT be advertised as a Direct Sender Actor or Receiver Actor capability. Its catalog identity MAY be included for completeness with both Direct role flags false.

| **Local** | **Canonical transaction code**     | **Sender Actor** | **Receiver Actor** | **Rule**                                        |
|-----------|------------------------------------|------------------|--------------------|-------------------------------------------------|
| TX1       | send-outpatient-visit-notification | Yes / No         | Yes / No           | Role-dependent                                  |
| TX2       | send-admission-notification        | Yes / No         | Yes / No           | Role-dependent                                  |
| TX3       | send-birth-notification            | Yes / No         | Yes / No           | Role-dependent                                  |
| TX4       | send-discharge-notification        | Yes / No         | Yes / No           | Role-dependent                                  |
| TX5       | send-documents                     | Yes / No         | Yes / No           | Role-dependent                                  |
| TX6       | query-for-documents                | No               | No                 | Native IHE query; outside Direct exchange scope |
| TX7       | send-patient-update                | Yes / No         | Yes / No           | Role-dependent                                  |
| TX8       | send-workflow-status               | Yes / No         | Yes / No           | Role-dependent; not universally required        |

An endpoint SHALL declare send-workflow-status capabilities according to the Technical Actor Roles it actually supports. An endpoint that supports TX8 as a Sender Actor SHALL declare supportsSend=true; an endpoint that supports TX8 as a Receiver Actor SHALL declare supportsReceive=true. Neither capability is universally required solely because the endpoint asserts support for cc-maternal-health-birth. The MAP Endpoint CapabilityStatement Profile and validation rules SHALL permit independent TX8 Sender Actor and Receiver Actor declarations, including false/false when the applicable Transaction Definitions do not impose stronger requirements.

Conformance testing SHALL assess the transaction and Technical Actor Role combinations actually declared by the endpoint. Organization type alone does not determine test applicability.

A development-target CapabilityStatement MAY enumerate planned Sender Actor and Receiver Actor capabilities for testing-tool design, including comprehensive coverage. Such a resource SHALL be conspicuously identified as a non-operational target and SHALL NOT be published or used as the Directory-discoverable authoritative declaration of deployed capabilities until each claimed role and exchange option has been implemented and verified. This development target does not change progressive-adoption requirements for other endpoints.

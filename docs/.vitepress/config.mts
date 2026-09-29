import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'cc-maternal-health-birth Use Case Guide',
  description: 'cc-maternal-health-birth Use Case Implementation Guide, built on the DirectTrust Framework for Metadata and Payloads via the Direct Standard(R)',
  base: '/cc-maternal-health-birth/',
  cleanUrls: true,

  themeConfig: {
    logo: '/directtrust-logo.png',
    siteTitle: false,

    nav: [
      { text: 'Implementer Guidance', link: '/implementer-guidance' },
      { text: 'Use Case Overview', link: '/use-case-overview' },
      { text: 'Appendices', link: '/appendices' },
      { text: 'DirectTrust Technical Docs Home', link: 'https://directtrust.github.io' }
    ],

    sidebar: [
      {
        text: 'Implementer Guidance',
        link: '/implementer-guidance',
        collapsed: true,
        items: [
          { text: 'CDA Document Construction', link: '/cda-document-construction' },
          { text: 'Identifier and Context Management', link: '/identifier-context-management' },
          { text: 'Outbound and Inbound Mailroom Processing', link: '/mailroom-processing' },
          { text: 'Workflow Status and Closed-Loop Signaling', link: '/workflow-status-closed-loop' },
          { text: 'Where Detailed Conformance Belongs', link: '/detailed-conformance' },
          { text: 'Reference Notes Retained', link: '/reference-notes' }
        ]
      },
      { text: 'Use Case Overview', link: '/use-case-overview' },
      { text: 'Actors and Transactions', link: '/actors-and-transactions' },
      {
        text: 'Transaction Framework',
        link: '/transaction-framework',
        collapsed: true,
        items: [
          { text: 'TX1: send-outpatient-visit-notification', link: '/tx1-send-outpatient-visit-notification' },
          { text: 'TX2: send-admission-notification', link: '/tx2-send-admission-notification' },
          { text: 'TX3: send-birth-notification', link: '/tx3-send-birth-notification' },
          { text: 'TX4: send-discharge-notification', link: '/tx4-send-discharge-notification' },
          { text: 'TX5: send-documents', link: '/tx5-send-documents' },
          { text: 'TX6: query-for-documents', link: '/tx6-query-for-documents' },
          { text: 'TX7: send-patient-update', link: '/tx7-send-patient-update' },
          { text: 'TX8: send-workflow-status', link: '/tx8-send-workflow-status' }
        ]
      },
      { text: 'Endpoint Capability Statement', link: '/endpoint-capability-statement' },
      { text: 'AI and Autonomous System Considerations', link: '/ai-autonomous-system-considerations' },
      {
        text: 'Appendices',
        link: '/appendices',
        collapsed: true,
        items: [
          { text: 'Appendix A: Understanding Clinical Documents', link: '/appendix-a-understanding-clinical-documents' },
          { text: 'Appendix B: Understanding Identity, Context, and Status', link: '/appendix-b-identity-context-status' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  }
})

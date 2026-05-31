import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const groups = [
  {
    name: 'Design & Build',
    slug: 'design-and-build',
    services: [
      {
        slug: 'ux-design',
        title: 'UX Design & Prototyping',
        icon: '✏️',
        description:
          'Rapid prototyping allows you to test ideas with real users before investing heavily in development. We help you validate assumptions, reduce risk and build confidence before committing to a full product build.',
        features: [
          'User research and discovery',
          'Rapid prototyping',
          'Usability testing',
          'Interface design',
          'Design systems',
        ],
      },
      {
        slug: 'custom-software',
        title: 'Software Development',
        icon: '⚙️',
        description:
          'Custom software designed around your business processes and user needs. From internal tools to customer-facing platforms, we build systems that help your organisation operate more effectively.',
        features: [
          'Web applications and portals',
          'Mobile-responsive applications',
          'Internal business systems',
          'Customer platforms',
          'API development and integration',
        ],
      },
    ],
  },
  {
    name: 'Data & AI',
    slug: 'data-and-ai',
    services: [
      {
        slug: 'ai-skills',
        title: 'Harness AI',
        icon: '🤖',
        description:
          'Most AI projects fail because organisations start with the technology instead of the problem. We begin by identifying where AI can create genuine business value, then implement solutions safely, responsibly and with clear measures of success.',
        features: [
          'AI opportunity assessments',
          'Staff and customer AI assistants',
          'Document understanding and extraction',
          'Intelligent search across business data',
          'Drafting, triage and summarisation',
          'Governance, evaluation and human oversight',
        ],
      },
      {
        slug: 'data-analysis',
        title: 'Data Analysis',
        icon: '📊',
        description:
          'Turn your existing data into practical business insights. We help uncover patterns, risks and opportunities hidden within your operational, sales and customer data.',
        features: [
          'Customer segmentation and lifetime value analysis',
          'Retention and churn insights',
          'Sales and demand forecasting',
          'Cohort and funnel analysis',
          'Deep-dive business investigations',
        ],
      },
      {
        slug: 'monitoring',
        title: 'Business Monitoring & Dashboards',
        icon: '📈',
        description:
          'Gain real-time visibility into the metrics that matter most. Build confidence in your decisions with dashboards, alerts and reporting tailored to your business.',
        features: [
          'KPI and revenue dashboards',
          'Operational performance monitoring',
          'Stakeholder reporting',
          'Automated alerts and notifications',
          'Unified reporting across multiple systems',
        ],
      },
    ],
  },
  {
    name: 'Automation & Integration',
    slug: 'automation-and-integration',
    services: [
      {
        slug: 'automation',
        title: 'Process Automation',
        icon: '🔄',
        description:
          'Reduce repetitive work and improve consistency by automating routine business processes and customer communications.',
        features: [
          'Workflow automation',
          'Customer notifications',
          'Onboarding and lifecycle communications',
          'Escalation and follow-up workflows',
          'Scheduled reporting and tasks',
        ],
      },
      {
        slug: 'integration',
        title: 'Systems Integration',
        icon: '🔗',
        description:
          'Connect the tools you already use so information flows automatically between systems, eliminating duplication and reducing errors.',
        features: [
          'CRM integration',
          'Accounting software integration',
          'E-commerce integrations',
          'Third-party API development',
          'Data synchronisation',
        ],
      },
    ],
  },
]

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Our Services - Software, AI, Data & Automation | Zynx</title>
        <meta
          name="description"
          content="UX, custom software, AI skills, data analysis, business dashboards, process automation and systems integration — tailored for small and medium businesses."
        />
        <meta property="og:title" content="Our Services - Software, AI, Data & Automation | Zynx" />
        <meta
          property="og:description"
          content="UX, custom software, AI, data analysis, dashboards and automation for SMBs."
        />
        <meta property="og:url" content="https://zynx.uk/services" />
        <meta property="og:image" content="https://zynx.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Services - Software, AI, Data & Automation | Zynx" />
        <meta
          name="twitter:description"
          content="UX, custom software, AI, data analysis, dashboards and automation for SMBs."
        />
        <meta name="twitter:image" content="https://zynx.uk/og-image.png" />
      </Helmet>
      {/* Hero */}
      <section className="pt-24 pb-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              We help small and medium businesses get more from their software, data and
              day-to-day operations. Whether you're looking to streamline processes,
              improve visibility, automate repetitive work or explore AI opportunities, we
              focus on solutions that deliver measurable business outcomes.
            </p>
          </div>
        </Container>
      </section>

      {/* Common Challenges */}
      <section className="py-10">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-normal text-text mb-6">
              Common challenges we help solve
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                'Too much manual work and repetitive administration',
                'Disconnected systems and duplicated data',
                'Reporting that takes hours instead of minutes',
                "Valuable business data that's difficult to access or understand",
                "Software that doesn't fit the way your team works",
                'Uncertainty about where AI can create real value',
              ].map((challenge, index) => (
                <li key={index} className="flex items-start gap-3 text-text-muted">
                  <span className="text-text font-normal">–</span>
                  {challenge}
                </li>
              ))}
            </ul>
            <p className="text-text-muted leading-relaxed">
              Whether you need a custom platform, better visibility into your operations,
              or smarter automation, we'll help identify the highest-impact opportunities.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Detail */}
      <section className="py-6">
        <Container>
          <div className="space-y-20">
            {groups.map((group) => (
              <div key={group.slug} id={group.slug} className="scroll-mt-32">
                <h2 className="text-sm uppercase tracking-widest text-text-muted mb-8">
                  {group.name}
                </h2>
                <div className="space-y-12">
                  {group.services.map((service) => (
                    <div key={service.slug} id={service.slug} className="scroll-mt-32">
                      <Card hover={false} className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                          <div>
                            <div className="text-4xl mb-4" aria-hidden="true">{service.icon}</div>
                            <h3 className="text-2xl md:text-3xl font-normal text-text mb-4">
                              {service.title}
                            </h3>
                            <p className="text-text-muted leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                          <div>
                            <ul className="space-y-3">
                              {service.features.map((feature, fIndex) => (
                                <li
                                  key={fIndex}
                                  className="flex items-start gap-3 text-text-muted"
                                >
                                  <span className="text-text font-normal">–</span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-text">
              Not sure what you need?
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              Book a free consultation and we'll help identify the most valuable
              opportunities for your business.
            </p>
            <div className="mt-8">
              <Button to="/contact">
                Book a Consultation
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

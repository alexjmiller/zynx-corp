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
          "Rapid prototyping means you test and learn before you commit. Put an idea in front of real users in days, iterate cheaply, and only build the full thing when you know it lands. Skipping this step — building first, learning later — is where small teams waste the most money on the wrong product.",
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
          'Tailored software designed around your business and grounded in user-centred design principles — from internal tools to customer-facing platforms.',
        features: [
          'Web applications and portals',
          'Mobile-responsive designs',
          'Internal business tools',
          'Customer-facing platforms',
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
          "Most AI projects don't move the needle — they're built before anyone asks where AI actually fits. We start by finding the places in your business where AI changes the outcome, then implement it safely with the right guardrails and a clear way to measure the win.",
        features: [
          'AI opportunity audits — where it pays off, where it doesn\'t',
          'AI assistants for staff and customers',
          'Document understanding and extraction',
          'Smart search across your business data',
          'Drafting, triage and summarisation',
          'Safe rollout: guardrails, evaluation, human-in-the-loop',
        ],
      },
      {
        slug: 'data-analysis',
        title: 'Data Analysis',
        icon: '📊',
        description:
          'Turn the data you already have — CRM, sales, support, operations — into clear answers. We surface the patterns and risks hidden in your numbers.',
        features: [
          'Customer segmentation and lifetime value',
          'Churn, risk and retention signals',
          'Sales and demand forecasting',
          'Cohort and funnel analysis',
          'One-off deep-dive investigations',
        ],
      },
      {
        slug: 'monitoring',
        title: 'Business Monitoring & Dashboards',
        icon: '📈',
        description:
          'Always-on visibility into how your business is performing. Live dashboards for the metrics that matter, with alerts when something needs attention.',
        features: [
          'Live KPI and revenue dashboards',
          'Operational and team performance views',
          'Custom reports for stakeholders',
          'Threshold-based alerts and notifications',
          'Unified view across multiple systems',
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
          'Streamline operations and use your data to drive smarter customer experiences. Automate the repetitive work and trigger the right message at the right moment.',
        features: [
          'Workflow and back-office automation',
          'Data-driven customer notifications',
          'Lifecycle and onboarding emails',
          'Escalation and follow-up rules',
          'Scheduled tasks and report generation',
        ],
      },
      {
        slug: 'integration',
        title: 'Systems Integration',
        icon: '🔗',
        description:
          'Connect your existing tools into one unified ecosystem so data flows where it needs to and your team stops re-keying information.',
        features: [
          'CRM integration',
          'Accounting software connections',
          'E-commerce platform linking',
          'Third-party API integration',
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
        <meta property="og:image" content="https://zynx.uk/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Services - Software, AI, Data & Automation | Zynx" />
        <meta
          name="twitter:description"
          content="UX, custom software, AI, data analysis, dashboards and automation for SMBs."
        />
        <meta name="twitter:image" content="https://zynx.uk/og-image.svg" />
      </Helmet>
      {/* Hero */}
      <section className="pt-24 pb-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              We help small and medium businesses get more from their software, their data
              and their day-to-day operations. From user-centred design through to AI,
              dashboards and automation — everything we build is grounded in what your
              business actually needs.
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
              Book a free consultation and we'll help you identify the best solution for your business.
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

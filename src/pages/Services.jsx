import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const services = [
  {
    title: 'UX Design & Prototyping',
    icon: '✏️',
    description: 'We start with your users. Through rapid prototyping and a test-and-learn approach, we validate ideas quickly and iterate until we get it right.',
    features: [
      'User research and discovery',
      'Rapid prototyping',
      'Usability testing',
      'Interface design',
      'Design systems',
    ],
  },
  {
    title: 'Custom Software Development',
    icon: '⚙️',
    description: 'We build tailored software solutions designed specifically for your business needs, grounded in user-centred design principles.',
    features: [
      'Web applications and portals',
      'Mobile-responsive designs',
      'Internal business tools',
      'Customer-facing platforms',
      'API development and integration',
    ],
  },
  {
    title: 'Process Automation',
    icon: '🔄',
    description: 'Streamline your operations by automating repetitive tasks and workflows.',
    features: [
      'Workflow automation',
      'Data entry automation',
      'Report generation',
      'Email and notification systems',
      'Scheduled task management',
    ],
  },
  {
    title: 'Systems Integration',
    icon: '🔗',
    description: 'Connect your existing tools and create a unified technology ecosystem.',
    features: [
      'CRM integration',
      'Accounting software connections',
      'E-commerce platform linking',
      'Third-party API integration',
      'Data synchronization',
    ],
  },
]

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              We take a user-centred approach to everything we build. Through research,
              prototyping, and iteration, we create software solutions that truly work
              for the people who use them—helping small and medium businesses thrive.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Detail */}
      <section className="py-12">
        <Container>
          <div className="space-y-16">
            {services.map((service, index) => (
              <Card key={index} hover={false} className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h2 className="text-2xl md:text-3xl font-normal text-text mb-4">
                      {service.title}
                    </h2>
                    <p className="text-text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3 text-text-muted">
                          <span className="text-text font-normal">–</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
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

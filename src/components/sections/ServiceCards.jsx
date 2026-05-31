import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Card from '../ui/Card'

const services = [
  {
    title: 'Design & Build',
    href: '/services#design-and-build',
    description:
      'Custom software, apps and digital platforms designed around your users and business processes. From prototypes to production-ready solutions, we build software that people actually enjoy using.',
    icon: '✏️',
  },
  {
    title: 'Data & AI',
    href: '/services#data-and-ai',
    description:
      'Transform business data into actionable insights. Build dashboards, uncover trends and apply AI where it creates genuine value.',
    icon: '🤖',
  },
  {
    title: 'Automation & Integration',
    href: '/services#automation-and-integration',
    description:
      'Eliminate repetitive tasks, connect disconnected systems and automate workflows so your team can focus on higher-value work.',
    icon: '🔗',
  },
]

export default function ServiceCards() {
  return (
    <section className="py-24 bg-background-light/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-text">
            What we do
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto">
            We help businesses reduce manual work, improve visibility and create better
            customer and employee experiences through software, data and automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              to={service.href}
              key={index}
              aria-label={`${service.title} — see details`}
              className="block no-underline"
            >
              <Card className="h-full">
                <div className="text-3xl mb-4" aria-hidden="true">{service.icon}</div>
                <h3 className="text-xl font-normal text-text mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

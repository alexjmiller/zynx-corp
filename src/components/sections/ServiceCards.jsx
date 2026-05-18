import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Card from '../ui/Card'

const services = [
  {
    title: 'Design & Software',
    description:
      'User-centred design and custom-built software. Rapid prototyping, web and mobile apps, internal tools and customer platforms — built around the people who use them.',
    icon: '✏️',
  },
  {
    title: 'AI & Data',
    description:
      'Practical AI, data analysis and live dashboards. Unlock patterns in your business data, monitor what matters, and put AI to work where it earns its keep.',
    icon: '🤖',
  },
  {
    title: 'Automation & Integration',
    description:
      'Connect your tools and automate the busywork. Data-driven customer notifications, lifecycle comms and seamless flow between the systems you already use.',
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
            User-centred design, AI and smart technology to help SMBs work better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link
              to="/services"
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

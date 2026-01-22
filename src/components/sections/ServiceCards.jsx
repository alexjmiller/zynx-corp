import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Card from '../ui/Card'

const services = [
  {
    title: 'UX Design & Prototyping',
    description: 'We start with your users. Rapid prototyping and a test-and-learn approach means we validate ideas quickly and iterate until we get it right.',
    icon: '✏️',
  },
  {
    title: 'Custom Software Development',
    description: 'Tailored applications grounded in user-centred design. From web apps to internal tools, we build solutions that people actually want to use.',
    icon: '⚙️',
  },
  {
    title: 'Automation & Integration',
    description: 'Streamline operations and connect your tools. We automate repetitive tasks and create seamless data flow across your business.',
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
            User-centred design and smart technology to help SMBs work better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link to="/services" key={index}>
              <Card className="h-full">
                <div className="text-3xl mb-4">{service.icon}</div>
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

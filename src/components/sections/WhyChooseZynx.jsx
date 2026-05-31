import Container from '../ui/Container'
import Card from '../ui/Card'

const reasons = [
  {
    title: 'Enterprise Experience Without Enterprise Overhead',
    description:
      'Get the benefit of proven digital expertise without the complexity and cost of large consultancy engagements.',
  },
  {
    title: 'User-Centred by Design',
    description:
      'Every solution starts with understanding your users, processes and goals to ensure what we build actually gets used.',
  },
  {
    title: 'Practical AI',
    description:
      'We focus on AI where it delivers measurable business value, not where it creates unnecessary complexity.',
  },
  {
    title: 'Built Around Your Business',
    description:
      'No off-the-shelf compromises. We create solutions tailored to your workflows, customers and growth plans.',
  },
  {
    title: 'Partnership First',
    description:
      'We work alongside our clients to deliver solutions that continue creating value long after launch.',
  },
]

export default function WhyChooseZynx() {
  return (
    <section className="py-24">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-text">
            Why businesses choose Zynx
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Small and medium-sized businesses often face the same operational challenges
            as large organisations, but without access to dedicated software teams, data
            specialists or digital transformation budgets.
          </p>
          <p className="mt-4 text-text-muted leading-relaxed">
            Zynx brings together user-centred design, software engineering, data
            expertise and practical AI to help businesses solve real problems and unlock
            new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <Card key={index} className="h-full">
              <h3 className="text-xl font-normal text-text mb-3">
                {reason.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {reason.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

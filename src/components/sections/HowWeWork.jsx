import Container from '../ui/Container'
import Card from '../ui/Card'

const steps = [
  {
    title: 'Discover',
    description: 'Understand your business, users, systems and challenges.',
  },
  {
    title: 'Design',
    description:
      'Prototype and validate ideas before committing significant time and budget.',
  },
  {
    title: 'Build',
    description:
      'Develop scalable, secure software using modern technologies and best practices.',
  },
  {
    title: 'Improve',
    description:
      'Measure results, learn from users and continuously refine what we build.',
  },
]

export default function HowWeWork() {
  return (
    <section className="py-24 bg-background-light/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-text">
            How we work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="h-full">
              <div className="text-sm text-accent-light font-normal mb-3">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-normal text-text mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

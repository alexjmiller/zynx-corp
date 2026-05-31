import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const values = [
  {
    title: 'Simplicity',
    description: 'The best solutions are easy to understand and easy to use. We reduce complexity so technology works for people, not against them.',
  },
  {
    title: 'Partnership',
    description: 'We work closely with our clients, building long-term relationships and delivering solutions aligned with their goals.',
  },
  {
    title: 'Quality',
    description: 'We take pride in our work. Every solution is designed thoughtfully, built carefully and tested thoroughly.',
  },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Zynx - Software, AI & Data Partners for SMBs</title>
        <meta name="description" content="Zynx brings enterprise-level digital expertise to small and medium-sized businesses — combining user-centred design, software development, data and practical AI." />
        <link rel="canonical" href="https://zynx.uk/about" />
        <meta property="og:title" content="About Zynx - Software, AI & Data Partners for SMBs" />
        <meta property="og:description" content="Software, AI, data and automation partners for small and medium businesses." />
        <meta property="og:url" content="https://zynx.uk/about" />
        <meta property="og:image" content="https://zynx.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Zynx - Software, AI & Data Partners for SMBs" />
        <meta name="twitter:description" content="Software, AI, data and automation partners for small and medium businesses." />
        <meta name="twitter:image" content="https://zynx.uk/og-image.png" />
      </Helmet>
      {/* Hero */}
      <section className="pt-24 pb-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              About Zynx
            </h1>
            <p className="mt-6 text-lg text-text leading-relaxed">
              We help growing businesses use technology more effectively.
            </p>
            <p className="mt-4 text-lg text-text-muted leading-relaxed">
              By combining user-centred design, software development, data expertise and
              practical AI, we create solutions that streamline operations, improve
              visibility and support sustainable growth.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="py-6">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-normal text-text mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Zynx was founded to bring enterprise-level digital expertise to small
                  and medium-sized businesses.
                </p>
                <p>
                  After decades of experience delivering digital products, customer
                  experiences and operational improvements across multiple industries, we
                  saw the same challenge repeatedly: smaller businesses often face the same
                  problems as larger organisations but rarely have access to the same level
                  of expertise.
                </p>
                <p>
                  Too often they're forced to choose between expensive enterprise software
                  or off-the-shelf products that only partially solve the problem.
                </p>
                <p>We bridge that gap.</p>
                <p>
                  Our approach combines design thinking, software engineering, data
                  analysis and practical AI to help businesses solve real operational
                  challenges and create lasting value.
                </p>
              </div>
            </div>
            <Card hover={false} className="p-8">
              <h3 className="text-xl font-normal text-text mb-6">Quick Facts</h3>
              <ul className="space-y-4 text-text-muted">
                {[
                  'Enterprise and SME experience',
                  'User-centred approach',
                  'Software, Data and AI specialists',
                  'Partnership-first delivery',
                  'Solutions built for growth',
                ].map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-text font-normal">–</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 bg-background-light/50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal text-text">
              Our Values
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-8">
                <h3 className="text-xl font-normal text-text mb-4">
                  {value.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {value.description}
                </p>
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
              Let's work together
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              Ready to explore what's possible with software, data, automation or AI?
              We'd love to hear about your business and the challenges you're looking to
              solve.
            </p>
            <div className="mt-8">
              <Button to="/contact">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

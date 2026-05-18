import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const values = [
  {
    title: 'Simplicity',
    description: 'We believe the best solutions are elegant and easy to use. We cut through complexity to deliver software that just works.',
  },
  {
    title: 'Partnership',
    description: 'We work alongside our clients as true partners, understanding their business deeply to deliver meaningful results.',
  },
  {
    title: 'Quality',
    description: 'We take pride in our craft. Every line of code is written with care, tested thoroughly, and built to last.',
  },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Zynx - Software, AI & Data Partners for SMBs</title>
        <meta name="description" content="Learn about Zynx — we help small and medium businesses build custom software, apply AI where it actually moves the needle, and unlock the value in their data." />
        <meta property="og:title" content="About Zynx - Software, AI & Data Partners for SMBs" />
        <meta property="og:description" content="Software, AI, data and automation partners for small and medium businesses." />
        <meta property="og:url" content="https://zynx.uk/about" />
        <meta property="og:image" content="https://zynx.uk/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Zynx - Software, AI & Data Partners for SMBs" />
        <meta name="twitter:description" content="Software, AI, data and automation partners for small and medium businesses." />
        <meta name="twitter:image" content="https://zynx.uk/og-image.svg" />
      </Helmet>
      {/* Hero */}
      <section className="pt-24 pb-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              About Zynx
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              We're a team of designers, developers and data specialists helping small
              and medium businesses build custom software, put AI to work where it earns
              its keep, and turn their data into clearer decisions.
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
                  Zynx was founded with a simple observation: small and medium businesses
                  often struggle to find affordable, high-quality software development
                  services tailored to their unique needs.
                </p>
                <p>
                  Too often, SMBs are left with the choice between expensive enterprise
                  solutions that don't fit their scale, or off-the-shelf products that
                  don't quite solve their problems.
                </p>
                <p>
                  We bridge that gap. Our team brings enterprise-level expertise to SMB
                  projects, delivering custom solutions that are practical, affordable,
                  and built to grow with your business.
                </p>
              </div>
            </div>
            <Card hover={false} className="p-8">
              <h3 className="text-xl font-normal text-text mb-6">Quick Facts</h3>
              <ul className="space-y-4 text-text-muted">
                <li className="flex justify-between border-b border-background pb-4">
                  <span>Founded</span>
                  <span className="text-text">2024</span>
                </li>
                <li className="flex justify-between border-b border-background pb-4">
                  <span>Focus</span>
                  <span className="text-text">SMB Software</span>
                </li>
                <li className="flex justify-between">
                  <span>Approach</span>
                  <span className="text-text">Partnership-first</span>
                </li>
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
              Ready to start your project? We'd love to hear from you.
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

import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import ServiceCards from '../components/sections/ServiceCards'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Zynx - Modern Software Solutions for Growing Businesses</title>
        <meta name="description" content="Zynx builds custom software, automates workflows, and designs intuitive UX for small and medium businesses. Book a free consultation." />
        <meta property="og:title" content="Zynx - Modern Software Solutions for Growing Businesses" />
        <meta property="og:description" content="Custom software, workflow automation, and UX design for small and medium businesses." />
        <meta property="og:url" content="https://zynx.co/" />
        <meta name="twitter:title" content="Zynx - Modern Software Solutions for Growing Businesses" />
        <meta name="twitter:description" content="Custom software, workflow automation, and UX design for small and medium businesses." />
      </Helmet>
      <Hero />
      <ServiceCards />

      {/* CTA Section */}
      <section className="py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-text">
              Ready to transform your business?
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your goals with custom software solutions.
            </p>
            <div className="mt-8">
              <Button to="/contact">
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

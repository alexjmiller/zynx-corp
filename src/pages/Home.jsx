import Hero from '../components/sections/Hero'
import ServiceCards from '../components/sections/ServiceCards'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <>
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

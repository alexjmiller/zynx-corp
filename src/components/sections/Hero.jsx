import Container from '../ui/Container'
import Button from '../ui/Button'
import HeroBackground from './HeroBackground'

export default function Hero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <HeroBackground />
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-text leading-tight">
            Modern software solutions for growing businesses
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            We help small and medium businesses streamline operations, automate workflows,
            and build custom software that scales with your needs.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/contact">
              Book a Consultation
            </Button>
            <Button to="/services" variant="secondary">
              Explore Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

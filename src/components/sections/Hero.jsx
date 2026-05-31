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
            Software that helps your business run smarter
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            We build custom software, apps and websites for growing businesses. From
            replacing spreadsheets and manual processes to unlocking the value in your
            data with AI and automation, we create systems that save time, improve
            visibility and help you scale with confidence.
          </p>
          <p className="mt-6 text-lg text-text font-normal">
            Custom Software. Data. AI. Automation. Built around your business.
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

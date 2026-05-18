import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import BookingWidget from '../components/sections/BookingWidget'

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us - Book a Free Consultation | Zynx</title>
        <meta name="description" content="Book a free 30-minute consultation to discuss your software, AI, data or automation project. Email hello@zynx.co or schedule a call online." />
        <meta property="og:title" content="Contact Us - Book a Free Consultation | Zynx" />
        <meta property="og:description" content="Book a free consultation to discuss your software, AI, data or automation project." />
        <meta property="og:url" content="https://zynx.uk/contact" />
        <meta property="og:image" content="https://zynx.uk/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - Book a Free Consultation | Zynx" />
        <meta name="twitter:description" content="Book a free consultation to discuss your software, AI, data or automation project." />
        <meta name="twitter:image" content="https://zynx.uk/og-image.svg" />
      </Helmet>
      {/* Hero */}
      <section className="pt-24 pb-10">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              Ready to discuss your project? Book a free consultation or reach out directly.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Options */}
      <section className="py-6">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Widget */}
            <div id="booking" className="lg:col-span-2 scroll-mt-24">
              <Card hover={false} className="p-0 overflow-hidden">
                <BookingWidget slug="consultation" />
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div id="email" className="scroll-mt-24">
              <Card hover={false} className="p-8">
                <h2 className="text-xl font-normal text-text mb-4">
                  Email Us
                </h2>
                <p className="text-text-muted mb-4">
                  Prefer email? Send us a message and we'll respond within 24 hours.
                </p>
                <a href="mailto:hello@zynx.co">hello@zynx.co</a>
              </Card>
              </div>

              <Card hover={false} className="p-8">
                <h2 className="text-xl font-normal text-text mb-4">
                  What to Expect
                </h2>
                <ul className="space-y-3 text-sm text-text-muted">
                  <li className="flex items-start gap-3">
                    <span className="text-accent">1.</span>
                    Book a 30-minute discovery call
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent">2.</span>
                    We'll discuss your business needs
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent">3.</span>
                    Receive a tailored proposal
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent">4.</span>
                    Start building together
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

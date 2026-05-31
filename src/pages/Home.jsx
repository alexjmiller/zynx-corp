import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import WhyChooseZynx from '../components/sections/WhyChooseZynx'
import ServiceCards from '../components/sections/ServiceCards'
import HowWeWork from '../components/sections/HowWeWork'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Zynx - Software, AI, Data & Automation for Growing Businesses</title>
        <meta name="description" content="Zynx builds custom software, apps and websites for growing businesses. Unlock the value in your data and put AI and automation to work. Book a free consultation." />
        <link rel="canonical" href="https://zynx.uk/" />
        <meta property="og:title" content="Zynx - Software, AI, Data & Automation for Growing Businesses" />
        <meta property="og:description" content="Custom software, practical AI, data analysis, dashboards and automation for small and medium businesses." />
        <meta property="og:url" content="https://zynx.uk/" />
        <meta property="og:image" content="https://zynx.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zynx - Software, AI, Data & Automation for Growing Businesses" />
        <meta name="twitter:description" content="Custom software, practical AI, data analysis, dashboards and automation for small and medium businesses." />
        <meta name="twitter:image" content="https://zynx.uk/og-image.png" />
      </Helmet>
      <Hero />
      <WhyChooseZynx />
      <ServiceCards />
      <HowWeWork />

      {/* CTA Section */}
      <section className="py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal text-text max-w-3xl mx-auto">
              Ready to spend less time managing systems and more time growing your business?
            </h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto">
              Let's explore where software, automation or AI could make the biggest impact.
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

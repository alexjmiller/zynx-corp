import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Use | Zynx</title>
        <meta
          name="description"
          content="The terms that apply when you use the zynx.uk website and chatbot."
        />
        <meta property="og:title" content="Terms of Use | Zynx" />
        <meta
          property="og:description"
          content="The terms that apply when you use the zynx.uk website and chatbot."
        />
        <meta property="og:url" content="https://zynx.uk/terms" />
        <link rel="canonical" href="https://zynx.uk/terms" />
        <meta property="og:image" content="https://zynx.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Use | Zynx" />
        <meta
          name="twitter:description"
          content="The terms that apply when you use the zynx.uk website and chatbot."
        />
        <meta name="twitter:image" content="https://zynx.uk/og-image.png" />
      </Helmet>

      <section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Terms of Use
            </h1>
            <p className="mt-3 text-sm text-text-muted">Last updated: 18 May 2026</p>

            <div className="mt-10 space-y-8 text-text-muted leading-relaxed">
              <p>
                By using this website (zynx.uk), you agree to these terms. If
                you don't, please don't use the site.
              </p>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  About us
                </h2>
                <p>
                  Zynx is a UK-based business providing software, AI, data and
                  automation services for small and medium businesses. Contact:{' '}
                  <a href="mailto:hello@zynx.co">hello@zynx.co</a>.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Use of this site
                </h2>
                <p>
                  You are welcome to browse, contact us via the chatbot or
                  email, and book a free consultation. You may not:
                </p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>attempt to gain unauthorised access to our systems,</li>
                  <li>use the chatbot to abuse, harass or spam,</li>
                  <li>automate or scrape the site in a way that disrupts its operation,</li>
                  <li>use anything on this site to do something illegal.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Free consultations
                </h2>
                <p>
                  The 30-minute consultations offered through the booking widget
                  are free, no-obligation discovery calls. Booking a slot does
                  not create a contract for paid work; any paid engagement
                  will be subject to a separate written agreement.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  AI-generated responses
                </h2>
                <p>
                  The chatbot is powered by an AI model (Claude, by Anthropic).
                  While we make reasonable efforts to keep its replies accurate,
                  AI can make mistakes — particularly about prices, timelines
                  or specific capabilities. Anything that matters should be
                  confirmed in writing with us directly.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Intellectual property
                </h2>
                <p>
                  The content of this site — copy, design, code and the Zynx
                  brand — belongs to Zynx unless attributed otherwise. You may
                  share links to public pages freely; please don't reproduce
                  substantial portions without asking.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  No warranties
                </h2>
                <p>
                  This site and its content are provided &ldquo;as is&rdquo;,
                  without warranty of any kind, express or implied. We do not
                  warrant that the site will be uninterrupted, error-free, or
                  free from harmful components.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Limitation of liability
                </h2>
                <p>
                  To the maximum extent permitted by law, Zynx is not liable
                  for any indirect, incidental, consequential or special
                  damages arising from your use of this site, the chatbot, or
                  any information found here. Nothing in these terms limits
                  liability for death, personal injury, or fraud.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Changes
                </h2>
                <p>
                  We may update these terms from time to time. The &ldquo;last
                  updated&rdquo; date at the top will change when we do.
                  Continued use of the site after a change means you accept
                  the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Governing law
                </h2>
                <p>
                  These terms are governed by the laws of England and Wales.
                  Disputes go to the courts of England and Wales.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Contact
                </h2>
                <p>
                  <a href="mailto:hello@zynx.co">hello@zynx.co</a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

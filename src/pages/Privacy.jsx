import { Helmet } from 'react-helmet-async'
import Container from '../components/ui/Container'

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Zynx</title>
        <meta
          name="description"
          content="How Zynx collects, uses and protects your information when you use zynx.uk."
        />
        <meta property="og:title" content="Privacy Policy | Zynx" />
        <meta
          property="og:description"
          content="How Zynx collects, uses and protects your information."
        />
        <meta property="og:url" content="https://zynx.uk/privacy" />
        <link rel="canonical" href="https://zynx.uk/privacy" />
        <meta property="og:image" content="https://zynx.uk/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Zynx" />
        <meta
          name="twitter:description"
          content="How Zynx collects, uses and protects your information."
        />
        <meta name="twitter:image" content="https://zynx.uk/og-image.png" />
      </Helmet>

      <section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-normal text-text leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-text-muted">Last updated: 18 May 2026</p>

            <div className="mt-10 space-y-8 text-text-muted leading-relaxed">
              <p>
                This policy explains what information Zynx collects when you use
                this website (zynx.uk), how we use it, and your rights. Zynx is a
                UK-based business; the &ldquo;data controller&rdquo; responsible
                for your information is Zynx. You can reach us at{' '}
                <a href="mailto:hello@zynx.co">hello@zynx.co</a>.
              </p>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  What we collect
                </h2>
                <p>
                  We collect personal information only when you choose to share
                  it with us:
                </p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>
                    <strong className="text-text font-normal">Chat messages.</strong>{' '}
                    When you use the chatbot at the bottom of the site, your
                    messages are sent to Anthropic so they can be processed by
                    Claude, the AI model that powers the chat. Anthropic does
                    not use API messages to train its models. No account is
                    required to use the chat.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Booking details.</strong>{' '}
                    When you book a free consultation through the widget on{' '}
                    <a href="/contact">/contact</a>, you provide your name,
                    email, optional notes and time zone. These are passed to
                    booq.now to schedule your call and send you a calendar
                    invite.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Lead handoffs.</strong>{' '}
                    When you ask the chatbot to have someone email you back, the
                    bot collects your name, email and a short summary of your
                    question so we can follow up.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Email enquiries.</strong>{' '}
                    Anything you email directly to{' '}
                    <a href="mailto:hello@zynx.co">hello@zynx.co</a>.
                  </li>
                </ul>
                <p className="mt-4">
                  We do not run analytics, ad tracking or any third-party
                  scripts that fingerprint you. We do not require accounts.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  How we use it
                </h2>
                <p>We use your information only to:</p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>reply to your enquiry or chat,</li>
                  <li>set up and confirm your booked consultation,</li>
                  <li>improve how we describe and deliver our services (in aggregate; no personal data leaves the systems below).</li>
                </ul>
                <p className="mt-4">
                  The legal basis under UK GDPR is your consent (when you submit
                  a message, book a slot or share your email) and our
                  legitimate interest in running this business.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Sub-processors
                </h2>
                <p>
                  These third parties may receive parts of your information
                  strictly to provide the features above:
                </p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>
                    <strong className="text-text font-normal">Anthropic</strong> —
                    hosts the AI model that responds to chat messages. Receives
                    only the messages in the current chat session.
                  </li>
                  <li>
                    <strong className="text-text font-normal">booq.now</strong> —
                    scheduling service. Receives your name, email, time zone
                    and any notes you add when booking, plus the chosen slot.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Slack Technologies</strong> —
                    when you ask the chatbot for a human reply, your name,
                    email, summary and a short chat excerpt are sent to a
                    private Slack channel so Alex sees the request.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Netlify</strong> —
                    hosts this website. Sees standard server logs (IP address,
                    browser type, page visited) for short periods.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Cloudflare</strong> —
                    DNS provider for zynx.uk. Receives no personal data beyond
                    what your DNS lookups require.
                  </li>
                </ul>
                <p className="mt-4">
                  If we change sub-processors we will update this list.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  What's stored in your browser
                </h2>
                <p>
                  The chat widget stores your conversation history in your
                  browser's <code className="px-1 py-0.5 rounded bg-background-light text-text text-xs">localStorage</code>{' '}
                  so that if you refresh the page or come back later, you don't
                  lose what was said. It stays on your device. Clearing your
                  browser's site data, using a private/incognito window, or
                  clicking &ldquo;New chat&rdquo; in the panel header all clear
                  it.
                </p>
                <p className="mt-4">We do not set tracking cookies.</p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  How long we keep things
                </h2>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>
                    <strong className="text-text font-normal">Chat transcripts</strong> in
                    your browser stay until you clear them.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Slack-notified leads</strong> stay
                    in the Slack channel under our normal retention. We do not
                    currently maintain a separate CRM.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Booked consultations</strong> stay
                    in our calendar for the standard lifecycle of a customer
                    record — at most 6 years to comply with UK tax record
                    keeping. You can ask us to remove your record at any time.
                  </li>
                  <li>
                    <strong className="text-text font-normal">Anthropic</strong> retains
                    chat messages per its own retention policy.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Your rights
                </h2>
                <p>Under UK GDPR you have the right to:</p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li>ask us what data we hold about you,</li>
                  <li>ask us to correct it,</li>
                  <li>ask us to delete it,</li>
                  <li>object to how we use it,</li>
                  <li>withdraw consent at any time.</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these, email{' '}
                  <a href="mailto:hello@zynx.co">hello@zynx.co</a>. We will reply
                  within 30 days.
                </p>
                <p className="mt-4">
                  If you are not happy with how we have handled your data you
                  can complain to the Information Commissioner's Office (ICO)
                  at{' '}
                  <a
                    href="https://ico.org.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ico.org.uk
                  </a>
                  .
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-normal text-text mb-3">
                  Changes to this policy
                </h2>
                <p>
                  If we change how we handle data we will update this page and
                  change the &ldquo;last updated&rdquo; date at the top.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

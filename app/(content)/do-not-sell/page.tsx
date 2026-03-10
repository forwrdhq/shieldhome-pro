import type { Metadata } from 'next'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import ContentLayout from '@/components/content/ContentLayout'
import { APP_URL, COMPANY_NAME, FROM_EMAIL, PHONE_NUMBER } from '@/lib/constants'
import DoNotSellForm from './DoNotSellForm'

export const metadata: Metadata = {
  title: `Do Not Sell or Share My Personal Information | ${COMPANY_NAME}`,
  description:
    'California residents and others may opt out of the sale or sharing of their personal information. Submit your privacy request here.',
  alternates: { canonical: `${APP_URL}/do-not-sell` },
  robots: 'index, follow',
}

export default function DoNotSell() {
  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      {/* Hero */}
      <div className="bg-[#1A1A2E] py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
            Your Privacy Rights
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Do Not Sell or Share<br className="hidden sm:block" /> My Personal Information
          </h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            We respect your privacy. Use this page to exercise your rights under
            the California Consumer Privacy Act (CCPA/CPRA) and other applicable
            privacy laws.
          </p>
        </div>
      </div>

      <ContentLayout
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Do Not Sell My Info', url: '/do-not-sell' },
        ]}
      >
        {/* ── Your Rights ── */}
        <h2>Your Privacy Rights</h2>
        <p>
          Under the California Consumer Privacy Act (CCPA) as amended by the
          California Privacy Rights Act (CPRA), California residents have the
          right to opt out of the "sale" or "sharing" of their personal
          information. Similar rights exist under Virginia (VCDPA), Colorado
          (CPA), Connecticut (CTDPA), Texas (TDPSA), and other state privacy
          laws.
        </p>
        <p>
          <strong>{COMPANY_NAME}</strong> may share certain data — such as
          cookie identifiers, browsing behavior, and device data — with
          third-party advertising partners (including Meta and Google) in ways
          that may constitute a "sale" or "sharing" for purposes of targeted
          advertising under California law. You have the right to opt out of
          this at any time.
        </p>

        {/* ── What We Collect & Share ── */}
        <h2>Categories of Personal Information We May Sell or Share</h2>
        <p>
          The following categories of personal information may be disclosed to
          third-party advertising and analytics partners:
        </p>
        <ul>
          <li>
            <strong>Identifiers</strong> — Cookie IDs, device IDs, IP address,
            and online identifiers (e.g., Facebook Click ID, Google Click ID)
          </li>
          <li>
            <strong>Internet or network activity</strong> — Browsing history on
            our Site, pages visited, interactions with content, and referring
            URLs
          </li>
          <li>
            <strong>Geolocation data</strong> — General location derived from
            IP address or ZIP code
          </li>
          <li>
            <strong>Inferences</strong> — Interest profiles drawn from browsing
            behavior for purposes of advertising
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell your name, email address, phone
          number, or precise home address to third-party data brokers for their
          own marketing purposes.
        </p>

        {/* ── How to Opt Out ── */}
        <h2>How to Opt Out</h2>
        <p>You can opt out through any of the following methods:</p>

        <h3>1. Submit a Request Below</h3>
        <p>
          Complete the form below. We will process your request and confirm via
          email within <strong>45 calendar days</strong>. If we need additional
          time, we will notify you of the extension.
        </p>

        {/* ── Form ── */}
        <DoNotSellForm />

        <h3>2. Email or Phone</h3>
        <p>
          You may also contact us directly:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${FROM_EMAIL}?subject=Privacy%20Request%20–%20Do%20Not%20Sell`}>
              {FROM_EMAIL}
            </a>{' '}
            — include "Privacy Request" in the subject line
          </li>
          <li>
            <strong>Phone:</strong> {PHONE_NUMBER} (7 days/week, 8am–10pm ET)
          </li>
        </ul>

        <h3>3. Browser-Level &amp; Platform-Level Opt-Outs</h3>
        <p>
          You may also limit data sharing through the following opt-out tools:
        </p>
        <ul>
          <li>
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Network Advertising Initiative (NAI) Opt-Out
            </a>
          </li>
          <li>
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance (DAA) Opt-Out
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/adpreferences/ad_settings"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meta Ad Preferences
            </a>
          </li>
          <li>
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ad Settings
            </a>
          </li>
        </ul>

        {/* ── Additional Rights ── */}
        <h2>Additional Privacy Rights</h2>
        <p>
          In addition to opting out of sale/sharing, you may also submit
          requests to:
        </p>
        <ul>
          <li>
            <strong>Access</strong> the personal information we have collected
            about you
          </li>
          <li>
            <strong>Delete</strong> your personal information (subject to
            certain legal exceptions)
          </li>
          <li>
            <strong>Correct</strong> inaccurate personal information
          </li>
          <li>
            <strong>Obtain a portable copy</strong> of your personal information
          </li>
          <li>
            <strong>Limit use</strong> of sensitive personal information
          </li>
        </ul>
        <p>
          Use the form above or contact us at{' '}
          <a href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a> to submit any of
          these requests. We will verify your identity before processing.
        </p>

        {/* ── Non-Discrimination ── */}
        <h2>Non-Discrimination</h2>
        <p>
          We will not discriminate against you for exercising any of your
          privacy rights. You will not receive a different level or quality of
          service, nor will you be denied services or charged different prices,
          because you exercised a right under this page or applicable law.
        </p>

        {/* ── Authorized Agents ── */}
        <h2>Authorized Agents</h2>
        <p>
          California residents may designate an authorized agent to make
          privacy requests on their behalf. The authorized agent must provide
          written authorization signed by the consumer, and we may require
          direct verification from the consumer to confirm the request.
        </p>

        <blockquote>
          For questions about our privacy practices, see our full{' '}
          <a href="/privacy">Privacy Policy</a>. For questions about these Terms
          of use, see our <a href="/terms">Terms of Service</a>.
        </blockquote>
      </ContentLayout>

      <ContentFooter />
    </div>
  )
}

import type { Metadata } from 'next'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import ContentLayout from '@/components/content/ContentLayout'
import { APP_URL, COMPANY_NAME, FROM_EMAIL, PHONE_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Privacy Policy | ${COMPANY_NAME}`,
  description:
    'Learn how ShieldHome Pro collects, uses, and protects your personal information when you use our website and services.',
  alternates: { canonical: `${APP_URL}/privacy` },
  robots: 'index, follow',
}

const EFFECTIVE_DATE = 'March 10, 2026'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      {/* Hero */}
      <div className="bg-[#1A1A2E] py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00C853] text-sm font-semibold uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Effective Date: {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      <ContentLayout
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      >
        <p>
          {COMPANY_NAME} ("we," "us," or "our") operates{' '}
          <strong>shieldhomepro.com</strong> (the "Site") as an authorized
          independent dealer of Vivint Smart Home. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your personal information
          when you visit our Site or request a quote. Please read it carefully.
          By using the Site, you agree to the practices described below.
        </p>

        {/* ── 1. Information We Collect ── */}
        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide Directly</h3>
        <p>
          When you submit a quote request, contact form, or other inquiry, we
          may collect:
        </p>
        <ul>
          <li>Full name, email address, and phone number</li>
          <li>ZIP code and property type</li>
          <li>Home-ownership status and security timeline</li>
          <li>Products or services you are interested in</li>
          <li>
            Any other information you voluntarily include in a message or form
          </li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <p>
          When you visit the Site, certain data is collected automatically
          through cookies and similar technologies:
        </p>
        <ul>
          <li>
            <strong>Device &amp; browser data</strong> — IP address, browser
            type and version, operating system, device type
          </li>
          <li>
            <strong>Usage data</strong> — pages visited, time on page, clicks,
            scroll depth, referring URL, exit page
          </li>
          <li>
            <strong>Marketing identifiers</strong> — Google Click ID (gclid),
            Facebook Click ID (fbclid), UTM parameters (source, medium,
            campaign, ad set, ad, keyword, content), landing page URL
          </li>
        </ul>

        <h3>1.3 Information from Third Parties</h3>
        <p>
          We may receive information about you from advertising platforms (such
          as Meta and Google), analytics providers, and lead-verification
          services to improve ad targeting and prevent fraud.
        </p>

        {/* ── 2. How We Use Your Information ── */}
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>
            Connect you with a Vivint Smart Home Pro to fulfill your quote
            request
          </li>
          <li>
            Send transactional communications (confirmation SMS, welcome email,
            appointment reminders)
          </li>
          <li>
            Send follow-up marketing communications about home security products
            and promotions (you may opt out at any time)
          </li>
          <li>Score and prioritize leads internally to improve response times</li>
          <li>
            Analyze website traffic and campaign performance to improve our
            marketing
          </li>
          <li>Detect and prevent fraud, abuse, and spam</li>
          <li>
            Comply with legal obligations and enforce our Terms of Service
          </li>
        </ul>

        <h3>Legal Bases (for EEA/UK visitors)</h3>
        <p>
          Where applicable law requires a legal basis, we process your data
          under: (a) your <strong>consent</strong> when you submit a form; (b)
          our <strong>legitimate interests</strong> in operating and improving
          our business; and (c) <strong>compliance with legal
          obligations</strong>.
        </p>

        {/* ── 3. How We Share Your Information ── */}
        <h2>3. How We Share Your Information</h2>
        <p>
          We do not sell, rent, or trade your personal information to unrelated
          third parties for their own marketing purposes. We may share your
          information as follows:
        </p>
        <ul>
          <li>
            <strong>Vivint Smart Home</strong> — As an authorized dealer, we
            share your quote request with Vivint so that a licensed Smart Home
            Pro can contact you. Vivint's use of your data is governed by
            Vivint's own privacy policy.
          </li>
          <li>
            <strong>Service providers</strong> — We use Twilio (SMS delivery),
            SendGrid (email delivery), Vercel (hosting), and Neon/PostgreSQL
            (database) to operate the Site. These providers access your data
            only as necessary to perform services on our behalf and are
            contractually bound to protect it.
          </li>
          <li>
            <strong>Analytics &amp; advertising partners</strong> — We use
            Google Analytics, Google Ads, Meta Pixel, and Microsoft Clarity.
            These services may use cookies to collect aggregated and
            pseudonymous data about your interactions with the Site. See Section
            5 for opt-out options.
          </li>
          <li>
            <strong>Legal requirements</strong> — We may disclose your
            information when required by law, subpoena, court order, or
            government request, or to protect our rights, property, or safety.
          </li>
          <li>
            <strong>Business transfers</strong> — In the event of a merger,
            acquisition, or sale of assets, your information may be transferred
            as part of that transaction. We will notify you via email or
            prominent Site notice before your information is subject to a
            different privacy policy.
          </li>
        </ul>

        {/* ── 4. Cookies & Tracking ── */}
        <h2>4. Cookies and Tracking Technologies</h2>
        <p>We use the following types of cookies and tracking technologies:</p>
        <ul>
          <li>
            <strong>Strictly necessary cookies</strong> — Required for the Site
            to function (session management, security).
          </li>
          <li>
            <strong>Analytics cookies</strong> — Google Analytics 4 and
            Microsoft Clarity collect anonymized usage data to help us
            understand how visitors use the Site.
          </li>
          <li>
            <strong>Advertising &amp; remarketing cookies</strong> — The Meta
            Pixel and Google Ads tags track conversions and support
            retargeting campaigns.
          </li>
          <li>
            <strong>Functional cookies</strong> — Remember your preferences
            (e.g., partially completed forms).
          </li>
        </ul>
        <p>
          <strong>Your choices:</strong> You can manage or delete cookies
          through your browser settings. To opt out of Google Analytics, install
          the{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          . To opt out of Meta ad tracking, visit{' '}
          <a
            href="https://www.facebook.com/adpreferences"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Ad Preferences
          </a>
          . Note that disabling cookies may affect Site functionality.
        </p>

        {/* ── 5. California Privacy Rights ── */}
        <h2>5. California Privacy Rights (CCPA / CPRA)</h2>
        <p>
          If you are a California resident, you have the following rights under
          the California Consumer Privacy Act (CCPA) as amended by the
          California Privacy Rights Act (CPRA):
        </p>
        <ul>
          <li>
            <strong>Right to Know</strong> — Request disclosure of the
            categories and specific pieces of personal information we have
            collected about you, as well as the categories of sources,
            business/commercial purposes for collection, and third parties with
            whom we share it.
          </li>
          <li>
            <strong>Right to Delete</strong> — Request deletion of your personal
            information, subject to certain exceptions.
          </li>
          <li>
            <strong>Right to Correct</strong> — Request correction of inaccurate
            personal information.
          </li>
          <li>
            <strong>Right to Opt Out of Sale / Sharing</strong> — We may share
            certain identifiers (such as cookie IDs and device data) with
            advertising partners in ways that qualify as a "sale" or "sharing"
            under California law. You may opt out at our{' '}
            <a href="/do-not-sell">Do Not Sell or Share My Personal Information</a>{' '}
            page.
          </li>
          <li>
            <strong>Right to Limit Use of Sensitive Information</strong> — You
            may direct us to limit use of any sensitive personal information to
            purposes permitted by the CPRA.
          </li>
          <li>
            <strong>Right to Non-Discrimination</strong> — We will not
            discriminate against you for exercising any of these rights.
          </li>
        </ul>
        <p>
          To submit a verifiable consumer request, email us at{' '}
          <a href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a> or call{' '}
          {PHONE_NUMBER}. We will respond within 45 days.
        </p>

        {/* ── 6. Other State Rights ── */}
        <h2>6. Other U.S. State Privacy Rights</h2>
        <p>
          Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA),
          Texas (TDPSA), and other states with comprehensive privacy laws may
          have similar rights to access, correct, delete, and port their
          personal data, and to opt out of targeted advertising. To exercise
          these rights, contact us using the information in Section 10.
        </p>

        {/* ── 7. SMS Messaging ── */}
        <h2>7. SMS Messaging</h2>
        <p>
          By submitting your phone number through our quote form, you expressly
          consent to receive transactional SMS messages from {COMPANY_NAME}
          regarding your quote request, as well as follow-up marketing messages
          about home security products and promotions. Message and data rates
          may apply. Message frequency varies. You may opt out at any time by
          replying <strong>STOP</strong> to any message or contacting us at{' '}
          <a href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a>.
        </p>

        {/* ── 8. Data Retention ── */}
        <h2>8. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill
          the purposes outlined in this Policy, unless a longer retention period
          is required by law. Lead records are retained for up to 3 years for
          business and compliance purposes. Anonymized analytics data may be
          retained indefinitely.
        </p>

        {/* ── 9. Security ── */}
        <h2>9. Data Security</h2>
        <p>
          We implement commercially reasonable technical and organizational
          measures to protect your personal information against unauthorized
          access, disclosure, alteration, and destruction. These include
          encrypted data transmission (TLS), access controls, and regular
          security reviews. However, no method of transmission over the Internet
          or electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>

        {/* ── 10. Children ── */}
        <h2>10. Children's Privacy</h2>
        <p>
          The Site is not directed to individuals under the age of 18. We do not
          knowingly collect personal information from children. If you believe a
          child has provided us with personal information, please contact us and
          we will promptly delete it.
        </p>

        {/* ── 11. Third-Party Links ── */}
        <h2>11. Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites, including
          Vivint.com. We are not responsible for the privacy practices or
          content of those sites. We encourage you to review the privacy
          policies of any third-party sites you visit.
        </p>

        {/* ── 12. Changes ── */}
        <h2>12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Policy from time to time. When we make material
          changes, we will update the "Effective Date" at the top of this page
          and, where appropriate, notify you by email or a prominent Site notice.
          Your continued use of the Site after any changes constitutes your
          acceptance of the revised Policy.
        </p>

        {/* ── 13. Contact ── */}
        <h2>13. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise
          your privacy rights, please contact us:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a>
          </li>
          <li>
            <strong>Phone:</strong> {PHONE_NUMBER} (available 7 days/week,
            8am–10pm ET)
          </li>
          <li>
            <strong>Mail:</strong> {COMPANY_NAME}, Privacy Officer, United
            States
          </li>
        </ul>

        {/* Highlight box */}
        <blockquote>
          California residents: To opt out of the sale or sharing of your
          personal information, visit our{' '}
          <a href="/do-not-sell">Do Not Sell or Share My Personal Information</a>{' '}
          page.
        </blockquote>
      </ContentLayout>

      <ContentFooter />
    </div>
  )
}

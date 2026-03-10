import type { Metadata } from 'next'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import ContentLayout from '@/components/content/ContentLayout'
import { APP_URL, COMPANY_NAME, FROM_EMAIL, PHONE_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Terms of Service | ${COMPANY_NAME}`,
  description:
    'Read the Terms of Service governing your use of the ShieldHome Pro website and services.',
  alternates: { canonical: `${APP_URL}/terms` },
  robots: 'index, follow',
}

const EFFECTIVE_DATE = 'March 10, 2026'

export default function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Effective Date: {EFFECTIVE_DATE}
          </p>
        </div>
      </div>

      <ContentLayout
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      >
        <p>
          These Terms of Service ("Terms") govern your access to and use of the
          website located at <strong>shieldhomepro.com</strong> (the "Site"),
          operated by <strong>{COMPANY_NAME}</strong> ("we," "us," or "our"),
          an authorized independent dealer of Vivint Smart Home. By accessing or
          using the Site, you agree to be bound by these Terms. If you do not
          agree, please do not use the Site.
        </p>

        {/* ── 1. About Us ── */}
        <h2>1. About {COMPANY_NAME}</h2>
        <p>
          {COMPANY_NAME} is an independent authorized dealer of Vivint Smart
          Home products and services. We are not Vivint Smart Home, Inc., and
          are not affiliated with or acting as an agent of Vivint's corporate
          entity. All Vivint products and services are subject to Vivint's own
          terms, warranties, and policies.
        </p>

        {/* ── 2. Use of the Site ── */}
        <h2>2. Permitted Use of the Site</h2>
        <p>
          You may use the Site for lawful, personal, non-commercial purposes
          consistent with these Terms. You agree not to:
        </p>
        <ul>
          <li>
            Use the Site in any way that violates applicable federal, state,
            local, or international law or regulation
          </li>
          <li>
            Submit false, misleading, or fraudulent information through any
            form on the Site
          </li>
          <li>
            Use automated means (bots, scrapers, crawlers) to access, collect,
            or copy content from the Site without our prior written consent
          </li>
          <li>
            Attempt to interfere with, disrupt, or damage the Site or the
            servers or networks connected to it
          </li>
          <li>
            Transmit any advertising or promotional material, spam, or any
            other unsolicited communications
          </li>
          <li>
            Impersonate any person or entity or misrepresent your affiliation
            with any person or entity
          </li>
          <li>
            Engage in any conduct that restricts or inhibits anyone's use or
            enjoyment of the Site
          </li>
        </ul>

        {/* ── 3. Quote Requests ── */}
        <h2>3. Quote Requests and Lead Submission</h2>
        <p>
          By submitting a quote request on the Site, you acknowledge and agree
          that:
        </p>
        <ul>
          <li>
            You are providing your information voluntarily for the purpose of
            receiving information about Vivint Smart Home products and services.
          </li>
          <li>
            A representative of {COMPANY_NAME} or a Vivint Smart Home Pro may
            contact you via phone, email, or SMS at the contact information you
            provide.
          </li>
          <li>
            Submission of a quote request does not create any obligation on
            your part to purchase any product or service, nor does it obligate
            us to provide any specific quote or pricing.
          </li>
          <li>
            You consent to receive SMS and email communications as further
            described in our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </li>
          <li>
            All information you provide must be truthful, accurate, and current.
          </li>
        </ul>

        {/* ── 4. SMS Consent ── */}
        <h2>4. SMS Communications and Consent</h2>
        <p>
          By providing your mobile phone number and submitting a form on the
          Site, you expressly consent to receive autodialed and non-autodialed
          SMS messages from {COMPANY_NAME} at the number you provide. These
          messages may include:
        </p>
        <ul>
          <li>Quote confirmation and appointment reminders</li>
          <li>Follow-up messages from our sales team</li>
          <li>Promotional offers related to home security products</li>
        </ul>
        <p>
          Message and data rates may apply. Message frequency varies. You may
          opt out at any time by replying <strong>STOP</strong> to any message.
          For help, reply <strong>HELP</strong> or contact us at{' '}
          <a href={`mailto:${FROM_EMAIL}`}>{FROM_EMAIL}</a>. Opting out will
          not affect your eligibility to receive a quote.
        </p>

        {/* ── 5. Intellectual Property ── */}
        <h2>5. Intellectual Property</h2>
        <p>
          The Site and all of its content — including but not limited to text,
          graphics, logos, images, audio clips, and software — are the property
          of {COMPANY_NAME} or its content suppliers and are protected by
          United States and international copyright, trademark, and other
          intellectual property laws.
        </p>
        <p>
          You are granted a limited, non-exclusive, non-transferable,
          revocable license to access and use the Site for your personal,
          non-commercial purposes. You may not reproduce, distribute, modify,
          create derivative works of, publicly display, publicly perform,
          republish, download, store, or transmit any material from the Site
          without our prior written consent.
        </p>
        <p>
          "Vivint," "Vivint Smart Home," and related marks are trademarks of
          Vivint Smart Home, Inc. The {COMPANY_NAME} name and logo are our
          trademarks. Nothing on the Site grants you any right to use these
          marks.
        </p>

        {/* ── 6. Third-Party Content ── */}
        <h2>6. Third-Party Services and Links</h2>
        <p>
          The Site may contain links to third-party websites and services,
          including Vivint.com. These links are provided for convenience only.
          We do not control, endorse, or assume responsibility for any
          third-party sites or their content, privacy practices, or terms. Your
          use of third-party sites is entirely at your own risk.
        </p>
        <p>
          We use third-party service providers including Google Analytics, Meta
          Pixel, Microsoft Clarity, Twilio, SendGrid, and Vercel to operate the
          Site. Your use of the Site is subject to the privacy policies of these
          providers.
        </p>

        {/* ── 7. Disclaimer ── */}
        <h2>7. Disclaimer of Warranties</h2>
        <p>
          THE SITE AND ALL CONTENT, INFORMATION, TOOLS, AND SERVICES MADE
          AVAILABLE THROUGH THE SITE ARE PROVIDED ON AN "AS IS" AND "AS
          AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL
          WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
          NON-INFRINGEMENT.
        </p>
        <p>
          WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE,
          FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, OR THAT ANY ERRORS WILL
          BE CORRECTED. WE DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING
          THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT ON THE SITE.
        </p>
        <p>
          PRICING, AVAILABILITY, AND FEATURES OF VIVINT PRODUCTS AND SERVICES
          ARE SUBJECT TO CHANGE WITHOUT NOTICE AND ARE NOT GUARANTEED BY US.
          ACTUAL PRICING WILL BE DETERMINED BY VIVINT.
        </p>

        {/* ── 8. Limitation of Liability ── */}
        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
          {COMPANY_NAME.toUpperCase()}, ITS OFFICERS, DIRECTORS, EMPLOYEES,
          AGENTS, LICENSORS, OR SERVICE PROVIDERS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES —
          INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
          LOSSES — ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE
          OF (OR INABILITY TO USE) THE SITE, EVEN IF WE HAVE BEEN ADVISED OF
          THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER OR
          RELATED TO THESE TERMS OR YOUR USE OF THE SITE SHALL NOT EXCEED ONE
          HUNDRED U.S. DOLLARS ($100.00).
        </p>
        <p>
          SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
          CERTAIN DAMAGES, SO SOME OF THE ABOVE LIMITATIONS MAY NOT APPLY TO
          YOU.
        </p>

        {/* ── 9. Indemnification ── */}
        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless {COMPANY_NAME} and
          its officers, directors, employees, agents, licensors, and service
          providers from and against any claims, liabilities, damages,
          judgments, awards, losses, costs, expenses, or fees (including
          reasonable attorneys' fees) arising out of or relating to your
          violation of these Terms or your use of the Site.
        </p>

        {/* ── 10. TCPA ── */}
        <h2>10. Telephone Consumer Protection Act (TCPA)</h2>
        <p>
          By providing your phone number and submitting a quote request, you
          consent to be contacted via autodialed calls, pre-recorded messages,
          and/or SMS text messages by {COMPANY_NAME} and/or Vivint Smart Home
          at the number you provide, even if the number is on a state or federal
          Do Not Call registry. This consent is not a condition of purchase.
        </p>

        {/* ── 11. Governing Law ── */}
        <h2>11. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the United States and the state in which {COMPANY_NAME}
          operates, without regard to conflict of law principles.
        </p>
        <p>
          Any dispute arising out of or relating to these Terms or your use of
          the Site shall first be submitted to non-binding mediation. If
          mediation is unsuccessful, the dispute shall be resolved by binding
          arbitration administered by the American Arbitration Association under
          its Consumer Arbitration Rules, and judgment on the award may be
          entered in any court having jurisdiction. You waive any right to
          participate in a class action lawsuit or class-wide arbitration.
        </p>

        {/* ── 12. Changes ── */}
        <h2>12. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. When we make
          material changes, we will update the "Effective Date" at the top of
          this page. Your continued use of the Site after any changes
          constitutes your acceptance of the revised Terms. We encourage you to
          review these Terms periodically.
        </p>

        {/* ── 13. Termination ── */}
        <h2>13. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your access to the Site
          at any time, without notice, for conduct that we believe violates
          these Terms or is harmful to other users, us, third parties, or for
          any other reason at our sole discretion.
        </p>

        {/* ── 14. Entire Agreement ── */}
        <h2>14. Entire Agreement</h2>
        <p>
          These Terms, together with our{' '}
          <a href="/privacy">Privacy Policy</a>, constitute the entire agreement
          between you and {COMPANY_NAME} regarding your use of the Site and
          supersede all prior agreements and understandings, whether written or
          oral, relating to such subject matter.
        </p>

        {/* ── 15. Contact ── */}
        <h2>15. Contact Us</h2>
        <p>
          If you have questions about these Terms, please contact us:
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
        </ul>

        <blockquote>
          By using this Site, you acknowledge that you have read, understood,
          and agree to be bound by these Terms of Service.
        </blockquote>
      </ContentLayout>

      <ContentFooter />
    </div>
  )
}

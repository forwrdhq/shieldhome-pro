/**
 * World-class email template system for ShieldHome Pro
 *
 * 4 audience-specific nurture sequences that mirror each landing page:
 *   1. vivint   — /google landing page (Vivint keyword searchers)
 *   2. switch   — /switch landing page (ADT contract buyout)
 *   3. cost     — /get-quote / homeshield.pro (cost/pricing shoppers)
 *   4. standard — homepage quiz / direct traffic (general security)
 */

import { PHONE_NUMBER, APP_URL } from './constants'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmailRecipient {
  firstName: string
  email: string
  phone?: string
  landingPage?: string | null
  segment?: string | null
  currentProvider?: string | null
  contractMonthsRemaining?: string | null
  currentMonthlyPayment?: string | null
  propertyType?: string | null
  timeline?: string | null
  productsInterested?: string[]
  creditScoreRange?: string | null
}

export interface EmailContent {
  subject: string
  preheader?: string
  html: string
  type: string
}

// ---------------------------------------------------------------------------
// Sequence routing
// ---------------------------------------------------------------------------

export type SequenceKey = 'vivint' | 'switch' | 'cost' | 'standard'

export function getSequenceKey(lead: { landingPage?: string | null; segment?: string | null }): SequenceKey {
  if (lead.segment === 'switch' || lead.landingPage === '/switch') return 'switch'
  if (lead.landingPage === '/google') return 'vivint'
  if (lead.landingPage === '/get-quote') return 'cost'
  return 'standard'
}

// ---------------------------------------------------------------------------
// Design system — shared layout
// ---------------------------------------------------------------------------

const COLORS = {
  emerald: '#10b981',
  emeraldDark: '#059669',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  red500: '#ef4444',
  amber500: '#f59e0b',
  amber50: '#fffbeb',
  green50: '#f0fdf4',
  green100: '#dcfce7',
  red50: '#fef2f2',
}

function emailWrapper(body: string, preheader?: string): string {
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ShieldHome Pro</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:${COLORS.slate100};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheaderHtml}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.slate100};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLORS.white};border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08),0 4px 24px rgba(0,0,0,0.04);">
        <!-- Header -->
        <tr><td style="background:${COLORS.slate900};padding:24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="color:${COLORS.emerald};font-size:20px;font-weight:800;letter-spacing:-0.5px;">ShieldHome</span><span style="color:${COLORS.white};font-size:20px;font-weight:800;letter-spacing:-0.5px;"> Pro</span>
                <p style="color:${COLORS.slate400};font-size:11px;margin:4px 0 0;letter-spacing:0.5px;text-transform:uppercase;">Vivint Smart Home Marketing Partner</p>
              </td>
              <td align="right" style="vertical-align:middle;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background:rgba(16,185,129,0.15);border-radius:20px;padding:6px 14px;">
                      <span style="color:${COLORS.emerald};font-size:11px;font-weight:700;">⭐ 4.8/5 · 58,000+ Reviews</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 32px 28px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:${COLORS.slate50};border-top:1px solid ${COLORS.slate200};padding:24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <p style="color:${COLORS.slate500};font-size:12px;margin:0 0 8px;line-height:1.5;">
                ShieldHome Pro · Vivint Smart Home Marketing Partner<br>
                <a href="tel:${PHONE_NUMBER}" style="color:${COLORS.emerald};text-decoration:none;font-weight:600;">${PHONE_NUMBER}</a>
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 8px;"><a href="%%unsubscribe%%" style="color:${COLORS.slate400};font-size:11px;text-decoration:underline;">Unsubscribe</a></td>
                  <td style="color:${COLORS.slate400};font-size:11px;">·</td>
                  <td style="padding:0 8px;"><a href="${APP_URL}/privacy" style="color:${COLORS.slate400};font-size:11px;text-decoration:underline;">Privacy</a></td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Shared UI components
// ---------------------------------------------------------------------------

function cta(text: string, href?: string): string {
  const url = href || `tel:${PHONE_NUMBER}`
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
    <tr><td align="center" style="background:${COLORS.emerald};border-radius:10px;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:16px 36px;color:${COLORS.white};font-size:16px;font-weight:700;text-decoration:none;letter-spacing:-0.2px;">${text}</a>
    </td></tr>
  </table>`
}

function ctaSecondary(text: string, href?: string): string {
  const url = href || `tel:${PHONE_NUMBER}`
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto;">
    <tr><td align="center" style="border:2px solid ${COLORS.slate200};border-radius:10px;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;color:${COLORS.slate700};font-size:15px;font-weight:600;text-decoration:none;">${text}</a>
    </td></tr>
  </table>`
}

function heading(text: string): string {
  return `<h2 style="color:${COLORS.slate900};font-size:22px;font-weight:800;line-height:1.3;margin:0 0 16px;letter-spacing:-0.3px;">${text}</h2>`
}

function paragraph(text: string): string {
  return `<p style="color:${COLORS.slate700};font-size:15px;line-height:1.7;margin:0 0 16px;">${text}</p>`
}

function calloutBox(content: string, borderColor: string = COLORS.emerald): string {
  return `<div style="background:${COLORS.slate50};border-left:4px solid ${borderColor};border-radius:0 10px 10px 0;padding:20px 24px;margin:24px 0;">
    ${content}
  </div>`
}

function statBox(value: string, label: string, bgColor: string = COLORS.green50): string {
  return `<td style="background:${bgColor};border-radius:10px;padding:20px 12px;text-align:center;width:33%;">
    <p style="font-size:28px;font-weight:800;color:${COLORS.slate900};margin:0;line-height:1;">${value}</p>
    <p style="font-size:11px;color:${COLORS.slate500};margin:6px 0 0;line-height:1.3;">${label}</p>
  </td>`
}

function featureRow(emoji: string, title: string, desc: string): string {
  return `<tr>
    <td style="padding:14px 0;border-bottom:1px solid ${COLORS.slate100};vertical-align:top;width:36px;">
      <span style="font-size:18px;">${emoji}</span>
    </td>
    <td style="padding:14px 0 14px 12px;border-bottom:1px solid ${COLORS.slate100};">
      <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">${title}</p>
      <p style="margin:3px 0 0;color:${COLORS.slate500};font-size:13px;">${desc}</p>
    </td>
  </tr>`
}

function testimonialCard(quote: string, name: string, location: string): string {
  return `<div style="background:${COLORS.slate50};border-radius:10px;padding:20px 24px;margin:12px 0;border-left:3px solid ${COLORS.emerald};">
    <p style="color:${COLORS.slate800};font-size:14px;font-style:italic;line-height:1.6;margin:0 0 10px;">"${quote}"</p>
    <p style="color:${COLORS.slate400};font-size:12px;margin:0;font-weight:600;">— ${name}, ${location}</p>
  </div>`
}

function signoff(): string {
  return `<p style="color:${COLORS.slate500};font-size:13px;margin:24px 0 0;">Talk soon,<br><strong style="color:${COLORS.slate700};">The ShieldHome Pro Team</strong></p>`
}

function urgencyBanner(text: string): string {
  return `<div style="background:${COLORS.red50};border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin:0 0 24px;text-align:center;">
    <p style="color:${COLORS.red500};font-weight:700;font-size:14px;margin:0;">⏰ ${text}</p>
  </div>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${COLORS.slate200};margin:28px 0;">`
}

// ---------------------------------------------------------------------------
// WELCOME EMAILS (sent immediately on form submit)
// ---------------------------------------------------------------------------

export function buildWelcomeEmail(lead: EmailRecipient, unsubUrl: string): EmailContent {
  const key = getSequenceKey(lead)
  const html = emailWrapper(welcomeBody(key, lead, unsubUrl), welcomePreheader(key, lead))
  return {
    subject: welcomeSubject(key, lead),
    preheader: welcomePreheader(key, lead),
    html: html.replace('%%unsubscribe%%', unsubUrl),
    type: 'welcome',
  }
}

function welcomeSubject(key: SequenceKey, lead: EmailRecipient): string {
  switch (key) {
    case 'switch': return `Your ${lead.currentProvider || 'Contract'} Buyout Request — Here's What Happens Next`
    case 'vivint': return "Your Vivint Smart Home Quote — Here's What's Next"
    case 'cost': return "Your Home Security Pricing Breakdown — Here's What's Next"
    case 'standard': return "Your Free Home Security Quote — Here's What's Next"
  }
}

function welcomePreheader(key: SequenceKey, lead: EmailRecipient): string {
  switch (key) {
    case 'switch': return `We're reviewing your ${lead.currentProvider || ''} contract now. A switch specialist will call within minutes.`
    case 'vivint': return 'A Vivint Smart Home Pro will call you shortly with your custom system recommendation.'
    case 'cost': return 'Your personalized pricing breakdown is ready. Here\'s exactly what a system costs.'
    case 'standard': return 'A Smart Home Pro will call you shortly with a custom security recommendation.'
  }
}

function welcomeBody(key: SequenceKey, lead: EmailRecipient, unsubUrl: string): string {
  switch (key) {
    case 'switch': return welcomeSwitch(lead)
    case 'vivint': return welcomeVivint(lead)
    case 'cost': return welcomeCost(lead)
    case 'standard': return welcomeStandard(lead)
  }
}

function welcomeSwitch(lead: EmailRecipient): string {
  const provider = lead.currentProvider || 'your current provider'
  return `
    ${heading(`${lead.firstName}, your switch from ${provider} is underway.`)}
    ${paragraph(`Thanks for choosing ShieldHome Pro. We're already reviewing your contract details and preparing your personalized buyout package.`)}

    ${calloutBox(`
      <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">What happens next:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        ${featureRow('📞', 'A switch specialist calls you', `At ${lead.phone || 'the number you provided'} — usually within minutes`)}
        ${featureRow('💰', 'We calculate your exact buyout', `Up to $1,000 covered to cancel your ${provider} contract`)}
        ${featureRow('📋', 'We handle the paperwork', `Cancellation with ${provider} — you don't have to call them`)}
        ${featureRow('🔧', 'Same/next-day installation', `A certified Vivint tech installs your new system in ~2 hours`)}
      </table>
    `)}

    <div style="background:${COLORS.green50};border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:${COLORS.slate900};font-size:14px;">Your switch package includes:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Up to $1,000 contract buyout</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Free professional installation</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Free doorbell camera</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ 90 days free monitoring ($150 value)</td></tr>
      </table>
    </div>

    ${paragraph(`Can't wait for the call? Reach us anytime — we're ready when you are.`)}
    ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
    ${signoff()}`
}

function welcomeVivint(lead: EmailRecipient): string {
  return `
    ${heading(`${lead.firstName}, great choice — your Vivint quote is being prepared.`)}
    ${paragraph(`You're one step closer to the #1 rated smart home security system in America. A Vivint Smart Home Pro will call you shortly with a custom system recommendation and current promotions.`)}

    ${calloutBox(`
      <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">What happens next:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        ${featureRow('📞', 'A Smart Home Pro calls you', `At ${lead.phone || 'the number you provided'} — usually within minutes`)}
        ${featureRow('🏠', 'Custom system design', 'They\'ll recommend the right cameras, sensors, and smart devices for your home')}
        ${featureRow('💰', 'Quote with current promos', '$0 down, free installation, and bonus equipment')}
        ${featureRow('🔧', 'Professional installation', 'A certified tech installs everything — usually within 24 hours')}
      </table>
    `)}

    <div style="background:${COLORS.green50};border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:${COLORS.slate900};font-size:14px;">Current spring deals include:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">🎁 Buy 2 cameras, get 1 FREE</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">💰 $0 down + $24.99/mo starting</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">🔧 Free professional installation</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">🎁 90 days free monitoring ($150 value)</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">📺 90 days free monitoring (worth $150)</td></tr>
      </table>
    </div>

    ${paragraph(`Can't wait? Call or text us anytime.`)}
    ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
    ${signoff()}`
}

function welcomeCost(lead: EmailRecipient): string {
  return `
    ${heading(`${lead.firstName}, here's your home security pricing breakdown.`)}
    ${paragraph(`Thanks for requesting pricing through HomeShield. You're smart to compare — and we'll make sure you have the full picture before making a decision.`)}

    ${calloutBox(`
      <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">What happens next:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        ${featureRow('📞', 'A security advisor calls you', `At ${lead.phone || 'the number you provided'} for a no-pressure pricing consultation`)}
        ${featureRow('📊', 'Custom quote for your home', 'Based on your home size, entry points, and what you want to protect')}
        ${featureRow('💰', 'Transparent pricing breakdown', 'Equipment, monitoring, installation — no hidden fees')}
        ${featureRow('🎁', 'Current promotions applied', 'We\'ll lock in the best available deals for your area')}
      </table>
    `)}

    <div style="background:${COLORS.amber50};border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:${COLORS.slate900};font-size:14px;">Quick pricing snapshot:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:6px 0;color:${COLORS.slate700};font-size:13px;">📱 24/7 professional monitoring</td><td align="right" style="font-weight:700;color:${COLORS.slate900};font-size:13px;">from $24.99/mo</td></tr>
        <tr><td style="padding:6px 0;color:${COLORS.slate700};font-size:13px;">🔧 Professional installation</td><td align="right" style="font-weight:700;color:${COLORS.emeraldDark};font-size:13px;">FREE</td></tr>
        <tr><td style="padding:6px 0;color:${COLORS.slate700};font-size:13px;">📷 Equipment (cameras, sensors, hub)</td><td align="right" style="font-weight:700;color:${COLORS.emeraldDark};font-size:13px;">$0 down</td></tr>
        <tr><td style="padding:6px 0;color:${COLORS.slate700};font-size:13px;">☁️ Cloud storage & camera playback</td><td align="right" style="font-weight:700;color:${COLORS.emeraldDark};font-size:13px;">Included</td></tr>
      </table>
      <p style="margin:12px 0 0;color:${COLORS.slate500};font-size:12px;font-style:italic;">That's less than $1/day for complete home protection.</p>
    </div>

    ${paragraph(`A security advisor will walk you through your exact pricing on the call. No pressure, no obligation — just the numbers.`)}
    ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
    ${signoff()}`
}

function welcomeStandard(lead: EmailRecipient): string {
  return `
    ${heading(`${lead.firstName}, your free security quote is being prepared!`)}
    ${paragraph(`Thanks for requesting your home security assessment through ShieldHome Pro. You're one step closer to protecting what matters most.`)}

    ${calloutBox(`
      <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">What happens next:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        ${featureRow('📞', 'A Smart Home Pro calls you', `At ${lead.phone || 'the number you provided'} — usually within minutes`)}
        ${featureRow('🏠', 'Home security assessment', 'They\'ll assess your home\'s unique vulnerabilities and needs')}
        ${featureRow('🛡️', 'Custom system recommendation', 'The right cameras, sensors, and smart devices for your situation')}
        ${featureRow('💰', 'Free quote with current promos', 'Zero pressure, zero obligation')}
      </table>
    `)}

    <div style="background:${COLORS.green50};border-radius:12px;padding:20px 24px;margin:24px 0;">
      <p style="margin:0 0 8px;font-weight:700;color:${COLORS.slate900};font-size:14px;">What's included for free:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Custom home security assessment</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Professional installation ($199 value)</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ Free doorbell camera ($249 value)</td></tr>
        <tr><td style="padding:4px 0;color:${COLORS.slate700};font-size:13px;">✅ $0 down equipment financing</td></tr>
      </table>
    </div>

    ${paragraph(`Can't wait for the call? Reach us anytime.`)}
    ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
    ${signoff()}`
}

// ---------------------------------------------------------------------------
// NURTURE SEQUENCES (6 emails each × 4 audiences)
// ---------------------------------------------------------------------------

export function buildNurtureEmail(step: number, lead: EmailRecipient, unsubUrl: string): EmailContent {
  const key = getSequenceKey(lead)
  const builders: Record<SequenceKey, (s: number, l: EmailRecipient) => EmailContent> = {
    vivint: nurtureVivint,
    switch: nurtureSwitch,
    cost: nurtureCost,
    standard: nurtureStandard,
  }
  const content = builders[key](step, lead)
  content.html = emailWrapper(content.html, content.preheader).replace(/%%unsubscribe%%/g, unsubUrl)
  return content
}

// ===== VIVINT SEQUENCE (Google Ads — Vivint keyword searchers) =====

function nurtureVivint(step: number, lead: EmailRecipient): EmailContent {
  const name = lead.firstName
  switch (step) {
    case 0: return {
      type: 'nurture-vivint-0',
      subject: `${name}, your Vivint quote is still waiting`,
      preheader: 'A Smart Home Pro is ready to walk you through your custom system.',
      html: `
        ${heading(`${name}, still interested in Vivint?`)}
        ${paragraph(`We noticed you requested a quote for a Vivint Smart Home system. A Smart Home Pro tried reaching you — but no worries, your quote is still on file and ready.`)}
        ${paragraph(`Here's a quick reminder of why Vivint is the #1 rated system in America:`)}

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
          ${featureRow('🛡️', 'Smart Deter Technology', 'Cameras with spotlights, sirens, and 2-way audio that actively prevent crime')}
          ${featureRow('📱', 'One App, Total Control', 'Cameras, locks, thermostat, garage — all from your phone')}
          ${featureRow('📡', '24/7 Professional Monitoring', 'Real U.S.-based agents dispatch first responders in ~14 seconds')}
          ${featureRow('🔧', 'Pro Installation in 24hrs', 'A certified tech handles everything — placement, wiring, app setup')}
        </table>

        ${paragraph(`Your free consultation takes about 10 minutes. Zero pressure, zero obligation.`)}
        ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 1: return {
      type: 'nurture-vivint-1',
      subject: "Vivint's Smart Deter cameras don't just record — they fight back",
      preheader: 'See how AI-powered cameras are stopping crime before it happens.',
      html: `
        ${heading(`${name}, this is the camera that changes everything.`)}
        ${paragraph(`Most security cameras just watch. Vivint's cameras <strong>fight back</strong>. Here's how Smart Deter technology works:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;padding:24px;margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            <tr><td style="padding:10px 0;"><span style="color:${COLORS.red500};font-weight:800;">1.</span> <strong style="color:${COLORS.slate900};">Camera detects a person</strong> <span style="color:${COLORS.slate500};font-size:13px;">— AI distinguishes people from animals, cars, and shadows</span></td></tr>
            <tr><td style="padding:10px 0;"><span style="color:${COLORS.amber500};font-weight:800;">2.</span> <strong style="color:${COLORS.slate900};">Lights + siren activate</strong> <span style="color:${COLORS.slate500};font-size:13px;">— bright spotlights and loud siren let them know they've been caught</span></td></tr>
            <tr><td style="padding:10px 0;"><span style="color:${COLORS.emerald};font-weight:800;">3.</span> <strong style="color:${COLORS.slate900};">You get a live alert</strong> <span style="color:${COLORS.slate500};font-size:13px;">— talk directly to whoever's there through 2-way audio</span></td></tr>
            <tr><td style="padding:10px 0;"><span style="color:${COLORS.emerald};font-weight:800;">4.</span> <strong style="color:${COLORS.slate900};">Monitoring responds</strong> <span style="color:${COLORS.slate500};font-size:13px;">— if needed, professionals dispatch police in seconds</span></td></tr>
          </table>
        </div>

        ${testimonialCard(
          "The Smart Deter camera caught someone on our porch at 2am and scared them off with the siren. Worth every penny.",
          "Michelle K.", "Charlotte, NC"
        )}

        ${paragraph(`No other system has this. Not ADT. Not Ring. Not SimpliSafe. Only Vivint.`)}
        ${cta(`Get My Free Vivint Quote`)}
        ${signoff()}`
    }

    case 2: return {
      type: 'nurture-vivint-2',
      subject: "What a Vivint system actually costs (no hidden fees)",
      preheader: '$0 down, $24.99/mo, free installation. Here\'s the real breakdown.',
      html: `
        ${heading(`${name}, here's exactly what Vivint costs.`)}
        ${paragraph(`One of the biggest questions people have about Vivint is pricing. Here's the honest, no-BS breakdown:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;overflow:hidden;margin:24px 0;">
          <div style="background:${COLORS.slate900};padding:16px 24px;">
            <p style="color:${COLORS.white};font-weight:700;font-size:15px;margin:0;">The Total Shield Package</p>
          </div>
          <div style="padding:20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Complete security system</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$599</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Professional installation</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$199</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Indoor Camera Pro</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$199</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Smart Doorbell Camera</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$249</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Entry sensors for every door</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$499</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">90 days free monitoring</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$150</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">Visa gift card bonus</td><td align="right" style="color:${COLORS.slate400};font-size:13px;text-decoration:line-through;">$200</td></tr>
              <tr><td colspan="2" style="padding:12px 0 0;border-top:2px solid ${COLORS.slate200};">
                <table role="presentation" width="100%"><tr>
                  <td style="font-weight:800;color:${COLORS.slate900};font-size:15px;">Your cost:</td>
                  <td align="right"><span style="font-weight:800;color:${COLORS.emerald};font-size:18px;">$0 down + $24.99/mo</span></td>
                </tr></table>
              </td></tr>
            </table>
          </div>
        </div>

        ${paragraph(`That's less than <strong>$1/day</strong> for 24/7 professional monitoring, cameras, smart locks, and the most advanced system on the market.`)}
        ${cta(`Lock In This Price`)}
        ${signoff()}`
    }

    case 3: return {
      type: 'nurture-vivint-3',
      subject: `Spring Flash Sale — Buy 2 Cameras, Get 1 Free`,
      preheader: 'Plus 90 days free monitoring. This deal expires soon.',
      html: `
        ${urgencyBanner('Spring Flash Sale — limited-time pricing for your area')}
        ${heading(`${name}, this is the best Vivint deal we've seen all year.`)}
        ${paragraph(`As a top Vivint Smart Home marketing partner, we get access to exclusive promotions. Right now, we can offer you:`)}

        <div style="margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${featureRow('📷', 'Buy 2 Cameras, Get 1 FREE', 'Choose from Outdoor Pro, Indoor Pro, or Doorbell Camera')}
            ${featureRow('🔧', 'Free Professional Installation', 'Certified tech handles everything in ~2 hours')}
            ${featureRow('📺', '90 Days Free Monitoring', '$150 value — on the house')}
            ${featureRow('🔧', 'Free Professional Installation', 'Certified tech handles everything in ~2 hours')}
          </table>
        </div>

        ${calloutBox(`
          <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">These offers are tied to current inventory and promotion windows — they do change.</p>
          <p style="margin:8px 0 0;color:${COLORS.slate700};font-size:13px;">The best way to lock yours in is to get on a quick call today.</p>
        `, COLORS.amber500)}

        ${cta(`Lock In My Offer → ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 4: return {
      type: 'nurture-vivint-4',
      subject: `"I wish we'd done it sooner" — hear from Vivint customers`,
      preheader: 'Real homeowners share why they chose Vivint.',
      html: `
        ${heading(`${name}, here's what other homeowners are saying.`)}
        ${paragraph(`We know it's a big decision. Here are some real experiences from families who went through the same process:`)}

        ${testimonialCard(
          "They were at my house the next morning. The whole system was set up in under 2 hours. I finally sleep through the night.",
          "Sarah M.", "Provo, UT"
        )}
        ${testimonialCard(
          "I was paying ADT $52/month for a system that couldn't tell the difference between my dog and a person. Switched through ShieldHome, they bought out my entire contract. Night and day difference.",
          "Jason R.", "Scottsdale, AZ"
        )}
        ${testimonialCard(
          "The app alone is worth it. I can check on my house from anywhere, lock the doors remotely, and get alerts the second something moves. My husband was skeptical but now he's the one checking the cameras constantly.",
          "Amanda T.", "Dallas, TX"
        )}

        ${paragraph(`Your quote is still on file. Whenever you're ready, a 10-minute call is all it takes.`)}
        ${cta(`Get My Free Quote`)}
        ${signoff()}`
    }

    case 5: default: return {
      type: 'nurture-vivint-5',
      subject: `Closing your Vivint quote file, ${name}`,
      preheader: 'This is our last email. Your quote is still available if you want it.',
      html: `
        ${heading(`${name}, this is our last email.`)}
        ${paragraph(`We've reached out a few times about your Vivint Smart Home quote. We don't want to keep filling your inbox if the timing isn't right.`)}
        ${paragraph(`After today, we'll close your quote file and stop reaching out.`)}

        <div style="background:${COLORS.green50};border:2px solid ${COLORS.emerald};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="color:${COLORS.slate900};font-weight:700;font-size:16px;margin:0 0 8px;">If you're still interested — even a little</p>
          <p style="color:${COLORS.slate700};font-size:14px;margin:0 0 20px;">One 10-minute call. No pressure. Just a free system design and custom quote.</p>
          ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        </div>

        ${paragraph(`If the timing just isn't right, no hard feelings. We hope you stay safe — and if you ever want to revisit, you know where to find us.`)}
        ${signoff()}`
    }
  }
}

// ===== SWITCH SEQUENCE (ADT / contract buyout leads) =====

function nurtureSwitch(step: number, lead: EmailRecipient): EmailContent {
  const name = lead.firstName
  const provider = lead.currentProvider || 'your current provider'

  switch (step) {
    case 0: return {
      type: 'nurture-switch-0',
      subject: `${name}, your ${provider} buyout is being processed`,
      preheader: `We're reviewing your ${provider} contract. A switch specialist will call shortly.`,
      html: `
        ${heading(`${name}, we're working on your switch from ${provider}.`)}
        ${paragraph(`A switch specialist tried reaching you to review your contract details. Your buyout request is on file and ready — here's a quick refresher on what's included:`)}

        <div style="background:${COLORS.green50};border-radius:12px;padding:24px;margin:24px 0;">
          <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">Your Switch Package:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${featureRow('💰', `Up to $1,000 buyout`, `We pay to cancel your ${provider} contract`)}
            ${featureRow('📋', 'We handle cancellation', `No awkward call to ${provider} — we do the paperwork`)}
            ${featureRow('🔧', 'Free professional installation', 'Certified tech installs your new Vivint system in ~2 hours')}
            ${featureRow('📷', 'Free doorbell camera', '$249 value — included with your switch')}
            ${featureRow('📺', '90 Days Free Monitoring', '$150 value — on the house')}
          </table>
        </div>

        ${paragraph(`The sooner we connect, the sooner you stop paying ${provider} for a system you don't want. One call gets the whole process started.`)}
        ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 1: return {
      type: 'nurture-switch-1',
      subject: `Why ${provider === 'ADT' ? 'ADT' : provider} customers are switching to Vivint`,
      preheader: `Smarter cameras, better app, no early termination stress.`,
      html: `
        ${heading(`${name}, here's why people leave ${provider} for Vivint.`)}
        ${paragraph(`You're not alone — thousands of homeowners switch from ${provider} every month. Here's what they say makes the biggest difference:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;overflow:hidden;margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
            <tr style="background:${COLORS.slate900};">
              <td style="padding:12px 16px;color:${COLORS.white};font-weight:700;font-size:13px;">Feature</td>
              <td style="padding:12px 16px;color:${COLORS.emerald};font-weight:700;font-size:13px;text-align:center;">Vivint</td>
              <td style="padding:12px 16px;color:${COLORS.slate400};font-weight:700;font-size:13px;text-align:center;">${provider}</td>
            </tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">AI Smart Deter Cameras</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">✅</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">❌</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">Same/Next-Day Installation</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">✅</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">Weeks</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">Modern App Control</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">✅</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">Basic</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">Contract Buyout</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">Up to $1,000</td><td style="padding:10px 16px;text-align:center;font-size:13px;border-bottom:1px solid ${COLORS.slate200};">N/A</td></tr>
            <tr><td style="padding:10px 16px;font-size:13px;color:${COLORS.slate700};">Cloud Storage</td><td style="padding:10px 16px;text-align:center;font-size:13px;">Included</td><td style="padding:10px 16px;text-align:center;font-size:13px;">$3-10/mo extra</td></tr>
          </table>
        </div>

        ${testimonialCard(
          `I was paying ${provider === 'ADT' ? 'ADT $52/month' : `${provider} way too much`} for a system that couldn't tell the difference between my dog and a person. Switched through ShieldHome, they bought out my entire contract. Night and day difference.`,
          "Jason R.", "Scottsdale, AZ"
        )}

        ${paragraph(`Your buyout request is still active. One quick call and we take it from there.`)}
        ${cta(`Start My Switch`)}
        ${signoff()}`
    }

    case 2: return {
      type: 'nurture-switch-2',
      subject: `How the switch from ${provider} actually works (step by step)`,
      preheader: 'Most switches complete in 24-48 hours. Here\'s exactly what happens.',
      html: `
        ${heading(`${name}, here's how the switch works — step by step.`)}
        ${paragraph(`We know switching feels like a hassle. That's exactly why we handle everything. Here's the full process:`)}

        <div style="margin:24px 0;">
          <div style="display:flex;align-items:flex-start;gap:16px;padding:16px 0;border-bottom:1px solid ${COLORS.slate100};">
            <div style="background:${COLORS.emerald};color:white;font-weight:800;width:32px;height:32px;border-radius:50%;text-align:center;line-height:32px;font-size:14px;flex-shrink:0;">1</div>
            <div>
              <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">Quick phone consultation (10 min)</p>
              <p style="margin:4px 0 0;color:${COLORS.slate500};font-size:13px;">We review your ${provider} contract, calculate your exact buyout amount, and confirm your coverage.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:16px;padding:16px 0;border-bottom:1px solid ${COLORS.slate100};">
            <div style="background:${COLORS.emerald};color:white;font-weight:800;width:32px;height:32px;border-radius:50%;text-align:center;line-height:32px;font-size:14px;flex-shrink:0;">2</div>
            <div>
              <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">We handle ${provider} cancellation</p>
              <p style="margin:4px 0 0;color:${COLORS.slate500};font-size:13px;">No awkward retention calls for you. We take care of the paperwork and cover up to $1,000 in early termination fees.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:16px;padding:16px 0;border-bottom:1px solid ${COLORS.slate100};">
            <div style="background:${COLORS.emerald};color:white;font-weight:800;width:32px;height:32px;border-radius:50%;text-align:center;line-height:32px;font-size:14px;flex-shrink:0;">3</div>
            <div>
              <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">Same/next-day Vivint installation</p>
              <p style="margin:4px 0 0;color:${COLORS.slate500};font-size:13px;">A certified technician installs your complete system in about 2 hours. Zero gap in protection.</p>
            </div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:16px;padding:16px 0;">
            <div style="background:${COLORS.emerald};color:white;font-weight:800;width:32px;height:32px;border-radius:50%;text-align:center;line-height:32px;font-size:14px;flex-shrink:0;">4</div>
            <div>
              <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">You're fully protected with Vivint</p>
              <p style="margin:4px 0 0;color:${COLORS.slate500};font-size:13px;">24/7 monitoring active, app set up, and you're fully covered. Done.</p>
            </div>
          </div>
        </div>

        ${calloutBox(`
          <p style="margin:0;color:${COLORS.slate700};font-size:14px;"><strong>The whole process takes 24–48 hours.</strong> Most people say the hardest part was deciding to make the call — everything after that was easy.</p>
        `)}

        ${cta(`Start My Switch → ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 3: return {
      type: 'nurture-switch-3',
      subject: `${name}, your $1,000 buyout offer is still available`,
      preheader: `Don't keep paying ${provider} for a system you want to leave.`,
      html: `
        ${urgencyBanner(`Your ${provider} buyout offer is still active — but these terms are time-limited`)}
        ${heading(`${name}, why keep paying ${provider}?`)}
        ${paragraph(`Every month you wait is another month paying for a system you've already decided to leave. Here's what's waiting for you:`)}

        <div style="background:${COLORS.green50};border:2px solid ${COLORS.emerald};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="font-size:36px;font-weight:800;color:${COLORS.slate900};margin:0;">$1,000</p>
          <p style="color:${COLORS.slate700};font-size:14px;margin:8px 0 0;">Maximum contract buyout — we pay, not you</p>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0;">
          <tr>
            ${statBox('$0', 'Down payment', COLORS.green50)}
            <td style="width:12px;"></td>
            ${statBox('FREE', 'Installation', COLORS.green50)}
            <td style="width:12px;"></td>
            ${statBox('$200', 'Visa gift card', COLORS.amber50)}
          </tr>
        </table>

        ${paragraph(`<strong>Plus:</strong> Free doorbell camera, free professional installation, and 90 days free monitoring.`)}
        ${paragraph(`One call. That's all it takes to stop paying ${provider} and start protecting your home with the #1 rated system.`)}
        ${cta(`Claim My Buyout Offer`)}
        ${signoff()}`
    }

    case 4: return {
      type: 'nurture-switch-4',
      subject: `Real stories from homeowners who left ${provider === 'ADT' ? 'ADT' : 'their old provider'}`,
      preheader: 'See why thousands switch to Vivint every month.',
      html: `
        ${heading(`${name}, you're not alone — here's what switchers say.`)}
        ${paragraph(`Thousands of homeowners make the switch every month. Here's what they say about the experience:`)}

        ${testimonialCard(
          `I kept putting it off because I figured switching would be a hassle. ShieldHome handled literally everything — they even dealt with ${provider === 'ADT' ? 'ADT' : 'my old provider'} so I didn't have to. New system was installed the next day. I wish I'd done it months ago.`,
          "Mark T.", "Houston, TX"
        )}
        ${testimonialCard(
          "The Smart Deter camera caught someone on our porch at 2am and scared them off with the siren. My old system would've just recorded it. Worth every penny.",
          "Michelle K.", "Charlotte, NC"
        )}
        ${testimonialCard(
          "The app alone is worth it. I can check on my house from anywhere, lock the doors remotely, and get alerts the second something moves. My husband was skeptical but now he's the one checking the cameras constantly.",
          "Amanda T.", "Dallas, TX"
        )}

        ${paragraph(`Your buyout request is still active. A 10-minute call is all it takes to get started.`)}
        ${cta(`Start My Switch`)}
        ${signoff()}`
    }

    case 5: default: return {
      type: 'nurture-switch-5',
      subject: `Closing your ${provider} buyout file — last chance, ${name}`,
      preheader: `After today we'll close your buyout request. Here's one last look.`,
      html: `
        ${heading(`${name}, this is our last email.`)}
        ${paragraph(`We've reached out a few times about your ${provider} contract buyout. We don't want to keep filling your inbox if the timing isn't right.`)}
        ${paragraph(`After today, we'll close your buyout file and stop reaching out.`)}

        <div style="background:${COLORS.green50};border:2px solid ${COLORS.emerald};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="color:${COLORS.slate900};font-weight:700;font-size:16px;margin:0 0 8px;">If you're still thinking about switching</p>
          <p style="color:${COLORS.slate700};font-size:14px;margin:0 0 4px;">Up to $1,000 buyout · Free installation</p>
          <p style="color:${COLORS.slate500};font-size:13px;margin:0 0 20px;">One call. We handle everything from there.</p>
          ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        </div>

        ${paragraph(`No hard feelings either way. We hope your home stays safe — and if you ever want to revisit, you know where to find us.`)}
        ${signoff()}`
    }
  }
}

// ===== COST SEQUENCE (homeshield.pro — price/cost shoppers) =====

function nurtureCost(step: number, lead: EmailRecipient): EmailContent {
  const name = lead.firstName

  switch (step) {
    case 0: return {
      type: 'nurture-cost-0',
      subject: `${name}, your home security pricing is ready`,
      preheader: 'Here\'s what a professionally monitored system actually costs in 2026.',
      html: `
        ${heading(`${name}, still comparing home security prices?`)}
        ${paragraph(`We know you're doing your research — that's smart. Here's a quick pricing snapshot so you have the numbers before your consultation:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;overflow:hidden;margin:24px 0;">
          <div style="background:${COLORS.slate900};padding:16px 24px;">
            <p style="color:${COLORS.white};font-weight:700;font-size:15px;margin:0;">2026 Home Security Cost Guide</p>
          </div>
          <div style="padding:20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
              <tr><td style="padding:10px 0;border-bottom:1px solid ${COLORS.slate200};"><span style="color:${COLORS.slate700};font-size:13px;">DIY systems (Ring, SimpliSafe)</span></td><td align="right" style="padding:10px 0;border-bottom:1px solid ${COLORS.slate200};color:${COLORS.slate700};font-size:13px;">$200–$600 up front + $10–$30/mo</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid ${COLORS.slate200};"><span style="color:${COLORS.slate700};font-size:13px;">Traditional (ADT, Brinks)</span></td><td align="right" style="padding:10px 0;border-bottom:1px solid ${COLORS.slate200};color:${COLORS.slate700};font-size:13px;">$99–$199 install + $25–$60/mo</td></tr>
              <tr style="background:${COLORS.green50};">
                <td style="padding:12px 10px;border-radius:8px 0 0 8px;"><strong style="color:${COLORS.emeraldDark};font-size:14px;">ShieldHome / Vivint</strong></td>
                <td align="right" style="padding:12px 10px;border-radius:0 8px 8px 0;"><strong style="color:${COLORS.emeraldDark};font-size:14px;">$0 down + $24.99/mo</strong></td>
              </tr>
            </table>
          </div>
        </div>

        ${calloutBox(`
          <p style="margin:0;color:${COLORS.slate700};font-size:14px;">With ShieldHome, there are <strong>no hidden fees</strong>. Installation is free, cloud storage is included, and you won't find surprise charges on your bill. That's less than <strong>$1/day</strong> for complete protection.</p>
        `)}

        ${paragraph(`Want the exact pricing for your home? A quick call with a security advisor will get you a custom quote with current promotions applied.`)}
        ${cta(`Get My Exact Price`)}
        ${signoff()}`
    }

    case 1: return {
      type: 'nurture-cost-1',
      subject: "The hidden costs of home security (and how to avoid them)",
      preheader: 'Equipment fees, cloud storage charges, rate increases — here\'s what to watch for.',
      html: `
        ${heading(`${name}, watch out for these hidden costs.`)}
        ${paragraph(`Not all home security pricing is what it seems. Here are the most common surprise charges that other companies don't tell you about:`)}

        <div style="margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${featureRow('💸', 'Equipment rental fees ($5–$15/mo)', 'Some companies charge monthly to rent the equipment in your own home. With ShieldHome: $0.')}
            ${featureRow('📹', 'Camera cloud storage ($3–$10/mo per camera)', 'Ring and others charge per camera for cloud playback. With Vivint: included in your plan.')}
            ${featureRow('🔧', 'Installation fees ($99–$300)', 'ADT charges up to $199 just to show up. With ShieldHome: always free.')}
            ${featureRow('📈', 'Annual rate increases', 'Many providers hike your rate after year one. ShieldHome: locked-in pricing.')}
            ${featureRow('💀', 'Early termination fees ($500–$1,400)', 'ADT charges up to $1,400 if you cancel early. With ShieldHome: flexible terms.')}
          </table>
        </div>

        ${calloutBox(`
          <p style="margin:0;color:${COLORS.slate900};font-weight:700;font-size:14px;">The ShieldHome difference:</p>
          <p style="margin:8px 0 0;color:${COLORS.slate700};font-size:13px;">$0 down. Free installation. No equipment rental. No cloud storage fees. No rate surprises. Locked-in pricing from day one.</p>
        `)}

        ${paragraph(`Want to see the full cost breakdown for your home? One quick call — no pressure, no obligation.`)}
        ${cta(`Get My Cost Breakdown`)}
        ${signoff()}`
    }

    case 2: return {
      type: 'nurture-cost-2',
      subject: "DIY vs. professional security — which is actually worth it?",
      preheader: 'Ring and SimpliSafe are cheap up front. But here\'s the real math.',
      html: `
        ${heading(`${name}, is a professional system worth the price?`)}
        ${paragraph(`It's a fair question. DIY systems like Ring and SimpliSafe cost less up front. But let's look at the full picture:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;overflow:hidden;margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
            <tr style="background:${COLORS.slate900};">
              <td style="padding:12px 14px;color:${COLORS.white};font-weight:700;font-size:12px;"></td>
              <td style="padding:12px 14px;color:${COLORS.emerald};font-weight:700;font-size:12px;text-align:center;">Professional</td>
              <td style="padding:12px 14px;color:${COLORS.slate400};font-weight:700;font-size:12px;text-align:center;">DIY</td>
            </tr>
            <tr><td style="padding:10px 14px;font-size:12px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">If someone breaks in at 3am</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.emeraldDark};border-bottom:1px solid ${COLORS.slate200};font-weight:700;">Police dispatched in ~14 sec</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.slate500};border-bottom:1px solid ${COLORS.slate200};">You get a phone notification</td></tr>
            <tr><td style="padding:10px 14px;font-size:12px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">Fire or CO alarm</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.emeraldDark};border-bottom:1px solid ${COLORS.slate200};font-weight:700;">Fire dept dispatched automatically</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.slate500};border-bottom:1px solid ${COLORS.slate200};">Alarm sounds (you hope someone calls)</td></tr>
            <tr><td style="padding:10px 14px;font-size:12px;color:${COLORS.slate700};border-bottom:1px solid ${COLORS.slate200};">WiFi goes down</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.emeraldDark};border-bottom:1px solid ${COLORS.slate200};font-weight:700;">Cellular backup keeps working</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.slate500};border-bottom:1px solid ${COLORS.slate200};">System goes offline</td></tr>
            <tr><td style="padding:10px 14px;font-size:12px;color:${COLORS.slate700};">Installation</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.emeraldDark};font-weight:700;">Certified tech, 2 hours</td><td style="padding:10px 14px;text-align:center;font-size:12px;color:${COLORS.slate500};">You + YouTube + 4-6 hours</td></tr>
          </table>
        </div>

        ${paragraph(`The honest answer: DIY is fine if you just want cameras. But if you want real protection — the kind where someone breaks in at 3am and police show up while you're still half asleep — a professional system pays for itself.`)}

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0;">
          <tr>
            ${statBox('1 in 36', 'Homes burglarized/year', COLORS.red50)}
            <td style="width:12px;"></td>
            ${statBox('$2,800', 'Avg loss per burglary', COLORS.amber50)}
            <td style="width:12px;"></td>
            ${statBox('300%', 'Less likely with a system', COLORS.green50)}
          </tr>
        </table>

        ${paragraph(`Your custom pricing is still available. Get the numbers for your home with a quick, no-pressure call.`)}
        ${cta(`Get My Custom Price`)}
        ${signoff()}`
    }

    case 3: return {
      type: 'nurture-cost-3',
      subject: `Spring deals — $0 down, free cameras, free install`,
      preheader: 'Current promotions for your area. Limited time.',
      html: `
        ${urgencyBanner('Spring Flash Sale — limited-time pricing available')}
        ${heading(`${name}, here's what's available right now.`)}
        ${paragraph(`Since you were comparing prices, we wanted to make sure you saw the current Spring Flash Sale promotions:`)}

        <div style="background:${COLORS.slate50};border-radius:12px;overflow:hidden;margin:24px 0;">
          <div style="background:${COLORS.slate900};padding:16px 24px;">
            <p style="color:${COLORS.white};font-weight:700;font-size:15px;margin:0;">The Total Shield Package — Spring Pricing</p>
          </div>
          <div style="padding:20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">📷 Buy 2 cameras, get 1 FREE</td><td align="right" style="color:${COLORS.emeraldDark};font-size:13px;font-weight:600;">Save $199+</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">🔧 Professional installation</td><td align="right" style="color:${COLORS.emeraldDark};font-size:13px;font-weight:600;">FREE ($199 value)</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">📺 First 90 days monitoring</td><td align="right" style="color:${COLORS.emeraldDark};font-size:13px;font-weight:600;">FREE ($150 value)</td></tr>
              <tr><td style="padding:8px 0;color:${COLORS.slate700};font-size:13px;">💳 Visa gift card bonus</td><td align="right" style="color:${COLORS.emeraldDark};font-size:13px;font-weight:600;">Up to $200</td></tr>
              <tr><td colspan="2" style="padding:16px 0 0;border-top:2px solid ${COLORS.slate200};">
                <table role="presentation" width="100%"><tr>
                  <td style="font-weight:800;color:${COLORS.slate900};font-size:15px;">Total cost:</td>
                  <td align="right"><span style="font-weight:800;color:${COLORS.emerald};font-size:18px;">$0 down + from $24.99/mo</span></td>
                </tr></table>
              </td></tr>
            </table>
          </div>
        </div>

        ${paragraph(`These promotions are tied to current inventory and change regularly. Lock yours in with a quick call.`)}
        ${cta(`Lock In Spring Pricing`)}
        ${signoff()}`
    }

    case 4: return {
      type: 'nurture-cost-4',
      subject: `"Is it really worth it?" — homeowners weigh in`,
      preheader: 'Real families share what they pay and whether it\'s worth the cost.',
      html: `
        ${heading(`${name}, here's what real homeowners say about the cost.`)}
        ${paragraph(`When people ask "is home security worth it?" — here's what paying customers tell us:`)}

        ${testimonialCard(
          "I kept putting it off for two years, thinking it was too expensive. After we finally got the system installed, I wished we'd done it when we first got the quote. Total peace of mind for less than my streaming subscriptions.",
          "Mark T.", "Houston, TX"
        )}
        ${testimonialCard(
          "Our alarm went off at 2am — monitoring called us and had police there in 4 minutes. Nothing was taken. I can't imagine not having it. The cost is nothing compared to what we almost lost.",
          "David R.", "Atlanta, GA"
        )}
        ${testimonialCard(
          "We compared Ring, SimpliSafe, and Vivint for months. Vivint costs a bit more per month, but the professional monitoring and smart cameras are on a different level. You get what you pay for.",
          "Sarah M.", "Provo, UT"
        )}

        ${calloutBox(`
          <p style="margin:0;color:${COLORS.slate700};font-size:14px;">Most families pay <strong>$35–$55/month</strong> total. That's roughly <strong>$1.50/day</strong> — less than a coffee — for 24/7 professional monitoring, smart cameras, and emergency response.</p>
        `)}

        ${paragraph(`Your pricing consultation is still available. No pressure — just the numbers for your home.`)}
        ${cta(`Get My Custom Price`)}
        ${signoff()}`
    }

    case 5: default: return {
      type: 'nurture-cost-5',
      subject: `Closing your pricing file — last chance, ${name}`,
      preheader: 'This is our last email. Your custom pricing is still available.',
      html: `
        ${heading(`${name}, this is our last email.`)}
        ${paragraph(`We've reached out a few times about your home security pricing request. We don't want to keep filling your inbox if you've already made a decision.`)}
        ${paragraph(`After today, we'll close your file and stop reaching out.`)}

        <div style="background:${COLORS.green50};border:2px solid ${COLORS.emerald};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="color:${COLORS.slate900};font-weight:700;font-size:16px;margin:0 0 8px;">Still comparing prices?</p>
          <p style="color:${COLORS.slate700};font-size:14px;margin:0 0 4px;">$0 down · Free installation · From $24.99/mo</p>
          <p style="color:${COLORS.slate500};font-size:13px;margin:0 0 20px;">One quick call for your exact pricing. No pressure.</p>
          ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        </div>

        ${paragraph(`If you've already found the right system, no hard feelings. We hope your home stays safe — and if you ever want to revisit, you know where to find us.`)}
        ${signoff()}`
    }
  }
}

// ===== STANDARD SEQUENCE (Homepage quiz / direct traffic) =====

function nurtureStandard(step: number, lead: EmailRecipient): EmailContent {
  const name = lead.firstName

  switch (step) {
    case 0: return {
      type: 'nurture-standard-0',
      subject: `${name}, your home security quote is ready`,
      preheader: 'A Smart Home Pro is ready to walk you through your custom recommendation.',
      html: `
        ${heading(`${name}, your quote is still waiting.`)}
        ${paragraph(`Thanks for completing your home security assessment through ShieldHome Pro. A Smart Home Pro tried reaching you — but don't worry, your quote is on file and ready whenever you are.`)}

        ${calloutBox(`
          <p style="margin:0 0 12px;font-weight:700;color:${COLORS.slate900};font-size:15px;">Your free consultation includes:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${featureRow('🏠', 'Custom security assessment', 'Based on your home\'s specific vulnerabilities')}
            ${featureRow('📷', 'System recommendation', 'The right cameras, sensors, and smart devices for your situation')}
            ${featureRow('💰', 'Quote with current promos', '$0 down, free installation, and bonus equipment')}
            ${featureRow('🛡️', 'No pressure', 'Zero obligation — just information to help you decide')}
          </table>
        `)}

        ${paragraph(`The whole call takes about 10 minutes. Whenever you're ready, we're here.`)}
        ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 1: return {
      type: 'nurture-standard-1',
      subject: "Why 2 million families trust Vivint (and what makes it different)",
      preheader: '#1 rated smart home security. Here\'s what sets it apart.',
      html: `
        ${heading(`${name}, here's why Vivint is #1.`)}
        ${paragraph(`When you requested your security quote, you took the first step toward protecting your home with the most advanced system available. Here's what makes Vivint different from everything else:`)}

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">
          ${featureRow('🛡️', 'Smart Deter Technology', 'AI-powered cameras with spotlights, sirens, and 2-way audio that actively scare off intruders — before they break in')}
          ${featureRow('📱', 'One App, Total Control', 'Lock doors, watch cameras, adjust thermostat, arm your system — all from one app, anywhere')}
          ${featureRow('📡', '24/7 Professional Monitoring', 'Real U.S.-based agents dispatch police, fire, and medical in an average of 14 seconds')}
          ${featureRow('🔧', 'Professional Installation', 'A certified technician installs, tests, and trains you — usually within 24 hours')}
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0;">
          <tr>
            ${statBox('2M+', 'Homes protected', COLORS.green50)}
            <td style="width:12px;"></td>
            ${statBox('14s', 'Avg response time', COLORS.amber50)}
            <td style="width:12px;"></td>
            ${statBox('25+', 'Years in business', COLORS.slate50)}
          </tr>
        </table>

        ${paragraph(`Your personalized quote is still available. A quick call is all it takes.`)}
        ${cta(`Get My Free Quote`)}
        ${signoff()}`
    }

    case 2: return {
      type: 'nurture-standard-2',
      subject: `"Is a home security system really worth it?"`,
      preheader: '1 in 36 homes are burglarized each year. Here\'s the honest answer.',
      html: `
        ${heading(`${name}, great question.`)}
        ${paragraph(`One of the most common things people tell us is: <em>"I've been thinking about it for a while, but I'm not sure it's really necessary."</em>`)}
        ${paragraph(`Here's what the data says:`)}

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:24px 0;">
          <tr>
            ${statBox('1 in 36', 'Homes burglarized/year', COLORS.red50)}
            <td style="width:12px;"></td>
            ${statBox('$2,800', 'Avg loss per burglary', COLORS.amber50)}
            <td style="width:12px;"></td>
            ${statBox('300%', 'Less likely with a system', COLORS.green50)}
          </tr>
        </table>

        ${paragraph(`The honest answer? A monitored security system is the single most effective deterrent against break-ins. And most homeowners tell us they wish they'd done it sooner.`)}

        ${calloutBox(`
          <p style="margin:0;color:${COLORS.slate700};font-size:14px;">Current promotions include <strong>free equipment, free professional installation, and $0 down</strong>. A complete Vivint system starts at <strong>$24.99/month</strong> — less than $1/day.</p>
        `)}

        ${paragraph(`Your quote is still ready. A 10-minute call to find out what a system would cost for your home.`)}
        ${cta(`See My Free Quote`)}
        ${signoff()}`
    }

    case 3: return {
      type: 'nurture-standard-3',
      subject: "Your exclusive spring offer — this won't last long",
      preheader: 'Buy 2 cameras get 1 free, free installation, and more.',
      html: `
        ${urgencyBanner('Spring Flash Sale — limited-time promotions for your area')}
        ${heading(`${name}, a quick heads up.`)}
        ${paragraph(`These promotions are currently active for your area through ShieldHome Pro:`)}

        <div style="margin:24px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${featureRow('📷', 'Buy 2 Cameras, Get 1 FREE', 'Outdoor Pro, Indoor Pro, or Doorbell — your choice')}
            ${featureRow('🔧', 'Free Professional Installation', 'Certified technician installs your entire system ($199 value)')}
            ${featureRow('📺', '90 Days Free Monitoring', '$150 value — on the house')}
            ${featureRow('💰', '$0 Down on Equipment', 'No large upfront cost — flexible monthly financing')}
            ${featureRow('📺', '90 Days Free Monitoring', '$150 value — on the house')}
          </table>
        </div>

        ${calloutBox(`
          <p style="margin:0;font-weight:700;color:${COLORS.slate900};font-size:14px;">These offers are tied to current inventory and promotion windows.</p>
          <p style="margin:8px 0 0;color:${COLORS.slate700};font-size:13px;">The best way to lock yours in is to get on a quick call today.</p>
        `, COLORS.amber500)}

        ${cta(`Lock In My Offer → ${PHONE_NUMBER}`)}
        ${signoff()}`
    }

    case 4: return {
      type: 'nurture-standard-4',
      subject: `${name}, still thinking about home security?`,
      preheader: 'No rush — but here\'s what other homeowners say.',
      html: `
        ${heading(`No rush — but here's what others are saying.`)}
        ${paragraph(`${name}, we know life gets busy. We just want to make sure you have the info you need when you're ready.`)}

        ${testimonialCard(
          "I kept putting it off for two years. After we finally got the system installed, I wished we'd done it when we first got the quote. Total peace of mind.",
          "Mark T.", "Houston, TX"
        )}
        ${testimonialCard(
          "The setup took about 2 hours. The tech was great. Now I can check in on my kids and the house from my phone anywhere. Worth every penny.",
          "Sarah K.", "Tampa, FL"
        )}
        ${testimonialCard(
          "Our alarm went off at 2am — monitoring called us and had police there in 4 minutes. Nothing was taken. I can't imagine not having it.",
          "David R.", "Atlanta, GA"
        )}

        ${paragraph(`Whenever you're ready, we're here. Your quote is still on file and we can have a Smart Home Pro call you at any time that works.`)}
        ${cta(`Schedule My Call`)}
        ${signoff()}`
    }

    case 5: default: return {
      type: 'nurture-standard-5',
      subject: `Closing your quote file — last chance, ${name}`,
      preheader: 'This is our last email. Your quote is still available if you want it.',
      html: `
        ${heading(`${name}, this is our last email.`)}
        ${paragraph(`We've reached out a few times about your free home security quote. We don't want to keep filling your inbox if the timing isn't right.`)}
        ${paragraph(`After today, we'll close your quote file and stop reaching out.`)}

        <div style="background:${COLORS.green50};border:2px solid ${COLORS.emerald};border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <p style="color:${COLORS.slate900};font-weight:700;font-size:16px;margin:0 0 8px;">If you're still interested — even a little</p>
          <p style="color:${COLORS.slate700};font-size:14px;margin:0 0 20px;">One 10-minute call. No pressure. Just a free assessment and a custom quote.</p>
          ${cta(`📞 Call Now: ${PHONE_NUMBER}`)}
        </div>

        ${paragraph(`If the timing just isn't right, no hard feelings. We hope you stay safe — and if you ever want to revisit, you know where to find us.`)}
        ${signoff()}`
    }
  }
}

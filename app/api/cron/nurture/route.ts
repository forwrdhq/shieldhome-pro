import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/sendgrid'
import { PHONE_NUMBER, APP_URL } from '@/lib/constants'

const NURTURE_SCHEDULE_HOURS = [0, 24, 72, 168, 336, 504]

function buildNurtureEmail(step: number, firstName: string, unsubUrl: string): { subject: string; html: string; type: string } {
  const header = `
    <div style="background:#1A1A2E;padding:20px 24px;text-align:center;">
      <span style="color:#00C853;font-size:22px;font-weight:800;letter-spacing:-0.5px;">ShieldHome Pro</span>
      <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:4px 0 0;">Authorized Vivint Smart Home Dealer</p>
    </div>`
  const footer = `
    <div style="background:#f1f1f1;padding:16px 24px;text-align:center;border-top:1px solid #e0e0e0;">
      <p style="color:#999;font-size:11px;margin:0;">
        ShieldHome Pro | Authorized Vivint Dealer<br>
        <a href="${unsubUrl}" style="color:#999;">Unsubscribe</a> &nbsp;|&nbsp; <a href="${APP_URL}/privacy" style="color:#999;">Privacy Policy</a>
      </p>
    </div>`
  const wrap = (body: string) => `
    <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f8f9fa;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
    <table width="100%" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <tr><td>${header}</td></tr>
    <tr><td style="padding:32px 32px 24px;">${body}</td></tr>
    <tr><td>${footer}</td></tr>
    </table></td></tr></table>
    </body></html>`

  const cta = (text: string, href: string = `tel:${PHONE_NUMBER}`) =>
    `<div style="text-align:center;margin:28px 0;">
      <a href="${href}" style="background:#00C853;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">${text}</a>
    </div>`

  switch (step) {
    case 0:
      return {
        type: 'welcome',
        subject: "Your Free Home Security Quote — Here's What's Next",
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">Hi ${firstName}, your quote request is in!</h2>
          <p style="color:#555;line-height:1.6;">Thanks for reaching out to ShieldHome Pro. You're one step closer to getting your home fully protected with a Vivint Smart Home system.</p>
          <div style="background:#f0faf4;border-left:4px solid #00C853;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
            <p style="margin:0;color:#1A1A2E;font-weight:700;">What happens next:</p>
            <ul style="color:#555;line-height:1.8;margin:8px 0 0;padding-left:20px;">
              <li>A Vivint Smart Home Pro will call you shortly</li>
              <li>They'll walk you through a custom security plan at no cost</li>
              <li>You'll get a quote with current promotions — zero obligation</li>
            </ul>
          </div>
          <p style="color:#555;line-height:1.6;">Can't wait? Give us a call or text right now — we're ready when you are.</p>
          ${cta(`📞 Call/Text: ${PHONE_NUMBER}`)}
          <p style="color:#888;font-size:13px;">Talk soon,<br><strong>The ShieldHome Pro Team</strong></p>
        `),
      }

    case 1:
      return {
        type: 'nurture-1',
        subject: 'Why 2 million families chose Vivint (and why it matters)',
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">Hi ${firstName}, still thinking about it?</h2>
          <p style="color:#555;line-height:1.6;">We just wanted to check in on your free home security quote. Here's something worth knowing:</p>
          <div style="background:#fff8e1;border:1px solid #ffe082;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
            <p style="font-size:32px;font-weight:800;color:#1A1A2E;margin:0;">2,000,000+</p>
            <p style="color:#555;margin:6px 0 0;font-size:14px;">Families currently protected by Vivint Smart Home</p>
          </div>
          <p style="color:#555;line-height:1.6;">Vivint is consistently rated the <strong>#1 Smart Home Security system</strong> in America. Here's what sets it apart from every other option:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr style="background:#f8f9fa;">
              <td style="padding:10px 12px;color:#1A1A2E;font-weight:700;font-size:13px;">✅ 24/7 Professional Monitoring</td>
              <td style="padding:10px 12px;color:#555;font-size:13px;">Police, fire, and medical response</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;color:#1A1A2E;font-weight:700;font-size:13px;">✅ Smart Home Integration</td>
              <td style="padding:10px 12px;color:#555;font-size:13px;">Locks, lights, garage, thermostats</td>
            </tr>
            <tr style="background:#f8f9fa;">
              <td style="padding:10px 12px;color:#1A1A2E;font-weight:700;font-size:13px;">✅ Professional Installation</td>
              <td style="padding:10px 12px;color:#555;font-size:13px;">A certified tech sets everything up</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;color:#1A1A2E;font-weight:700;font-size:13px;">✅ App Control</td>
              <td style="padding:10px 12px;color:#555;font-size:13px;">Arm, view cameras, get alerts anywhere</td>
            </tr>
          </table>
          <p style="color:#555;line-height:1.6;">Your free quote is still waiting. No pressure — just a 10-minute call to see what makes sense for your home.</p>
          ${cta(`Get My Free Quote → ${PHONE_NUMBER}`)}
          <p style="color:#888;font-size:13px;">— The ShieldHome Pro Team</p>
        `),
      }

    case 2:
      return {
        type: 'nurture-2',
        subject: '"Is a home security system really worth it?" — Here\'s the honest answer',
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">Hi ${firstName}, great question.</h2>
          <p style="color:#555;line-height:1.6;">One of the most common things people tell us is: <em>"I've been thinking about it for a while, but I'm not sure it's really necessary."</em></p>
          <p style="color:#555;line-height:1.6;">Here's what the data actually says:</p>
          <div style="display:flex;gap:12px;margin:20px 0;flex-wrap:wrap;">
            <div style="flex:1;min-width:150px;background:#fff3f3;border-radius:8px;padding:16px;text-align:center;">
              <p style="font-size:28px;font-weight:800;color:#e53935;margin:0;">1 in 36</p>
              <p style="font-size:12px;color:#555;margin:6px 0 0;">U.S. homes burglarized each year</p>
            </div>
            <div style="flex:1;min-width:150px;background:#fff8e1;border-radius:8px;padding:16px;text-align:center;">
              <p style="font-size:28px;font-weight:800;color:#f9a825;margin:0;">$2,800</p>
              <p style="font-size:12px;color:#555;margin:6px 0 0;">Average loss per burglary</p>
            </div>
            <div style="flex:1;min-width:150px;background:#f0faf4;border-radius:8px;padding:16px;text-align:center;">
              <p style="font-size:28px;font-weight:800;color:#00C853;margin:0;">300%</p>
              <p style="font-size:12px;color:#555;margin:6px 0 0;">Less likely to be targeted with a visible security system</p>
            </div>
          </div>
          <p style="color:#555;line-height:1.6;">The honest answer? A monitored security system is <strong>the single most effective deterrent</strong> against break-ins — and most homeowners tell us they wish they'd done it sooner.</p>
          <p style="color:#555;line-height:1.6;">Your quote is still ready. It only takes a few minutes to find out what a system would cost for your home — and current promotions include <strong>free equipment and free professional installation</strong>.</p>
          ${cta(`See My Free Quote`)}
          <p style="color:#888;font-size:13px;">— The ShieldHome Pro Team<br><a href="tel:${PHONE_NUMBER}" style="color:#00C853;">${PHONE_NUMBER}</a></p>
        `),
      }

    case 3:
      return {
        type: 'nurture-3',
        subject: 'Your exclusive Vivint offer — this won\'t last long',
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">Hi ${firstName}, a quick heads up.</h2>
          <div style="background:#fff3f3;border:2px solid #ef9a9a;border-radius:8px;padding:20px;margin:0 0 24px;text-align:center;">
            <p style="color:#c62828;font-weight:700;font-size:16px;margin:0 0 4px;">⏰ Current Promotion — Limited Time</p>
            <p style="color:#555;font-size:13px;margin:0;">Available for quote requests made this month</p>
          </div>
          <p style="color:#555;line-height:1.6;">When we spoke with your area's Vivint rep, they confirmed these promotions are currently active for your ZIP code:</p>
          <div style="margin:20px 0;">
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee;">
              <span style="color:#00C853;font-size:20px;">🎁</span>
              <div><p style="margin:0;font-weight:700;color:#1A1A2E;">Free Doorbell Camera</p><p style="margin:0;color:#777;font-size:13px;">Valued at $249 — included with system</p></div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #eee;">
              <span style="color:#00C853;font-size:20px;">🔧</span>
              <div><p style="margin:0;font-weight:700;color:#1A1A2E;">Free Professional Installation</p><p style="margin:0;color:#777;font-size:13px;">A certified technician sets up your entire system</p></div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;padding:12px 0;">
              <span style="color:#00C853;font-size:20px;">💰</span>
              <div><p style="margin:0;font-weight:700;color:#1A1A2E;">$0 Down on Equipment</p><p style="margin:0;color:#777;font-size:13px;">No large upfront cost — flexible monthly plans</p></div>
            </div>
          </div>
          <p style="color:#555;line-height:1.6;">These offers are tied to current inventory and promotion windows — they do change. The best way to lock yours in is to get on a quick call with a Smart Home Pro today.</p>
          ${cta(`Lock In My Offer → ${PHONE_NUMBER}`)}
          <p style="color:#888;font-size:13px;">— The ShieldHome Pro Team</p>
        `),
      }

    case 4:
      return {
        type: 'nurture-4',
        subject: `${firstName}, still thinking about home security?`,
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">No rush — but here's what others are saying.</h2>
          <p style="color:#555;line-height:1.6;">Hi ${firstName}, we know life gets busy. We just want to make sure you have the info you need when you're ready.</p>
          <div style="margin:24px 0;">
            <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:12px;border-left:3px solid #00C853;">
              <p style="color:#1A1A2E;font-style:italic;margin:0 0 8px;">"I kept putting it off for two years. After we finally got the system installed, I wished we'd done it when we first got the quote. Total peace of mind."</p>
              <p style="color:#999;font-size:12px;margin:0;">— Mark T., homeowner in Texas</p>
            </div>
            <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:12px;border-left:3px solid #00C853;">
              <p style="color:#1A1A2E;font-style:italic;margin:0 0 8px;">"The setup took 3 hours. The rep was great. Now I can check in on my kids and the house from my phone anywhere. Worth every penny."</p>
              <p style="color:#999;font-size:12px;margin:0;">— Sarah K., homeowner in Florida</p>
            </div>
            <div style="background:#f8f9fa;border-radius:8px;padding:20px;border-left:3px solid #00C853;">
              <p style="color:#1A1A2E;font-style:italic;margin:0 0 8px;">"Our alarm went off at 2am — monitoring called us and had police there in 4 minutes. Nothing was taken. I can't imagine not having it."</p>
              <p style="color:#999;font-size:12px;margin:0;">— David R., homeowner in Georgia</p>
            </div>
          </div>
          <p style="color:#555;line-height:1.6;">Whenever you're ready, we're here. Your quote is still on file and we can have a Smart Home Pro call you at any time that works.</p>
          ${cta(`Schedule My Call`)}
          <p style="color:#888;font-size:13px;">— The ShieldHome Pro Team<br><a href="tel:${PHONE_NUMBER}" style="color:#00C853;">${PHONE_NUMBER}</a></p>
        `),
      }

    case 5:
    default:
      return {
        type: 'nurture-5',
        subject: `Closing your quote file — last chance, ${firstName}`,
        html: wrap(`
          <h2 style="color:#1A1A2E;margin-top:0;">Hi ${firstName}, this is our last email.</h2>
          <p style="color:#555;line-height:1.6;">We've reached out a few times about your free Vivint home security quote. We don't want to keep filling your inbox if it's not the right time.</p>
          <p style="color:#555;line-height:1.6;">After today, we'll close your quote file and stop reaching out.</p>
          <div style="background:#f0faf4;border:2px solid #00C853;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
            <p style="color:#1A1A2E;font-weight:700;font-size:16px;margin:0 0 8px;">But if you're still interested — even a little —</p>
            <p style="color:#555;font-size:14px;margin:0 0 16px;">One 10-minute call is all it takes. No pressure, no obligation. Just a free assessment and a custom quote.</p>
            <a href="tel:${PHONE_NUMBER}" style="background:#00C853;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">📞 Call Now: ${PHONE_NUMBER}</a>
          </div>
          <p style="color:#555;line-height:1.6;">If the timing just isn't right, no hard feelings. We hope you stay safe — and if you ever want to revisit, you know where to find us.</p>
          <p style="color:#888;font-size:13px;">Take care,<br><strong>The ShieldHome Pro Team</strong><br>Authorized Vivint Smart Home Dealer</p>
        `),
      }
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const leads = await prisma.lead.findMany({
      where: {
        nurtureActive: true,
        nurtureStep: { lt: 6 },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST', 'NOT_QUALIFIED', 'CANCELLED'] },
      }
    })

    let sent = 0

    for (const lead of leads) {
      const nextStep = lead.nurtureStep
      const hoursRequired = NURTURE_SCHEDULE_HOURS[nextStep]
      if (hoursRequired === undefined) continue

      const hoursSinceSubmit = (Date.now() - lead.submittedAt.getTime()) / 3600000
      if (hoursSinceSubmit < hoursRequired) continue

      if (!lead.email) continue
      const unsubUrl = `${APP_URL}/unsubscribe?email=${encodeURIComponent(lead.email)}&id=${lead.id}`
      const emailInfo = buildNurtureEmail(nextStep, lead.firstName, unsubUrl)

      const msgId = await sendEmail({ to: lead.email, subject: emailInfo.subject, html: emailInfo.html })

      if (msgId) {
        await Promise.all([
          prisma.emailLog.create({ data: { leadId: lead.id, type: emailInfo.type, subject: emailInfo.subject, sendgridId: msgId, status: 'sent' } }),
          prisma.lead.update({ where: { id: lead.id }, data: { nurtureStep: nextStep + 1, emailsSent: { increment: 1 } } }),
          prisma.activity.create({ data: { leadId: lead.id, type: 'NURTURE_EMAIL', description: `Nurture email ${nextStep + 1} sent: ${emailInfo.subject}` } }),
        ])
        sent++
      }
    }

    return NextResponse.json({ success: true, sent })
  } catch (err) {
    console.error('Nurture cron error:', err)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}

import sgMail from '@sendgrid/mail'

const apiKey = process.env.SENDGRID_API_KEY

if (apiKey) {
  sgMail.setApiKey(apiKey)
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(opts: EmailOptions): Promise<string | null> {
  if (!apiKey) {
    console.warn('SendGrid not configured, skipping email')
    return null
  }
  try {
    const [response] = await sgMail.send({
      to: opts.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'quotes@shieldhomepro.com',
        name: process.env.SENDGRID_FROM_NAME || 'ShieldHome Pro',
      },
      subject: opts.subject,
      html: opts.html,
      text: opts.text || opts.html.replace(/<[^>]+>/g, ''),
    })
    return response.headers['x-message-id'] as string || 'sent'
  } catch (err) {
    console.error('SendGrid email error:', err)
    return null
  }
}

import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const fromNumber = process.env.TWILIO_PHONE_NUMBER!

let client: ReturnType<typeof twilio> | null = null

function getClient() {
  if (!client && accountSid && authToken) {
    client = twilio(accountSid, authToken)
  }
  return client
}

export async function sendSms(to: string, body: string): Promise<string | null> {
  const c = getClient()
  if (!c) {
    console.warn('Twilio not configured, skipping SMS')
    return null
  }
  try {
    const message = await c.messages.create({ body, from: fromNumber, to })
    return message.sid
  } catch (err) {
    console.error('Twilio SMS error:', err)
    return null
  }
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return phone
}

// Twilio SMS disabled — notifications handled by Callingly + Slack
export async function sendSms(_to: string, _body: string): Promise<string | null> {
  return null
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return phone
}

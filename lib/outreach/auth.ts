import { NextRequest, NextResponse } from 'next/server'

/**
 * Verify outreach API authorization.
 * Returns null if authorized, or a NextResponse error if not.
 */
export function verifyOutreachAuth(req: NextRequest): NextResponse | null {
  const expectedToken = process.env.OUTREACH_API_TOKEN
  if (!expectedToken) {
    console.error('OUTREACH_API_TOKEN is not configured')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

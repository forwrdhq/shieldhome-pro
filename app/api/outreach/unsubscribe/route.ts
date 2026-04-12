import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as instantly from '@/lib/instantly'

/**
 * GET /api/outreach/unsubscribe?email=... — Global unsubscribe endpoint
 *
 * CAN-SPAM compliant: adds email to suppression list and updates
 * prospect status. Also syncs to Instantly's block list.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase()

  if (!email) {
    return new NextResponse(unsubscribePage('Missing email parameter.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  try {
    // Add to suppression list (idempotent)
    await prisma.suppressionList.upsert({
      where: { email },
      update: {},
      create: {
        email,
        reason: 'unsubscribe',
        source: 'unsubscribe_link',
      },
    })

    // Update prospect status if they exist
    const prospect = await prisma.outreachProspect.findUnique({ where: { email } })
    if (prospect) {
      await prisma.outreachProspect.update({
        where: { email },
        data: { status: 'UNSUBSCRIBED' },
      })
    }

    // Sync to Instantly block list
    try {
      await instantly.addToBlockList({ entries: [email] })
    } catch {
      // Non-critical — Instantly sync failed but local suppression is in place
      console.warn('Failed to sync unsubscribe to Instantly block list:', email)
    }

    return new NextResponse(unsubscribePage('You have been successfully unsubscribed. You will not receive any further emails from us.', true), {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err: any) {
    console.error('Unsubscribe error:', err)
    return new NextResponse(unsubscribePage('Something went wrong. Please try again or reply "unsubscribe" to any email you received from us.', false), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

/**
 * HTML-escape to prevent XSS in rendered pages.
 */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * Simple HTML page for the unsubscribe confirmation.
 */
function unsubscribePage(message: string, success: boolean): string {
  const safeMessage = escapeHtml(message)
  const title = success ? 'Unsubscribed' : 'Error'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ShieldHome Pro</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #334155; }
    .card { background: white; border-radius: 12px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 24px; margin-bottom: 12px; color: #0f172a; }
    p { font-size: 16px; line-height: 1.6; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '&#10003;' : '&#9888;'}</div>
    <h1>${title}</h1>
    <p>${safeMessage}</p>
  </div>
</body>
</html>`
}

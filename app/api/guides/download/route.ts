import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/db'
import { APP_URL } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get('leadId')
  const source = req.nextUrl.searchParams.get('source') || 'meta_results'

  // Track the download
  if (leadId) {
    try {
      await prisma.metaQuizLead.update({
        where: { id: leadId },
        data: {
          notes: {
            set: `[Guide downloaded: ${new Date().toISOString()} via ${source}]`,
          },
        },
      })
    } catch {
      // Lead may not exist — continue serving the file
    }

    // Fire CAPI event for download tracking
    if (process.env.META_CAPI_ACCESS_TOKEN) {
      try {
        await fetch(`${APP_URL}/api/meta-capi`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'CompleteRegistration',
            eventId: `download_${leadId}_${Date.now()}`,
            sourceUrl: `${APP_URL}/meta/results`,
            userData: {},
            customData: {
              value: 10.0,
              currency: 'USD',
              content_name: 'guide_download',
              content_category: 'home_security',
            },
          }),
        })
      } catch {
        // Non-critical — don't block download
      }
    }
  }

  // Serve the PDF
  try {
    const filePath = join(process.cwd(), 'public', 'guides', 'home-security-guide.pdf')
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Home-Security-Guide-ShieldHome-Pro.pdf"',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    // PDF not found — redirect to results page
    return NextResponse.redirect(new URL('/meta/results', req.url))
  }
}

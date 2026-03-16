import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const id = searchParams.get('id')

  if (!email && !id) {
    return NextResponse.redirect(new URL('/unsubscribe?status=error', req.url))
  }

  try {
    const where = id ? { id } : { email: email! }
    await prisma.lead.updateMany({
      where,
      data: { nurtureActive: false },
    })
    return NextResponse.redirect(new URL('/unsubscribe?status=success', req.url))
  } catch {
    return NextResponse.redirect(new URL('/unsubscribe?status=error', req.url))
  }
}

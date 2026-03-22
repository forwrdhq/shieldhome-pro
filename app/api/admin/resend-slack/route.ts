import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { sendSlackNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: startOfDay } },
    orderBy: { createdAt: 'asc' },
  })

  if (leads.length === 0) {
    return NextResponse.json({ message: 'No leads found today', sent: 0 })
  }

  const results = await Promise.allSettled(
    leads.map(lead =>
      sendSlackNotification({
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName: lead.fullName,
        phone: lead.phone,
        email: lead.email,
        zipCode: lead.zipCode,
        propertyType: lead.propertyType,
        homeownership: lead.homeownership,
        doorsWindows: lead.doorsWindows,
        timeline: lead.timeline,
        leadScore: lead.leadScore,
        priority: lead.priority,
        source: lead.source,
        medium: lead.medium,
        campaign: lead.campaign,
        productsInterested: lead.productsInterested,
      })
    )
  )

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ sent: succeeded, failed, total: leads.length })
}

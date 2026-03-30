import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { updateLeadSchema } from '@/lib/validation'

function formatSpeed(secs: number): string {
  if (secs < 60) return `${secs}s`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${h}h ${m}m`
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } },
        assignedRep: { select: { id: true, name: true, email: true, phone: true } },
        commissions: true,
        emailLogs: { orderBy: { sentAt: 'desc' } },
        smsLogs: { orderBy: { sentAt: 'desc' } },
      }
    })
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    return NextResponse.json(lead)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const data = updateLeadSchema.parse(body)

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const updateData: any = { ...data }
    const now = new Date()

    // Handle firstContactAt — calculate speed-to-contact
    if (data.firstContactAt && !existing.firstContactAt) {
      const firstContact = new Date(data.firstContactAt)
      const speedToContact = Math.floor((firstContact.getTime() - existing.submittedAt.getTime()) / 1000)
      updateData.firstContactAt = firstContact
      updateData.speedToContact = speedToContact
    }

    // Handle appointment date
    if (data.appointmentDate) {
      updateData.appointmentDate = new Date(data.appointmentDate)
    }

    // Log call activity with timestamp
    if (data.callsMade && data.callsMade > existing.callsMade) {
      const speedSecs = existing.firstContactAt
        ? null
        : Math.floor((now.getTime() - existing.submittedAt.getTime()) / 1000)
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'CALL_MADE',
          description: `Call #${data.callsMade} logged${speedSecs !== null ? ` — speed to contact: ${formatSpeed(speedSecs)}` : ''}`,
          metadata: { timestamp: now.toISOString(), callNumber: data.callsMade, speedToContactSecs: speedSecs },
        }
      })
      // Set firstContactAt if this is the first call
      if (!existing.firstContactAt) {
        updateData.firstContactAt = now
        updateData.speedToContact = Math.floor((now.getTime() - existing.submittedAt.getTime()) / 1000)
      }
    }

    // Log SMS activity with timestamp
    if (data.smsSent && data.smsSent > existing.smsSent) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'SMS_SENT',
          description: `SMS #${data.smsSent} logged`,
          metadata: { timestamp: now.toISOString(), smsNumber: data.smsSent },
        }
      })
    }

    // Handle sale
    if (data.status === 'CLOSED_WON' && data.saleAmount && existing.assignedRepId) {
      const grossCommission = data.saleAmount * 0.1
      const ourShare = grossCommission * 0.5
      const repShare = grossCommission * 0.5
      await prisma.commission.create({
        data: {
          leadId: id,
          repId: existing.assignedRepId,
          saleAmount: data.saleAmount,
          grossCommission,
          ourShare,
          repShare,
        }
      })
      updateData.saleDate = new Date()
      await prisma.activity.create({
        data: { leadId: id, type: 'SALE_CLOSED', description: `Sale closed: $${data.saleAmount}` }
      })
    }

    // Log status change
    if (data.status && data.status !== existing.status) {
      await prisma.activity.create({
        data: {
          leadId: id,
          type: 'STATUS_CHANGE',
          description: `Status changed from ${existing.status} to ${data.status}`,
          metadata: { from: existing.status, to: data.status, timestamp: now.toISOString() },
        }
      })
    }

    const lead = await prisma.lead.update({ where: { id }, data: updateData })
    return NextResponse.json(lead)
  } catch (err: any) {
    console.error('Update lead error:', err)
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

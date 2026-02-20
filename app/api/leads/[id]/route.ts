import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateLeadSchema } from '@/lib/validation'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Handle firstContactAt
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

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { dispositionSchema } from '@/lib/validation'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, dispositionNote } = dispositionSchema.parse(body)

    const existing = await prisma.lead.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: status as any, dispositionNote, nurtureActive: false }
    })

    await prisma.activity.create({
      data: {
        leadId: id,
        type: 'STATUS_CHANGE',
        description: `Disposition: ${status}${dispositionNote ? ` — ${dispositionNote}` : ''}`,
      }
    })

    return NextResponse.json(lead)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
